<template>
  <div class="page">
    <!-- 正在审核和审核通过 不允许修改状态 -->
    <div v-if="status === '2' || status === '4' || status === '1'">
      <i-panel>
        <i-input v-model="authName" title="法人姓名" disabled placeholder="请输入真实姓名"/>
      </i-panel>
      <div class="mt20">
        <i-input v-model="number" title="手机号码" disabled type="number"/>
      </div>
      <div class="addimg-box">
        <span class="title">营业执照</span>
        <div class="img-item bor-none">
          <img :src="licenseImgs.src" alt="">
        </div>
      </div>
      <div class="addimg-box">
        <span class="title">法人身份证</span>
        <div class="img-item bor-none">
          <img :src="idcardFront.src" alt="">
        </div>
        <div class="img-item bor-none  ml30">
          <img :src="idcardBack.src" alt="">
        </div>
        <!-- <button class="submit-btn" @click="goPay" v-if="status === '2'">支付订单</button> -->
        <!-- <p class="tips" v-if="status === '2'">您的审核已通过，请支付{{amount}}元验证</p> -->
      </div>
    </div>
    <!-- 未审核、审核驳回修改 -->
    <div v-else>
      <i-panel>
        <i-input v-model="authName" title="法人姓名" placeholder="请输入真实姓名" maxlength="4"  @change="inputChange($event, 'authName')"/>
      </i-panel>
      <div class="mt20">
        <i-input v-model="number" title="手机号码" placeholder="请输入手机号码" maxlength="11"  @change="inputChange($event, 'number')"/>
      </div>
      <div class="addimg-box">
        <span class="title">营业执照</span>
        <div class="img-item"  @click="upload('licenseImgs')" v-if="licenseImgs === ''">
          <i class="icon img-icon"></i>
        </div>
        <div class="img-item bor-none"  @click="upload('licenseImgs', 2)">
          <img :src="licenseImgs.src" alt="">
        </div>
      </div>
      <div class="addimg-box">
        <span class="title">法人身份证</span>
        <div class="img-item"  @click="upload('idcardFront')"  v-if="idcardFront === ''">
          <i class="icon img-icon mt50"></i>
          <p class="txt">正面</p>
        </div>
        <div class="img-item bor-none"  @click="upload('idcardFront', 2)" v-else>
          <img :src="idcardFront.src" alt="">
        </div>
        <div class="img-item ml30"  @click="upload('idcardBack')"  v-if="idcardBack === ''">
          <i class="icon img-icon mt50"></i>
          <p class="txt">反面</p>
        </div>
        <div class="img-item bor-none  ml30"  @click="upload('idcardBack', 2)" v-else>
          <img :src="idcardBack.src" alt="">
        </div>
        <button class="submit-btn" @click="submit">保存信息</button>
      </div>
    </div>
      
  </div>
</template>
<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      status: '',
      authName: '',
      number: '',
      licenseImgs: '', // 营业执照图片
      idcardFront: '', // 身份证正面
      idcardBack: '', // 身份证反面
      modifyId: '', // 修改id
      amount: '', // 支付金额
      urlPrefix: ''
    }
  },
  onLoad(options) {
    this.status = options.status // 0:未申请过 2:审核通过不允许修改 3：审核失败，修改资料
    if (this.status === '1') {
      wx.showToast({ // 待审核
        title: '您的信息正在审核',
        icon: 'none'
      })
    }
    if (this.status === '2') {
      wx.showToast({
        title: '您的审核已通过，请完成支付验证',
        icon: 'none'
      })
    }
    if (this.status === '3') {
      wx.showToast({
        title: '您的审核未通过，请修改后重新提交',
        icon: 'none'
      })
    }
    if (this.status === '4') {
      // wx.showToast({
      //   title: '您已是合伙人',
      //   icon: 'none'
      // })
    }
    if (this.status === '0') {
      let license = wx.getStorageSync('license')
      this.modifyId = license.id
    }
    if (this.status === '1' || this.status === '2' || this.status === '3' || this.status === '4') {
      let license = wx.getStorageSync('license')
      this.authName = license.name
      this.number = license.mobile
      this.amount = license.amount
      this.urlPrefix = license.urlPrefix
      this.licenseImgs = {
        src: `${license.urlPrefix}${license.license}`,
        upload: license.license
      }
      this.idcardFront = {
        src: `${license.urlPrefix}${license.idcardFront}`,
        upload: license.idcardFront
      }
      this.idcardBack = {
        src: `${license.urlPrefix}${license.idcardBack}`,
        upload: license.idcardBack
      }
      this.modifyId = license.id
    }
  },
  onShow () {
  },
  methods: {
    inputChange(e, attr) {
      console.log(e.mp.detail.detail.value)
      this[attr] = e.mp.detail.detail.value
    },
    submit () {
      let check = this.checkEmpty() === false ? false : true
      if (check) {
        this.$http.post(this.API.saveLicense, {
          data: {
            name: this.authName,
            mobile: this.number,
            license: this.licenseImgs.upload,
            idcardFront: this.idcardFront.upload,
            idcardBack: this.idcardBack.upload,
            id: this.modifyId
          }
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
            wx.navigateTo({
              url: `/pages/me/main`
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    },
    checkEmpty () {
      if (this.authName === '') {
        wx.showToast({
          title: '请输入法人姓名',
          icon: 'none'
        })
        return false
      }
      if (this.number === '') {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none'
        })
        return false
      }
      if (this.idcardFront === '') {
        wx.showToast({
          title: '请上传身份证正面',
          icon: 'none'
        })
        return false
      }
      if (this.idcardBack === '') {
        wx.showToast({
          title: '请上传身份证反面',
          icon: 'none'
        })
        return false
      }
      if (this.licenseImgs === '') {
        wx.showToast({
          title: '请上传营业执照',
          icon: 'none'
        })
        return false
      }
    },
    upload(imgType, flag) { // flag 1:第一张 2：替换
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
                if (flag === 2 && imgType === 'licenseImgs') {
                  self.licenseImgs = ''
                  self.licenseImgs = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (flag === 2 && imgType === 'idcardFront') {
                  self.idcardFront = ''
                  self.idcardFront = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (flag === 2 && imgType === 'idcardBack') {
                  self.idcardBack = ''
                  self.idcardBack = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                self[imgType] = {
                  src: res.tempFilePaths[0],
                  upload: r.data.result
                }
              } else {
                wx.showToast({
                  title: res.message
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
    // 订单支付
    goPay () {
      this.$http.post(this.API.wxPay, { // 微信支付下单
        data: {
          orderId: this.modifyId,
          openId: wx.getStorageSync('openId'),
          type: 3
        }
      }).then(res => {
        // 调微信支付
        if (res.code === 0) {
          let obj = res.result
          this.requestPayment(obj)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 申请支付
    requestPayment (obj) {
      wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'success': (res) => {
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
          wx.navigateTo({
            url: `/pages/member/memberIndex/main`
          })
        },
        'fail': (res) => {
          wx.showToast({
            title: '支付失败',
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
  background: #f4f4f4;
  height: 100vh;
}
.addimg-box{
  margin-top:20rpx;
  background: #fff;
  padding: 30rpx 30rpx;
  .title{
    font-size: 28rpx;
    color: #333333;
    vertical-align: top;
    width: 155rpx;
    display: inline-block;
  }
  .img-item{
    display: inline-block;
    width: 178rpx;
    height: 178rpx;
    border: 1rpx solid #999999;
    vertical-align: top;
    .txt{
      color: #cccccc;
      font-size: 28rpx;
      text-align: center;
      margin-top: 10rpx;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.submit-btn{
  background: #fbb03b;
  color: #fff;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 30rpx;
  margin-top: 125rpx;
  border-radius: 50rpx;
}
.mt20{
  margin-top: 20rpx;
}
.ml30{
  margin-left: 30rpx;
}
.icon{
  background: url('../../../../static/images/travelSort.png');
  background-size: 200rpx 200rpx; 
  width: 28rpx;
  height: 28rpx;
  display: inline-block;
  vertical-align: middle;
}
.img-icon{
  background-position: -2rpx -102rpx;
  width: 50rpx;
  height: 45rpx;
  display: block;
  margin: 0 auto;
  margin-top: 66rpx;
}
.close-icon{
  background-position: -131rpx -30rpx;
  position: absolute;
  width: 35rpx;
  height: 35rpx;
  top: -12rpx;
  right: -12rpx; 
  z-index: 999;
}
.mt50{
  margin-top: 50rpx;
}
.bor-none{
  border:none!important;
}
.tips{
  font-size: 24rpx;
  color: #888;
  margin-left:30rpx;
  margin-top: 30rpx;
}
</style>