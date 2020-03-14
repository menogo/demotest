<template>
  <div class='page'>
    <i-tabs :current="current" color="#ff9913" @change="tabChange" class="i-tabs">
      <i-tab key="all" title="全部"></i-tab>
      <i-tab key="pament" title="待付款"></i-tab>
      <i-tab key="submit" title="待确认"></i-tab>
      <i-tab key="trip" title="待出行"></i-tab>
      <i-tab key="evalua" title="待评价"></i-tab>
      <i-tab key="cancel" title="取消/退款"></i-tab>
    </i-tabs>
    <ul class="order-list">
      <li v-for="(item, index) in orderList" :key="index" @click="goDetail(item.id)">
        <p class="title">
          <i-icon type="shop_fill" size="18" class="store-icon"/>
          <span>{{item.merchantName}}</span>
          <span class="right">{{item.status}}</span>
        </p>
        <div class="img-main">
          <img :src="item.productImg" alt="">
          <div class="txt-right">
            <p>
              <!-- <span class="icon">旅游订单</span>  -->
              {{item.productName}}
            </p>
          </div>
        </div>
        <div class="txt-main">
          <p>出发时间： {{item.serviceTime}}</p>
          <p>行程天数： {{item.travelDays}}</p>
          <p>套餐包含：
            <span v-for="(ite, ind) in item.detailList" :key="ind">
              <span>{{ite.priceTypeName}}</span>
              <span>{{ite.num}}</span>
            </span>&emsp;
          </p>
          <p class="right">合计：￥{{item.orderPrice}}</p>
        </div>
        <!-- <div class="evaluate-box" @click.stop="goEvaluate(item)" v-if="item.status === '待评价'"> -->
        <div class="evaluate-box" v-if="item.status === '待评价' || item.status === '待付款'">
          <span class="evaluate-btn" @click.stop="goEvaluate(item)" v-if="item.status === '待评价'">评价</span>
          <span class="payment-btn" @click.stop="goPay(item)" v-if="item.status === '待付款'">待付款</span>
        </div>
      </li>
    </ul>
    <empty :list = orderList></empty>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      current: 'all',
      orderList: [], // 订单列表
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onShow() {
    this.current = 'all'
    this.gettravelOrderList('')
  },
  methods: {
    tabChange (detail) {
      // 1-待付款 2-待确认 3-待出行 4-待评价 5-已完成 6-已取消 7-已关闭 8-申请退款 9-拒绝退款 10-退款中 11-已退款 12-已删除 13-退款失败
      this.orderList = []
      this.current = detail.mp.detail.key
      switch (this.current) {
        case 'all':
          this.gettravelOrderList('')
          break
        case 'pament':
          this.gettravelOrderList('1')
          break
        case 'submit':
          this.gettravelOrderList('2')
          break
        case 'trip':
          this.gettravelOrderList('3')
          break
        case 'evalua':
          this.gettravelOrderList('4')
          break
        case 'cancel':
          this.gettravelOrderList('6,7,8,9,10,11,13')
          break
      }
    },
    gettravelOrderList (status) {
      this.$http.post(this.API.travelOrderList, {
        data: {
          statusStr: status
        }
      }).then(res => {
        if (res.code === 0) {
          this.orderList = res.result.data
          this.orderList.forEach((item) => {
            item.serviceTime = dayjs(item.serviceTime).format('YYYY-MM-DD') // 出发时间
            switch (item.status) {
              case 1:
                item.status = '待付款'
                break
              case 2:
                item.status = '待确认'
                break
              case 3:
                item.status = '待出行'
                break
              case 4:
                item.status = '待评价'
                break
              case 5:
                item.status = '已完成'
                break
              case 6:
                item.status = '已取消'
                break
              case 7:
                item.status = '已关闭'
                break
              case 8: // 状态是申请退款，展示为退款中
                item.status = '退款中'
                break
              case 9:
                item.status = '拒绝退款'
                break
              case 10:
                item.status = '退款中'
                break
              case 11:
                item.status = '已退款'
                break
              case 12:
                item.status = '已删除'
                break
              case 13: // 状态是退款失败，展示为退款中
                item.status = '退款中'
                break
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 订单支付
    goPay (item) {
      this.$http.post(this.API.wxPay, { // 微信支付下单
        data: {
          orderId: item.id,
          openId: wx.getStorageSync('openId'),
          type: 2
        }
      }).then(res => {
        if (res.code === 0) {
          // 调微信支付
          let obj = res.result
          this.requestPayment(obj)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 申请支付
    requestPayment (obj) {
      wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'success': (res) => {
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
        },
        'fail': (res) => {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    },
    goEvaluate (item) {
      console.log(item.id)
      wx.navigateTo({
        url: `/pages/travel/addEvaluate/main?id=${item.id}&logoImg=${item.logoImg}&productId=${item.productId}`
      })
    },
    goDetail (id) {
      wx.navigateTo({
        url: `/pages/travel/travelOrderDetail/main?id=${id}`
      })
    }
  },
  components: {
    empty
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
}
.i-tabs{
  top: 0;
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 9;
}
.order-list{
  background: #fff;
  font-size:24rpx;
  color:#353535;
  margin-top: 75rpx;
  li{
    border-top: 20rpx solid #f4f4f4;
    padding: 0 30rpx;
    .title{
      height: 60rpx;
      line-height: 60rpx;
      vertical-align: middle;
      .right{
        float:right;
        margin-right: 10rpx;
      }
      .store-icon{
        margin-right: 20rpx;
        vertical-align: top;
        margin-top: -5rpx;
        display: inline-block;
        color: #888;
      }
    }
    .img-main{
      border-bottom: 1rpx solid #ccc;
      padding-bottom: 20rpx;
      img{
        width: 170rpx;
        height: 115rpx;
        display: inline-block;
      }
      .txt-right{
        display: inline-block;
        width: 70%;
        margin-left: 35rpx;
        vertical-align: top;
        p{
          .icon{
            display: inline-block;
            background: #ff9913;
            color: #fff;
            font-size: 20rpx;
            border-radius: 5rpx;
            padding: 0 5rpx;
          }
          display: inline-block;
          font-size:22rpx;
        }
      }
    }
    .txt-main{
      font-size: 22rpx;
      padding: 20rpx 0;
      position: relative;
      .right{
        position: absolute;
        right: 30rpx;
        top: 20rpx;
      }
    }
    .evaluate-box{
      height: 98rpx;
      border-top: 1rpx solid #dcdcdc;
      .evaluate-btn{
        margin-left: 10rpx;
      }
      span{
        width: 159rpx;
        height: 50rpx;
        line-height: 50rpx;
        border: 1rpx solid #dcdcdc;
        text-align: center;
        border-radius: 35rpx;
        margin-top: 23rpx;
        font-size: 26rpx;
        float: right;
      }
    }
  }
    
}
</style>
