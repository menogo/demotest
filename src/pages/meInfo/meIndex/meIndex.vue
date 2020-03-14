<template>
  <div>
    <img :src="bgImg" alt="" class="bgtop-img" v-if="customerDetail.bgImg"  @click="uploadBgImg">
    <img src="https://deer99.com/imgSer/resource/image/customerbgImg.jpg" alt="" class="bgtop-img" v-else>
    <div class="tab">
      <ul>
        <li @click="toogleTab(1)"><span :class="{'active': tabActive === 1}">主页</span></li>
        <li @click="toogleTab(2)"><span :class="{'active': tabActive === 2}">随便看</span></li>
        <li @click="toogleTab(3)"><span :class="{'active': tabActive === 3}">游记</span></li>
        <li @click="toogleTab(4)"><span :class="{'active': tabActive === 4}">约伴</span></li>
      </ul>
    </div>
    <div class="me-intrd" >
      <div class="header-box">
        <img :src="customerDetail.photo" alt="">
      </div>
      <div class="main">
        <p class="name">{{customerDetail.nickName}}</p>
        <p class="info">{{customerDetail.remark}}</p>
        <div class="info2">
          <div class="flex-item">
            <span class="title">关注</span>
            <span>{{customerDetail.followNum}}</span>
          </div>
          <div class="flex-item line">
            <span class="title">粉丝</span>
            <span>{{customerDetail.fansNum}}</span>
          </div>
          <div class="flex-item" @click="goDarenStory">
            <span>我的故事</span>
            <i class="right-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 主页 -->
    <div class="indexmain-info" v-if="tabActive === 1">
      <p class="title">基本信息</p>
      <div class="info-item">
        <label>信息</label>
        <span v-if="!editInfo">{{age}}</span>
        <input v-if="editInfo" type="text" v-model="age" >
      </div>
      <div class="info-item">
        <label>情感状况</label>
        <span v-if="!editInfo">{{marriageList[customerDetail.emotionStatus]}}</span>
        <picker class="dis-inb" v-if="editInfo" :range="marriageList"  @change="pickerChange($event)"  :value = "emotionStatus">
          <!-- <i-input  title="情感状态" disabled left :value = "marriageList[emotionStatus]" /> -->
          <span>{{marriageList[emotionStatus]}}</span>
          <i class="right-icon"></i>
        </picker>
      </div>
      <div class="info-item">
        <label>职业</label>
        <span v-if="!editInfo">{{customerDetail.occupation}}</span>
        <input v-if="editInfo" type="text" v-model="occupation" >
      </div>
      <div class="info-item">
        <label>学校</label>
        <span v-if="!editInfo">{{customerDetail.school}}</span>
        <input v-if="editInfo" type="text" v-model="school" >
      </div>
      <div class="info-item">
        <label>注册时间</label>
        <span>{{customerDetail.createTime}}</span>
      </div>
      <p class="edit" @click="goEdit" v-if="customerId === id">编辑资料</p>
      <!-- <p class="edit" @click=""  v-else>提交</p> -->
    </div>
    <!-- 随便看 -->
    <div  v-if="tabActive === 2" class="mt130">
      <div class="look-around-box"  @click="goLookAroundDetail" v-for="(item, index) in trasLookList" :key= index>
        <div class="title">
          <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{item.nickName}}</p>
            <p class="data">{{item.createTimeStr}}</p>
          </div>
          <!-- <div class="right'"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="lookFollowEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div> -->
        </div>
        <div class="img-box">
          <div class="img-pic-flex" v-if="item.imgUrl && item.imgUrl.length <= 2">
            <image mode="aspectFill" class="img" :src="item.urlPrefix + url" alt="" v-for="(url, uIndex) in  item.imgUrl" :key="uIndex"></image>
          </div>
          <template v-else-if="item.imgUrl">
            <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[0]" alt="" class="img1" ></image>
            <div class="right-img">
              <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[1]" alt="" class="img2"></image>
              <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[2]" alt="" class="img3"></image>
            </div>
          </template>
        </div>
        <div class="main">{{item.content}}</div>
        <div class="msg-info">
          <span class="location"><i class="icon location-icon"></i>{{item.province+item.city+item.address}}</span>
          <span class="space">相距{{item.distance}}km</span>
        </div>
        <div class="like">
          <div class="img-flex">
            <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in item.photoList" v-if="iIndex <= 9" :key="iIndex">
          </div>
          <span class="omit" v-if="item.photoList && item.photoList.length > 10">...</span>
          <span class="like-txt">{{item.likeNum}}人喜欢</span>
        </div>
        <div class="social-box">
          <div class="social-item">
            <i class="icon zf-icon"></i>
            <span>0</span>
          </div>
          <div class="social-item">
            <i class="icon pl-icon"></i>
            <span>{{item.commentNum}}</span>
          </div>
          <div class="social-item"  @click.stop="likeEvt(item)">
            <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
            <span>{{item.likeNum}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 游记列表 -->
    <div v-if="tabActive === 3" class="mt130">
      <div v-for="(item, index) in trasNoteList" :key = index>
        <div class="travels-box"   @click="goTrasNoteDetail(item)">
          <div class="title">
            <img :src="item.photo || userLogo" alt="" class="header-img">
            <div class="name-box">
              <p class="name">{{item.nickName}}</p>
              <p class="data">{{item.createTime}}</p>
            </div>
            <!-- <div class="right" @click.stop="followEvt(item)"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div> -->
          </div>
          <div class="main-box">
            <div class="left">
              <p class="title">{{item.title}}</p>
              <rich-text :nodes="item.content || ''" class="main"></rich-text>
            </div>
            <img :src="item.img" alt="" class="right-img">
          </div>
          <div class="msg-info">
            <span class="location"><i class="icon see-icon"></i><span>{{item.forwardNum}}</span></span>
            <span class="follow" @click.stop="traNotelikeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i><span>{{item.likeNum}}</span></span>
            <span class="msg-mod"><i class="icon msg-icon"></i><span>{{item.commentNum}}</span></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 约伴列表 -->
    <div v-if="tabActive === 4" class="mt130">
      <div class="partner-box" @click="goPartnerDetail(item)" v-for="(item, index) in partnerList" :key= index>
        <div class="title">
          <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{item.nickName}}<img class="sex-icon" v-if="item.sex !== 0" :src="sexJson[item.sex]" alt=""></p>
            <p class="data" v-if="item.createTime">{{item.createTime}}</p>
          </div>
        </div>
        <div class="main-box">
          <image mode="aspectFill" :src="item.urlPrefix + item.typeImgUrl" alt="" class="bg-img"></image>
          <div class="main-info">
            <p class="title">{{item.title}}</p>
            <p class="main">{{item.content}}</p>
            <p class="date">{{item.departureTime}} <span>{{item.destination}}</span></p>
            <p class="time"> {{item.day}}天</p>
            <p class="travels-btn">{{item.typeName}}</p>
          </div>
        </div>
        <div class="msg-info">
          <span class="follow" @click.stop="partnerLikeEvt(item)">
            <i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}
            <span class="newNum" v-if="item.newLikeNum > 0">+{{item.newLikeNum}}</span>
          </span>
          <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}<span class="newNum" v-if="item.newCommentNum > 0">+{{item.newCommentNum}}</span></span>
          <div class="img-modules" @click.stop="showApplyListEvt(item)">
            <div class="img-box">
              <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" v-if="iIndex <= 9" alt="" v-for="(img, iIndex) in item.applyPhotoList" :key="iIndex">
              <span class="newNum" style="margin-left: 0" v-if="item.newApplyNum > 0">+{{item.newApplyNum}}</span>
            </div>
            <span class="newNum" v-if="item.newApplyNum > 0">+{{item.newApplyNum}}</span>
            <span class="dots" v-if="item.applyPhotoList && item.applyPhotoList.length > 10">...</span>
            <span class="num">{{item.applyPhotoList && item.applyPhotoList.length}}人已报名</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Http from '../../../utils/http'
export default {
  data () {
    return {
      customerId: '', // 本人id
      id: '', // 查看id
      tabActive: 1,
      editInfo: false, // 编辑资料
      bgImg: '',
      uploadbgImg: '', // 上传背景图参数
      trasLookList: [],
      trasNoteList: [], // 游记
      partnerList: [], // 约伴
      marriageList: ['保密', '已婚', '单身', '恋爱中'],
      emotionStatus: '',
      customerDetail: {},
      occupation: '', // 职业
      school: '', // 学校
      age: '',
      themeBg: require('../../../../static/images/common/themeBg.jpg'),
      userlogo: require('../../../../static/images/common/userlogo.png'),
      sexJson: {1: require('../../../../static/images/common/man_icon.png'), 2: require('../../../../static/images/common/woman.png')}
    }
  },
  onLoad (options) {
    this.id = parseInt(options.id)
    this.customerId = wx.getStorageSync('customerId')
    this.getCustomer()
  },
  onShow () {
  },
  methods: {
    toogleTab (type) {
      if (type === 1) {
        this.tabActive = 1
      }
      if (type === 2) {
        this.tabActive = 2
        this.getLookAroundList()
      }
      if (type === 3) {
        this.tabActive = 3
        this.getTrasNoteList()
      }
      if (type === 4) {
        this.tabActive = 4
        this.getPartnerList()
      }
    },
    // toogleEditInfo () {
    //   this.editInfo = true
    // },
    goEdit () {
      wx.navigateTo({
        url: '/pages/setUp/personInfo/main'
      })
    },
    pickerChange(e) {
      this.emotionStatus = parseInt(e.target.value)
    },
    getCustomer () {
      this.$http.post(this.API.customer, {
        data: {
          id: this.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.customerDetail = res.result
          this.school = this.customerDetail.school
          this.occupation = this.customerDetail.occupation
          this.age = this.customerDetail.age
          this.emotionStatus = this.customerDetail.emotionStatus
          this.bgImg = this.customerDetail.bgImg
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    save () {
      this.$http.post(this.API.updatecustomer, {
        data: {
          age: this.age,
          photo: this.uploadHeaderImg,
          bgImg: this.uploadbgImg,
          occupation: this.occupation,
          school: this.school,
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
                self.uploadbgImg = r.data.result
                self.bgImg = res.tempFilePaths[0]
                self.$http.post(self.API.updatecustomer, {
                  data: {
                    bgImg: self.uploadbgImg
                  }
                }).then(res => {
                  wx.showToast({
                    title: '背景图片修改成功',
                    icon: 'none'
                  })
                })
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
    },
    goDarenStory () {
      wx.navigateTo({
        url: `/pages/daren/darenStory/main?id=${this.id}&showType=2` // 1:达人 2：普通用户
      })
    },
    getLookAroundList () { // 隨便看看列表
      this.$http.post(this.API.casualLookList, {
        data: {
          customerId: this.id,
          type: 0
        }
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach(item => {
            item.imgUrl = item.imgUrl.split(',')
          })
          this.trasLookList = res.result.data
        }
      })
    },
    /* eslint-disable */
    getTrasNoteList () { // 游记列表
      this.$http.post(this.API.travelNoteList, {
        data: {
          customerId: this.id,
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          this.trasNoteList = res.result.data
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          this.trasNoteList.forEach((item) => {
            item.photo = `${item.urlPrefix}${item.photo}`
            // 获取第一张图片作为主图
            let arr = item.content.match(imgReg)
            if (arr && arr[0]) {
              let src = arr[0].match(srcReg)
              this.$set(item, 'img', src[1]) // src[1]为src地址
            }
            item.content = item.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
          })
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    getPartnerList () { // 约伴列表
      this.$http.post(this.API.partnerList, {
        data: {
          customerId: this.id,
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          this.partnerList = res.result.data
          this.partnerList.forEach((item) => {
            item.typeImgUrl = item.typeImgUrl.split(',')[0]
          })
        }
      })
    },
  },
  components: {
  }
}
</script>

<style  lang="scss" scoped>
  .bgtop-img{
    width: 100%;
    height: 400rpx;
    position: absolute;
    top: 0;
    z-index: -1;
  }
  .dis-inb{
    display: inline-block;
  }
  .tab{
    height: 195rpx;
    width: 100%;
    background: #fff;
    position: absolute;
    top: 400rpx;
    ul{
      position: absolute;
      bottom: 5rpx;
      width: 100%;
      padding: 0 30rpx;
      box-sizing: border-box;
      li{
        display: inline-block;
        text-align: center;
        width: 25%;
        span{
          display: inline-block;
          padding: 17rpx 0; 
          color: #666666;
        }
        span.active{
          color: #fbb03b;
          border-bottom: 4rpx solid #fbb03b;
        }
      }
    }
  }
  .me-intrd{
    width: 690rpx;
    height: 306rpx;
    margin: 0 auto;
    margin-top: 180rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 1rpx 17rpx 1rpx rgba(3, 0, 0, 0.1);
    border-radius: 15rpx;
    position: relative;
    .header-box{
      background: #fff;
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      margin: 0 auto;
      position: absolute;
      top: -25%;
      left: 50%;
      margin-left: -75rpx;
      img {
        width: 138rpx;
        height: 138rpx;
        box-sizing: border-box;
        border-radius:50%;
        margin: 0 auto;
        display: block;
        margin-top: 7rpx;
      }
    }
    .main{
      padding-top: 90rpx;
      .name{
        font-size: 34rpx;
        text-align: center;
      }
      .info{
        font-size: 26rpx;
        color: #666666;
        margin-top: 10rpx; 
        text-align: center;
      }
      .info2{
        display: flex;
        font-size: 28rpx;
        color: #333333;
        margin-top: 30rpx;
        .flex-item{
          text-align: center;
          flex-grow: 1;
          .title{
            color: #666666;
            margin-right: 23rpx;
          }
          .right-icon{
            background: url('../../../../static/images/travelSort.png');
            background-size: 200rpx 200rpx;
            width: 21rpx;
            height: 30rpx;
            display: inline-block;
            vertical-align: middle;
            background-position: -30rpx 0;
            margin-top: -5rpx;
            margin-left: 5rpx;
          }
        }
        .line{
          border-left: 1rpx solid #dddddd;
          border-right: 1rpx solid #dddddd;
        }
      }
    }
  }
  .indexmain-info{
    background: #fff;
    margin-top: 130rpx;
    padding: 40rpx 30rpx;
    .title{
      font-size: 36rpx;
    }
    .info-item{
      border-bottom: solid 1rpx #dcdcdc;
      height: 80rpx;
      line-height:  80rpx;
      color: #666666;
      position: relative;
      label{
        width: 190rpx;
        display: inline-block;
        color:#000;
      }
      input{
        display: inline-block;
        vertical-align: middle;
      }
      span{
        width: 450rpx;
        display: inline-block;
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
    }
    .edit{
      color: #388ef8;
      font-size: 32rpx;
      text-align: center;
      margin-top: 40rpx;
    }
  }
  .mt130{
    margin-top: 130rpx;
  }
  .location-icon, .follow-icon, .msg-icon, .see-icon{
    width: 32rpx;
    height: 30rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
  }
  .msg-info{
    font-size: 22rpx;
    color: #666;
    margin-top: 20rpx;
  }
   .icon{
    background: url('../../../../static/images/travelPerson.png');
    background-size: 200rpx 100rpx;
    width: 20rpx;
    height: 35rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .look-around-box{
  padding: 50rpx 30rpx 30rpx 30rpx;
  .img-box{
    display: flex;
    padding: 20rpx 0;
    position: relative;
    margin-top: 20rpx;
    .img-pic-flex {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      margin: 0 -5px;
      margin-top: 20rpx;
      .img {
        margin: 0 5px;
        height: 312rpx;
        flex: 1;
      }
    }
    .img1{
      flex: 1;
      margin-right: 15rpx;
      height: 312rpx;
    }
    .right-img{
      float: right;
      top:20rpx;
      left: 10rpx;
      image {
        width: 230rpx;
        height: 150rpx;
        display: block;
      }
      .img3{
        margin-top: 15rpx;
      }
    }
  }
  .main{
    font-size: 30rpx;
    margin-top: 10rpx;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .msg-info{
    font-size: 22rpx;
    color: #666;
    margin-top: 10rpx;
    .location{
      width: 300rpx;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    .space{
      margin-left: 20rpx;
    }
    .msg{
      float: right;
      margin-right: 5rpx;
      margin-left: 20rpx;
    }
  }
  .like{
    margin-top: 20rpx;
    height: 80rpx;
    .img-flex{
      display: inline-block;
      max-width: 600rpx;
      img{
        width: 60rpx;
        height: 60rpx;
        display: inline-block;
        border-radius: 50%;
        margin-left: -7rpx;
      }
    }
    .omit{
      font-size: 30rpx;
      vertical-align: top;
      margin-left: 10rpx;
    }
    .like-txt{
      color: #333333;
      font-size: 22rpx;
      float: right;
      margin-top: 19rpx;
    }
  }
  .location-icon, .follow-icon, .msg-icon, .see-icon{
    width: 20rpx;
    height: 20rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
    margin-top: 0;
  }
  .follow-icon{
    background-position: -23rpx -63rpx;
  }
  .msg-icon{
    background-position: -51rpx -63rpx;
  }
  .see-icon{
    background-position: -75rpx -63rpx;
    width: 25rpx;
  }
  .social-box{
    padding: 20rpx 0 0 0;
    border-top: 1rpx solid #dcdcdc;
    display: flex;
    .social-item{
      flex-grow: 1;
      display: inline-block;
      font-size: 28rpx;
      color: #666666;
      justify-content:space-between;
      .zf-icon{
        background-position: -83rpx -57rpx;
        width: 33rpx;
        height: 33rpx;
        margin-right: 15rpx;
      }
      .dz-icon{
        background-position: -19rpx -58rpx;
        width: 32rpx;
        height: 33rpx;
        margin-right: 15rpx;
        vertical-align: middle;
        &.active {
          width: 33rpx;
          height: 33rpx;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
          background-size: 100%;
          margin-top: 7rpx;
          vertical-align: top;
        }
      }
      .pl-icon{
        background-position: -50rpx -59rpx;
        width: 33rpx;
        height: 33rpx;
        margin-right: 15rpx;
      }
    }
    .social-item:nth-child(2){
      text-align: center;
    }
    .social-item:last-child{
      text-align: right;
    }
  }
}
.partner-box{
  padding: 30rpx;
  .sex-icon {
    width: 22rpx;
    height: 22rpx;
    margin-left: 5rpx;
    vertical-align: top;
    margin-top: 16rpx;
  }
  .follow-icon, .msg-icon, .see-icon{
    width: 32rpx;
    height: 32rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
    margin-top: -8rpx;
  }
  .msg-icon{
    background-position: -50rpx -55rpx;
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .bg-img{
      width: 690rpx;
      height: 300rpx;
      display: block;
    }
    .main-info{
      color: #ffffff;
      font-size: 24rpx;
      position: absolute;
      top: 0;
      width: 690rpx;
      height: 300rpx;
      background: rgba(0,0,0,0.2);
      .title{
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        width: 543rpx;
        text-align: center;
        margin: 0 auto;
        margin-top:10rpx;
        color: #ffffff;
        font-size: 32rpx;
      }
      .main{
        width: 622rpx;
        margin: 0 auto;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
        -webkit-box-orient: vertical;
      }
      .date{
        width: 520rpx;
        margin: 0 auto;
        margin-top:10rpx;
        span{
          float: right;
        }
      }
      .time{
        text-align: center;
        margin-top:10rpx;
        font-size: 30rpx;
      }
      .travels-btn{
        width: 190rpx;
        height: 40rpx;
        background-color: #fbb03b;
        border-radius: 20rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #ffffff;
        text-align:center;
        margin: 0 auto;
        margin-top: 10rpx;
      }
    }
  }
  .msg-info{
    font-size: 22rpx;
    color: #666;
    margin-top: 15rpx;
    .img-modules{
      float: right;
      margin-top: -5rpx;
      .img-box{
        display: inline-block;
        max-width: 250rpx;
        vertical-align: middle;
        margin-left: 100rpx;
        margin-right: 20rpx;
        img{
          width: 40rpx;
          height: 40rpx;
          display: inline-block;
          margin-left: -7rpx;
          border-radius: 50%;
          border: 1px solid #fff;
        }
      }
      .dots{
        color: #666666;
        font-size: 30rpx;
        margin:0 10rpx;
        line-height: 35rpx;
        vertical-align: top;
      }
      .num{
        color: #666666;
        font-size: 20rpx;
        vertical-align: middle;
      }
    }
  }
  .msg{
    margin-right: 20rpx;
    margin-left: 100rpx;
  }
}
.travels-box{
  padding: 50rpx 30rpx;
  .location-icon, .follow-icon, .msg-icon, .see-icon{
    width: 32rpx;
    height: 32rpx;
    background-position: 0 -60rpx;
    margin-right: 8rpx;
    margin-top: -8rpx;
  }
  .msg-icon{
    background-position: -50rpx -55rpx;
  }
  .see-icon{
    background-position: -80rpx -54rpx;
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .left{
      width: 50%;
      .title{
        font-size: 30rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .main{
        height: 70rpx;
        font-size: 24rpx;
        color: #666;
        margin-top: 30rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .right-img{
      float: right;
      width: 320rpx;
      height: 200rpx;
      position: absolute;
      top: 10rpx;
      right: 0;
    }
  }
  .msg-info{
    font-size: 26rpx;
    color: #666;
    margin-top: 30rpx;
  }
  .follow{
    margin-left: 60rpx;
  }
  .msg-mod{
    margin-left: 60rpx;
  }
}
.partner-box, .look-around-box, .travels-box{
  background: #fff;
  margin-top: 20rpx;
  .title{
    position: relative;
    color: #333333;
    font-size: 30rpx;
    .header-img{
      width: 90rpx;
      height: 90rpx;
      border-radius:50%;
      display: inline-block;
      vertical-align: middle;
    }
    .name-box{
      display: inline-block;
      margin-left: 24rpx;
      font-size: 32rpx;
      vertical-align: middle;
      .data{
        color: #999999;
        font-size: 22rpx;
      }
    }
  }
  .right{
    position: absolute;
    right: 0;
    top: 0;
    color: #388ef8;
    font-size: 30rpx;
  }
  .follow-icon{
    background-position: -19rpx -55rpx;
    &.active {
      width: 32rpx;
      height: 32rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .follow-btn{
    border: 1rpx solid #ff9913;
    border-radius: 30rpx;
    color: #ff9913;
    width: 100rpx;
    height: 40rpx;
    display: inline-block;
    text-align: center;
    line-height: 40rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
    &.gray {
      border-color: #999;
      color: #999;
    }
  }
}
</style>