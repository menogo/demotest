<template>
  <div class="wrapper">
    <div class="logo-wrap">
      <image class="logo" src="../../../static/images/common/public_logo.png" alt="" mode="widthFix"></image>
    </div>
    <ul class="list">
      <li class="item">世界很大带TA去看看</li>
      <li class="item">流浪猫狗</li>
      <li class="item">客家会客厅</li>
      <li class="item">汉文化项目</li>
      <li class="item">河源红色项目</li>
    </ul>
    <div class="text-wrap">
      <p class="text">温馨提示：</p>
      <p class="text">所有募捐的款项有福建省商盟公益基金会统一管理，本平台为爱心人士提供捐赠入口。</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  onShow () {

  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
  height: 100vh;
  background-color: #fff;
}
.logo-wrap {
  padding: 60rpx 0 30rpx;
  text-align: center;
  .logo {
    width: 143rpx;
    height: 200rpx;
  }
}
.list {
  flex: 1;
  .item {
    height: 78rpx;
    margin: 30rpx 0;
    line-height: 78rpx;
    border-radius: 30rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000000;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, .1);
  }
}
  .text-wrap {
    padding-bottom: 40rpx;
    line-height: 32rpx;
    font-size: 24rpx;
  }
</style>
