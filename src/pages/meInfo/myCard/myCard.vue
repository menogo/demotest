<template>
    <div class="page">
        <div class="col-bg"></div>
        <div class="col-radius"></div>
        <div class="person-card" v-if="personCard">
          <div class="header-box">
            <img :src="customerDetail.photo || userlogo">
          </div>
          <div class="name-box">
            <p class="name" v-if="customerDetail.realName || customerDetail.nickName">{{customerDetail.realName || customerDetail.nickName}}</p>
            <open-data  class="name" type="userNickName" v-else ></open-data>
            <p>{{customerDetail.mobile}}</p>
          </div>
          <div class="qrCode">
            <img :src="qrCode" >
          </div>
        </div>
        <div class="store-card" v-if="!personCard">
          <div class="header-box">
            <img :src="customerDetail.photo || userlogo">
          </div>
          <div class="name-box">
            <p class="name" v-if="customerDetail.realName || customerDetail.nickName">{{customerDetail.realName || customerDetail.nickName}}</p>
            <open-data  class="name" type="userNickName" v-else ></open-data>
          </div>
          <div class="store-info">
            <i class="home-icon"></i>
            <p class="title">店铺信息</p>
            <div class="detail">
              <p>
                <span>店铺名称：</span>
                <span>深圳深之旅国际旅行社</span>
              </p>
              <p>
                <span>店铺评分：</span>
                <span class="stars">
                  <img class="star" :src="'/static/images/common/lu_icon'+(4 > index ? '_active':'')+'.png'" alt="" v-for="(item, index) in 5" :key = index>
                </span>
              </p>
              <p>
                <span>经营类目：</span>
                <span>国内游、出境游</span>
              </p>
            </div>
            
          </div>
          <div class="qrCode">
            <img :src="themeBg" >
          </div>
        </div>
        <button open-type="share" class="share-btn">分享卡片</button>
    </div>
</template>
<script>
export default {
  data () {
    return {
      personCard: true, // 个人名片
      merchantId: '', // 商户id
      storeDetail: '',
      customerDetail: {},
      qrCode: '',
      userlogo: require('../../../../static/images/common/userlogo.png'),
      themeBg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onShow() {
    this.getPersonInfo()
    this.createWxQrcode()
  },
  onShareAppMessage(res) {
    // let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    if (res.from !== 'button') return false
    return {
      // title: this.shareTitle,
      path: this.pathShare
      // imageUrl: this.sharePicture,
    }
  },
  methods: {
    getPersonInfo () {
      this.$http.post(this.API.customer).then(res => {
        if (res.code === 0) {
          this.customerDetail = res.result
          if (this.customerDetail.merchantId === 0) { // 无店铺的个人名片
            this.personCard = true
          } else {
            this.personCard = false
            this.merchantId = this.customerDetail.merchantId
            this.getMerchantDetail()
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 商家详情
    getMerchantDetail() {
      this.$http.post(this.API.getMerchantDetail, {
        data: {
          id: this.merchantId
        }
      }).then(res => {
        if (res.code === 0) {
          this.storeDetail = res.result
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 生成分享二维码
    createWxQrcode () {
      let that = this
      let shareCode = wx.getStorageSync('customerCode') // 本人分享id
      // step1:生成分享二维码
      let page = ''
      if (this.personCard) { // 个人
        page = 'pages/travelIndex/main'
      } else { // 商户
        page = 'pages/travel/travelStore/main'
      }
      this.$http.post(this.API.createWxQrcode, {
        data: {
          page: page,
          scene: `${shareCode}`,
          width: 80
        }
      }).then(res => {
        if (res.code === 0) {
          // step2:把二维码地址下载到本地
          wx.downloadFile({
            url: res.result, // 后端返回的二维码地址
            success: function (res) {
              if (res.statusCode === 200) {
                that.qrCode = res.tempFilePath // 下载后的二维码地址
              }
            },
            fail: function (e) {
              console.log('下载失败', e)
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  height: 100vh;
  background: #fff;
}
.col-bg{
  width: 100%;
  height: 250rpx;
  background: #fbb03b;
}
.col-radius{
  width: 110%;
  height: 325rpx;
  background: #fbb03b;
  border-radius: 0 0 50% 50%;
  margin-left: -40rpx;
  margin-top: -150rpx;
}
.person-card,.store-card{
  background:#fff; 
  margin: 0 55rpx;
  border-radius: 15rpx; 
  box-shadow: 0 0 20px #ccc;
  top: 225rpx;
  position: absolute;
  width: 86%;
  box-sizing: border-box;
  .header-box{
    background: #fff;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    padding-top: 5rpx;
    position: absolute;
    top: -100rpx;
    left: 50%;
    margin-left: -100rpx;
    img {
      width: 190rpx;
      height: 190rpx;
      box-sizing: border-box;
      border-radius:50%;
      margin: 0 auto;
      display: block;
      margin-top: 5rpx;
    }
  }
  .name-box{
    padding: 130rpx 0 40rpx 0;
    text-align:center;
    font-size: 34rpx;
    .name{
      margin-bottom: 20rpx;
    }
  }
  .qrCode{
    width: 175rpx;
    height: 175rpx;
    margin: 0 auto;
    margin-bottom: 40rpx;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.store-card{
  top: 140rpx;
  .store-info{
    border-top: 1rpx solid #eeeeee;
    padding-top: 50rpx;
    .home-icon{
      background: url('../../../../static/images/travelIndex.png');
      background-size: 300rpx 150rpx;
      background-position: -180rpx -50rpx;
      width: 45rpx;
      height:40rpx;
      display:block;
      margin: 0 auto;
    }
    .title{
      text-align: center;
      font-size: 34rpx;
    }
    .detail{
      color: #666;
      font-size: 28rpx;
      margin-top: 20rpx;
      margin-bottom: 60rpx;
      p span:nth-child(1){
        width: 40%;
        display: inline-block;
        text-align: right;
      }
    }
  }
}
.share-btn{
  background: #fbb03b;
  color: #fff;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 30rpx;
  margin-top: 125rpx;
  position: absolute;
  bottom: 60rpx;
  width: 92%;
  border-radius: 50rpx;
}
.stars {
  display: inline-block;
  margin-right: 10px;
}
.star {
  width: 14px;
  height: 14px;
  margin: 0 1px;
  background-size: auto 14px;
}
</style>

