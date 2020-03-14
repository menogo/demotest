<template>
  <div class="travel-person-page">
    <!-- <img :src="travelPerson" alt="" class="bg-img"> -->
    <banner :showSelect = "true" :flag = 3 ></banner>
    <div class="config-modules-box">
      <div @click="goGuideIndex">
        <img :src="miniIcon1" alt="">
        <p>达人陪游</p>
      </div>
      <div @click="goPartnerIndex">
        <img :src="miniIcon2" alt="">
        <p>约伴出行</p>
      </div>
      <div @click="goTravels">
        <img :src="miniIcon3" alt="">
        <p>游记攻略</p>
      </div>
      <div @click="goLookAround">
        <img :src="miniIcon4" alt="">
        <p>随便看看</p>
      </div>
      <!-- <div @click="goBusIndex" >
        <img :src="miniIcon2" alt="">
        <p>包车接送</p>
      </div> -->
    </div>
    <!-- 向导TOP -->
    <div class="rang-box" @click="goSelectGuide">
      <p class="title">达人TOP</p>
      <span class="right">查看更多<i class="icon right-icon"></i></span>
      <div class="rang-flex">
        <div class="flex-item" @click.stop="goDarenIndex(item.customerId)" v-for="(item, index) in travelsList" :key = index  v-if="travelsList.length > 0">
          <i class="icon"></i>
          <image mode="aspectFill" :src="item.photo" alt=""></image>
          <p>{{item.nickName}}</p>
        </div>
      </div>
      <div class="person-img">
        <img :src="person1" alt="" @click.stop="goDarenExplain">
        <img :src="person2" alt="" @click.stop="goSettledIn">
      </div>
    </div>
    <!-- 随便看看 -->
    <div class="look-around-box"  @click="goLookAroundDetail" v-if="detailData">
      <div class="box-top"  @click.stop="goLookAround">
        <span class="title">随便看看</span>
        <span class="right">查看更多<i class="icon right-icon"></i></span>
      </div>
      <div class="title">
        <img :src="detailData.photo ? (detailData.urlPrefix + detailData.photo) : userLogo" alt="" class="header-img" mode='aspectFill' @click.stop="goPersonIndex(detailData)">
        <div class="name-box" @click.stop="goPersonIndex(detailData)">
          <p class="name">{{detailData.nickName}}</p>
          <p class="data">{{detailData.createTimeStr}}</p>
        </div>
        <div class="right'"><span :class="'follow-btn ' + (detailData.isFollow === 0 ? '' : 'gray')" @click.stop="lookFollowEvt(detailData)">{{detailData.isFollow === 0 ? '关注+':'已关注'}}</span></div>
      </div>
      <div class="img-box">
        <div class="img-pic-flex">
          <swiper @animationfinish="swiperChange">
            <swiper-item v-for="(url, uIndex) in  detailData.imgUrl" :key="uIndex">
              <image mode="aspectFill" class="img" :src="detailData.urlPrefix + url"></image>
            </swiper-item>
          </swiper>
          <div class="indicator-wrap" v-if="detailData.imgUrl">{{detailData.curIndex}} / {{detailData.imgUrl.length}}</div>
        </div>
      </div>
      <div class="main">
        <wxParse v-if="detailData.content" :content="detailData.content" @navigate="navigate" />
      </div>
      <div class="msg-info">
        <span class="location"><i class="icon location-icon"></i>{{detailData.province+detailData.city+detailData.address}}</span>
        <span class="space">相距{{detailData.distance}}km</span>
      </div>
      <div class="like">
        <div class="img-flex">
          <img :src="img.photo ? (detailData.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in detailData.photoList" v-if="iIndex <= 9" :key="iIndex" mode='aspectFill'>
        </div>
        <span class="omit" v-if="detailData.photoList && detailData.photoList.length > 10">...</span>
        <span class="like-txt">{{detailData.likeNum}}人喜欢</span>
      </div>
      <div class="social-box">
        <div class="social-item" @click.stop="goForward(detailData)">
          <i class="icon zf-icon"></i>
          <span>{{detailData.forwardNum}}</span>
        </div>
        <div class="social-item">
          <i class="icon pl-icon"></i>
          <span>{{detailData.commentNum}}</span>
        </div>
        <div class="social-item"  @click.stop="likeEvt(detailData)">
          <i :class="'icon dz-icon ' + (detailData.isLike === 1 ? 'active':'')"></i>
          <span>{{detailData.likeNum}}</span>
        </div>
      </div>
    </div>
    <!-- 约伴出行 -->
    <div class="partner-box" @click="goPartnerDetail(partnerItem)" v-if="partnerItem">
      <div class="box-top"  @click.stop="goPartnerIndex">
        <span class="title">约伴出行</span>
        <span class="right">查看更多<i class="icon right-icon"></i></span>
      </div>
      <div class="title">
        <img :src="partnerItem.photo ? (partnerItem.urlPrefix + partnerItem.photo) : userLogo" alt="" class="header-img" mode='aspectFill' @click.stop="goPersonIndex(partnerItem)">
        <div class="name-box" @click.stop="goPersonIndex(partnerItem)">
          <p class="name">{{partnerItem.nickName}}<img class="sex-icon" v-if="partnerItem.sex !== 0" :src="sexJson[partnerItem.sex]" alt=""></p>
          <p class="data" v-if="partnerItem.createTime">{{partnerItem.createTime}}</p>
        </div>
        <div class="right'">
          <!-- <span class="follow-btn" style="margin-right: 20rpx" @click.stop="deletePartner(partnerItem)" v-if="partnerItem.customerId == customerId">删除</span> -->
          <span :class="'follow-btn ' + (partnerItem.isFollow === 0 ? '' : 'gray')" @click.stop="partnerFollowEvt(partnerItem)">{{partnerItem.isFollow === 0 ? '关注+':'已关注'}}</span>
        </div>
      </div>
      <div class="main-box">
        <image mode="aspectFill" :src="partnerItem.urlPrefix + partnerItem.typeImgUrl" alt="" class="bg-img"></image>
        <div class="main-info">
          <p class="title">{{partnerItem.title}}</p>
          <p class="main">{{partnerItem.content}}</p>
          <p class="date">{{partnerItem.departureTime}} <span>{{partnerItem.destination}}</span></p>
          <p class="time"> {{partnerItem.day}}天</p>
          <p class="travels-btn">{{partnerItem.typeName}}</p>
        </div>
      </div>
      <div class="msg-info">
        <span class="follow" @click.stop="partnerLikeEvt(partnerItem)">
          <i :class="'icon follow-icon ' + (partnerItem.isLike === 1 ? 'active':'')"></i>{{partnerItem.likeNum}}
          <span class="newNum" v-if="partnerItem.newLikeNum > 0">+{{partnerItem.newLikeNum}}</span>
        </span>
        <span class="msg" ><i class="icon msg-icon"></i>{{partnerItem.commentNum}}<span class="newNum" v-if="partnerItem.newCommentNum > 0">+{{partnerItem.newCommentNum}}</span></span>
        <div class="img-modules" @click.stop="showApplyListEvt(partnerItem)">
          <div class="img-box">
            <img :src="img.photo ? (partnerItem.urlPrefix + img.photo) : userLogo" v-if="iIndex <= 9" alt="" v-for="(img, iIndex) in partnerItem.applyPhotoList" :key="iIndex">
            <span class="newNum" style="margin-left: 0" v-if="partnerItem.newApplyNum > 0">+{{item.newApplyNum}}</span>
          </div>
          <span class="newNum" v-if="partnerItem.newApplyNum > 0">+{{partnerItem.newApplyNum}}</span>
          <span class="dots" v-if="partnerItem.applyPhotoList && partnerItem.applyPhotoList.length > 10">...</span>
          <span class="num">{{partnerItem.applyPhotoList && partnerItem.applyPhotoList.length}}人已报名</span>
        </div>
      </div>
    </div>
    <!-- 游记攻略 -->
    <div class="travels-box" v-if="travelNoteModu"  @click="goTravelsNoteDetail(travelNoteModu)" >
      <div class="box-top"  @click.stop="goTravels">
        <span class="title">游记攻略</span>
        <span class="right">查看更多<i class="icon right-icon"></i></span>
      </div>
      <div class="title">
        <img :src="travelNoteModu.photo || userLogo" alt="" class="header-img" mode='aspectFill' @click.stop="goPersonIndex(travelNoteModu)">
        <div class="name-box" @click.stop="goPersonIndex(travelNoteModu)">
          <p class="name">{{travelNoteModu.nickName}}</p>
          <p class="data">{{travelNoteModu.createTime}}</p>
        </div>
        <div class="right" @click.stop="followEvt(travelNoteModu)"><span :class="'follow-btn ' + (travelNoteModu.isFollow === 0 ? '' : 'gray')">{{travelNoteModu.isFollow === 0 ? '关注+':'已关注'}}</span></div>
      </div>
      <div class="main-box">
        <div class="left">
          <p class="title">{{travelNoteModu.title}}</p>
          <rich-text :nodes="travelNoteModu.content || ''" class="main"></rich-text>
        </div>
        <img :src="travelNoteModu.img" alt="" class="right-img">
      </div>
      <div class="msg-info">
        <span class="location" @click.stop="goTrasForward(item)"><i class="icon see-icon"></i><span>{{travelNoteModu.forwardNum}}</span></span>
        <span class="follow" @click.stop="traNotelikeEvt(travelNoteModu)"><i :class="'icon follow-icon ' + (travelNoteModu.isLike === 1 ? 'active':'')"></i><span>{{travelNoteModu.likeNum}}</span></span>
        <span class="msg-mod"><i class="icon msg-icon"></i><span>{{travelNoteModu.commentNum}}</span></span>
      </div>
    </div>
    <!-- 达人陪游 -->
    <div class="guide-box" v-if="guideList.length > 0">
      <p class="title">达人陪游</p>
      <div class="goods-card">
        <div class="goods-card-item" v-for="(item, index) in guideList" :key = index @click="goGuideDetail(item)">
          <div class="po-rel">
            <image mode="aspectFill" :src="item.productUrl" alt=""></image>
          </div>
          <p class="goods-title">{{item.productName}}</p>
          <div class="label-card">
            <span v-for="(ite, ind) in labList" :key = ind>特色内容</span>
          </div>
          <div class="price-box">
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <span>起</span>
          </div>
          <span class="place">目的地：{{item.destination}}</span>
        </div>
      </div>
    </div>
  <!-- <span>{{emojiData[0]}}</span> -->
  </div>
</template>
<script>
// import emoji from '../../../static/js/emoji'
import banner from '@/components/common/banner'
import wxParse from 'mpvue-wxparse'
import utils from '../../utils'

export default {
  data () {
    return {
      emojiData: [],
      currentCity: '',
      guideList: [],
      labList: [],
      travelsList: [], // 向导Top
      travelNoteModu: '', // 游记模块
      detailData: {}, // 随便看数据
      partnerItem: {}, // 约伴数据
      isLogin: false,
      // travelPerson: require('../../../static/images/travelPerson.jpg'),
      userLogo: require('../../../static/images/common/userlogo.png'),
      person1: require('../../../static/images/travelPerson/person1.png'),
      person2: require('../../../static/images/travelPerson/person2.png'),
      themeImg: require('../../../static/images/common/themeBg.jpg'),
      miniIcon1: require('../../../static/images/travelPerson/icon1.png'),
      miniIcon2: require('../../../static/images/travelPerson/icon2.png'),
      miniIcon3: require('../../../static/images/travelPerson/icon3.png'),
      miniIcon4: require('../../../static/images/travelPerson/icon4.png'),
      sexJson: {1: require('../../../static/images/common/man_icon.png'), 2: require('../../../static/images/common/woman.png')}
    }
  },
  onLoad() {
    this.travelsList = []
  },
  onShow() {
    if (wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('selectCity')
    } else {
      if (!wx.getStorageSync('userCity')) { // 首次进入页面
        utils.getLocation().then(res => {
          this.currentCity = res.data.result.ad_info.city
        })
      } else {
        this.currentCity = wx.getStorageSync('userCity')
      }
    }
    this.getIsLogin()
    this.getGuideList()
    this.trasModules() // 游记
    this.getLookList()
    this.getPartnerList()
    this.travelTalentTop()
  },
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/travelPerson/main?shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  methods: {
    goForward (item) {
      wx.navigateTo({
        url: `/pages/daren/lookForward/main?id=${item.id}`
      })
    },
    getGuideList () {
      this.$http.post(this.API.myGuide, {
        data: {
          type: 1
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.guideList = res.result.data
          this.labList = this.guideList.productLabel.split(',')
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    travelTalentTop () {
      this.$http.post(this.API.travelTalentTop, {
        data: {
          currentPage: 1,
          pageSize: 5,
          status: 2,
          searchType: 1 // 1-查询向导top
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.travelsList = res.result.data
          this.travelsList.forEach((item) => {
            item.photo = `${item.urlPrefix}${item.photo}`
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getLookList () {
      let params = {
        currentPage: 1,
        pageSize: 10,
        type: 1,
        sortType: 1,
        lookType: 1
      }
      this.$http.post(this.API.casualLookList, {
        data: params
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach(item => {
            item.imgUrl = item.imgUrl.split(',')
          })
          this.detailData = res.result.data[0]
          this.$set(this.detailData, 'curIndex', 1)
        }
      })
    },
    getPartnerList() {
      let url = this.API.partnerList
      this.$http.post(url, {
        data: {
          currentPage: 1,
          pageSize: 10,
          type: 1,
          sortType: 1
        },
        showLoading: true
      }).then(res => {
        if (res.code === 0) {
          if (res.result.data.length > 0) {
            // debugger
            this.partnerItem = res.result.data[0]
            // 随机背景图
            this.partnerItem.typeImgUrl = this.partnerItem.typeImgUrl.split(',')[0]
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    /* eslint-disable */
    trasModules() {
      this.$http.post(this.API.travelNoteList, {
        data: {
          type: 1,
          sortType: 1
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          if (res && res.result && res.result.data && res.result.data[0]) {
            this.travelNoteModu = res.result.data[0]
            let imgReg = /<img.*?(?:>|\/>)/gi
            let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
            let img = this.travelNoteModu.content.match(imgReg)
            let src = img[0].match(srcReg)
            this.$set(this.travelNoteModu, 'img', '')
            this.travelNoteModu.img = src[1]
            this.travelNoteModu.content = this.travelNoteModu.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
            // 头像
            let urlPrefix = this.travelNoteModu.urlPrefix
            if (this.travelNoteModu.photo) {
              this.travelNoteModu.photo = `${urlPrefix}${this.travelNoteModu.photo}`
            } else {
              this.travelNoteModu.photo = ''
            }
          } else {
            this.travelNoteModu = ''
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goDarenIndex(id) {
      console.log(id)
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${id}`
      })
    },
    likeEvt(item) {
      let type = item.isLike === 0 ? 1 : 2
      this.$http.post(this.API.likeCasualLookList, {
        data: {
          type: type,
          likeId: item.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let like = item.isLike === 0 ? 1 : 0
          item.isLike = like
          if (like === 1) {
            item.likeNum++
          } else {
            item.likeNum--
          }
          this.dataList.splice(0, 0)
        }
      })
    },
    partnerLikeEvt(item) {
      let type = item.isLike === 0 ? 1 : 2
      this.$http.post(this.API.partnerLike, {
        data: {
          type: type,
          likeId: item.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let like = item.isLike === 0 ? 1 : 0
          item.isLike = like
          if (like === 1) {
            item.likeNum++
          } else {
            item.likeNum--
          }
          this.dataList.splice(0, 0)
        }
      })
    },
    traNotelikeEvt(item) {
      let type = this.travelNoteModu.isLike === 0 ? 1 : 2
      this.$http.post(this.API.travelNoteLike, {
        data: {
          type: type,
          likeId: this.travelNoteModu.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let like = this.travelNoteModu.isLike === 0 ? 1 : 0
          this.travelNoteModu.isLike = like
          if (like === 1) {
            this.travelNoteModu.likeNum++
          } else {
            this.travelNoteModu.likeNum--
          }
          // this.travelNoteList.splice(0, 0)
        }
      })
    },
    lookFollowEvt (item) {
      let type = item.isFollow === 0 ? 1 : 2
      this.$http.post(this.API.followCasualLookList, {
        data: {
          type: type,
          followId: item.customerId
        }
      }).then(res => {
        if (res.code === 0) {
          let text = ''
          let like = item.isFollow === 0 ? 1 : 0
          item.isFollow = like
          if (like === 1) {
            text = '关注成功'
          } else {
            text = '取消成功'
          }
          wx.showToast({title: text})
          this.dataList.splice(0, 0)
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    partnerFollowEvt(item) {
      let type = item.isFollow === 0 ? 1 : 2
      this.$http.post(this.API.partnerFollow, {
        data: {
          type: type,
          followId: item.customerId
        }
      }).then(res => {
        if (res.code === 0) {
          let text = ''
          let like = item.isFollow === 0 ? 1 : 0
          item.isFollow = like
          if (like === 1) {
            text = '关注成功'
          } else {
            text = '取消成功'
          }
          wx.showToast({title: text})
          this.dataList.splice(0, 0)
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    followEvt (item) {
      let type = item.isFollow === 0 ? 1 : 2
      this.$http.post(this.API.followCasualLookList, {
        data: {
          type: type, // 1 关注 2 取消关注
          followId: item.id
        }
      }).then(res => {
        if (res.code === 0) {
          let text = ''
          let like = item.isFollow === 0 ? 1 : 0
          item.isFollow = like
          if (like === 1) {
            text = '关注成功'
          } else {
            text = '取消成功'
          }
          wx.showToast({title: text})
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    getIsLogin() {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0) {
          this.isLogin = res.result
        }
      })
    },
    goLogin () {
      wx.navigateTo({
        url: '/pages/login/main'
      })
    },
    goLookAround() {
      wx.navigateTo({
        url: '/pages/daren/lookAround/main'
      })
    },
    goLookAroundDetail() {
      wx.navigateTo({
        url: `/pages/daren/lookAroundDetail/main?id=${this.detailData.id}&type=1`
      })
    },
    goPartnerDetail() {
      wx.navigateTo({
        url: `/pages/daren/partnerDetail/main?id=${this.partnerItem.id}&type=1&urlIndex=0`
      })
    },
    goGuideIndex() { // 达人陪游
      wx.navigateTo({
        url: '/pages/daren/guideIndex/main'
        // url: '/pages/daren/guideDetail/main'
      })
    },
    goGuideDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/guideDetail/main?id=${item.id}`
      })
    },
    goBusIndex() {
      wx.navigateTo({ // 包车接机
        url: '/pages/daren/busIndex/main'
      })
    },
    goTravels() { // 游记攻略
      wx.navigateTo({
        url: `/pages/daren/travels/main`
      })
    },
    goTravelsNoteDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/trasDetail/main?id=${item.id}&trasCustomerId=${item.customerId}`
      })
    },
    goPartnerIndex() { // 结伴出游
      wx.navigateTo({
        url: `/pages/daren/partnerIndex/main?type=1`
      })
    },
    goDarenExplain() {
      wx.navigateTo({
        url: `/pages/daren/darenExplain/main`
      })
    },
    goSelectGuide() {
      wx.navigateTo({
        url: `/pages/daren/selectGuide/main`
      })
    },
    goSettledIn () {
      if (this.isLogin) {
        wx.navigateTo({
          url: `/pages/daren/settledIn/main`
        })
      } else {
        this.goLogin()
      }
    },
    goTrasForward (item) {
      wx.navigateTo({
        url: `/pages/daren/forward/main?id=${item.id}`
      })
    },
    goPersonIndex(item) {
      if (item.talentStatus === 2) {
        wx.navigateTo({
          url: `/pages/daren/darenIndex/main?id=${item.customerId}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/meInfo/meIndex/main?id=${item.customerId}`
        })
      }
    },
    swiperChange(e) {
      this.detailData.curIndex = e.mp.detail.current + 1
    }
  },
  components: {
    banner,
    wxParse
  }
}
</script>
<style lang="scss" scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
.bg-img{
  width: 100%;
  height: 100vh;
  display: block;
}
.travel-person-page {
  min-height: 100vh;
  background: #f4f4f4;
}
.config-modules-box{
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding-bottom: 60rpx;
  div {
    width: 25%;
    text-align: center;
    font-size: 22rpx;
    margin-top: 60rpx;
    img {
      width: 82rpx;
      height: 82rpx;
    }
  }
}
.icon{
  background: url('../../../static/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 48rpx;
  height: 50rpx;
  display: inline-block;
  vertical-align: middle;
}
.rang-box{
  background: #fff;
  margin-top: 20rpx;
  padding: 50rpx 30rpx;
  position: relative;
  .title{
    font-size: 36rpx;
    margin-bottom: 30rpx;
  }
  .right{
    position: absolute;
    top: 50rpx;
    right: 50rpx;
    color: #388ef8;
    font-size: 28rpx;
    margin-top: 0
  }
  .right-icon{
    width: 20rpx;
    height: 30rpx;
    background-position: -117rpx -57rpx;
    position: absolute;
    top: 10rpx;
    right: -20rpx;
  }
  .rang-flex{
    display: flex;
    overflow: auto;
    margin-left: -10rpx;
    .flex-item{
      position: relative;
      background: #fff;
      border-radius: 5rpx;
      image{
        width: 212rpx;
        height: 152rpx;
        display: block;
        border-radius: 5rpx 5rpx 0 0;
        margin-top: -20rpx;
        margin-left: 20rpx;
      }
      p{
        box-shadow: 0px 0px 20rpx #ddd;
        border-radius: 0 0 5rpx 5rpx;
        font-size: 26rpx;
        color: #333;
        text-align: center;
        height: 70rpx;
        line-height: 70rpx;
        width: 212rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 20rpx;
      }
      .icon{
        background: none;
      }
    }
    .flex-item:nth-child(1) i, .flex-item:nth-child(2) i, .flex-item:nth-child(3) i{
      z-index: 99;
      background: url('../../../static/images/travelPerson.png');
      background-size: 200rpx 100rpx;
      width: 48rpx;
      height: 50rpx;
      display: inline-block;
      vertical-align: middle;
    }
    .flex-item:nth-child(1){
      i{
        background-position: 0 -3rpx;
      }
    }
    .flex-item:nth-child(2){
      i{
        background-position: -50rpx -3rpx;
      }
    }
    .flex-item:nth-child(3){
      i{
        background-position: -98rpx -3rpx;
      }
    }
  }
  .person-img{
    margin-top: 60rpx;
    img:nth-child(1){
      margin-right: 20rpx;
    }
    img{
      width: 334rpx;
      height: 184rpx;
      display: inline-block;
    }
  }
}
.guide-box{
  padding: 30rpx;
  .title{
    text-align: center;
    font-size: 34rpx;
  }
  .goods-card{
    display: flex;
    flex-wrap: wrap;
    .goods-card-item:nth-child(2n){
      margin-right: 0;
    }
    .goods-card-item{
      background: #fff;
      margin: 30rpx 20rpx 0 0 ;
      width: 335rpx;
      font-size: 24rpx;
      padding-bottom: 20rpx;
      border-radius: 10rpx;
      .po-rel {
        position: relative;
        image{
          width: 100%;
          height: 220rpx;
          margin: 0 auto;
          border-radius: 10rpx 10rpx 0 0;
          display: block;
        }
      }
      .goods-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin:15rpx 0 10rpx 0;
        color: #353535;
        padding: 0 10rpx;
        height: 80rpx;
      }
      .label-card{
        span{
          display: inline-block;
          width: 100rpx;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
          border: 1rpx solid #ff9913;
          margin-right: 8rpx;
          font-size: 20rpx;
          color: #ff9913;
        }
        span:nth-child(1){
          margin-left: 8rpx;
        }
      }
      .price-box{
        margin-right:20rpx;
        margin-top: 10rpx;
        margin-left: 10rpx;
        font-size: 20rpx;
        color: #888;
        display: inline-block;
        .symbol{
          font-size: 20rpx;
          color: #f65631;
        }
        .price{
          font-size:30rpx;
          color: #f65631;
        }
      }
      .place{
        float: right;
        color: #888;
        font-size: 20rpx;
        margin-top: 20rpx;
        margin-right: 10rpx;
      }
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
        text-align: center;
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
.look-around-box{
  padding: 50rpx 30rpx 30rpx 30rpx;
  .img-box{
    padding: 20rpx 0;
    position: relative;
    margin-top: 20rpx;
    .img-pic-flex {
      // display: flex;
      // flex: 1;
      // flex-wrap: wrap;
      // margin: 0 -5px;
      // margin-top: 20rpx;
      .img {
        margin: 0 auto;
        width: 690rpx;
        height: 460rpx;
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
.box-top{
  height: 80rpx;
  border-bottom: 1rpx solid #dcdcdc;
  margin-bottom: 30rpx;
  position: relative;
  .title{
    font-size: 36rpx;
  }
  .right{
    position: absolute;
    right: 30rpx;
    top: 0;
    color: #388ef8;
    font-size: 30rpx;
    .right-icon{
      width: 20rpx;
      height: 30rpx;
      background-position: -117rpx -57rpx;
      position: absolute;
      top: 12rpx;
      right: -25rpx;
    }
  }
}
swiper {
  height: 460rpx;
}
.indicator-wrap {
  position: absolute;
  right: 20rpx;
  bottom: 40rpx;
  color: #fff;
  background-color: rgba(0, 0, 0, .4);
  -webkit-border-radius: 30rpx;
  -moz-border-radius: 30rpx;
  border-radius: 30rpx;
  line-height: 1;
  padding: 10rpx 20rpx;
}
</style>
