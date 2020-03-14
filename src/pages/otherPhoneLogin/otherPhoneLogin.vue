<template>
    <div>
      <img :src="logo" class="logo-img">
      <div class="login-form">
        <div class="phone-input">
          <input type="text" placeholder="请输入手机号"  maxlength="11" v-model="mobile">
          <span class="yzm-txt" @click="getVerifyCode" v-if="!getCodeNoTap">{{codeTxt}}</span>
          <span class="yzm-txt" @click="getVerifyCode" v-else>{{codeTxt}}</span>
        </div>
        <div class="code-input">
          <input type="text" placeholder="请输入动态密码" maxlength="6" v-model="verifyCode">
        </div>
      </div>
      <p class="submit" @click="submit">提交</p>
      <p class="wechat-login" @click="goWechatLogin">微信一键登录</p>
    </div>
</template>
<script>
export default {
  data () {
    return {
      mobile: '',
      verifyCode: '',
      Time: 60, // 倒计时时间
      codeTxt: '获取动态验证码', // 验证码文字
      timer: null, // 定时器
      getCodeNoTap: false, // 获取验证码是否允许点击
      logo: require('../../../static/images/common/logo.png')
    }
  },
  methods: {
    getVerifyCode () {
      if (this.getCodeNoTap) {
        return
      }
      if (!this.mobile) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false
      } if (!this.mobile.match(/^1\d{10}$/g)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return false
      }
      // 倒计时
      this.sendCode()
      this.countDown()
      this.timer = setInterval(() => {
        this.countDown()
      }, 1000)
    },
    sendCode () {
      this.$http.post(this.API.getVerifyCode, {
        data: {
          mobile: this.mobile
        }
      }).then(res => {
        if (res.code === 0) {
          console.log(res)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 倒计时
    countDown () {
      if (this.Time > 0) {
        this.getCodeNoTap = true
        this.codeTxt = this.Time + 's'
        --this.Time
      } else {
        clearInterval(this.timer)
        this.Time = 60
        this.getCodeNoTap = false
        this.codeTxt = '重新获取'
      }
    },
    submit () {
      this.$http.post(this.API.loginSubmit, {
        data: {
          mobile: this.mobile,
          loginType: 1,
          verifyCode: this.verifyCode
        }
      }).then(res => {
        if (res.code === 0) {
          wx.setStorageSync('sessionid', res.result.session) // 存储sessionid进cookie后续用
          wx.setStorageSync('customerCode', res.result.customerCode) // 分享code
          wx.setStorageSync('isLogin', true)
          wx.switchTab({
            url: '/pages/me/main'
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goWechatLogin () {
      wx.navigateTo({
        url: '/pages/login/main'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo-img{
  width: 180rpx;
  height: 205rpx;
  display: block;
  margin: 0 auto;
  margin-top: 130rpx;
}
.login-form{
  margin-top: 125rpx;
  font-size:24rpx;
  .phone-input, .code-input{
    position: relative;
    border: 1rpx solid #aaa;
    border-radius: 50rpx;
    margin: 0 62rpx;
    margin-top: 42rpx;
  }
  input{
    width: 70%;
    height: 78rpx;
    line-height: 78rpx;
    padding: 20rpx 46rpx;
    box-sizing:border-box;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box; 
  }
  .code-input{
    input{
      width: 100%;
    }
  }
  .yzm-txt {
    width: 180rpx;
    color: #ff9913;
    position: absolute;
    right: 20rpx;
    top: 0;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
  }
}
.submit {
  background: #fbb03b;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 62rpx;
  margin-top: 50rpx;
  border-radius: 50rpx;
}
.wechat-login{
  margin: 0 62rpx;
  margin-top: 30rpx;
  font-size: 25rpx;
  color: #888888;
}
</style>

