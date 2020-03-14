<template>
  <div class="page">
    <div class="img-box"   @click="upload">
      <i-input title="头像" disabled/>
      <img class="header-img" :src="headerImg || userlogo"/>
      <i class="right-icon h-icon"></i>
    </div>
    <i-panel>
      <i-input title="个性签名"  maxlength="100"   v-model="remark" left type="text" @change="inputChange('remark', $event)" placeholder="我有我的style，编辑我的个性签名"/>
    </i-panel>
    <div class="img-box"   @click="uploadBgImg">
      <i-input title="背景图" disabled/>
      <img class="bg-img" :src="bgImg"/>
      <i class="right-icon h-icon"></i>
    </div>
    <i-panel class="mt20">
      <i-input title="昵称"  maxlength="10"   v-model="nickName" left type="text" @change="inputChange('nickName', $event)"/>
    </i-panel>
    <picker class="pos-rel" :range="sexList"  @change="pickerChange($event)"  :value = "sex-1">
      <i-input  title="性别" disabled left :value = "sexList[sex-1]" />
      <i class="right-icon"></i>
    </picker>
    <picker mode="date" :value="birthday" end="2217-09-01" @change="bindDateChangeEnd($event)" class="select-input" >
      <i-input  title="生日" disabled left :value = "birthday" />
      <i class="right-icon"></i>
    </picker>
    <i-panel>
      <i-input title="年龄"  maxlength="3"   v-model="age" left type="number" @change="inputChange('age', $event)"/>
    </i-panel>
    <picker class="pos-rel" mode="region" :value="region" @change="CityChange($event)">
      <i-input  title="所在地" disabled left :value = "region" />
      <i class="right-icon"></i>
    </picker>
    <i-panel>
      <i-input title="故乡"  maxlength="20"   v-model="hometown" left type="text" @change="inputChange('hometown', $event)" placeholder="天涯遇故乡"/>
    </i-panel>
    <picker class="pos-rel" :range="marriageList"  @change="pickerChange2($event)"  :value = "emotionStatus">
      <i-input  title="情感状态" disabled left :value = "marriageList[emotionStatus]" />
      <i class="right-icon"></i>
    </picker>
    <i-panel>
      <i-input title="职业"  maxlength="20"   v-model="occupation" left type="text" @change="inputChange('occupation', $event)" placeholder="遇见同行大神"/>
    </i-panel>
    <i-panel>
      <i-input title="学校"  maxlength="20"   v-model="school" left type="text" @change="inputChange('school', $event)" placeholder="天涯遇校友"/>
    </i-panel>
    <div class="pos-rel" @click="goAddStory">
      <i-input  title="我的故事" disabled left />
      <i class="right-icon"></i>
    </div>
    <!-- <div class="remarkTxt">
      <textarea v-model="story"  @change="inputChange('story', $event)"  placeholder="我有酒，你的故事呢"></textarea>
    </div> -->
    <button   class="submit" @click="save">保存</button>
  </div>
</template>
<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      nickName: '',
      sex: '',
      age: '',
      remark: '',
      headerImg: '',
      uploadHeaderImg: '', // 上传图片参数
      bgImg: '',
      uploadbgImg: '', // 上传背景图参数
      region: '',
      idcardFront: '',
      idcardBack: '',
      sexList: ['男', '女'],
      marriageList: ['保密', '已婚', '单身', '恋爱中'],
      emotionStatus: '', // 婚姻状态
      birthday: '', // 生日
      hometown: '', // 故乡
      occupation: '', // 职业
      school: '',
      story: '',
      detailData: {},
      userlogo: require('../../../../static/images/common/userlogo.png')
    }
  },

  onShow () {
    this.customerData()
    if (wx.getStorageSync('editStory')) {
      this.story = wx.getStorageSync('editStory')
      console.log('this.story11', this.story)
      wx.removeStorageSync('editStory')
      console.log('this.story22', this.story)
    }
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    customerData () {
      // debugger
      this.$http.post(this.API.customer, {}).then(res => {
        this.detailData = res.result
        if (this.detailData.sex === 0) {
          this.sex = 1
        } else {
          this.sex = this.detailData.sex
        }
        this.age = this.detailData.age
        this.nickName = this.detailData.nickName
        this.hometown = this.detailData.hometown // 故乡
        this.region = this.detailData.liveCity // 所在地
        this.remark = this.detailData.remark
        this.headerImg = this.detailData.photo
        this.bgImg = this.detailData.bgImg
        this.birthday = this.detailData.birthday
        this.story = this.detailData.story
        this.school = this.detailData.school
        this.occupation = this.detailData.occupation
        this.emotionStatus = this.detailData.emotionStatus
      })
    },
    bindDateChangeEnd (res) {
      this.birthday = res.mp.detail.value
    },
    inputChange(attr, e) {
      // this[attr] = e.mp.detail.detail.value
      this[attr] = e.mp.detail.detail.value
      console.log(this.remark)
    },
    pickerChange(e) {
      this.sex = parseInt(e.target.value) + 1
    },
    pickerChange2(e) {
      this.emotionStatus = parseInt(e.target.value)
    },
    CityChange(e) {
      this.region = e.mp.detail.value
      console.log('选中的城市为：' + e.mp.detail.value)
    },
    goAddStory () {
      wx.navigateTo({
        url: `/pages/daren/addStory/main?type=2`
      })
    },
    save () {
      // console.log('this.story', this.story)
      this.$http.post(this.API.updatecustomer, {
        data: {
          nickName: this.nickName,
          sex: this.sex,
          age: this.age,
          hometown: this.hometown,
          remark: this.remark,
          photo: this.uploadHeaderImg,
          bgImg: this.uploadbgImg,
          birthday: this.birthday,
          liveCity: this.region,
          occupation: this.occupation,
          school: this.school,
          story: this.story,
          emotionStatus: this.emotionStatus
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '保存成功'
          })
          wx.navigateBack({
            url: '/pages/setUp/index/main'
          })
        } else {
          wx.showToast({
            title: res.message
          })
        }
      })
    },
    upload() {
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
                self.uploadHeaderImg = r.data.result
                self.headerImg = res.tempFilePaths[0]
              } else {
                wx.showToast({
                  title: '修改头像失败',
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
    uploadBgImg() {
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
                self.uploadbgImg = r.data.result
                self.bgImg = res.tempFilePaths[0]
              } else {
                wx.showToast({
                  title: '背景图片修改失败',
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
.img-box{
  position: relative;
  // margin-bottom: 20rpx;
  .header-img, .bg-img{
    position: absolute;
    top: 10rpx;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    right: 50rpx;
  }
  .bg-img{
    border-radius: 0;
  }
}
.pos-rel{
  position: relative;
  .rght-icon{
    position: absolute;
    top: 0;
  }
}
.right-icon {
  background: url('../../../../static/images/goodsDetail.png');
  background-size: 500rpx 120rpx;
  background-position:-232rpx 0;
  width: 15rpx;
  height: 30rpx;
  position: absolute;
  top: 50%;
  right: 10rpx;
  margin-top: -15rpx;
  &.h-icon {
    top: 26rpx;
    margin-top: 0;
  }
}
.remarkTxt{
  width: 100%;
  background: #fff;
  textarea{
    border-top:1rpx solid #e9eaec;
    width: 100%;
    box-sizing: border-box;
    display: block;
    height: 300rpx;
    padding: 30rpx;
    font-size: 26rpx;
  }
}
.login-out, .submit{
  background: #fbb03b;
  color: #fff;
  font-size: 28rpx;
  border: none;
  height: 80rpx;
  line-height: 80rpx;
  margin: 0 30rpx;
  margin-top: 125rpx;
  margin-top: 20rpx;
}
</style>
