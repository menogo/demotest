<template>
  <div class="page">
    <img :src="logo" alt="" class="logoImg">
    <p class="msg">欢迎来到港港跨境直邮电商平台，为您提供香港名牌系列商品香港直邮到家服务！</p>
    <div class="btn-box">
      <button>登记买家</button>
      <button>进去逛逛</button>
    </div>
    <div class="tips-box">
      <p>温馨提示：</p>
      <p>1.每个中国公民全年享有2.6万元海外直邮免税购买个人日用品权益。</p>
      <p>2.香港名牌商品涵盖世界各大品牌</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logo: require('../../../../static/images/common/ggCross.png')
    }
  },
  onShow () {

  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.page{
  background: #fff;
  height: 100vh;
}
.logoImg{
  width: 180rpx;
  height: 180rpx;
  margin:0 auto;
  display: block;
  padding-top: 110rpx;
}
.msg{
  margin:55rpx  40rpx;
  font-size: 32rpx;
}
.btn-box{
  margin: 100rpx 40rpx 0 40rpx;
  button{
    display: inline-block;
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    background: #5587c6;
    font-size: 36rpx;
  }
  button:nth-child(2){
    margin-left: 60rpx;
    background: #fbb03b;
  }
}
.tips-box{
  position: fixed;
  bottom: 45rpx;
  margin: 0 40rpx;
  color: #333333;
  font-size: 24rpx;
}
</style>
