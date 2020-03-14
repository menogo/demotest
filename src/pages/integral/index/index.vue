<template>
    <div>
        <div class="login-box">
          <div class="title-main" >
            <!-- 头像 -->
            <!-- <img  v-if="isLogin && headImg" :src="headImg" class="user-img"/> -->
            <open-data  class="user-img" type="userAvatarUrl"></open-data>
            <!-- 名字 -->
            <div class="name-box">
            <!-- <p  v-if="isLogin && nickName" class="login-txt">{{nickName}}</p> -->
            <open-data   class="login-txt" type="userNickName" ></open-data>
            <p class="level-name">{{levelName}}</p>
            </div>
          </div>
          <div class="integ-box">
            <p @click="goRule">积分规则</p>
            <p>我的积分<span>{{integral}}</span></p>
          </div>
        </div>
        <div class="sign-box">
          <p class="day">已连续签到{{signInDay}}天</p>
          <p class="tips">连续签到可积分翻倍</p>
          <div class="progress-bar">
            <div class="progress-inner font-color" :style="'width:' + 14.3 * signInDay + '%'"></div>
          </div>
          <div class="day-box">
            <span>1天</span><span>2天</span><span>3天</span><span>4天</span><span>5天</span><span>6天</span><span>7天</span>
          </div>
          <span class="sign-btn" @click="getSignIn()">签到</span>
        </div>
        <div class="rank-list" v-if="rqList && rqList.length > 0">
          <p class="tit">
            <span>人气抵扣</span>
            <span>Top{{rangNum}}</span>
          </p>
          <swiper class="swiper"  interval="3000" duration="1000"  indicator-dots="true"  autoplay="true"  indicator-color="eee" indicator-active-color="#ff9913"  @change="rangndex($event)">
            <block v-for="(item, index) in rqList" :key = index>
              <swiper-item>
                <div class="rank-goods" @click="goGoodsDetail(item.id)">
                  <img :src="item.thumbnailImg" alt="">
                  <div class="right">
                    <p class="title">{{item.productName}}</p>
                    <span class="money" v-if="item.integralDeductType === 1"><span class="fh">￥</span>{{item.price}}+{{item.useIntegral}}积分</span>
                    <span class="money" v-if="item.integralDeductType === 2">{{item.useIntegral}}积分</span>
                    <!-- <span class="integ">积分可抵扣50%</span> -->
                  </div>
                </div>
              </swiper-item>
            </block>
          </swiper>
          <!-- <div class="rank-goods" v-for="(index, item) in arr" :key = item>
            <img :src="integ1" alt="">
            <div class="right">
              <p class="title">标题标题标题标题标题标题标题标题标题标题标题标题标题标题</p>
              <span class="money"><span class="fh">￥</span>99</span>
              <span class="integ">积分可抵扣50%</span>
            </div>
          </div> -->


        </div>
        <div class="img-tab">
          <img :src="integ1" alt="" @click="getFreeList">
          <img :src="integ2" alt="" @click="getMyList">
        </div>
        <!-- <ul class="nav-tab">
          <li><span @click="toggleTab(1)" :class="{'active' : 1 === tabActive}">小鹿优选</span></li>
          <li><span @click="toggleTab(2)" :class="{'active' : 2 === tabActive}">优选食品</span></li>
          <li><span @click="toggleTab(3)" :class="{'active' : 3 === tabActive}">旅行必备</span></li>
        </ul> -->
        <div class="fine-select"  v-if="tabList && tabList.length > 0">
          <p class="title"><span class="line"></span>小鹿优选</p>
        </div>
        <div class="goods-box"  v-if="tabList && tabList.length > 0">
          <div class="goods-item" v-for="(item, index) in tabList" :key = index @click="goGoodsDetail(item.id)">
            <img :src="item.thumbnailImg" alt="">
            <p class="title">{{item.productName}}</p>
            <p class="money" v-if="item.integralDeductType === 1"><span class="fh">￥</span>{{item.price}}+{{item.useIntegral}}积分</p>
            <p class="money" v-if="item.integralDeductType === 2">{{item.useIntegral}}积分</p>
            <!-- <span class="integral">积分可抵50%</span> -->
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="dialog-mask" v-if="signInShow"  @click="closeSign"></div>
        <div class="sign-mask" v-if="signInShow">
          <img :src="signImg" alt="">
          <p class="suc">签到成功</p>
          <p class="tip">恭喜获得{{integralNum}}积分</p>
          <p class="sign-btn" @click="closeSign">确认</p>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      integral: '',
      levelName: '',
      signInDay: 0,
      // tabActive: 1,
      rangNum: 1,
      integralNum: 0,
      arr: [1, 2, 3],
      signInShow: false,
      rqList: [], // 人气抵扣积分商品
      tabList: [], // 优选列表产品
      integ1: require('../../../../static/images/common/integ1.png'),
      integ2: require('../../../../static/images/common/integ2.png'),
      signImg: require('../../../../static/images/common/signIn.png'),
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onShow () {
    this.getCustomer()
    this.getIntegralList(1) // 人气抵扣积分商品
    this.getIntegralList(2) // 优选积分商品
    // this.getIntegralList(3) // 优选食品积分商品
  },
  methods: {
    // toggleTab (index) {
    //   this.tabActive = index
    // },
    rangndex  (res) {
      this.rangNum = res.mp.detail.current + 1
    },
    getSignIn() {
      this.$http.post(this.API.signIn, {
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.signInShow = true
          this.integralNum = res.result
          this.signInDay = this.signInDay + 1
          this.integral = this.integral + this.integralNum
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getCustomer () {
      this.$http.post(this.API.customer, {
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.integral = res.result.integral
          this.levelName = res.result.levelName
          this.signInDay = res.result.signDay
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getIntegralList(type) {
      let data = {
        currentPage: 1,
        pageSize: 20
      }
      if (type === 1) { // 人气
        data.integralDeductType = 10
        data.sortType = 1
      }
      if (type === 2) { // 优选列表
        data.integralDeductType = 10
      }
      this.$http.post(this.API.goodsList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          if (type === 1) {
            this.rqList = res.result.data
            if (this.rqList.length > 3) {
              this.rqList.length = 3
            }
          }
          if (type === 2) {
            this.tabList = res.result.data
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    closeSign () {
      this.signInShow = false
    },
    goGoodsDetail (id) {
      wx.navigateTo({
        url: '/pages/goods/goodsDetail/main?id=' + id
      })
    },
    goRule () {
      wx.navigateTo({
        url: '/pages/integral/rule/main'
      })
    },
    getFreeList () {
      wx.navigateTo({
        url: `/pages/goods/goodsSearch/main?searchType=6`
      })
    },
    getMyList () {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0) {
          if (res.result) {
            wx.navigateTo({
              url: `/pages/goods/goodsSearch/main?searchType=7`
            })
          } else {
            wx.navigateTo({
              url: '/pages/login/main'
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.swiper{
  height: 200rpx;
}
.login-box{
  background: #fbb03b;
  position: relative;
  height: 320rpx;
  .title-main{
    height: 200rpx;
    padding-top: 25rpx;
    .mt70{
      margin-top: 70rpx;
    }
    .user-img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: #e5e5e5;
      display: inline-block;
      margin: 48rpx 0 32rpx 31rpx;
    }
    .name-box{
      width: 50%;
      display: inline-block;
      height: 120rpx;
      vertical-align: top;
      margin-top: 50rpx;
      padding-top: 15rpx;
      padding-left: 20rpx;
      .login-txt, .nologin-txt {
        color: #fff;
        vertical-align: top;
        display: inline-block;
        font-size: 32rpx;
      }
      .level-name{
        font-size: 24rpx;
        color: #fff;
      }
    }
    .msg-icon{
      float: right;
      width: 35rpx;
      height: 35rpx;
      background: url(../../../../static/images/meTop.png);
      background-size: 220rpx 100rpx;
      background-position: -4rpx -62rpx;
      margin-right: 30rpx;
    }
    .setup-icon{
      float: right;
      margin-right: 50rpx;
      background-position: -92rpx -49rpx;
    }
  }
  .integ-box{
    margin-top: 90rpx;
    color: #fff;
    position: absolute;
    top: 0;
    right: 30rpx;
    text-align: right;
    p:nth-child(1){
      width: 110rpx;
      height: 32rpx;
      text-align: center;
      line-height: 32rpx;
      background: #fcc062;
      display: inline-block;
      font-size: 20rpx;
      border-radius: 12rpx;
    }
    p:nth-child(2){
      font-size: 22rpx;
      span{
        font-size: 30rpx;
        margin-left: 15rpx;
      }
    }
  }
}
.sign-box{
  position:relative;
  margin: 0 30rpx;
  margin-top:-80rpx;
  border-radius: 12rpx;
  background: #fff;
  padding: 45rpx 35rpx;
  text-align: center;
  .day{
    font-size: 28rpx;
    font-weight: bold;
  }
  .tips{
    color: #999999;
    font-size: 20rpx;
  }
  .sign-btn{
    width: 200rpx;
    height: 60rpx;
    background: #fbb03b;
    color: #fff;
    font-size: 30rpx;
    display: inline-block;
    line-height: 60rpx;
    border-radius: 30rpx;
  }
  .progress-bar {
    float: left;
    width: 620rpx;
    background: #fee7c4;
    height: 12rpx;
    overflow: hidden;
    display: inline;
    position: relative;
    border-radius: 7rpx;
    margin-top:40rpx;
    margin-bottom:20rpx;
  }
  .progress-inner {
    // width: 14.3%;
  }
  .font-color {
    background: #fbb03b;
    height: 12rpx;
    border-radius: 7rpx;
    text-align: center;
  }
  .day-box{
    width: 620rpx;
    margin-top: 20rpx;
    margin-bottom: 35rpx;
    font-size: 22rpx;
    span{
      width:88rpx;
      text-align: center;
      display: inline-block;
    }
  }
}
.rank-list{
  background: #fff;
  padding: 35rpx 25rpx;
  margin: 30rpx;
  border-radius: 10rpx;
  .tit{
    font-size: 30rpx;
    span:nth-child(2){
      color: #e7be70;
      float: right;
    }
  }
  .rank-goods{
    margin-top: 30rpx;
  }
  img{
    width: 100rpx;
    height: 100rpx;
  }
  .right{
    width:80%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 28rpx;
    margin-left: 30rpx;
    .money{
      color: #fbb03b;
      font-size: 28rpx;
      margin-top: 10rpx;
      display: inline-block;
      .fh{
        font-size: 20rpx;
      }
    }
    .integ{
      font-size: 20rpx;
      color: #f60701;
      padding: 5rpx 8rpx;
      border: 1rpx solid #f60701;
      border-radius: 5rpx;
      margin-left: 30rpx;
    }
  }
}
.img-tab{
  margin: 30rpx;
  img{
    width: 335rpx;
    height: 180rpx;
    display: inline-block;
  }
  img:nth-child(1){
    margin-right: 20rpx;
  }
}
.nav-tab{
  border-bottom:1rpx solid #dcdcdc;
  li{
    display: inline-block;
    width:25%;
    text-align: center;
    color: #666666;
    font-size: 28rpx;
    span{
      display: inline-block;
      padding: 20rpx 0;
    }
    span.active{
      border-bottom: 5rpx solid #fbb03b;
      color: #fbb03b;
    }
  }
}
.goods-box{
  margin: 0 30rpx 30rpx 30rpx;
  .goods-item{
    display: inline-block;
    width:330rpx;
    background: #ffffff;
    img{
      width: 330rpx;
      height: 330rpx;
      display: block;
    }
    .title{
      font-size: 28rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin:15rpx 25rpx;
      height:80rpx;
    }
    .money{
      color: #ff9d00;
      font-size: 28rpx;
      .fh{
        font-size: 20rpx;
        margin-left: 10rpx;
      }
    }
    .integral{
      font-size: 20rpx;
      color: #f60701;
      border: 1rpx solid #f60701;
      float: right;
      border-radius:10rpx;
      padding:5rpx 8rpx;
      margin-right: 10rpx;
    }
  }
  .goods-item:nth-child(2n+1){
    margin:30rpx 30rpx 0 0;
  }
}
.dialog-mask {
  position: fixed;
  bottom: 0;
  left: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
}
.sign-mask {
  position: fixed;
  width: 100%;
  top:50%;
  left: 50%;
  width:560rpx;
  height: 500rpx;
  margin-left: -280rpx;
  margin-top: -250rpx;
  font-size: 28rpx;
  color: #666;
  background: #fff;
  border-radius: 20rpx;
  z-index: 999999;
  img{
    width: 100%;
    height: 200rpx;
  }
  .suc{
    text-align: center;
    font-size:36rpx;
    color: #fbb03b;
    margin-top: 10rpx;
  }
  .tip{
    text-align: center;
    font-size:24rpx;
    color: #999999;
    margin-top: 24rpx;
  }
  .sign-btn{
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #fbb03b;
    color: #fff;
    font-size:34rpx;
    margin-top: 45rpx;
    margin-left: 130rpx;
    display: inline-block;
    text-align: center;
    border-radius:40rpx;
  }
}
.fine-select{
  padding: 35rpx 20rpx 0 20rpx;
  .title {
    font-size: 30rpx;
    margin-bottom: 10rpx;
    .line {
      display: inline-block;
      width: 6rpx;
      height: 35rpx;
      background: #ff9913;
      vertical-align: text-top;
      margin-top: 6rpx;
      margin-right: 15rpx;
    }
  }
}
</style>

