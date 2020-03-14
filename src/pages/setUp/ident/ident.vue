<template>
  <div class="page">
    <div>
      <img :src="identImg" alt="" class="header-img">
      <p class="title">账户实名认证，保证资金安全</p>
      <p class="mian-title">实名认证，可有效保障小鹿网账户的资金安全，</p>
      <p class="mian-title">更尊贵“拿去花闪住、信用抢票”等特权服务。</p>
      <p type="text" class="auto-input" @click="goAnthNameIdent"> 用身份证认证</p>
    </div>
        
      
  </div>
</template>
<script>

export default {
  data () {
    return {
      identImg: require('../../../../static/images/ident.png')
    }
  },

  onShow () {

  },

  methods: {
    goAnthNameIdent () {
      wx.navigateTo({
        url: `/pages/setUp/bankCardIdent/main?step=1`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    // background: #fcf9f9;
    background: #f4f4f4;
  }
  .header-img {
    margin: 0 auto;
    margin: 0 auto;
    padding-top: 100rpx;
    width: 190rpx;
    height: 200rpx;
    display: block;
  }
  .title{
    text-align: center;
    font-size: 26rpx;
    color: #ff9913;
    padding-bottom: 20rpx;
  }
  .mian-title{
    font-size: 24rpx;
    color: #353535;
    text-align: center;
  }
  .auto-input{
    background: #fff;
    width:100%;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    margin-top: 120rpx;
    padding: 0 30rpx;
    color: #353535;
  }
</style>
