<template>
  <div class='page'>
    <i-tabs :current="current" color="#ff9913" @change="tabChange">
      <i-tab key="all" title="全部"></i-tab>
      <i-tab key="dfk" title="待付款"></i-tab>
      <i-tab key="dcx" title="待出行"></i-tab>
      <i-tab key="dpj" title="待评价"></i-tab>
      <i-tab key="tk" title="退款"></i-tab>
    </i-tabs>
    <!-- <ul class="order-list">
      <li v-for="(item, index) in guideList" :key = index>
        <div class="img-main">
          <div class="txt-left">
            <p> {{item.productName}}</p>
          </div>
          <span class="right">已取消</span>
        </div>
        <div class="txt-main">
          <p>类型： 达人陪游</p>
          <p>达人名称： {{item.talentName}}</p>
          <p>下单时间： {{item.createTime}}</p>
          <p class="right">￥{{item.orderPrice}}</p>
        </div>
        <div class="evaluate-box" v-if="item.status === 5">
          <span class="evaluate-btn">订单已取消</span>
        </div>
        <div class="evaluate-box" @click="goCancleOrder(item, 1)" v-if="current === 'dfk'">
          <span>取消订单</span>
        </div>
        <div class="evaluate-box" @click="goCancleOrder(item, 2)" v-if="current === 'dcx'">
          <span>申请退款</span>
        </div>
      </li>
    </ul> -->
    <ul class="order-list">
      <li v-for="(item, index) in guideList" :key = index>
        <p class="title">
          <!-- <i-icon type="shop_fill" size="18" class="store-icon"/> -->
          <!-- <span>{{item.productName}}</span> -->
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
          <p>达人名称： {{item.talentName}}</p>
          <p>下单时间： {{item.createTime}}</p>
          <p class="right">合计：￥{{item.orderPrice}}</p>
        </div>
        <div class="evaluate-box" v-if="current === 'dfk' || current === 'dcx'">
          <span @click="goCancleOrder(item, 1)" v-if="current === 'dfk'">取消订单</span>
          <span @click="goCancleOrder(item, 2)" v-if="current === 'dcx'">申请退款</span>
        </div>
      </li>
    </ul>
    <!-- <empty :list = guideList></empty> -->
  </div>
</template>

<script>
  import empty from '@/components/common/empty'
  export default {
    data () {
      return {
        current: 'all',
        guideList: []
      }
    },
    onShow() {
      this.current = 'all'
      this.getGuideList()
    },
    methods: {
      tabChange (detail) {
        this.current = detail.mp.detail.key
        switch (this.current) {
          case 'all':
            this.getGuideList('')
            break
          case 'dfk':
            this.getGuideList('1')
            break
          case 'dcx':
            this.getGuideList('2')
            break
          case 'dpj':
            this.getGuideList('3')
            break
          case 'tk':
            this.getGuideList('7,8,9')
            break
        }
      },
      getGuideList (str) {
        if (!str) {
          str = ''
        }
        this.$http.post(this.API.guideOrderList, {
          data: {
            statusStr: str,
            type: 1
          }
        }).then(res => {
          if (res.code === 0) {
            this.guideList = res.result.data
            this.guideList.forEach((item) => {
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
          }
        })
      },
      goCancleOrder (item, type) {
        this.$http.post(this.API.guideUpdateStatus, {
          data: {
            status: type,
            id: item.id,
            refundDesc: '不要了' // 取消订单原因
          }
        }).then(res => {
          if (res.code === 0) {
            if (type === 1) {
              wx.showToast({title: '取消成功'})
            }
            if (type === 2) {
              wx.showToast({title: '退款成功'})
            }
            this.guideList = []
            this.getGuideList(this.current)
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
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
.order-list{
  background: #fff;
  font-size:24rpx;
  color:#353535;
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
        margin-right: 10rpx;
        font-size: 26rpx;
        float: right;
      }
    }
  }
    
}
</style>
