<template>
    <div>
      <ul class="input-box">
        <li class="img-box" @click="upload('photo')">
          <span>头像<i class="must">*</i></span>
          <img :src="photo.src || userlogo"/>
          <i class="right-icon"></i>
        </li>
        <li>
          <span>姓名<i class="must">*</i></span>
          <span v-if="status === 2">{{realName}}</span>
          <input v-else type="text" class="input" v-model="realName">
        </li>
        <li>
          <span>性别<i class="must">*</i></span>
          <span v-if="status === 2">{{sexList[sex-1]}}</span>
          <picker v-else class="select-input" :range="sexList"  @change="pickerChange($event)"  :value = "sex-1">
            <input type="text" :value = "sexList[sex-1]" disabled="true">
            <i class="right-icon"></i>
          </picker>
        </li>
        <li>
          <span>生日<i class="must">*</i></span>
          <span v-if="status === 2" class="cener-txt">{{birthday}}</span>
          <picker v-else mode="date" :value="birthday" end="2217-09-01" @change="bindDateChangeEnd($event)" class="select-input" >
            <input type="text" :value = "birthday" disabled="true">
            <i class="right-icon"></i>
          </picker>
        </li>
        <li>
          <span>星座</span>
          <span class="cener-txt">{{constell}}</span>
        </li>
        <li>
          <span>联系电话<i class="must">*</i></span>
          <input type="text" class="input" v-model="phone">
        </li>
        <li>
          <span>从业时间</span>
          <picker class="select-input" :range="workTimeList"  @change="pickerworkTimeChange($event)"  :value = "workTime">
            <input type="text" :value = "workTimeList[workTime]" disabled="true">
            <i class="right-icon"></i>
          </picker>
        </li>
        <li>
          <span>服务城市<i class="must">*</i></span>
          <picker class="select-input" mode="region" :value="serviceCity" @change="CityChange('serviceCity', $event)">
            <input  disabled right :value = "serviceCity"/>
            <i class="right-icon"></i>
          </picker>
        </li>
        <li>
          <span>所在城市</span>
          <picker class="select-input" mode="region" :value="liveCity" @change="CityChange('liveCity', $event)">
            <input  disabled right :value = "liveCity"/>
            <i class="right-icon"></i>
          </picker>
        </li>
        <li>
          <span>个性签名</span>
          <input type="text" class="input" v-model="remark">
        </li>
        <li>
          <span>故乡</span>
          <input type="text" class="input" v-model="hometown">
        </li>
        <li>
          <span>学校</span>
          <input type="text" class="input" v-model="school">
        </li>
        <li>
          <span>职业</span>
          <input type="text" class="input" v-model="occupation">
        </li>
        <li>
          <span>情感</span>
          <picker class="select-input" :range="marriageList"  @change="pickerEmotionChange($event)"  :value = "emotionStatus">
            <input type="text" :value = "marriageList[emotionStatus]" disabled="true">
            <i class="right-icon"></i>
          </picker>
        </li>
        <li class="img-box" @click="upload('bgImg')">
          <span>背景图</span>
          <img :src="bgImg.src" class="radius-none" />
          <i class="right-icon"></i>
        </li>
        <li @click="goAddStory">
          <span>我的故事</span>
          <i class="right-icon"></i>
          <!-- <input type="text" class="input" v-model="story"> -->
        </li>
        <li v-if="status == 2">
          <span>身份认证</span>
          <span class="cert-right">已认证</span>
          <img :src="certImg" class="cert-img">
        </li>
      </ul>
      <div class="id-prove"  v-if="status !== 2">
        <p class="title">身份证认证</p>
        <div class="flex">
          <div  @click="upload('idcardFront')">
            <img :src="idcardFront.src" alt="" v-if="idcardFront.src">
            <div v-else>
              <i class="icon2 zm-icon"></i>
              <p>请上传身份证正面照</p>
            </div>
          </div>
          <div @click="upload('idcardBack')">
            <img :src="idcardBack.src" alt="" v-if="idcardBack.src">
            <div v-else>
              <i class="icon2 fm-icon"></i>
              <p>请上传身份证背面照</p>
            </div>
            
          </div>
        </div>
      </div>
      <div class="btn-bg" v-if="status !== 2">
        <button class="save-btn" @click="submit(1)">提交审核</button>
      </div>
      <div class="btn-bg" v-else>
        <button class="save-btn" @click="submit(2)">修改</button>
      </div>
    </div>
</template>
<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      status: '',
      realName: '',
      photo: {}, // 头像
      idcardFront: {}, // 身份证正面
      idcardBack: {}, // 身份证反面
      bgImg: {}, // 背景图
      story: '',
      workTime: '',
      school: '',
      occupation: '',
      emotionStatus: '',
      sex: '',
      birthday: '',
      constell: '', // 星座
      phone: '',
      hometown: '',
      liveCity: '',
      serviceCity: '',
      remark: '',
      sexList: ['男', '女'],
      marriageList: ['保密', '已婚', '单身', '恋爱中'],
      workTimeList: ['1年', '2年', '3年', '3~5年', '5年以上'], // 0:1年 1:2年 2:3年 3:3~5年 4:5年以上
      userlogo: require('../../../../static/images/common/userlogo.png'),
      certImg: require('../../../../static/images/common/idCer.png')
    }
  },
  onLoad() {
    this.getTraTalentDetail()
  },
  onShow () {
    if (wx.getStorageSync('editStory')) {
      this.story = wx.getStorageSync('editStory')
      wx.removeStorageSync('editStory')
    }
  },
  methods: {
    getTraTalentDetail() {
      this.$http.post(this.API.traPersonDetail).then(res => {
        if (res.code === 0) {
          let data = res.result
          let urlPrefix = res.result.urlPrefix
          this.status = data.status // 0-未提交过 1-待审核 2-审核通过 3-审核驳回
          if (this.status !== 0) {
            this.realName = data.realName
            this.workTime = parseInt(data.workTime)
            this.sex = data.sex // 男：1 女：2
            this.birthday = data.birthday
            let birArr = this.birthday.split('-') // 星座
            this.getConstell(birArr[1], birArr[2])
            this.phone = data.phone
            this.hometown = data.hometown
            this.liveCity = data.liveCity
            this.occupation = data.occupation
            this.school = data.school
            this.serviceCity = data.serviceCity
            this.remark = data.remark
            this.story = data.story
            this.emotionStatus = data.emotionStatus
            // this.bgImg = {
            //   src: `${urlPrefix}${data.bgImg}`,
            //   upload: data.bgImg
            // }
            this.photo = {
              src: `${urlPrefix}${data.photo}`,
              upload: data.photo
            }
            this.idcardFront = {
              src: `${urlPrefix}${data.license.idcardFront}`,
              upload: data.license.idcardFront
            }
            this.idcardBack = {
              src: `${urlPrefix}${data.license.idcardBack}`,
              upload: data.license.idcardBack
            }
          }
        }
      })
    },
    pickerChange(e) {
      this.sex = parseInt(e.target.value) + 1
      console.log(this.sex)
    },
    pickerEmotionChange (e) {
      this.emotionStatus = parseInt(e.target.value)
      console.log('this.emotionStatus', this.emotionStatus)
    },
    pickerworkTimeChange(e) {
      this.workTime = e.target.value
      console.log(e.target.value)
    },
    CityChange(attr, e) {
      this[attr] = e.mp.detail.value
      console.log('选中的城市为：' + e.mp.detail.value)
    },
    bindDateChangeEnd (res) {
      this.birthday = res.mp.detail.value
      let birArr = this.birthday.split('-')
      this.getConstell(birArr[1], birArr[2])
    },
    getConstell (month, day) {
      let s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'
      let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
      this.constell = `${s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2)}座`
    },
    submit (type) {
      let check = this.checkEmpty() === false ? false : true
      let api
      if (type === 1) {
        api = 'darenSettledin'
      } else {
        api = 'darenUpdate'
      }
      if (check) {
        this.$http.post(this.API[api], {
          data: {
            realName: this.realName,
            photo: this.photo.upload,
            // bgImg: this.bgImg.upload,
            workTime: this.workTime,
            sex: this.sex,
            birthday: this.birthday,
            phone: this.phone,
            hometown: this.hometown,
            liveCity: this.liveCity,
            serviceCity: this.serviceCity,
            remark: this.remark,
            story: this.story,
            emotionStatus: this.emotionStatus,
            occupation: this.occupation,
            school: this.school,
            idcardFront: this.idcardFront.upload,
            idcardBack: this.idcardBack.upload
          }
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: '提交审核成功',
              icon: 'success'
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
    },
    checkEmpty () {
      if (!this.photo.upload) {
        wx.showToast({
          title: '请上传头像',
          icon: 'none'
        })
        return false
      }
      if (this.realName === '') {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return false
      }
      if (this.phone === '') {
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none'
        })
        return false
      }
      if (this.sex === '') {
        wx.showToast({
          title: '请选择性别',
          icon: 'none'
        })
        return false
      }
      if (this.birthday === '') {
        wx.showToast({
          title: '请选择出生年月',
          icon: 'none'
        })
        return false
      }
      if (this.serviceCity === '') {
        wx.showToast({
          title: '请输入服务城市',
          icon: 'none'
        })
        return false
      }
      if (!this.idcardFront.upload) {
        wx.showToast({
          title: '请选择身份证正面',
          icon: 'none'
        })
        return false
      }
      if (!this.idcardBack.upload) {
        wx.showToast({
          title: '请选择身份证反面',
          icon: 'none'
        })
        return false
      }
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
                if (str === 'photo') { // 头像
                  self.photo = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'bgImg') { // 背景图
                  self.bgImg = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'idcardFront') { // 身份证正面
                  self.idcardFront = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'idcardBack') { // 身份证反面
                  self.idcardBack = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                console.log(self.photo)
                console.log(self.idcardFront)
                console.log(self.idcardBack)
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
    goAddStory () {
      wx.navigateTo({
        url: `/pages/daren/addStory/main?type=1`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.img-box{
  position: relative;
  margin-bottom: 20rpx;
  img{
    position: absolute;
    top: -5rpx;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    right: 50rpx;
  }
  .radius-none{
    border-radius: 0;
  }
}
.input-box{
  background: #fff;
  padding: 30rpx 30rpx 50rpx 30rpx;
  li{
    margin-top: 40rpx;
    position: relative;
    span{
      width: 150rpx;
      display: inline-block;
      .must{
        color: #f90404;
        font-size: 32rpx;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .cert-right{
      float:right;
      color: #fbb03b;
      text-align: right;
      width: 90rpx;
    }
    .cert-img{
      width: 39rpx;
      height: 39rpx;
      float:right;
      margin-top: 3rpx;
    }
    .cener-txt{
      width: 300rpx;
    }
    .input{
      width: 76%;
      border-bottom: solid 1rpx #999999;
      display: inline-block;
      font-size: 28rpx;
      vertical-align: middle;
    }
    textarea{
      width: 690rpx;
	    height: 180rpx;
      border:1rpx solid #999999;
      margin-top: 10rpx;
      padding: 10rpx;
      box-sizing: border-box;
      font-size: 26rpx;
    }
    .select-input{
      display: inline-block;
      width: 76%;
      position: absolute;
      top:5rpx;
      font-size: 26rpx;
    }
  }
  li:first-child{
    margin-top: 0;
  }
}
.id-prove{
  background: #fff;
  margin-top: 20rpx;
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
      // position: relative;
      img{
        width: 100%;
        height: 100%;
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
.btn-bg{
  background: #fff;
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
.icon2{
  background: url('../../../../static/images/travelPerson/prove.png');
  background-size: 300rpx 200rpx; 
  width: 125rpx;
  height: 85rpx;
  display: inline-block;
  vertical-align: middle;
}
.right-icon {
  background: url('../../../../static/images/goodsDetail.png');
  background-size: 500rpx 120rpx;
  background-position:-232rpx 0;
  width: 15rpx;
  height: 30rpx;
  position: absolute;
  top: 10rpx;
  right: 10rpx;
}
</style>