<template>
    <div>
      <div class="wrapper">
        <div class="img-modules">
          <textarea class="textarea" cols="30" rows="10" placeholder="分享美好的瞬间..." v-model="textValue" @input="handleKeyup($event)"></textarea>
        </div>
        <div class="img-modules">
          <div class="img-box">
            <div class="img-pic-item" v-for="(img, imgIndex) in uploadImgs">
              <i class="close-icon" @click="delImgs(imgIndex)"></i>
              <img class="img" :src="img.src" alt="">
            </div>
            <div class="img-item" @click="upload('prdPhoto1')" v-if="uploadImgs.length < 9">
              <i class="icon img-icon"></i>
            </div>
            <!--<div class="img-item" @click="upload('prdPhoto1')">
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
            </div>-->
          </div>
        </div>
        <div class="img-modules flex-text" @click="mapView">
          <i class="lc-icon lc-location"></i>
          <p class="title">所在位置</p>
          <span class="text">{{addressStr}}</span>
          <div class="right-btn"></div>
        </div>
        <div class="img-modules flex-text" @click="getFollowEvt">
          <i class="lc-icon lc-at"></i>
          <p class="title">好友</p>
          <span class="text"></span>
          <div class="right-btn"></div>
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
      addressStr: '',
      forwardPerson: [],
      uploadImgs: [],
      address_component: {} // 定位信息
    }
  },
  onLoad () {
    indexObj.getLocation(data => {
      this.address_component = data.address_component
      this.address = data.address
      this.addressStr = data.address
      this.longitude = data.location.lng
      this.latitude = data.location.lat
    })
  },
  onUnload() {
    Object.assign(this, this.$options.data())
    wx.removeStorageSync('forwardPerson')
  },
  onShow () {
    this.forwardPerson = wx.getStorageSync('forwardPerson')
    if (this.forwardPerson) {
      let name = this.forwardPerson[this.forwardPerson.length - 1].name
      if (this.textValue.indexOf(name) === -1) {
        this.textValue = this.textValue.replace(/[@]$/, `@${name}`)
      }
    } else {
      this.forwardPerson = []
    }
  },
  methods: {
    handleKeyup(e) {
      if (e.target.keyCode === 64) {
        this.getFollow()
      }
    },
    getFollowEvt() {
      if (this.textValue.charAt(this.textValue.length - 1) !== '@') {
        this.textValue += '@'
      }
      this.getFollow()
    },
    delImgs(index) {
      this.uploadImgs.splice(index, 1)
    },
    upload(str) {
      let self = this
      wx.chooseImage({
        count: 9 - this.uploadImgs.length,
        success: function (res) {
          wx.showLoading()
          res.tempFilePaths.forEach((tPath, tIndex) => {
            wx.uploadFile({
              url: Http.baseURL + '/upload',
              filePath: tPath,
              name: 'file',
              success: function (r) {
                r.data = JSON.parse(r.data)
                if (r.data.code === 0) {
                  self.uploadImgs.push({
                    src: tPath,
                    upload: r.data.result
                  })
                  /* if (str === 'prdPhoto1') { // 产品图片1
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
                  } */
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              },
              complete() {
                if (tIndex === res.tempFilePaths.length - 1) {
                  wx.hideLoading()
                }
              }
            })
          })
        }
      })
    },
    mapView () {
      let self = this
      wx.chooseLocation({
        success: function (res) {
          self.address = res.address
          self.addressStr = res.name
          self.longitude = res.longitude
          self.latitude = res.latitude
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    },
    getFollow () {
      wx.navigateTo({
        url: `/pages/daren/forwardList/main`
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
      this.uploadImgs.forEach(s => {
        productUrl.push(s.upload)
      })
      this.productUrl = productUrl.join(',')
      if (this.productUrl === '') {
        wx.showToast({
          title: '请添加产品图片',
          icon: 'none'
        })
        return
      }
      this.forwardPerson.forEach((item, index) => {
        if (this.textValue.indexOf(item.name) > 0) { // 给@的人增加href标签
          this.textValue = this.textValue.replace(`@${item.name}`, `<a href=${item.id}>@${item.name}</a>`)
        } else {
          this.forwardPerson.splice(index, 1)
        }
      })
      let customerArr = []
      this.forwardPerson.forEach((item) => {
        customerArr.push(item.id)
      })
      this.$http.post(this.API.saveCasualLook, {
        data: {
          content: this.textValue,
          imgUrl: this.productUrl,
          longitude: this.longitude,
          latitude: this.latitude,
          address: this.addressStr,
          notifyCustomer: customerArr.toString()
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '发布成功'
          })
          wx.removeStorageSync('forwardPerson')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/daren/lookAround/main?tab=2'
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
  textarea {
    height: 100px;
  }
  .img-modules {
    background: #fff;
    padding: 40rpx 30rpx;
    .title {
      font-size: 30rpx;
      margin-bottom: 25rpx;
    }
    .img-box {
      display: flex;
      flex-wrap: wrap;
      .img-pic-item {
        position: relative;
        width: 33.333%;
        height: 158rpx;
        padding: 10rpx;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .img-item {
        width: 33.333%;
        height: 158rpx;
        border: dashed 1rpx #aaaaaa;
        display: inline-block;
        margin-right: 28rpx;
        position: relative;
        overflow: hidden;
        padding: 10rpx;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        &:last-child {
          margin-right: 0;
        }
        img{
          width: 100%;
          height: 100%;
        }
        .img-icon {
          display: inline-block;
          background-position: 0 -81rpx;
          width: 80rpx;
          height: 63rpx;
          margin-top: 40rpx;
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
  .flex-text {
    display: flex;
    align-items: center;
    line-height: 1;
    border-bottom: 1px solid #eee;
    .title {
      margin-bottom: 0;
    }
    .text {
      flex: 1;
      margin-left: 20rpx;
      font-size: 28rpx;
    }
  }
  .right-btn {
    background: url('../../../../static/images/goodsDetail.png');
    background-size: 500rpx 120rpx;
    background-position:-232rpx 0;
    width: 15rpx;
    height: 30rpx;
    margin-left: 20rpx;
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
    top: 0;
    right: 0;
  }
  .lc-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 30rpx;
  }
  .lc-at {
    width: 40rpx;
    height: 40rpx;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADmUlEQVRYR+2WXYhVVRTH/+vcOzNNA4KIEdTDOH0QQw5zzj53xkowH1J7qLegIkIQehAFSTAfAhV8yIiikCLwSUFQHyIK0yAki67T7LXv+IXEXFFhXnyJciLxNmevWHKOnG7349xBsMANl3s46661fvu/11r7Eu7xonucH/cB/r8KTE5OLmk0Go8CeHB+fv58vV6/tZh66kmBKIrWE9GrAJ4HMNyU8JyInCWi08x8oChMYQBjjAbdlAaui8gsEdUBeCIaEZERAPoZVAgR2c/Mx7qBFAIwxlgABsAVItpirT3eKvDExMSKJEn2Anhd7UR0xFqrirVdXQGMMVdSuU8y84ZuO1J7GIajQRBc1GcRed859047v44AmexFdtKcII7j50TkxxQids5xK4i2AGnBnQBwq1wuPzQ1NXUjCxBF0W4iUjWeAPBNkiTvBkGwkYjWiMj3zrnd+tsoivYR0Q4R+cg593ZPAHEcfy4ibwHYzMyfZc7GmMMAXmsKdkpEThPRLhHZkwMwRKT1c5GZn+4JwBgzC+BxIlpprb2Q7ugNIjqUyrpnYGDgk0ajoSq8l7amnvkdgLGxsaG+vr4/9PdJkiydmZn5rRmi5RHokFlYWPgdwIIOGmb+Sx2NMT8AWE1EX1lrX86ChWG4PAgCLdahPEDqc1nbMwiCcHp6eqYQQK6K68ysO7y9jDFzAB4hoq3W2v35YMaYU6pCC4DsfctCbKlAGIbPBEHwE4ApZl6VA7gJ4AEReck593UvAN774Vqtdq2QAuPj48OlUkklvc7MD+cALgF4CsBOZt5XECDzGWLmPwsBjI6O9g8ODt6+XPr7+5dVq9Vf0yL8koj07JmZ4yxYpVKpeO9/zooz1wWriKgqIoecc2/22gVnAEx67yu1Wk1bCXEc6xnrmeo6JiIHiWgFAO377wC8ogYiWuu9nyOiTwG8AGA9M3/bK8AHALYD+JCZ9TsrRH1W252lu7TWPmuMUaWWNtn+VbD/sLei0ndpJ1QBLGneQRzHLwJY570f0eRE9IW19pcoijboNASghXsmnYo6TduujndBOnJ3qTczd724OiVqZ+saNOvvNMDHzLxtMYkWDaCOeSUA6A13VP+MeO9nnXN1bdtyuTysva5Xd9YFRUC7KpArvs0A9EZ7rFPg5knYDaIwQFqYy0ulks6BCRF5MgtORHMiomP6mohcdc51LLxCXdCN/G7Ze1LgbiW9r8B/SoG/ATpFoDBXqP9EAAAAAElFTkSuQmCC") no-repeat;
    background-size: 100%;
  }
  .lc-location {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE20lEQVRYR6VXW4iVVRT+1j/jGJGMCiaR9lADmsYwZ+99HCWikbxEZQVFak9q5nTVouyhl/SlhwzKSzcz66kyCkwrsogGKqbp7LXPNGAX6AJWkF2VqbDjzF6xpnPqnDnnPxdccB7O/6/Lt9fl2+sntCDGmMsAXAFgORHNBqA/leMichzAuwDeCyF80KxbakbRObdWRLYA6G1GH8AQEe303r/USL8ugO7u7nOnTJnyDIDri46OiMjHALyIfNPR0fG9Pi8UCnOI6EIAjogWA1hZ1D94+vTp/pGRkZ/SgKQCyGQyLkkSTel0AMeI6GHvvYJpKM65fhF5EMAFAE7EGJfn83lfy7AmAGttpxoWDY7GGG/K5/OfNYxcppDJZBYkSfIKgIXFx9OZ+eRkHzUBOOf2i8h6AAPMvLSVwJN1rbXvA+gjoue99xsaAjDGbCIiTfUZBy8FK4EQkf4Qwt5yEFUZsNZqrWyMMZtWt1YzUuynHABmZpcKoHR6IjrgvV+TFqirq2tqZ2fneiK6VEROichHMcaDw8PDpb6pMnXOvSwiqydnoSIDxpjXiehaANcw85u1ANRorpLaMIDtzHywlp219moAb4jIoRDCdSWdCgDW2j8A/M7Mc2s56e3tnT02NvajviOivTHGQSL6k4iWicgmAH/FGJfl8/nBFBDfAZjBzOdUAXDO9YmIduzTzHx7ioNHAdwHYDMz7y7Xcc5tEJHnAHzIzErZVWKtfQrAbUS01Hs/MHGQkpYxZjURaZ22hxC2pThQFuxl5jT+OAagjZnPr2VvjNlGRA+JyJoQwoEKANbazQB2NgDwK4CZdQAEAPOZ+ex6AABsYeZdkzNwDxE9BmAXM+vFUyuFLwJYG2NcOJkZrbXnAfgKwLfMfEmK/U4tn4jcG0J4vAJANpvNxhg/AfA5My9IOcE6ZTQARycHKSObeiVUOr84SZJFuVxOeeH/Hujr62sfHR39WS8fIprvvf8y5RQKYJ2Sioh8SkSnAFyunE9Eh733OsZV4pybJyJf6B0zbdq0WQMDA2MVAPSPtVZn/yoAdzCzdmxNsdaWpqH8/QvMrPdHmo1O1pMA3mJm5YQJqehm59wtIrJPRF4LIdyY5kyfZzKZWUmSzI0xjidJ8gMz/1JP3xjzKhHdQEQbvfc6rtUAenp6pre1tWmdzhKRRSEEbaozFmNMFxFpf50aHx9fUE7ZVfPsnNsjInfWq2eriJxzh0RkFRE94b2/q9y+CkCRbt8B0E1EO7z3D7QasFzfOfeIiGwFMNLe3r5iaGhIl9f/JI3RVgA4oloisiGEoJ3fshhj9MbcXzRcycx6sApJ3QmttfcD2AHgpIhcGUJQGm5ajDGLiehtALrebWVmnZwqqbsVW2ufBbARgHLCzcysVNtQrLUGgLLmPAD7mPnWNKOG3wUlhgOgK3gfM39dD4G19iJd5wDMaWatawhAg1lrD+uSortCR0dH1+Dg4G+1QCxZsmRmoVDQ0Z2hywczr2qUrqYAqBNjzG4i0hEqMPPUWo6ttX8D6BCRPSGEuxsF1/dNAyiCmLjPi9PhQghcfG6JaOLDo9513nIT1jIoLRXFYP0Tp/h3jW85eMsZKAEyxujuoJnQzzaVE8WTT9zxrUhLJSh3nM1me2KME+VIkmR7LpfTrbhl+Qc+/S0/F1bIvgAAAABJRU5ErkJggg==") no-repeat;
    background-size: 100%;
  }
</style>
