<template>
    <div>
      <div class="column-item" @click="goProve(1)">
        <span>身份实名认证</span>
        <i class="icon right-icon"></i>
        <span class="right-txt" v-if="dataDetail.idcardVerify === 0">未认证</span>
        <span class="right-txt active" v-else>已认证</span>
      </div>
      <div class="column-item" @click="goProve(2)">
        <span>导游认证</span>
        <i class="icon right-icon"></i>
        <span class="right-txt"  v-if="dataDetail.guideVerify === 0">未认证</span>
        <span class="right-txt active" v-else>已认证</span>
      </div>
      <div class="column-item" @click="goProve(3)">
        <span>驾驶证认证</span>
        <i class="icon right-icon"></i>
        <span class="right-txt"  v-if="dataDetail.driverVerify === 0">未认证</span>
        <span class="right-txt active" v-else>已认证</span>
      </div>
      <div class="column-item" @click="goProve(4)">
        <span>学生证认证</span>
        <i class="icon right-icon"></i>
        <span class="right-txt"  v-if="dataDetail.studentVerify === 0">未认证</span>
        <span class="right-txt active" v-else>已认证</span>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      dataDetail: {}
    }
  },
  onShow () {
    this.getLicenseDetail()
  },
  methods: {
    getLicenseDetail() {
      this.$http.post(this.API.licenseDetail).then(res => {
        if (res.code === 0) {
          this.dataDetail = res.result
        }
      })
    },
    goProve (type) {
      wx.navigateTo({
        url: `/pages/daren/prove/main?type=${type}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.column-item{
  font-size: 30rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: #fff;
  padding: 0 30rpx;
  position: relative;
  border-bottom: 1rpx solid #dcdcdc;
  .right-icon{
    background-position: 0 0;
    position: absolute;
    right: 30rpx;
    top: 45rpx;
  }
  .right-txt{
    float: right;
    font-size: 30rpx;
    color: #a9a9a9;
    margin-right: 35rpx;
  }
  .right-txt.active{
    color: #fcb13a;
  }
}
 .icon{
  background: url('../../../../static/images/cash.png');
  background-size: 200rpx 50rpx;
  width: 25rpx;
  height: 35rpx;
  display: inline-block;
  vertical-align: middle;
}
</style>