<template>
  <div class="page" >
    <img src="https://deer99.com/imgSer/resource/image/427f0487c697ef05992f7783f3ffb3c.jpg" alt="" class="bg-img">
    <div class="main">
      <i class="icon seccess-icon"></i>
      <p class="pay-txt">支付成功</p>
      <p class="pay-price">￥{{subtotal}}</p>
      <img src="https://deer99.com/imgSer/resource/image/8a6bb341d01e2cf4635f02f88ad5f35.png" alt="" class="gift-img">
      <p class="title">恭喜您获得免费旅游的机会</p>
      <p class="sec-title">以下任选一</p>
      <div class="tra-gift-box">
        <div class="tra-gift-item" v-for="(item, index) in showGiftTraList.productList" :key = index>
          <img :src="item.productImg || userlogo" alt="">
          <div class="right">
            <p class="tra-title">{{item.productName}}</p>
            <p class="tra-price">
              <span>￥{{item.productPrice}}</span>
              <span>￥0</span>
            </p>
            <span class="buy-btn" @click="goTravelsGiftDetail(item)">立即预订</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        goodsId: '',
        subtotal: '',
        urlPrefix: '',
        allTravalesGift: [],
        showGiftTraList: [],
        userlogo: require('../../../../static/images/common/userlogo.png')
      }
    },
    onLoad(options) {
      this.goodsId = options.goodsId
      this.subtotal = options.subtotal
      this.getGiftTravel(this.goodsId)
    },
    methods: {
      getGiftTravel(id) {
        this.$http.post(this.API.queryGiftActivityList, {
          data: {
            shopId: id
          }
        }).then(res => {
          if (res.code === 0) {
            this.allTravalesGift = res.result
            this.urlPrefix = res.result[0].urlPrefix
            // 每个活动主图
            this.allTravalesGift.forEach((item) => {
              item.productList.forEach((ite) => {
                if (ite.productImg) {
                  ite.productImg = `${this.urlPrefix}${ite.productImg}`
                }
              })
            })
            // 只展示小于支付价格的第一个旅游活动区间
            // step1 找出所有低于支付价格的旅游活动区间
            let selectGiftTraLis = []
            this.allTravalesGift.filter((item) => {
              if (this.subtotal >= item.price) {
                selectGiftTraLis.push(item)
              }
            })
            // step2 将区间价格大到小排序
            let selectTrasPrice = []
            selectGiftTraLis.forEach((item) => {
              selectTrasPrice.push(item.price)
            })
            selectTrasPrice = selectTrasPrice.sort().reverse()
            // step3 取区间中第一个价格的活动
            let showprice = selectTrasPrice[0]
            selectGiftTraLis.forEach((item) => {
              if (showprice === item.price) {
                this.showGiftTraList = item
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
      goTravelsGiftDetail(item) {
        let url = ''
        if (item.type === 1) {
          url = `/pages/travel/travelDetail/main?parentId=${item.productId}&giftType=true`
        } else if (item.type === 2) {
          url = `/pages/travel/independTra/main?parentId=${item.productId}&giftType=true`
        } else if (item.type === 3) {
          url = `/pages/cruise/cruiseDetail/main?productId=${item.productId}&giftType=true`
        }
        wx.navigateTo({
          url: url
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page{
    overflow: hidden;
  }
  .bg-img{
    width: 100%;
    min-height: 100vh;
    display: block;
  }
  .main{
    position: absolute;
    width: 100%;
    top:0;
    .seccess-icon{
      width: 66rpx;
      height: 64rpx;
      background-position: -229rpx -50rpx; 
      margin: 0 auto;
      margin-top: 40rpx;
      display: inline-block;
      display: block;
    }
    .pay-txt{
      text-align: center;
      font-size: 36rpx;
      margin-top: 20rpx;
      color: #fff;
    }
    .pay-price{
      text-align: center;
      font-size: 30rpx;
      color: #fff;
    }
    .gift-img{
      width: 400rpx;
      height: 370rpx;
      display: block;
      margin: 0 auto;
    }
    .title{
      font-size: 36rpx;
      color: #fff;
      text-align: center;
      margin-top: 10rpx;
    }
    .sec-title{
      color: #fff;
      font-size: 24rpx;
      text-align: center;
      margin-top: 10rpx;
    }
    .tra-gift-box{
      width: 690rpx;
      height: 445rpx;
      background: #fff;
      border-radius: 10rpx;
      margin: 0 auto;
      margin-top: 20rpx;
      padding: 0 30rpx 30rpx 30rpx;
      box-sizing: border-box;
      overflow: auto;
      .tra-gift-item{
        padding-top: 30rpx;
        img{
          width: 130rpx;
          height: 98rpx;
          border-radius: 10rpx;
          display: inline-block;
        }
        .right{
          width: 75%;
          position: relative;
          display: inline-block;
          margin-left: 15rpx;
          .tra-title{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
            color: #333333;
          }
          .tra-price{
            margin-top: 15rpx;
            font-size: 30rpx;
            span:nth-child(1){
              color: #f42c2b;
              text-decoration: line-through;
            }
            span:nth-child(2){
              color: #999999;
              margin-left: 20rpx;
            }
          }
          .buy-btn{
            position: absolute;
            right: 0;
            bottom: 0;
            background: #fbb03b;
            color: #fff;
            width: 150rpx;
            height: 44rpx;
            line-height: 44rpx;
            font-size: 24rpx;
            text-align: center;
            border-radius: 20rpx;
          }
        }
      }
    }
  }
  .icon {
    background: url('../../../../static/images/goodsDetail.png');
    display: inline-block;
    background-size: 500rpx 120rpx;
  }
  
</style>
