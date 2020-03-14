<template>
    <div class="page">
      <div class="id-prove" v-if="type === 1">
        <p class="title">身份证认证</p>
        <div class="flex">
          <div>
            <img :src="idcardFront.src" alt="" v-if="idcardFront.src">
            <div v-else @click="upload('idcardFront')">
              <i class="icon2 zm-icon"></i>
              <p>请上传身份证正面照</p>
            </div>
          </div>
          <div>
            <img :src="idcardBack.src" alt="" v-if="idcardBack.src">
            <div v-else @click="upload('idcardBack')">
              <i class="icon2 fm-icon"></i>
              <p>请上传身份证背面照</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-prove" v-if="type === 2">
        <div class="input-box">
          <label>姓名</label>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </div>
        <div class="input-box bot-none">
          <label>导游证件</label>
          <input type="text" placeholder="请输入导游证号" v-model="guideLicenseNo">
        </div>
        <!-- <p class="title">导游认证</p> -->
        <div class="card-img"  @click="upload('guideLicense')">
          <img :src="guideLicense.src" alt="" v-if="guideLicense.src">
          <div v-else>
            <i class="icon2 dy-icon"></i>
            <p>请上传导游证</p>
          </div>
        </div>
      </div>
      <div class="card-prove" v-if="type === 3">
        <div class="input-box">
          <label>姓名</label>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </div>
        <div class="input-box bot-none">
          <label>驾驶证件</label>
          <input type="text" placeholder="请输入驾驶证号" v-model="driverLicenseNo">
        </div>
        <!-- <p class="title">驾驶证认证</p> -->
        <div class="card-img"  @click="upload('driverLicense')">
          <img :src="driverLicense.src" v-if="driverLicense.src">
          <div v-else>
            <i class="icon2 dy-icon"></i>
            <p>请上传驾驶证</p>
          </div>
        </div>
      </div>
      <div class="card-prove" v-if="type === 4">
        <div class="input-box">
          <label>姓名</label>
          <input type="text" placeholder="请输入真实姓名" v-model="realName">
        </div>
        <div class="input-box bot-none">
          <label>学生证件</label>
          <input type="text" placeholder="请输入学生证号" v-model="studentLicenseNo">
        </div>
        <!-- <p class="title">学生证认证</p> -->
        <div class="card-img"  @click="upload('studentLicense')">
          <img :src="studentLicense.src" v-if="studentLicense.src">
          <div v-else>
            <i class="icon2 dy-icon"></i>
            <p>请上传驾驶证</p>
          </div>
        </div>
      </div>
      <div class="btn-bg" v-if="type === 1 && !idcardFront.src">
        <button class="save-btn" @click="submit">提交审核</button>
        <!-- <p class="tips">小鹿畅游会严格保密用户信息</p> -->
      </div>
      <div class="btn-bg" v-if="type !== 1">
        <button class="save-btn" @click="submit">提交审核</button>
      </div>
    </div>
</template>
<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      type: '',
      realName: '',
      guideLicenseNo: '',
      driverLicenseNo: '',
      studentLicenseNo: '',
      idcardFront: {},
      idcardBack: {},
      id: '',
      guideLicense: '', // 导游证
      driverLicense: '', // 驾驶证
      studentLicense: '', // 学生证
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onLoad (options) {
    this.type = parseInt(options.type)
    if (this.type === 1) {
      wx.setNavigationBarTitle({
        title: '身份认证'
      })
    }
    if (this.type === 2) {
      wx.setNavigationBarTitle({
        title: '导游认证'
      })
    }
    if (this.type === 3) {
      wx.setNavigationBarTitle({
        title: '驾驶认证'
      })
    }
    if (this.type === 4) {
      wx.setNavigationBarTitle({
        title: '学生证认证'
      })
    }
    this.getLicenseDetail()
  },
  methods: {
    getLicenseDetail() {
      this.$http.post(this.API.licenseDetail).then(res => {
        if (res.code === 0) {
          let data = res.result
          this.id = data.id
          this.realName = data.realName
          this.guideLicenseNo = data.guideLicenseNo
          this.driverLicenseNo = data.driverLicenseNo
          this.studentLicenseNo = data.studentLicenseNo
          let urlPrefix = data.urlPrefix
          this.idcardFront = {
            src: `${urlPrefix}${data.idcardFront}`
          }
          this.idcardBack = {
            src: `${urlPrefix}${data.idcardBack}`
          }
          this.guideLicense = {
            src: `${urlPrefix}${data.guideLicense}`,
            upload: data.guideLicense
          }
          this.driverLicense = {
            src: `${urlPrefix}${data.driverLicense}`,
            upload: data.driverLicense
          }
          this.studentLicense = {
            src: `${urlPrefix}${data.studentLicense}`,
            upload: data.studentLicense
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    submit() {
      if (!this.realName) {
        wx.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        })
        return false
      }
      if (this.type === 1) {
        if (!this.idcardFront || !this.idcardBack) {
          wx.showToast({
            title: '请提交身份证资料',
            icon: 'none'
          })
          return false
        }
      }
      if (this.type === 2) {
        if (!this.guideLicenseNo) {
          wx.showToast({
            title: '请输入导游证件号',
            icon: 'none'
          })
          return false
        }
        if (!this.guideLicense) {
          wx.showToast({
            title: '请提交证件资料',
            icon: 'none'
          })
          return false
        }
      }
      if (this.type === 3) {
        if (!this.driverLicenseNo) {
          wx.showToast({
            title: '请输入驾驶证件号',
            icon: 'none'
          })
          return false
        }
        if (!this.driverLicense) {
          wx.showToast({
            title: '请提交证件资料',
            icon: 'none'
          })
          return false
        }
      }
      if (this.type === 4) {
        if (!this.studentLicenseNo) {
          wx.showToast({
            title: '请输入学生证件号',
            icon: 'none'
          })
          return false
        }
        if (!this.studentLicense) {
          wx.showToast({
            title: '请提交证件资料',
            icon: 'none'
          })
          return false
        }
      }
      this.$http.post(this.API.traPersonSave, {
        data: {
          id: this.id,
          realName: this.realName,
          guideLicenseNo: this.guideLicenseNo,
          driverLicenseNo: this.driverLicenseNo,
          studentLicenseNo: this.studentLicenseNo,
          guideLicense: this.guideLicense.upload,
          driverLicense: this.driverLicense.upload,
          studentLicense: this.studentLicense.upload
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '提交审核成功',
            icon: 'none'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/me/main'
            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
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
                console.log(r)
                if (str === 'idcardFront') { // 身份证正面
                  self.guideLicense = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'idcardBack') { // 身份证反面
                  self.guideLicense = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'guideLicense') { // 导游证
                  self.guideLicense = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'driverLicense') { // 驾驶证
                  self.driverLicense = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'studentLicense') { // 学生证
                  self.studentLicense = {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #fff;
}
.icon2{
  background: url('../../../../static/images/travelPerson/prove.png');
  background-size: 300rpx 200rpx; 
  width: 125rpx;
  height: 85rpx;
  display: inline-block;
  vertical-align: middle;
}
.id-prove{
  background: #fff;
  padding: 60rpx 30rpx;
  .title{
    font-size: 32rpx;
    margin-bottom: 30rpx;
  }
  .flex{
    color: #666666;
    font-size: 24rpx;
    div{
      display: inline-block;
      width: 325rpx;
      height: 221rpx;
      border-radius: 10rpx;
      width: 330rpx;
      border: dashed 2rpx #dcdcdc;
      background-color: #f7f7f7;
      position: relative;
      img{
        width: 100%;
        height: 100%; 
        position: absolute;
        top: 0;
      }
      p{
        text-align: center;
      }
    }
    div:last-child{
      float: right;
    }
    .zm-icon, .fm-icon{
      margin-left: 105rpx;
      margin-top: 46rpx;
    }
    .zm-icon{
      background-position: -7rpx -3rpx;
    }
    .fm-icon{
      background-position: -137rpx -3rpx;
    }
  }
}
.card-prove{
  background: #fff;
  // padding: 60rpx 30rpx;
  .title{
    font-size: 32rpx;
    margin-bottom: 30rpx;
  }
  .card-img{
    width: 690rpx;
    height: 400rpx;
    background-color: #f7f7f7;
    border-radius: 15rpx;
    border: dashed 2rpx #dcdcdc;
    margin: 10rpx 30rpx;
    img{
      width: 100%;
      height: 100%;
    }
    .dy-icon{
      background-position: -3rpx -93rpx;
      margin-top: 107rpx;
      margin-left: 295rpx;
      width: 105rpx;
      height: 105rpx;
    }
    p{
      color: #999;
      font-size: 30rpx;
      margin-top: 30rpx;
      text-align: center;
    }
  }
}
.btn-bg{
  background: #fff;
  width: 100%;
  padding: 20rpx 0;
  margin-top: 100rpx;
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
  .tips{
    text-align: center;
    font-size: 22rpx;
    color: #999999;
    margin-top: 20rpx;
  }
}
.input-box{
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid #dcdcdc;
  label{
    font-size: 29rpx;
    width:150rpx;
    margin-left: 30rpx;
    display: inline-block;
  }
  input{
    width: 60%;
    display: inline-block;
    vertical-align: middle;
    margin-left: 30rpx;
  }
}
.bot-none{
  border-bottom: none;
}
</style>