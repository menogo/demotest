<template>
    <div class="page">
      <div class="box">
        <div class="modules">
          <p class="title mt0">服务特色</p>
          <textarea name="" id="" cols="30" rows="10" class="textarea" v-model = "serviceSpecial"></textarea>
        </div>
        <div class="modules">
          <p class="title">服务说明</p>
          <textarea name="" id="" cols="30" rows="10" class="textarea" v-model = "serviceDesc"></textarea>
        </div>
        <div class="modules">
          <p class="title">费用说明</p>
          <textarea name="" id="" cols="30" rows="10" class="textarea" v-model = "costDesc"></textarea>
        </div>
        <div class="modules">
          <p class="title">预订说明</p>
          <textarea name="" id="" cols="30" rows="10" class="textarea" v-model = "reserveDesc"></textarea>
        </div>
        <div class="modules">
          <p class="title">退改说明</p>
          <textarea name="" id="" cols="30" rows="10" class="textarea" v-model = "changeDesc"></textarea>
        </div>
      </div>
      <div class="btn-bg">
        <button class="save-btn" @click="confirm">提交发布</button>
      </div>  
    </div>
</template>
<script>

export default {
  data () {
    return {
      id: '',
      nextFormData: '',
      serviceSpecial: '',
      serviceDesc: '',
      costDesc: '',
      reserveDesc: '',
      changeDesc: '',
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onLoad(options) {
    wx.getStorageSync('nextFormData')
    this.id = options.id
  },
  onShow () {
    this.reset()
    // 编辑
    this.nextFormData = wx.getStorageSync('nextFormData')
    if (this.nextFormData.id === parseInt(this.id)) { // 编辑
      this.serviceSpecial = this.nextFormData.serviceSpecial
      this.serviceDesc = this.nextFormData.serviceDesc
      this.costDesc = this.nextFormData.costDesc
      this.reserveDesc = this.nextFormData.reserveDesc
      this.changeDesc = this.nextFormData.changeDesc
    }
  },
  methods: {
    reset() {
      this.serviceSpecial = ''
      this.serviceDesc = ''
      this.costDesc = ''
      this.reserveDesc = ''
      this.changeDesc = ''
    },
    confirm () {
      let formData = wx.getStorageSync('formData')
      wx.removeStorageSync('formData')
      let data = {
        ...formData,
        serviceSpecial: this.serviceSpecial,
        serviceDesc: this.serviceDesc,
        costDesc: this.costDesc,
        reserveDesc: this.reserveDesc,
        changeDesc: this.changeDesc
      }
      this.$http.post(this.API.saveGuide, {
        data: {
          productJson: JSON.stringify(data)
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'none'
          })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  padding-bottom: 100rpx;
}
.box{
  background: #fff;
  padding: 0 30rpx 30rpx 30rpx;
}
.modules{
  .title{
    font-size: 30rpx;
    margin-top: 30rpx;
    margin-bottom: 15rpx;
  }
  .mt0{
    margin-top: 0;
  }
  .textarea{
    width: 690rpx;
    height: 200rpx;
    border-radius: 8rpx;
    border: solid 1rpx #aaaaaa;
  }
}
.btn-bg{
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20rpx 0;
  .save-btn{
    background: #fbb03b;
    color: #fff;
    font-size: 28rpx;
    border: none;
    height: 80rpx;
    line-height: 80rpx;
    margin: 0 30rpx;
    border-radius: 50rpx;
    border-radius: 50rpx;
  }
}

</style>