<template>
  <div class="page">
    <ul class="tab">
      <li :class="{'active': activeTab === 0}" @click="toogleTab(0)">普通会员</li>
      <li :class="{'active': activeTab === 1}" @click="toogleTab(1)">黄金会员</li>
      <li :class="{'active': activeTab === 2}" @click="toogleTab(2)">钻石会员</li>
    </ul>
    <div class="coupon-box">
      <div class="coupon-item" v-for="(item, index) in couponList" :key = index>
        <div class="left">
          <i class="radius"></i>
          <i class="radius2"></i>
          <p class="title">{{item.relationNames}}</p>
          <p class="time">{{item.startTime}}~{{item.endTime}}</p>
          <div class="flex">
            <div class="flex-item" v-for="(ite, ind) in item.productList" :key = ind @click="goDetail(item.merchantType, ite)">
              <img :src="(item.urlPrefix + ite.imgUrl)" alt="">
              <p class="price">¥{{ite.price}}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <p><span class="symbol">￥</span>{{item.amount}}</p>
          <p>满{{item.useAmount}}元可用</p>
          <p v-if="!item.isReceive"  @click="receiveCoupon(item)">立即领取</p>
          <p v-else @click="goPrdList(item)">立即使用</p>
        </div>
      </div>
      <!-- <div class="coupon-item">
        <div class="left">
          <i class="radius"></i>
          <i class="radius2"></i>
          <p class="title">仅可购买旅游部分产品</p>
          <div class="flex">
            <div class="flex-item">
              <img :src="themeImg" alt="">
              <p class="price">¥199</p>
            </div>
            <div class="flex-item">
              <img :src="themeImg" alt="">
              <p class="price">¥199</p>
            </div>
            <div class="flex-item">
              <img :src="themeImg" alt="">
              <p class="price">¥199</p>
            </div>
          </div>
        </div>
        <div class="right">
          <p><span class="symbol">￥</span>50</p>
          <p>满1999元可用</p>
          <p>立即领取</p>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  export default {
    data () {
      return {
        activeTab: 0,
        couponList: [],
        themeImg: require('../../../../static/images/common/themeBg.jpg')
      }
    },
    onLoad(e) {
    },
    onShow () {
      this.queryCouponList(0)
    },
    methods: {
      queryCouponList (type) {
        this.$http.post(this.API.couponList, {
          data: {
            queryType: 3,
            receiveLevel: type
          }
        }).then(e => {
          if (e.code === 0) {
            this.couponList = e.result.data
            this.couponList.forEach((item) => {
              this.$set(item, 'isReceive', false)
              item.startTime = dayjs(item.startTime).format('YYYY.MM.DD')
              item.endTime = dayjs(item.endTime).format('YYYY.MM.DD')
            })
          }
        })
      },
      receiveCoupon (item) {
        this.$http.post(this.API.receiveCoupon, {
          data: {
            couponId: item.couponId,
            couponAmountId: item.couponAmountId,
            merchantType: item.merchantType // 1-旅游 2-名品名店
          }
        }).then(res => {
          if (res.code === 0) {
            item.isReceive = true
            wx.showToast({title: '领取成功', icon: 'none'})
            console.log(res)
          } else {
            wx.showToast({title: res.message, icon: 'none'})
          }
        })
      },
      goPrdList (item) {
        let couponParam = {
          relationIds: item.relationIds,
          scope: item.scope,
          useAmount: item.useAmount,
          amount: item.amount
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
      },
      toogleTab (index) {
        this.activeTab = index
        this.queryCouponList(index)
      },
      goDetail (type, ite) {
        if (type === 1) { // 旅游详情页
          if (ite.travelType === '1') { // 路线游
            wx.navigateTo({
              url: `/pages/travel/travelDetail/main?parentId=${ite.id}`
            })
          }
          if (ite.travelType === '2') { // 自由行
            wx.navigateTo({
              url: `/pages/travel/independTra/main?parentId=${ite.id}`
            })
          }
          if (ite.travelType === '3') { // 邮轮
            wx.navigateTo({
              url: `/pages/cruise/cruiseDetail/main?productId=${ite.id}`
            })
          }
        }
        if (type === 2) { // 商品详情页
          wx.navigateTo({
            url: `/pages/goods/goodsDetail/main?id=${ite.id}`
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.tab{
  height: 110rpx;
  line-height: 100rpx;
	background-color: #ffffff;
  font-size: 32rpx;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  li{
    display: inline-block;
    width: 33%;
    text-align: center;
    height: 95%;
  }
  li.active{
    border-bottom: 6rpx solid #fbb03b;
  }
}
.coupon-box{
  padding: 20rpx 30rpx;
  margin-top: 110rpx;
  .coupon-item{
    margin: 0 auto;
    margin-top: 20rpx;
    .left{
      background-color: #ffffff;
      border-radius: 8rpx;
      display: inline-block;
      width: 70%;
      vertical-align: top;
      padding: 20rpx 25rpx;
      box-sizing: border-box;
      height: 260rpx;
      position: relative;
      .title{
        font-size: 24rpx;
      }
      .time{
        color: #999999;
        font-size: 20rpx;
        margin-top: 10rpx;
      }
      .radius, .radius2{
        width: 28rpx;
        height: 28rpx;
        background-color: #f4f4f4;
        position: absolute;
        right: -15rpx;
        top: -15rpx;
        border-radius: 50%;
        z-index:99
      }
      .radius2{
        top: 245rpx;
      }
      .flex{
        margin-left: -25rpx;
        margin-top: 15rpx;
        .flex-item{
          display: inline-block;
          width: 33%;
          text-align: center;
          img{
            width: 100rpx;
	          height: 100rpx;
            display: block;
            margin: 0 auto;
          }
          .price{
            color: #999999;
            font-size: 20rpx;
          }
        }
      }
    }
    .right{
      background-color: #feefd8;
      border-radius: 8rpx;
      display: inline-block;
      width: 30%;
      vertical-align: top;
      height: 260rpx;
      color: #fbb03b;
      text-align: center;
      position: relative;
      p:nth-child(1){
        font-size: 40rpx;
        margin-top: 30rpx;
        .symbol{
          font-size: 30rpx;
        }
      }
      p:nth-child(2){
        font-size: 24rpx;
      }
      p:nth-child(3){
        width: 140rpx;
        height: 50rpx;
        line-height: 50rpx;
        background-color: #fbb03b;
        border-radius: 25rpx;
        color: #f4f4f4;
        font-size: 22rpx;
        margin: 0 auto;
        margin-top: 30rpx;
      }
    }
    .right:before{
      content: '';
      display: block;
      width: 18rpx;
      height: 80%;
      background-size: 18rpx 18rpx; /* 一个repeat的大小 */
      background-repeat: repeat-y;
      background-image: radial-gradient(#fff 7rpx, transparent 7rpx);
      position: absolute;
      top: 0;
      z-index:9
    }
    .right:before {
      left: -10rpx; /* 半圆，只显示一个repeat的一半 */
      top: 24rpx;
    }
  }
}
</style>
