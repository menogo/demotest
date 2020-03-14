<template>
  <div class = "me-page">
    <!-- 已登录 1：设置过用户名或者头像 2：没设置取微信头像和昵称 -->
    <div class="login-box" v-if="isLogin">
      <div class="title-main">
        <!-- 头像 -->
        <!-- <div @click="goMeIndex"> -->
          <img  v-if="isLogin && headImg" :src="headImg" class="user-img"  @click="goMeIndex"/>
          <open-data  v-else class="user-img" type="userAvatarUrl" @click="goMeIndex"></open-data>
        <!-- </div> -->
        <!-- 名字 -->
        <div class="name-box"  @click="goMeIndex">
          <p  v-if="isLogin && nickName" class="login-txt">{{nickName}}</p>
          <open-data  v-else class="login-txt" type="userNickName" ></open-data>
          <p class="level-name">{{levelName}}</p>
          <i class="qrCode-icon" @click.stop="createWxQrcode"></i>
        </div>
        <!-- <span class="card" @click="goMyCard">
          <i class="icon card-icon"></i>
          <span class="card-txt">我的名片</span>
        </span> -->
        <!-- <i class="msg-icon" :class="{'mt70': !license}" @click.stop="false"></i> -->
        <i class="icon setup-icon"  :class="{'mt70': !license}"  @click.stop="goSetUp"></i>
        <!-- status 状态：0-待上传 1-待审核 2-审核通过 3-审核驳回 -->
        <span class="member-box" @click.stop="goPartnerRegister" v-if="license && (license.status == 0 || license.status == 1 || license.status == 3)">
        <!-- <span class="member-box" @click.stop="goPartnerRegister"> -->
          <i class="member-icon"></i>
          <span>会员升级</span>
        </span>
      </div>
      <div class="bg-box"><div class="bg-box2"></div></div>
      <div class="extend-box">
        <div @click.stop="goMyProfit">
          <p><i class="qb-icon"></i></p>
          <p>钱包</p>
        </div>
        <div @click.stop="goMyCoupon">
          <p>{{couponCount || 0}}</p>
          <p>优惠券</p>
        </div>
        <!-- <div>
          <p>0</p>
          <p>积分</p>
        </div> -->
        <div @click.stop="goMyExtend">
          <p>{{customerDetail.totalPush}}</p>
          <p>推广</p>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="login-box"   v-if="!isLogin" @click="goLogin">
      <div class="title-main">
        <img :src="userlogo" class="user-img"/>
        <div class="name-box">
          <span class="nologin-txt">登录/注册</span>
        </div>
        <i class="icon setup-icon"  :class="{'mt70': !license}"  @click.stop="goSetUp"></i>
      </div>
      <div class="bg-box"><div class="bg-box2"></div></div>
      <div class="extend-box">
        <div  @click.stop="goMyProfit">
          <p><i class="qb-icon"></i></p>
          <p>钱包</p>
        </div>
        <div>
          <p>0</p>
          <p>优惠券</p>
        </div>
        <!-- <div>
          <p>0</p>
          <p>积分</p>
        </div> -->
        <div  @click.stop="goMyExtend">
          <p>0</p>
          <p>推广</p>
        </div>
      </div>
    </div>
    <div class="order-box">
      <div @click="goGoodsOrder('')">
        <i class="icon spdd-icon"></i>
        <p>商品订单</p>
      </div>
      <div  @click="goTravelOrder">
        <i class="icon lydd-icon"></i>
        <p>旅游订单</p>
      </div>
      <div  @click="goDaRenOrder">
        <i class="icon drdd-icon"></i>
        <p>达人订单</p>
      </div>
      <div  @click="goGoodsOrder(20)">
        <i class="icon tksh-icon"></i>
        <p>退款/售后</p>
      </div>
    </div>
    <div class="wallet-box"  v-if="talentStatus === 2">
      <p class="title">
        <i class="icon2 zs-icon"></i>
        <span class="txt">达人助手</span>
      </p>
      <div class="wallet-detail">
        <div @click="pushMask">
          <p><i class="icon2 fbcp-icon"></i></p>
          <p>发布产品</p>
        </div>
        <div @click="goMyGuide">
          <p><i class="icon2 wdcp-icon"></i></p>
          <p>我的产品</p>
        </div>
        <div @click="goProve">
          <p><i class="icon2 xxrz-icon"></i></p>
          <p>信息认证</p>
        </div>
        <div @click="goGuideOrder">
          <p><i class="icon2 ddgl-icon"></i></p>
          <p>订单管理</p>
        </div>
        <!-- <div @click="">
          <p><i class="icon2 pjgl-icon"></i></p>
          <p>评价管理</p>
        </div> -->
      </div>
    </div>
    <!-- <div class="share-box">
      <p class="title">
        <i class="icon share-icon"></i>
        <span class="txt">分享获得红包</span>
        <span class="more-btn">更多<i class="icon more-icon"></i></span>
      </p>
    </div> -->
    <p class="moduled-title">
      <i class="icon2 sq-icon"></i>
      <span class="txt">我的社区</span>
    </p>
    <div class="moduled-box">
      <!-- <div>
        <i class="icon drzx-icon"></i>
        <p>达人中心</p>
      </div> -->
      <!-- <div>
        <i class="icon scll-icon"></i>
        <p>收藏 / 浏览</p>
      </div> -->
      <div @click="goPushTravels">
        <i class="icon fbyk-icon"></i>
        <p>发布游记</p>
      </div>
      <div @click="goLookArround">
        <i class="icon fbsuk-icon"></i>
        <p>发布随便看</p>
      </div>
      <div @click="goPartner">
        <i class="icon2 fbyb-icon"></i>
        <p>发布约伴</p>
      </div>
      <!-- <div @click="goPushBusF">
        <i class="icon2 fbyb-icon"></i>
        <p>发布包车接机</p>
      </div> -->
      <div @click="goMyLookAround">
        <i class="icon2 wdsbk-icon"></i>
        <p>我的随便看</p>
      </div>
      <div @click="goMyTravels">
        <i class="icon2 wdyj-icon"></i>
        <p>我的游记</p>
      </div>
      <div @click="goMyPartner">
        <i class="icon wdyb-icon"></i>
        <p>我的约伴</p>
      </div>
      <!-- <div @click="goForward"  v-if="isLogin">
        <i class="icon wdyb-icon"></i>
        <p>关注列表</p>
      </div> -->
      <!-- <div @click="goGGCross">
        <i class="icon2 ggkj-icon"></i>
        <p>港港跨境
        </p>
      </div> -->
      <!-- <div @click="goPublic">
        <i class="icon wdyb-icon"></i>
        <p>公益扶贫</p>
      </div> -->
    </div>
    <div class="dialog-mask" v-if="pushMaskShow" @click="closePushMask"></div>
    <div class="push-mask" v-if="pushMaskShow">
      <p class="title">选择发布产品</p>
      <div class="item-modules">
        <span @click="goPushGuide">达人陪游</span>
        <!-- <span>向导咨询</span>
        <span>包车接机</span> -->
        <!-- <span @click="goAgentBuy">导游代购</span> -->
      </div>
    </div>
    <canvas canvas-id="shareCanvas1" :style="computedClassObject"></canvas>
  </div>
</template>
<script>
  import Http from '../../utils/http'
  export default {
    data () {
      return {
        customerId: '',
        timer: null, // 定时器
        shareImgList: [],
        isLogin: false,
        customerDetail: '',
        nickName: '', // 昵称
        headImg: '', // 头像
        levelName: '',
        talentStatus: '',
        isCertified: '', // 银行卡认证 0-未认证 1-已认证
        bank: '', // 银行卡信息
        showImgUrl: [],
        license: '',
        qrCode: '',
        userlogo: require('../../../static/images/common/userlogo.png'),
        windowWidth: 0, // 可使用窗口宽度
        windowHeight: 0,
        couponCount: '',
        pushMaskShow: false
      }
    },
    onShow () {
      this.getIsLogin()
      // 获取系统信息
      wx.getSystemInfo({
        success: res => {
          console.log('getSystemInfos', res)
          this.windowWidth = res.windowWidth
          this.windowHeight = res.windowHeight
        }
      })
    },
    methods: {
      goForward () {
        wx.navigateTo({
          url: `/pages/daren/forwardList/main`
        })
      },
      getIsLogin() {
        this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
          if (res.code === 0) {
            this.isLogin = res.result
            if (this.isLogin) {
              this.getCustomer()
              this.getCouponCount()
            }
          }
        })
      },
      getCustomer () {
        this.$http.post(this.API.customer, {
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.customerDetail = res.result
            this.isCertified = res.result.isCertified
            this.nickName = res.result.nickName
            this.headImg = res.result.photo
            this.levelName = res.result.levelName
            this.talentStatus = res.result.talentStatus // 2：达人
            this.license = res.result.license
            this.customerId = res.result.id
            wx.setStorageSync('customerId', this.customerId)
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      pushMask () {
        this.pushMaskShow = true
      },
      closePushMask () {
        this.pushMaskShow = false
      },
      getCouponCount () {
        this.$http.post(this.API.couponCount).then(res => { // 判断是否登录
          if (res.code === 0) {
            this.couponCount = res.result
          }
        })
      },
      goPartnerRegister () {
        let status = ''
        if (this.license && this.license.status) {
          status = this.license.status
        }
        let url = ''
        wx.setStorageSync('license', this.license)
        if (status === 1) {
          url = `/pages/member/partnerRegister/main?status=1`
        } else if (status === 2) { // 审核通过
          url = `/pages/member/partnerRegister/main?status=2`
        } else if (status === 3) { // 审核驳回
          url = `/pages/member/partnerRegister/main?status=3`
        } else if (status === 4) { // 审核通过且支付成功
          url = `/pages/member/partnerRegister/main?status=4`
        } else {
          url = `/pages/member/partnerRegister/main?status=0` // 未提交过审核
        }
        wx.navigateTo({
          url: url
        })
      },
      goGoodsOrder (status) {
        if (this.isLogin) {
          wx.navigateTo({
            url: `/pages/goods/order/main?status=${status}`
          })
        } else {
          this.goLogin()
        }
      },
      goMeIndex () {
        if (this.talentStatus === 2) { // 达人信息编辑页
          wx.navigateTo({
            url: `/pages/daren/settledIn/main?id=${this.customerId}`
          })
        } else { // 普通用户
          wx.navigateTo({
            url: `/pages/meInfo/meIndex/main?id=${this.customerId}`
          })
        }
      },
      goPushTravels () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/pushTravels/main'
          })
        } else {
          this.goLogin()
        }
      },
      goDaRenOrder () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/darenOrder/main'
          })
        } else {
          this.goLogin()
        }
      },
      goMyTravels () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/myTravels/main'
          })
        } else {
          this.goLogin()
        }
      },
      goAgentBuy () {
        this.pushMaskShow = false
        wx.navigateTo({
          url: '/pages/daren/pushAgentBuy/main'
        })
      },
      goMyGuide () {
        this.pushMaskShow = false
        wx.navigateTo({
          url: '/pages/daren/myGuide/main'
        })
      },
      goPushGuide () {
        this.pushMaskShow = false
        wx.navigateTo({
          url: `/pages/daren/pushGuideF/main`
        })
      },
      goGuideOrder () {
        wx.navigateTo({
          url: `/pages/daren/guideOrder/main`
        })
      },
      goMyCard () {
        wx.navigateTo({
          url: '/pages/meInfo/myCard/main'
        })
      },
      goLogin () {
        wx.navigateTo({
          url: '/pages/login/main'
        })
      },
      goSetUp () {
        // if (this.isLogin === true) {
        wx.navigateTo({
          url: '/pages/setUp/index/main'
        })
        // } else {
        //   wx.navigateTo({
        //     url: '/pages/login/main'
        //   })
        // }
      },
      goLookArround () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/addLookArround/main'
          })
        } else {
          this.goLogin()
        }
      },
      goMyLookAround () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/lookAround/main?tab=2'
          })
        } else {
          this.goLogin()
        }
      },
      goMyPartner() {
        if (this.isLogin) {
          wx.navigateTo({
            url: `/pages/daren/partnerIndex/main?type=2`
          })
        } else {
          this.goLogin()
        }
      },
      goGGCross() {
        wx.navigateTo({
          url: `/pages/webview/main`
        })
      },
      goPublic() {
        wx.navigateTo({
          url: `/pages/otherModula/public/main`
        })
      },
      goPartner () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/daren/addPartner/main'
          })
        } else {
          this.goLogin()
        }
      },
      goTravelOrder () {
        if (this.isLogin) {
          wx.navigateTo({
            url: '/pages/travel/traOrderList/main'
          })
        } else {
          this.goLogin()
        }
      },
      goMyProfit () {
        if (this.isLogin) {
          wx.navigateTo({
            url: `/pages/profit/myProfit/main`
          })
        } else {
          this.goLogin()
        }
      },
      goMyCoupon () {
        if (this.isLogin) {
          wx.navigateTo({
            url: `/pages/goods/myCoupon/main`
          })
        } else {
          this.goLogin()
        }
      },
      goMyExtend () {
        if (this.isLogin) {
          wx.navigateTo({
            url: `/pages/profit/myExtend/main`
          })
        } else {
          this.goLogin()
        }
      },
      goProve () {
        wx.navigateTo({
          url: `/pages/daren/myProve/main`
        })
      },
      goPushBusF() {
        wx.navigateTo({
          url: `/pages/daren/pushBusF/main`
        })
      },
      toUrl(url) {
        wx.navigateTo({
          url
        })
      },
      // 生成分享二维码
      createWxQrcode () {
        let that = this
        let shareCode = wx.getStorageSync('customerCode') // 本人分享id
        // step1:生成分享二维码
        this.$http.post(this.API.createWxQrcode, {
          data: {
            page: 'pages/travelPerson/main',
            scene: `${shareCode}`,
            width: 300
          }
        }).then(res => {
          if (res.code === 0) {
            wx.showLoading({
              title: '图片生成中'
            })
            // step2:把二维码地址下载到本地
            wx.downloadFile({
              url: res.result, // 后端返回的二维码地址
              success: function (res) {
                if (res.statusCode === 200) {
                  that.qrCode = res.tempFilePath // 下载后的二维码地址
                  // step3:canves绘3张图
                  that.showImgUrl = []
                  that.getShareImg('https://deer99.com/imgSer/resource/image/share1.jpg', that.qrCode, 'shareCanvas1')
                  // that.getShareImg('https://deer99.com/imgSer/resource/image/share2.jpg', that.qrCode, 'shareCanvas2')
                  // that.getShareImg('https://deer99.com/imgSer/resource/image/share3.jpg', that.qrCode, 'shareCanvas3')
                }
              },
              fail: function (e) {
                console.log('下载原海报失败', e)
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
      getShareImg (imgurl, qrCode, canvasId) {
        let that = this
        wx.getImageInfo({
          src: imgurl,
          success: res => {
            const ctx = wx.createCanvasContext(canvasId)
            // 绘制背景
            ctx.drawImage(res.path, 0, 0, this.windowWidth, this.windowHeight)
            // 绘制小程序码qrImgSize 小数是自己计算的比例
            // 二维码宽: this.windowWidth * 0.21
            // 二维码高: this.windowHeight * 0.15
            // 距离顶部距离：this.windowHeight * 0.81
            // 距离左边距离：this.windowWidth - (this.windowWidth * 0.21)) / 2
            ctx.drawImage(qrCode, (this.windowWidth - (this.windowWidth * 0.24)) / 2, this.windowHeight * 0.81, this.windowWidth * 0.24, this.windowHeight * 0.15)
            ctx.stroke()
            ctx.draw()
            setTimeout(() => {
              // canvas画布转换成图片地址
              wx.canvasToTempFilePath({
                canvasId: canvasId,
                success: (res) => {
                  wx.uploadFile({ // 把临时地址改成服务器地址，解决安卓打开图片黑屏bug
                    url: Http.baseURL + '/uploadByUrl',
                    filePath: res.tempFilePath,
                    name: 'file',
                    success: function (r) {
                      r.data = JSON.parse(r.data)
                      console.log(r.data.result)
                      if (r.data.code === 0) {
                        that.showImgUrl.push(r.data.result)
                        that.showImgUrl.push(that.qrCode) // 二维码大图
                        that.previewImage()
                      } else {
                        wx.showToast({
                          title: '图片生成失败',
                          icon: 'none'
                        })
                      }
                    },
                    complete() {
                      wx.hideLoading()
                    }
                  })
                }
              })
            }, 100)
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      // 预览图片
      previewImage () {
        debugger
        wx.hideLoading()
        wx.previewImage({
          urls: this.showImgUrl
        })
      },
      showJson(style) {
        let s = []
        for (let i in style) {
          s.push(i + ':' + style[i])
        }
        s = s.join(';')
        console.log(s)
        return s
      }
    },
    computed: {
      computedClassObject () {
        return this.showJson({
          height: `${this.windowHeight}px`,
          width: '750rpx',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px'
          // height: `800rpx`
        })
      }
    }
  }
</script>
<style lang = "scss" scoped>
  .me-page{
    min-height: 100vh;
    background: #f4f4f4;
  }
  .login-box{
    background: #fbb03b;
    position: relative;
    height: 400rpx;
    border-radius: 0 0 30% 30%;
    /* background-image: url('https://deer99.com/imgSer/resource/image/mePageBg.png'); */
    .title-main{
      height: 200rpx;
      padding-top: 25rpx;
      .user-img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background: #e5e5e5;
        display: inline-block;
        margin: 48rpx 0 32rpx 31rpx;
      }
      .name-box{
        /* width: 50%; */
        display: inline-block;
        height: 120rpx;
        vertical-align: top;
        margin-top: 50rpx;
        padding-top: 15rpx;
        padding-left: 20rpx;
        position: relative;
        .login-txt, .nologin-txt {
          color: #fff;
          vertical-align: top;
          display: inline-block;
          font-size: 32rpx;
        }
        .level-name{
          font-size: 24rpx;
          color: #fff;
          width: 150rpx;
        }
        .qrCode-icon{
          width: 38rpx;
          height: 38rpx;
          background: url(../../../static/images/qrcode.png);
          background-size: 100% 100%;
          position: absolute;
          right: -30rpx;
          bottom: 40rpx;
        }
      }
      .msg-icon{
        float: right;
        width: 35rpx;
        height: 35rpx;
        background: url(../../../static/images/meTop.png);
        background-size: 220rpx 100rpx;
        background-position: -4rpx -62rpx;
        margin-right: 30rpx;
      }
      .setup-icon{
        float: right;
        margin-right: 50rpx;
        background-position: -92rpx -49rpx;
        transform: scale(1.3);
        margin-top: 20rpx;
        border: 7px solid transparent;
        background-clip: padding-box;
      }
      .mt70{
        margin-top: 70rpx;
      }
    }
    .card{
      position: absolute;
      right: 160rpx;
      padding: 20rpx
    }
    .nologin-txt{
      margin-top: 20rpx;
    }
    .card-txt{
      color: #fff;
      font-size: 30rpx;
      vertical-align: top;
    }
    .card-icon{
      background-position: -287rpx -48rpx;
      vertical-align: top;
      margin-top: 12rpx;
      margin-right:10rpx;
    }
    .member-box{
      width: 175rpx;
      height: 50rpx;
      background: url(../../../static/images/meTop.png);
      background-size: 220rpx 100rpx;
      background-position: 0 -9rpx ;
      position: absolute;
      right: 0;
      margin-top: 90rpx;
      .member-icon{
        width: 32rpx;
        height: 30rpx;
        background: url(../../../static/images/meTop.png);
        background-size: 220rpx 100rpx;
        background-position: -183rpx -2rpx ;
        margin-left: 20rpx;
        display: inline-block;
        vertical-align: middle;
      }
      span{
        color: #fff;
        font-size: 22rpx;
        vertical-align: text-top;
        margin-left: 10rpx;
        vertical-align: middle;
      }
    }
    .bg-box{
      background: #fff;
      width: 100%;
      height: 180rpx;
      position: absolute;
      z-index: 1;
      overflow: hidden;
      .bg-box2{
        background: #fbb03b;
        width: 104%;
        height: 120rpx;
        position: absolute;
        z-index: 1;
        border-radius: 0 0 50% 50%;
        left: -2%;
        overflow: hidden;
      }
    }
    .extend-box{
      position: absolute;
      z-index: 99;
      left: 4%;
      width: 690rpx;
      height: 160rpx;
      background-color: #ffffff;
      box-shadow: 0px 2rpx 15rpx 1rpx rgba(4, 0, 0, 0.06);
      border-radius: 10rpx;
      margin: 0 auto;
      margin-top: 40rpx;
      padding: 35rpx 0;
      box-sizing: border-box;
      div{
        width: 33%;
        display: inline-block;
        font-size: 24rpx;
        text-align: center;
        border-right: 1rpx solid #f4f4f4;
        p:nth-child(1){
          font-size: 30rpx;
          color: #fbb03b;
        }
        p:nth-child(2){
          margin-top: 15rpx;
        }
      }
      div:last-child{
        border-right: none;
      }
      .qb-icon{
        width: 32rpx;
        height: 32rpx;
        background: url(../../../static/images/meTop.png);
        background-size: 220rpx 100rpx;
        background-position: -183rpx -37rpx ;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .icon {
    width: 40rpx;
    height: 40rpx;
    display: inline-block;
    margin: 0 auto;
    background: url(../../../static/images/meIcon.png);
    background-size: 500rpx 200rpx;
    background-position: -134rpx -49rpx;
  }
  .icon2{
    width: 38rpx;
    height: 40rpx;
    display: inline-block;
    margin: 0 auto;
    background: url(../../../static/images/travelPerson/allPerson.png);
    background-size: 200rpx 130rpx;
    vertical-align: middle;
  }
  .ggkj-icon{
    background-position:-148rpx -34rpx;
    height: 34rpx;
    margin-bottom: 18rpx;
    }
  .gyfp-icon{background-position:-162rpx -68rpx;}
  .right-icon {
    background: url('../../../static/images/goodsDetail.png');
    background-size: 500rpx 120rpx;
    background-position:-232rpx 0;
    width: 15rpx;
    height: 30rpx;
    float: right;
    margin-top:2rpx;
  }
  .order-box {
    background: #fff;
    display: flex;
    padding: 45rpx 0;
    padding: 180rpx 0 50rpx 0;
    margin-top: -100rpx;
    div {
      flex-grow: 1;
      text-align: center;
      font-size: 28rpx;
      color: #353535;
    }
    .spdd-icon { background-position: 0 -3rpx; }
    .lydd-icon { background-position: -42rpx -3rpx; }
    .drdd-icon { background-position: -242rpx -4rpx; }
    .tksh-icon { background-position: -84rpx -3rpx; }
  }
  .wallet-box, .share-box {
    position: relative;
    margin-top: 20rpx;
    background: #fff;
    font-size: 26rpx;
    height: 216rpx;
    .title {
      font-size: 30rpx;
      padding: 25rpx;
      .txt{
        margin-left: 70rpx;
      }
      .wallet-icon{
        background-position: -128rpx -2rpx;
        position: absolute;
        margin-top: 5rpx;
      }
      .extend-icon{
        background-position: -249rpx -45rpx;
        position: absolute;
        margin-top: 5rpx;
      }
      .right-btn {
        float: right;
        margin-right: 15rpx;
        color: #333333;
        text-align: center;
        font-size: 30rpx;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 25rpx;
      }
    }
    .wallet-detail {
      display: flex;
      height: 120rpx;
      div {
        flex-grow: 1;
        text-align: center;
        p:nth-child(1){
          margin-top: 10rpx;
          color: #f7a012;
        }
        p:nth-child(2){
          margin-top: 10rpx;
          font-size: 24rpx;
          color: #666666;
        }
      }
    }
    .give {
      color: #353535;
      padding: 26rpx 0;
      margin: 0 17rpx;
      border-top: 1rpx solid #e8e8e8;
      text-align: center;
      .give-icon {
        background-position: -52rpx -54rpx;
        height: 32rpx;
        margin-right: 10rpx;
      }
      span{
        vertical-align: top;
      }
    }
    .zs-icon{
      background-position: -80rpx -38rpx;
      position: absolute;
      margin-top: 5rpx;
    }
    .fbcp-icon{
      background-position: -4rpx -3rpx;
      height: 38rpx;
    }
    .wdcp-icon{
      background-position: -45rpx -3rpx;
      height: 38rpx;
    }
    .ddgl-icon{
      background-position: -118rpx -37rpx;
      width: 30rpx;
    }
    .xxrz-icon{
      background-position: -3rpx -33rpx;
      width: 36rpx;
    }
    /* .wdyj-icon{
      background-position: -117rpx -3rpx;
    } */
    .fbyj-icon{
      background-position: -86rpx -3rpx;
    }
    .pjgl-icon{
      background-position: -40rpx -40rpx;
    }
  }
  .share-box {
    position: relative;
    .title {
      .share-icon {
        background-position: -205rpx -5rpx;
        height: 32rpx;
        position: absolute;
      }
      .more-btn {
        float: right;
        color: #8d8d8d;
        font-size: 23rpx;
        margin-top: 8rpx;
      }
      .more-icon {
        width: 18rpx;
        height: 23rpx;
        background-position: -180rpx -58rpx;
        float: right;
        margin-top: 5rpx;
        margin-left: 8rpx;
      }
    }

  }
  .moduled-title {
    font-size: 30rpx;
    margin-top: 20rpx;
    padding: 25rpx 0 0 25rpx;
    background: #fff;
    .sq-icon{
      background-position: 0 -72rpx;
    }
    .txt{
      margin-left: 30rpx;
    }
  }
  .moduled-box {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    padding-bottom: 30rpx;
    font-size: 26rpx;
    color: #353535;
    div {
      padding-top: 40rpx;
      width: 25%;
      text-align: center;
      box-sizing: border-box;
      .drzx-icon {background-position: -242rpx -3rpx; height:44rpx;}
      .fbyk-icon {background-position: -414rpx -46rpx;}
      /* .cyxx-icon {background-position: -327rpx -1rpx;} */
      .scll-icon {background-position: -417rpx 0;}
      /* .fwdh-icon {background-position: -461rpx -1rpx;} */
      /* .yhk-icon {background-position: -201rpx -44rpx;} */
      /* .qrCode-icon{background-position: -376rpx -48rpx;} */
      .fbsuk-icon{background-position: -457rpx -45rpx;}
      .wdyb-icon{background-position: -372rpx 2rpx;}
      .fbyb-icon{background-position: -84rpx 3rpx;margin-bottom: 10rpx;}
      .wdsbk-icon{background-position: -161rpx 1rpx;height: 38rpx;margin-bottom: 13rpx;}
      .wdyj-icon{background-position: -117rpx 3rpx;margin-bottom: 10rpx;}
    }
  }
  .column-item{
   font-size: 30rpx;
   height: 92rpx;
   line-height: 92rpx;
   margin-top: 20rpx;
   background: #fff;
   padding: 0 30rpx;
   position: relative;
   .right-icon{
     position: absolute;
     top: 30rpx;
     right: 20rpx;
   }
   .rz-icon{
     background-position: -4rpx -39rpx;
     margin-right: 20rpx;
     margin-top: -5rpx;
   }
   .pl-icon{
     background-position: -40rpx -39rpx;
     margin-right: 20rpx;
   }
  }
  .dialog-mask{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
    animation: mymove .3s forwards;
  }
  .push-mask{
    background: #fff;
    border-radius: 15rpx;
    z-index: 99999999;
    animation: mymove .3s forwards;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500rpx;
    margin-top: -100rpx;
    margin-left: -250rpx;
    word-wrap:break-word; /*自动换行*/
    text-align: center;
    padding: 30rpx;
    box-sizing: border-box;
    .title{
      font-size: 26rpx;
    }
    .item-modules{
      span{
        display: inline-block;
        margin: 20rpx;
        width: 170rpx;
        height: 65rpx;
        line-height: 65rpx;
        background: #fbb03b;
        color: #fff;
        font-size: 24rpx
      }
    }
  }
  @keyframes mymove
  {
    from {opacity: 0 }
    to {opacity:1;}
  }
  @-webkit-keyframes mymove
  {
    from {opacity: 0 }
    to {opacity:1;}
  }
</style>
