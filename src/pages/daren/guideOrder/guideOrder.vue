<template>
  <div class='page'>
    <i-tabs :current="current1" color="#ff9913" @change="tabChange" class="i-tabs1">
      <i-tab key="guide" title="达人陪游"></i-tab>
    </i-tabs>
    <i-tabs :current="current2" color="#ff9913" @change="tabChange2" class="i-tabs2">
      <i-tab key="all" title="全部"></i-tab>
      <i-tab key="pament" title="待付款"></i-tab>
      <i-tab key="trip" title="待出行"></i-tab>
      <i-tab key="evalua" title="待评价"></i-tab>
      <i-tab key="cancel" title="退款"></i-tab>
    </i-tabs>
    <ul class="order-list">
      <li v-for="(item, index) in guideOrderList" :key = index>
        <p class="title">
          <!-- <i-icon type="shop_fill" size="18" class="store-icon"/> -->
          <span>{{item.talentName}}</span>
          <span class="right">{{item.status}}</span>
        </p>
        <div class="img-main">
          <img :src="item.productImg" alt="">
          <div class="txt-right">
            <p>
              {{item.productName}}
            </p>
          </div>
        </div>
        <div class="txt-main">
          <p>类型： 达人陪游</p>
          <p>客户名称： {{item.customerName}}</p>
          <p>下单时间： {{item.createTime}}</p>
          <p class="right">合计：￥{{item.orderPrice}}</p>
        </div>
        <!-- <div class="evaluate-box" @click="goverifyRefund(item)"> -->
        <div class="evaluate-box"  v-if="item.status === 7">
          <span class="evaluate-btn" @click.stop="openConfirm(item.id)">退款审核</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import dayjs from 'dayjs'
export default {
  data () {
    return {
      current1: 'guide',
      current2: 'all',
      orderList: [], // 订单列表
      guideOrderList: [],
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onShow() {
    this.current2 = 'all'
    this.getGuideOrderList()
  },
  methods: {
    tabChange2 (detail) {
      this.orderList = []
      this.current2 = detail.mp.detail.key
      switch (this.current2) {
        case 'all':
          this.getGuideOrderList('')
          break
        case 'pament':
          this.getGuideOrderList('1')
          break
        case 'trip':
          this.getGuideOrderList('2')
          break
        case 'evalua':
          this.getGuideOrderList('3')
          break
        case 'cancel':
          this.getGuideOrderList('7,8,9')
          break
      }
    },
    getGuideOrderList(str) {
      if (!str) {
        str = ''
      }
      this.$http.post(this.API.guideOrderList, {
        data: {
          statusStr: str,
          type: 2
        }
      }).then(res => {
        if (res.code === 0) {
          this.guideOrderList = res.result.data
          this.guideOrderList.forEach((item) => {
            if (item.status === 1) {
              item.status = '待付款'
            } else if (item.status === 2) {
              item.status = '待出行'
            } else if (item.status === 3) {
              item.status = '待评价'
            } else if (item.status === 4) {
              item.status = '已完成'
            } else if (item.status === 5) {
              item.status = '已取消'
            } else if (item.status === 6) {
              item.status = '已关闭'
            } else if (item.status === 7) {
              item.status = '退款中'
            } else if (item.status === 8) {
              item.status = '拒绝退款'
            } else if (item.status === 9) {
              item.status = '已退款'
            } else if (item.status === 10) {
              item.status = '已删除'
            } else {
              item.status = ''
            }
          })
          console.log(res)
        }
      })
    },
    openConfirm(id) {
      let self = this
      wx.showModal({
        title: '退款处理',
        content: '是否同意用户退款',
        confirmText: '同意',
        cancelText: '拒绝',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            self.goverifyRefund(id, 1)
          } else {
            self.goverifyRefund(id, 2)
          }
        }
      })
    },
    goverifyRefund (id, type) {
      this.$http.post(this.API.verifyRefund, {
        data: {
          id: id,
          verifyStatus: type,
          verifyContent: '同意退款' // 取消订单原因
        }
      }).then(res => {
        if (res.code === 0) {
          this.getGuideOrderList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
}
.i-tabs1{
  top: 0;
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 9;
}
.i-tabs2{
  top: 77rpx;
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 9;
}
.order-list{
  background: #fff;
  font-size:24rpx;
  color:#353535;
  margin-top: 150rpx;
  li{
    border-top: 20rpx solid #f4f4f4;
    padding: 0 30rpx;
    padding-top: 30rpx;
    .title{
      height: 60rpx;
      line-height: 60rpx;
      vertical-align: middle;
      .right{
        float:right;
        margin-right: 10rpx;
      }
      // .store-icon{
      //   margin-right: 20rpx;
      //   vertical-align: top;
      //   margin-top: -5rpx;
      //   display: inline-block;
      //   color: #888;
      // }
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
        bottom: 20rpx;
      }
    }
    .evaluate-box{
      height: 98rpx;
      border-top: 1rpx solid #dcdcdc;
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
