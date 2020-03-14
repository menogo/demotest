<template>
    <div>
      <div class="wrapper">
        <div class="img-modules">
          <textarea class="textarea" cols="30" rows="10" placeholder="分享美好的瞬间..." v-model="textValue"></textarea>
        </div>
        <div class="img-modules">
          <p class="title">地点</p>
          <span>{{address}}</span>
        </div>
        <div class="img-modules">
          <p class="title">产品图片</p>
          <div class="img-box">
            <div class="img-item" @click="upload('prdPhoto1')">
              <img :src="prdPhoto1.src" alt="" v-if="prdPhoto1.src">
              <i class="icon img-icon" v-else></i>
            </div>
            <div class="img-item" @click="upload('prdPhoto2')">
              <img :src="prdPhoto2.src" alt="" v-if="prdPhoto2.src">
              <i class="icon img-icon" v-else></i>
            </div>
            <div class="img-item" @click="upload('prdPhoto3')">
              <img :src="prdPhoto3.src" alt="" v-if="prdPhoto3.src">
              <i class="icon img-icon" v-else></i>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-bg">
        <button class="save-btn" @click="goNext">保存到下一步</button>
      </div>
    </div>
</template>
<script>
import Http from '../../../utils/http'
import indexObj from '../../../utils/index'
export default {
  data () {
    return {
      prdPhoto1: '',
      prdPhoto2: '',
      prdPhoto3: '',
      textValue: '',
      address: '',
      address_component: {} // 定位信息
    }
  },
  onLoad () {
    indexObj.getLocation(data => {
      this.address_component = data.address_component
      this.address = data.address
      this.longitude = data.location.lng
      this.latitude = data.location.lat
    })
  },
  onShow () {},
  methods: {
    upload(str) {
      let self = this
      wx.chooseImage({
        success: function (res) {
          wx.showLoading()
          wx.uploadFile({
            url: Http.baseURL + '/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function (r) {
              r.data = JSON.parse(r.data)
              if (r.data.code === 0) {
                if (str === 'prdPhoto1') { // 产品图片1
                  self.prdPhoto1 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'prdPhoto2') { // 产品图片2
                  self.prdPhoto2 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'prdPhoto3') { // 产品图片3
                  self.prdPhoto3 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
              } else {
                wx.showToast({
                  title: '上传失败',
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
    },
    goNext() {
      if (this.textValue === '') {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      let productUrl = []
      if (this.prdPhoto1 !== '') {
        productUrl.push(this.prdPhoto1.upload)
      }
      if (this.prdPhoto2 !== '') {
        productUrl.push(this.prdPhoto2.upload)
      }
      if (this.prdPhoto3 !== '') {
        productUrl.push(this.prdPhoto3.upload)
      }
      this.productUrl = productUrl.join(',')
      if (this.productUrl === '') {
        wx.showToast({
          title: '请添加产品图片',
          icon: 'none'
        })
        return
      }
      this.$http.post(this.API.saveCasualLook, {
        data: {
          content: this.textValue,
          imgUrl: this.productUrl,
          longitude: this.longitude,
          latitude: this.latitude,
          province: this.address_component.province,
          city: this.address_component.city,
          address: this.address_component.district + this.address_component.street + this.address_component.street_number
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '发布成功'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/daren/lookAround/main'
            })
          }, 1500)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .prd-modules {
    background: #fff;
    padding: 40rpx 30rpx;
    .mt40 {
      margin-top: 40rpx;
    }
    .sel-box {
      .single-select,
      .single-select.active {
        background-position: -142rpx -48rpx;
        width: 26rpx;
        height: 26rpx;
        vertical-align: top;
        margin-top: 12rpx;
      }
      .single-select.active {
        background-position: -113rpx -48rpx;
      }
      .left-lab {
        font-size: 30rpx;
        margin-right: 30rpx;
        vertical-align: top;
      }
      .right-lab {
        font-size: 30rpx;
        color: #666666;
        display: inline-block;
        vertical-align: middle;
        max-width: 79%;
        .pos-rel{
          position: relative;
          display: inline-block;
          .item-label{
            width: 170rpx;
            height: 55rpx;
            text-align: center;
            border: solid 1rpx #aaaaaa;
            display: inline-block;
            margin-right: 20rpx;
            box-sizing: border-box;
            padding: 10rpx;
            font-size: 24rpx;
            margin-top: 10rpx;
          }
          .item-label.active{
            background: #fbb03b;
            color: #fff;
            border: solid 1rpx #fbb03b;
          }
          .item-label:nth-child(3n){
            margin-right: 0;
          }
          .add-icon {
            background-position: -165rpx -4rpx;
            width: 30rpx;
            height: 28rpx;
            margin-left: 5rpx;
          }
        }
        .select-item {
          margin-right: 100rpx;
        }
      }
    }
    .txt-input {
      border-bottom: 1rpx solid #aaa;
      font-size: 28rpx;
      margin-top: 40rpx;
      padding: 10rpx 10rpx;
    }
  }
  .img-modules {
    background: #fff;
    padding: 40rpx 30rpx;
    margin-top: 20rpx;
    .title {
      font-size: 30rpx;
      margin-bottom: 25rpx;
    }
    .img-box {
      .img-item {
        width: 210rpx;
        height: 158rpx;
        border: dashed 1rpx #aaaaaa;
        display: inline-block;
        margin-right: 28rpx;
        position: relative;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
        .img-icon {
          background-position: 0 -81rpx;
          width: 80rpx;
          height: 63rpx;
          margin-top: 50rpx;
          margin-left: 65rpx;
        }
      }
      .img-item:last-child {
        margin-right: 0;
      }
    }
  }
  .date-modules {
    background: #fff;
    padding: 40rpx 30rpx;
    margin-top: 20rpx;
    .title {
      font-size: 30rpx;
      margin-bottom: 25rpx;
    }
    .price-box {
      span {
        font-size: 30rpx;
      }
      input {
        display: inline-block;
        border-bottom: 1rpx solid #000;
        width: 200rpx;
        vertical-align: top;
        margin-left: 10rpx;
        text-align: center;
      }
      .save{
        width: 90rpx;
        height: 44rpx;
        line-height: 44rpx;
        color: #ff9913;
        font-size: 30rpx;
        border-radius: 5rpx;
        border: solid 1rpx #fbb03b;
        display: inline-block;
        margin-left:  20rpx;
        text-align: center;
        border-radius: 5rpx;
      }
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
  .cus-box{
    background: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99999999;
    box-sizing: border-box;
    height: 750rpx;
    overflow: auto;
    animation: mymove .3s forwards;
    .title{
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      background: #fff;
    }
    .label-main{
      background: #fff;
      padding: 0 40rpx;
      div{
        position: relative;
        display: inline-block;
        margin-right: 34rpx;
        width: 200rpx;
        input, span{
          display: inline-block;
          width: 200rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 5rpx;
          border:1rpx solid #aaaaaa;
          margin-top: 25rpx;
          text-align: center;
          font-size: 26rpx;
          vertical-align: middle;
        }
        span{
          margin-right: 0;
        }
        .add{
          font-size: 40rpx;
        }
        .close-icon{
          background: url('../../../../static/images/travelSort.png');
          background-size: 200rpx 200rpx;
          width: 32rpx;
          height: 35rpx;
          display: inline-block;
          vertical-align: middle;
          background-position: -133rpx -30rpx;
          position: absolute;
          top: 5rpx;
          right: -10rpx;
        }
      }
      div:nth-child(3n){
        margin-right: 0;
      }
    }
    .control{
      font-size: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0 40rpx;
      background: #fff;
      box-sizing: border-box;
      span{
        color: #388ef8;
      }
      .right{
        float: right;
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
  .btn-bg {
    background: #fff;
    width: 100%;
    padding: 20rpx 0;
    .save-btn {
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
  .icon {
    background: url('../../../../static/images/travelPerson/guide.png');
    background-size: 200rpx 200rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .textarea {
    width: 100%;
  }
</style>
