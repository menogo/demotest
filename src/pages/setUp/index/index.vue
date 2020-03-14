<template>
  <div class="page">
    <!-- <div class="img-box"   @click="goPersonInfo">
      <i-input title="个人信息" disabled/>
      <i class="right-icon"></i>
    </div> -->
    <div class="img-box"   @click="goCommonInfo">
      <i-input title="常用信息" disabled/>
      <i class="right-icon"></i>
    </div>
    <div class="img-box"   @click="goIdent(1)"  v-if="isLogin && isCertified === 0">
      <i-input title="绑定银行卡" disabled/>
      <i class="right-icon"></i>
    </div>
    <div class="img-box"   @click="goIdent(2)" v-if="!isLogin || (isLogin && isCertified === 1)">
      <i-input title="银行卡信息" disabled/>
      <i class="right-icon"></i>
    </div>
    <div class="img-box"   @click="phone">
      <i-input title="服务电话" disabled/>
      <i class="right-icon"></i>
    </div>
    <!-- <div class="img-box"   @click="createWxQrcode">
      <i-input title="我的推广码" disabled/>
      <i class="right-icon"></i>
    </div> -->
    <button class="login-out" @click="loginOut">退出登录</button>
    <canvas canvas-id="shareCanvas1" :style="computedClassObject"></canvas>
  </div>
</template>
<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      isLogin: false,
      qrCode: '',
      showImgUrl: [],
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      isCertified: '' // 银行卡认证 0-未认证 1-已认证
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
    getIsLogin() {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0) {
          this.isLogin = res.result
          if (this.isLogin) {
            this.getCustomer()
          }
        }
      })
    },
    getCustomer () {
      this.$http.post(this.API.customer, {
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.isCertified = res.result.isCertified
          wx.setStorageSync('customerId', this.customerId)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goCommonInfo () {
      if (this.isLogin) {
        wx.navigateTo({
          url: '/pages/meInfo/commonInfo/main'
        })
      } else {
        this.goLogin()
      }
    },
    goIdent (type) {
      if (this.isLogin) {
        wx.navigateTo({
          url: `/pages/setUp/bankCardIdent/main?type=${type}`
        })
      } else {
        this.goLogin()
      }
    },
    goLogin () {
      wx.navigateTo({
        url: '/pages/login/main'
      })
    },
    phone () {
      wx.makePhoneCall({
        phoneNumber: '0755-82242196'
      })
    },
    goPersonInfo () {
      wx.navigateTo({
        url: '/pages/setUp/personInfo/main'
      })
    },
    loginOut () {
      this.$http.post(this.API.loginOut, {}).then(res => {
        wx.setStorageSync('isLogin', false)
        wx.navigateBack({
          url: '/pages/me/main'
        })
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

<style lang="scss" scoped>
.img-box{
  position: relative;
  img{
    position: absolute;
    top: 10rpx;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    right: 50rpx;
  }
}
.right-icon {
  background: url('../../../../static/images/goodsDetail.png');
  background-size: 500rpx 120rpx;
  background-position:-232rpx 0;
  width: 15rpx;
  height: 30rpx;
  position: absolute;
  top: 26rpx;
  right: 10rpx;
}
.login-out{
  background: #fbb03b;
  color: #fff;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 30rpx;
  margin-top: 125rpx;
}
</style>
