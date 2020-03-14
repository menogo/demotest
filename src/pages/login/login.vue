<template>
    <div>
      <img :src="logo" alt="" class="logo-img">
      <button  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  class="mobile-login"  @click="wxLogin" >使用微信绑定手机号一键登录</button>
      <p class="oth-mobile-login" @click="goOtherPhoneLogin">其他手机登录</p>
      <!-- <p class="oth-mobile-login" @click="goback">暂不登录</p> -->
      <!-- <div class="wechat-login">
        <img :src="wechatLogin">
      </div> -->
      <p class="tips">温馨提示：未注册用户首次登录时即自动完成注册</p>
    </div>
</template>
<script>
export default {
  data () {
    return {
      mobile: '',
      isRegist: '', // 用户是否注册过标识
      logo: require('../../../static/images/common/logo.png'),
      wechatLogin: require('../../../static/images/common/wechat.png')
    }
  },
  getPhoneNumber: function (e) {
    console.log(e.detail)
  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
  },
  onUnload() {
    if (wx.getStorageSync('loginPage')) {
      wx.removeStorageSync('loginPage')
    }
  },
  methods: {
    wxLogin () {
      wx.login({
        success: (res) => {
          let code = res.code
          let url = `${this.$http.baseURL}${this.API.getOpenId}`
          if (code) {
            wx.request({
              url: url, // 这里是我们自己的接口(用微信登录的code传给后端来换取session_key，openId)
              data: {
                code: code
              },
              success: (res) => {
                wx.setStorageSync('openId', res.data.result.openId)
                this.isRegist = res.data.result.regist // 用户是否注册过标识
              }
            })
          } else {
            wx.showToast({
              title: '获取用户登录状态失败',
              icon: 'none'
            })
          }
        }
      })
    },
    // 手机号登录/获取手机号
    getPhoneNumber (e) {
      var detail = e.mp.detail
      var openId = wx.getStorageSync('openId')
      console.log(detail.errMsg)
      if (detail.errMsg === 'getPhoneNumber:ok') {
        let url = `${this.$http.baseURL}${this.API.getMobile}`
        wx.request({
          url: url, // 解密手机号码接口
          data: {
            'openId': openId,
            'encryptedData': detail.encryptedData,
            'iv': detail.iv
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            if (res.data.code === 0) {
              this.mobile = res.data.result
              let promoterCode = wx.getStorageSync('promoterCode')
              console.log('promoterCode', wx.getStorageSync('promoterCode'))
              // 调登录接口
              this.$http.post(this.API.loginSubmit, {
                data: {
                  loginType: 2,
                  openId: openId,
                  mobile: this.mobile,
                  promoterCode: promoterCode // 分享人
                }
              }).then(res => {
                wx.setStorageSync('sessionid', res.result.session) // 存储sessionid进cookie后续用
                wx.setStorageSync('customerCode', res.result.customerCode) // 分享code
                wx.setStorageSync('isLogin', true)
                this.setSearchList()
                console.log(wx.getStorageSync('loginPage'))
                if (wx.getStorageSync('loginPage')) { // 有指定跳转页面
                  let url = wx.getStorageSync('loginPage')
                  wx.redirectTo({
                    url: url
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
                wx.removeStorageSync('loginPage')
              })
            } else {
              wx.showToast({
                title: '请稍后再试',
                icon: 'none'
              })
            }
          }
        })
      } else {
        wx.removeStorageSync('loginPage')
        wx.showToast({
          title: '未授权',
          icon: 'none'
        })
        wx.navigateBack()
      }
    },
    goOtherPhoneLogin () {
      wx.navigateTo({
        url: '/pages/otherPhoneLogin/main'
      })
    },
    setSearchList () {
      let searchList = wx.getStorageSync('searchList')
      if (searchList.length < 1) {
        return
      }
      this.$http.post(this.API.saveSearchWord, {
        data: {
          json: JSON.stringify(searchList)
        }
      }).then(res => {
        if (res.code === 0) {
          console.log(res)
          wx.removeStorageSync('searchList')
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goback () {
      wx.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
.logo-img {
  width: 180rpx;
  height: 205rpx;
  display: block;
  margin: 0 auto;
  margin-top: 130rpx;
}
.mobile-login{
  background: #ff9913;
  color: #fff;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 55rpx;
  margin-top: 125rpx;
}
.oth-mobile-login {
 font-size: 28rpx;
 text-align: center;
 margin-top: 30rpx;
}
.wechat-login{
  position: fixed;
  bottom: 130rpx;
  width: 80rpx;
  height: 80rpx;
  border:1rpx solid #dfdfdf;
  border-radius: 40rpx;
  margin-left: 335rpx;
  img{
    position: absolute;
    width: 50rpx;
    height: 40rpx;
    top: 50%;
    left: 50%;
    margin-top: -21rpx;
    margin-left: -23rpx;
  }
  
}
button::after{
  border: none;
}
.tips{
  position: fixed;
  color: #888;
  font-size: 22rpx;
  bottom: 35rpx;
  text-align: center;
  width: 500rpx;
  left: 52%;
  margin-left: -250rpx;
}

</style>

