<template>
  <div class="page">
    <ul class="tab">
      <li :class="{'active': tabActive === 0}" @click="getMyCouponList(0)"><span>全部</span></li>
      <li :class="{'active': tabActive === 1}" @click="getMyCouponList(1)"><span>旅游</span></li>
      <li :class="{'active': tabActive === 2}" @click="getMyCouponList(2)"><span>商品</span></li>
    </ul>
    <div class="coupon-box">
      <div class="coupon-item" v-for="(item, index) in couponList" :key = index>
        <div class="left">
          <p> <span class="symbol">￥</span>{{item.coupon.amount}}</p>
          <p>满{{item.coupon.useAmount}}元可用</p>
        </div>
        <div class="right"  @click="goPrdList(item)">
          <p>{{item.coupon.relationNames}}</p>
          <p>{{item.coupon.startTime}}~{{item.coupon.endTime}}</p>
          <i class="btn">立即使用</i>
        </div>
      </div>
    </div>
    <div class="btn-wrap" @click="goCouponCenter">
      <p class="coupon-btn">去领券中心</p>
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  export default {
    data: function () {
      return {
        tabActive: 0,
        couponList: []
      }
    },
    onShow() {
      this.getMyCouponList(0)
    },
    methods: {
      getMyCouponList (type) {
        this.tabActive = type
        if (type === 0) {
          type = ''
        }
        this.$http.post(this.API.getMyCouponList, {
          data: {
            currentPage: 1,
            pageSize: 20,
            merchantType: type
          }
        }).then(res => {
          if (res.code === 0) {
            this.couponList = res.result.data
            this.couponList.forEach((item) => {
              item.coupon.startTime = dayjs(item.coupon.startTime).format('YYYY.MM.DD')
              item.coupon.endTime = dayjs(item.coupon.endTime).format('YYYY.MM.DD')
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      goCouponCenter () {
        wx.navigateTo({
          url: `/pages/goods/coupon/main`
        })
      },
      goPrdList (item) {
        let couponParam = {
          relationIds: item.coupon.relationIds,
          scope: item.coupon.scope,
          useAmount: item.coupon.useAmount,
          amount: item.coupon.amount
        }
        couponParam = JSON.stringify(couponParam)
        if (item.merchantType === 1) { // 1-旅游 2-商品
          wx.navigateTo({
            url: `/pages/search/main?flag=5&couponParam=${couponParam}`
          })
        }
        if (item.merchantType === 2) { // 1-旅游 2-商品
          wx.navigateTo({
            url: `/pages/goods/goodsSearch/main?searchType=5&couponParam=${couponParam}`
          })
        }
      }
    },
    components: {
    }
  }
</script>
<style lang="scss" scoped>
.page{
  padding-bottom: 130rpx;
}
.tab{
  width: 100%;
	height: 100rpx;
	background-color: #ffffff;
  position: fixed;
  top: 0;
  z-index: 99;
  li{
    width: 33%;
    display: inline-block;
    text-align: center;
    span{
      display: inline-block;
      height: 97rpx;
      font-size: 32rpx;
      line-height: 100rpx;
      padding: 0 10rpx;
    }
  }
  li.active{
    span{
      border-bottom:5rpx solid #fbb03b
    }
  }
}
.coupon-box{
  padding: 10rpx 30rpx;
  padding-top: 100rpx;
  .coupon-item{
    margin-top: 30rpx;
    position: relative;
    .left{
      width: 30%;
      display: inline-block;
      text-align: center;
      background-color: #75a5ed;
      font-size: 22rpx;
      height: 180rpx;
      color: #ffffff;
      vertical-align: top;
      border-radius: 10rpx 0 0 10rpx;
      p:nth-child(1){
        margin-top:35rpx;
        font-size: 40rpx;
        .symbol{
          font-size: 30rpx;
        }
      }
      p:nth-child(2){
        margin-top:10rpx;
      }
    }
    .right{
      width: 70%;
      height: 180rpx;
      display: inline-block;
      background-color: #ffffff;
      vertical-align: top;
      border-radius:  0 10rpx 0 10rpx;
      padding-left: 35rpx;
      box-sizing: border-box;
      position: relative;
      p:nth-child(1){
        margin-top:40rpx;
        font-size: 26rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap
      }
      p:nth-child(2){
        margin-top:25rpx;
        color: #999999;
        font-size: 20rpx;
      }
      .btn{
        width: 140rpx;
        height: 44rpx;
        line-height: 44rpx;
        background-color: #ffffff;
        border-radius: 22rpx;
        border: solid 1rpx #75a5ed;
        position: absolute;
        right: 25rpx;
        bottom: 40rpx;
        color: #75a5ed;
        font-size: 24rpx;
        text-align: center;
      }
    }
    .delta{
      width: 96rpx;
      height: 96rpx;
      background: url(../../../../static/images/delta.png);
      background-size: 96rpx 96rpx;
      background-position: 0 0;
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      z-index:9;
    }
  }
}
.btn-wrap{
  width:100%;
  height: 110rpx;
  background-color: #f4f4f4;
  position: fixed;
  bottom: 0;
  padding-top: 20rpx;
}
.coupon-btn{
  width: 690rpx;
	height: 90rpx;
	background-color: #fbb03b;
	border-radius: 45rpx;
  font-size: 32rpx;
	line-height: 90rpx;
	color: #ffffff;
  text-align: center;
  margin-left: 4%;
}
</style>
