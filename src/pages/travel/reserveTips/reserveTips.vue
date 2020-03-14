<template>
  <div class="page" v-if="reserveMsg">
    <div class="modu-box">
      <p class="title">预订限制</p>
      <div class="main">
        <p>本产品不接受{{reserveMsg.rejectAge}}岁以上的人员预定</p>
        <p>本产品{{reserveMsg.lowerAge}}岁以下的人员预定，必须要有监护人陪行</p>
        <p>本产品{{reserveMsg.upperAge}}岁以上的人员预定，必须要提供医院开的健康证明</p>
        <p>
          <span v-if="reserveMsg.acceptForeign === 1">本产品接受外籍顾客预定</span>
          <span v-else>本产品不接受外籍顾客预定</span>
          <span v-if="reserveMsg.acceptHmt === 1">包含港澳台</span>
          <span v-else>不包含港澳台</span>
        </p>
      </div>
    </div>
    <div class="modu-box" v-if="reserveMsg.reserveDesc">
      <p class="title">预订说明</p>
      <div class="main">
        {{reserveMsg.reserveDesc}}
      </div>
    </div>
    <div class="modu-box" v-if="reserveMsg.productDesc">
      <p class="title">产品说明</p>
      <div class="main">
        {{reserveMsg.productDesc}}
      </div>
    </div>
    <div class="modu-box" v-if="reserveMsg.remind">
      <p class="title">温馨提示</p>
      <div class="main">
        {{reserveMsg.remind}}
      </div>
    </div>
    <div class="modu-box" v-if="reserveMsg.visaNotes">
      <p class="title">签证说明</p>
      <div class="main">
        {{reserveMsg.visaNotes}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      reserveMsg: '' // 预定说明数据
    }
  },
  mounted () {
    this.reserveMsg = wx.getStorageSync('reserveMsg')
  }
}
</script>
<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
}
.modu-box{
  background: #fff;
  padding: 30rpx 20rpx;
  margin-top: 20rpx;
  .title{
    font-size: 30rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
  }
  .main{
    font-size: 26rpx;
    color: #353535;
    white-space: pre-wrap;
  }
}
</style>