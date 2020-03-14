<template>
    <div>
      <img :src="darenDetail.bgImg || userlogo" alt="" class="banner-img" mode="aspectFill">
      <div class="personal-info" v-if="darenDetail">
        <div class="header-img">
          <img :src="darenDetail.photo || userlogo" alt="" v-if="darenDetail && darenDetail.photo" mode='aspectFill'>
        </div>
        <p class="name">{{darenDetail.nickName}}</p>
        <p class="follow">
          <span>关注<i class="col">{{darenDetail.followNum}}</i></span>
          <span>粉丝<i class="col">{{darenDetail.fansNum}}</i></span>
        </p>
        <p class="title">{{darenDetail.remark}}</p>
        <div class="introduce">
          <span v-if="darenDetail.workTime">
            <span>从业：{{workTime}}</span>
            <span class="line">|</span>
          </span>
          <span class="center" v-if="darenDetail.serviceCity">地区：{{serviceCity}}</span>
          <span class="line">|</span>
          <span>好评率：98%</span>
        </div>
        <p class="story"  @click="goDarenStory">向导的故事 ></p>
      </div>
      <!-- <div class="service-type">
        <p class="title">服务类型</p>
        <div class="service-item">
          <div>
            <i class="darenicon xdpy-icon"></i>
            <p>达人陪游</p>
          </div>
          <div>
            <i class="darenicon xdzx-icon"></i>
            <p>向导资讯</p>
          </div>
          <div>
            <img :src="miniIcon2" alt="">
            <p>达人带团</p>
          </div>
          <div>
            <img :src="miniIcon2" alt="">
            <p>达人带团</p>
          </div>
        </div>
      </div> -->
      <div class="column-item mt20" @click="toggleMask" v-if="darenDetail && darenDetail.license">
        <span>认证信息</span>
        <i class="icon right-icon"></i>
      </div>
      <div class="column-item" @click="goCommentList">
        <span>用户评论</span>
        <i class="icon right-icon"></i>
      </div>
      <!-- <div class="column-item" @click="goDarenStory">向导的故事<i class="icon right-icon"></i></div> -->
      <div class="column-item bor-none">
        <span>注册时间</span>
        <i class="center-txt">{{darenDetail.createTime}}</i>
      </div>
      <div class="guide-box">
        <p class="title">
          <span :class="{'active' : 0 === tabActive}" @click="toggleTab(0)">达人陪游</span>
          <!-- <span>包车接送</span> -->
          <span :class="{'active' : 1 === tabActive}" @click="toggleTab(1)">游记攻略</span>
          <span :class="{'active' : 2 === tabActive}" @click="toggleTab(2)">随便看</span>
          <span :class="{'active' : 3 === tabActive}" @click="toggleTab(3)">约伴</span>
          <!-- <span>导游代购</span> -->
        </p>
      </div>
      <!-- 达人陪游 -->
      <div class="goods-card"  v-if="0 === tabActive">
        <div class="goods-card-item" v-for="(item, index) in guideList" :key = index @click="goGuideDetail(item)">
          <div class="po-rel">
            <img :src="item.productUrl" alt="">
          </div>
          <p class="goods-title">{{item.productName}}</p>
          <div class="label-card">
            <span v-for="(ite, ind) in item.labList" :key = ind>{{ite}}</span>
          </div>
          <div class="price-box">
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <span>起</span>
          </div>
          <span class="place">目的地：{{item.destination}}</span>
        </div>
        <div class="empty-box" v-if="guideList.length === 0">
          <i class="empty-icon"></i>
          <p>这个达人有点懒，什么也没留下</p>
        </div>
      </div>
      <!-- 游记列表 -->
      <div class="bg-white" v-if="1 === tabActive">
        <div  v-for="(item, index) in trasNoteList" :key = index>
          <div class="travels-box"  @click="goTrasNoteDetail(item ,1)" v-if="item.noteType === 1">
            <div class="title">
              <img :src="item.photo || userLogo" alt="" class="header-img" mode='aspectFill'>
              <div class="name-box">
                <p class="name">{{item.nickName}}</p>
                <p class="data">{{item.createTime}}</p>
              </div>
            </div>
            <div class="right" @click.stop="followEvt(item)" v-if="item.oneself === 2">
              <span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')">{{item.isFollow === 0 ? '关注+':'已关注'}}</span>
            </div>
            <div class="right" v-if="item.oneself === 1"><span class='follow-btn gray'>{{item.viewNum}}浏览</span></div>
            <div class="main-box">
              <div class="left">
                <p class="title">{{item.title}}</p>
                <rich-text :nodes="item.content" class="main"></rich-text>
              </div>
              <img :src="item.img || traNoteImg" alt="" class="right-img">
            </div>
            <div class="msg-info">
              <span class="location" @click.stop="goTrasForward(item, 1)"><i class="icon forward-icon"></i>{{item.forwardNum}}</span>
              <span class="follow"  @click.stop="traNotelikeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
              <span class="msg-mod"><i class="icon msg-icon"></i>{{item.commentNum}}</span>
            </div>
          </div>
          <div class="travels-box2"  @click="goTrasNoteDetail(item, 2)" v-if="item.noteType === 2">
            <div class="title2">
              <img :src="item.photo || userLogo" alt="" class="header-img" mode='aspectFill'>
              <div class="name-box">
                <p class="name">{{item.nickName}}</p>
                <p class="data">{{item.createTime}}</p>
              </div>
            </div>
            <div class="right" @click.stop="followEvt(item)" v-if="item.oneself === 2">
              <span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')">{{item.isFollow === 0 ? '关注+':'已关注'}}</span>
            </div>
            <div class="right" v-if="item.oneself === 1"><span class='follow-btn gray'>{{item.viewNum}}浏览</span></div>
            <div class="forwardTxt">
              <wxParse :content="item.forwardContent" @navigate="navigate"/>
            </div>
            <div class="main-box">
              <div class="left">
                <p class="title">
                  <a class="author" @click="goAuthor(item.forwardTravelNote.customerId)">@{{item.forwardTravelNote.nickName}}:</a>
                  {{item.forwardTravelNote.title}}
                </p>
                <rich-text :nodes="item.forwardTravelNote.content" class="main"></rich-text>
              </div>
              <img :src="item.forwardTravelNote.img || traNoteImg" alt="" class="right-img">
              <div class="msg-info">
                <span class="location"><i class="icon forward-icon"></i>{{item.forwardTravelNote.forwardNum}}</span>
                <span class="follow" ><i class='icon follow-icon '></i>{{item.forwardTravelNote.likeNum}}</span>
                <span class="msg-mod"><i class="icon msg-icon"></i>{{item.forwardTravelNote.commentNum}}</span>
              </div>
            </div>
            <div class="msg-info2">
              <span class="location" @click.stop="goTrasForward(item, 2)"><i class="icon forward-icon"></i></span>
              <span class="msg-mod"><i class="icon msg-icon"></i>{{item.commentNum}}</span>
              <span class="follow" ><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')" @click.stop="traNotelikeEvt(item)"></i>{{item.likeNum}}</span>
            </div>
          </div>
        </div>
        <div class="empty-box" v-if="trasNoteList.length === 0">
          <i class="empty-icon"></i>
          <p>这个达人有点懒，什么也没留下</p>
        </div>
      </div>
      <!-- 随便看 -->
      <div  class="bg-white" v-if="2 === tabActive" >
        <div class="look-around-box" @click="goLookAroundDetail(item)" v-for="(item, index) in trasLookList" :key="index" >
          <div v-if="item.forwardCasualLook" >
            <!-- 转发 -->
            <div class="title">
              <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" mode='aspectFill'>
              <div class="name-box">
                <p class="name">{{item.nickName}}</p>
                <p class="data">{{item.createTimeStr}}</p>
              </div>
            </div>
            <div class="right'"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
            <div class="main forwardContent-text">
              <wxParse :content="item.forwardContent" @navigate="navigate" />
            </div>
            <div class="look-around-box forwardCasualLook-wrap">
              <div class="img-box">
                <div class="img-pic-flex">
                  <swiper @animationfinish="swiperChange($event, item)">
                    <swiper-item v-for="(url, uIndex) in  item.forwardCasualLook.imgUrl" :key="uIndex">
                      <image mode="aspectFill" class="img" :src="item.urlPrefix + url"></image>
                    </swiper-item>
                  </swiper>
                  <div class="indicator-wrap">{{item.curIndex}} / {{item.forwardCasualLook.imgUrl.length}}</div>
                </div>
              </div>
              <div class="main">
                <wxParse :content="item.forwardCasualLook.content" @navigate="navigate"/>
              </div>
              <div class="msg-info">
                <span class="location"><i class="icon location-icon"></i>{{item.forwardCasualLook.address}}</span>
                <span class="space">相距{{item.distance}}km</span>
              </div>
              <div class="social-box">
                <div class="social-item">
                  <i class="icon zf-icon"></i>
                  <span>{{item.forwardCasualLook.forwardNum}}</span>
                </div>
                <div class="social-item" >
                  <i class="icon pl-icon"></i>
                  <span>{{item.forwardCasualLook.commentNum}}</span>
                </div>
                <div class="social-item">
                  <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
                  <span>{{item.forwardCasualLook.likeNum}}</span>
                </div>
              </div>
            </div>
            <div class="like">
              <div class="img-flex">
                <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in item.photoList" v-if="iIndex <= 9" :key="iIndex" mode='aspectFill'>
              </div>
              <span class="omit" v-if="item.photoList.length > 10">...</span>
              <span class="like-txt">{{item.likeNum}}人喜欢</span>
            </div>
            <div class="social-box">
              <div class="social-item" @click.stop="goForward(item.forwardCasualLook)">
                <i class="icon zf-icon"></i>
              </div>
              <div class="social-item" >
                <i class="icon pl-icon"></i>
                <span>{{item.commentNum}}</span>
              </div>
              <div class="social-item"  @click.stop="likeEvt(item)">
                <i :class="'icon dz-icon ' + (item.isLike === 1 ? 'active':'')"></i>
                <span>{{item.likeNum}}</span>
              </div>
            </div>
          </div>
          <div v-else >
            <div class="title">
              <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" mode='aspectFill'>
              <div class="name-box">
                <p class="name">{{item.nickName}}</p>
                <p class="data">{{item.createTimeStr}}</p>
              </div>
            </div>
            <div class="right'"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
            <div class="img-box">
              <div class="img-pic-flex">
                <swiper @animationfinish="swiperChange($event, item)">
                  <swiper-item v-for="(url, uIndex) in  item.imgUrl" :key="uIndex">
                    <image mode="aspectFill" class="img" :src="item.urlPrefix + url"></image>
                  </swiper-item>
                </swiper>
                <div class="indicator-wrap">{{item.curIndex}} / {{item.imgUrl.length}}</div>
              </div>
            </div>
            <div class="main">
              <wxParse :content="item.content" @navigate="navigate"/>
            </div>
            <div class="msg-info">
              <span class="location"><i class="icon location-icon"></i>{{item.address}}</span>
              <span class="space">相距{{item.distance}}km</span>
            </div>
            <div class="like">
              <div class="img-flex">
                <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in item.photoList" v-if="iIndex <= 9" :key="iIndex" mode='aspectFill'>
              </div>
              <span class="omit" v-if="item.photoList.length > 10">...</span>
              <span class="like-txt">{{item.likeNum}}人喜欢</span>
            </div>
            <div class="social-box">
              <div class="social-item" @click.stop="goForward(item)">
                <i class="icon zf-icon"></i>
                <span>{{item.forwardNum}}</span>
              </div>
              <div class="social-item" >
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
        <div class="empty-box" v-if="trasLookList.length === 0">
          <i class="empty-icon"></i>
          <p>这个达人有点懒，什么也没留下</p>
        </div>
      </div>
      <!-- 约伴列表 -->
      <div  class="bg-white" v-if="3 === tabActive">
        <div class="partner-box" @click="goPartnerDetail(item)" v-for="(item, index) in partnerList" :key= index>
          <div class="title">
            <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" alt="" class="header-img" mode='aspectFill'>
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
        <div class="empty-box" v-if="partnerList.length === 0">
          <i class="empty-icon"></i>
          <p>这个达人有点懒，什么也没留下</p>
        </div>
      </div>
      <p class="none-list" v-if="showNoneList">没有更多了</p>
      <ul class="detail-mask" v-if="showDetailMask">
        <li class="title">
          达人身份认证
          <i class="icon2 close-icon" @click="closeMask"></i>
        </li>
        <li class="sec-title">达人入驻时已对达人以下身份认证</li>
        <li>
          <span>实名认证</span>
          <span class="right">
            <i class="icon2 suc-icon" :class="{'none': false}"></i>
          </span>
        </li>
        <li>
          <span>身份证认证</span>
          <span class="right">
            <i class="icon2 suc-icon" :class="{'none': darenDetail.license.idcardVerify === 0}"></i>
          </span>
        </li>
        <li>
          <span>导游资格认证</span>
          <span class="right">
            <i class="icon2 suc-icon" :class="{'none': darenDetail.license.guideVerify === 0}"></i>
          </span>
        </li>
        <li>
          <span>驾驶证资格认证</span>
          <span class="right">
            <i class="icon2 suc-icon" :class="{'none': darenDetail.license.driverVerify === 0}"></i>
          </span>
        </li>
        <li>
          <span>学生证资格认证</span>
          <span class="right">
            <i class="icon2 suc-icon" :class="{'none': darenDetail.license.studentVerify === 0}"></i>
          </span>
        </li>
      </ul>
      <div class="dialog-mask" @click="closeMask"  v-if="showDetailMask"></div>
    </div>
</template>
<script>
import wxParse from 'mpvue-wxparse'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      id: '',
      darenDetail: '',
      workTime: '',
      tabActive: 0,
      guideList: [], // 达人陪游
      trasNoteList: [], // 游记
      trasLookList: [], // 随便看
      partnerList: [], // 约伴
      showDetailMask: false,
      lookAroundPage: 1,
      lookAroundCount: 1,
      partnerPage: 1,
      partnerCount: 1,
      travelsPage: 1,
      travelsCount: 1,
      serviceCity: '',
      showNoneList: false,
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg'),
      travelNote: require('../../../../static/images/common/travelNote.jpg'),
      userlogo: require('../../../../static/images/common/userlogo.png'),
      sexJson: {1: require('../../../../static/images/common/man_icon.png'), 2: require('../../../../static/images/common/woman.png')}
    }
  },
  onLoad (options) {
    this.id = options.id
  },
  onShow () {
    this.reset()
    this.getDarenDetail()
    this.getGuideList()
  },
  onReachBottom() {
    if (this.tabActive === 1) {
      if (this.travelsPage === 1) {
        return
      }
      if (this.travelsPage > 1 && this.travelsPage > this.travelsCount) {
        this.showNoneList = true
      } else {
        this.getTrasNoteList()
      }
    }
    if (this.tabActive === 2) {
      if (this.lookAroundPage === 1) {
        return
      }
      if (this.lookAroundPage > 1 && this.lookAroundPage > this.lookAroundCount) {
        this.showNoneList = true
      } else {
        this.getLookAroundList()
      }
    }
    if (this.tabActive === 3) {
      if (this.partnerPage === 1) {
        return
      }
      if (this.partnerPage > 1 && this.partnerPage > this.partnerCount) {
        this.showNoneList = true
      } else {
        this.getPartnerList()
      }
    }
  },
  methods: {
    reset () {
      this.tabActive = 0
      this.darenDetail = ''
      this.lookAroundPage = 1
      this.lookAroundCount = 1
      this.partnerPage = 1
      this.partnerCount = 1
      this.travelsPage = 1
      this.travelsCount = 1
      this.showNoneList = false
      this.guideList = []
      this.trasNoteList = []
      this.trasLookList = []
      this.partnerList = []
    },
    navigate(href, e) {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${href}`
      })
    },
    getDarenDetail (id) {
      this.$http.post(this.API.traPersonDetail, {
        data: {
          id: parseInt(this.id)
        }
      }).then(res => {
        if (res.code === 0) {
          this.darenDetail = res.result
          this.darenDetail.createTime = dayjs(this.darenDetail.createTime).format('YYYY年MM月DD日')
          if (this.darenDetail && this.darenDetail.photo) {
            this.darenDetail.photo = `${this.darenDetail.urlPrefix}${this.darenDetail.photo}`
          } else {
            this.darenDetail.photo = ''
          }
          if (this.darenDetail && this.darenDetail.bgImg) {
            this.darenDetail.bgImg = `${this.darenDetail.urlPrefix}${this.darenDetail.bgImg}`
          } else {
            this.darenDetail.bgImg = ''
          }
          this.serviceCity = this.darenDetail.serviceCity.split(',')[1]
          if (this.darenDetail.workTime) {
            let wtIndex = this.darenDetail.workTime
            if (wtIndex === '0') {
              this.workTime = '1年'
            }
            if (wtIndex === '1') {
              this.workTime = '2年'
            }
            if (wtIndex === '2') {
              this.workTime = '3年'
            }
            if (wtIndex === '3') {
              this.workTime = '3~5年'
            }
            if (wtIndex === '4') {
              this.workTime = '5年以上'
            }
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    toggleMask() {
      this.showDetailMask = !this.showDetailMask
    },
    closeMask() {
      this.showDetailMask = false
    },
    goCommentList () {
      wx.navigateTo({
        url: `/pages/daren/commentList/main?talentId=${this.id}`
      })
    },
    goGuideDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/guideDetail/main?id=${item.id}`
      })
    },
    goTrasNoteDetail (item) {
      wx.navigateTo({
        url: `/pages/daren/trasDetail/main?id=${item.id}&trasCustomerId=${item.customerId}`
      })
    },
    goDarenStory () {
      wx.navigateTo({
        url: `/pages/daren/darenStory/main?id=${this.darenDetail.customerId}&showType=1` // 1:达人 2：普通用户
      })
    },
    getGuideList() { // 向导陪游列表
      this.$http.post(this.API.myGuide, {
        data: {
          talentId: this.id,
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          this.guideList = res.result.data
          this.guideList.forEach((item) => {
            this.$set(item, 'labList', '')
            item.labList = item.productLabel.split(',')
            if (item.labList.length >= 3) {
              item.labList.length = 3
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    /* eslint-disable */
    getTrasNoteList () { // 游记列表
      this.$http.post(this.API.travelNoteList, {
        data: {
          currentPage: this.travelsPage,
          pageSize: 5,
          customerId: this.id,
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          res.result.data.forEach((item) => {
            item.photo = `${item.urlPrefix}${item.photo}`
            // 获取第一张图片作为主图
            let arr = item.content.match(imgReg)
            if (arr && arr[0]) {
              let src = arr[0].match(srcReg)
              this.$set(item, 'img', src[1]) // src[1]为src地址
            }
            item.content = item.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
          })
          this.travelsCount = res.result.currentCount
          if (this.travelsPage === 1) {
            this.trasNoteList = []
            this.trasNoteList = res.result.data
            this.travelsPage = 2
          } else {
            this.trasNoteList = this.trasNoteList.concat(res.result.data)
            this.travelsPage++
          }
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    getLookAroundList () { // 隨便看看列表
      this.$http.post(this.API.casualLookList, {
        data: {
          currentPage: this.lookAroundPage,
          pageSize: 5,
          customerId: this.id,
          type: 0
        }
      }).then(res => {
        if (res.code === 0) {
          if (res.result.data.length > 0) {
            // 处理图片地址
            res.result.data.forEach(item => {
              this.$set(item, 'curIndex', 1)
              let dateArr = item.createTime.split(' ')[0].split('-') // 找到年月设置属性，方便渲染
              if (item.imgUrl) {
                item.imgUrl = item.imgUrl.split(',')
              }
              if (item.forwardCasualLook) {
                // 处理转发图片地址
                item.forwardCasualLook.imgUrl = item.forwardCasualLook.imgUrl.split(',')
              }
              item.createYear = dateArr[0]
              item.createMonth = dateArr[1]
              this.trasLookList[item.createYear + '-' + item.createMonth] = {
                year: item.createYear,
                month: item.createMonth,
                data: []
              }
            })
            this.initDataList(res.result.data)
            this.lookAroundCount = res.result.currentCount
            if (this.lookAroundPage === 1) {
              this.trasLookList = []
              this.trasLookList = res.result.data
              this.lookAroundPage = 2
            } else {
              this.trasLookList = this.trasLookList.concat(res.result.data)
              this.lookAroundPage++
            }
          }
        }
      })
    },
    initDataList (data) {
      data.forEach(item => {
        this.trasLookList[item.createYear + '-' + item.createMonth].data.push(item)
      })
    },
    getPartnerList () { // 约伴列表
      this.$http.post(this.API.partnerList, {
        data: {
          currentPage: this.partnerPage,
          pageSize: 5,
          customerId: this.id,
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach((item) => {
            item.typeImgUrl = item.typeImgUrl.split(',')[0]
          })
          this.partnerCount = res.result.currentCount
          if (this.partnerPage === 1) {
            this.partnerList = []
            this.partnerList = res.result.data
            this.partnerPage = 2
          } else {
            this.partnerList = this.partnerList.concat(res.result.data)
            this.partnerPage++
          }
        }
      })
    },
    toggleTab(index) {
      this.tabActive = index
      this.showNoneList = false
      if (index === 0) {
        this.getGuideList()
      }
      if (index === 1) {
        this.travelsPage = 1
        this.trasNoteList = []
        this.getTrasNoteList()
      }
      if (index === 2) {
        this.lookAroundPage = 1
        this.trasLookList = []
        this.getLookAroundList()
      }
      if (index === 3) {
        this.partnerPage = 1
        this.partnerList = []
        this.getPartnerList()
      }
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
        }
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
        }
      })
    },
    traNotelikeEvt(item) {
      let type = item.isLike === 0 ? 1 : 2
      this.$http.post(this.API.travelNoteLike, {
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
        }
      })
    },
    swiperChange(e, item) {
      item.curIndex = e.mp.detail.current + 1
    },
    goForward (item) {
      wx.navigateTo({
        url: `/pages/daren/lookForward/main?id=${item.id}`
      })
    },
    goLookAroundDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/lookAroundDetail/main?id=${item.id}&type=1`
      })
    },
    goPartnerDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/partnerDetail/main?id=${item.id}&type=1&urlIndex=0`
      })
    },
    goTrasForward (item, type) {
      if (type === 1) { // 首次转发
        wx.navigateTo({
          url: `/pages/daren/forward/main?id=${item.id}`
        })
      }
      if (type === 2) { // 二次以上转发
        wx.navigateTo({
          url: `/pages/daren/forward/main?id=${item.forwardTravelNote.id}`
        })
      }
    }
  },
  components: {
    wxParse
  }
}
</script>
<style lang="scss" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
 .banner-img{
   height: 240rpx;
   width: 100%;
   display: block;
   filter: blur(10rpx);
 }
 .none-list{
   text-align: center;
   color: #acacac;
   font-size: 24rpx; 
   margin-top: 40rpx;
   margin-bottom: 40rpx; 
 }
 .empty-box{
   text-align: center;
   width: 100%;
  margin-top: 80rpx;
  margin-bottom: 80rpx;
   .empty-icon{
    width: 475rpx;
    height: 244rpx;
    background: url('../../../../static/images/travelPerson/empty.png');
    background-size: 475rpx 244rpx;
    display: inline-block;
    vertical-align: middle;
    margin: 0 auto;
  }
  p{
    color: #acacac;
    font-size: 24rpx; 
    margin-top: 40rpx;
  }
 }
 
 .personal-info{
   background: #fff;
   position: relative;
   padding: 90rpx 30rpx 50rpx 30rpx;
   .header-img{
    position: absolute;
    top: -75rpx;
    width: 150rpx;
    height: 150rpx;
    left: 50%;
    margin-left: -75rpx;
    background: #fff;
    border-radius: 50%;
    img{
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      margin:6rpx;
    }
   }
   .name{
     text-align: center;
     font-size: 34rpx;
   }
   .follow{
     margin:10rpx;
     span{
       display: inline-block;
       width: 50%;
       text-align: center;
       font-size: 28rpx;
       color: #333333;
       .col{
         color: #388ef8;
         margin-left: 20rpx;
         display: inline-block;
       }
     }
   }
   .title{
    color: #666;
    font-size: 26rpx;
    margin-top: 30rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: center;
   }
   .introduce{
     font-size: 26rpx;
     text-align: center;
     margin-top: 30rpx;
     .line{
       margin: 0 30rpx;
     }
   }
   .story{
     color: #fbb03b;
     font-size: 30rpx;
     text-align: center;
     margin-top: 20rpx;
   }
 }
 .service-type{
   margin-top: 20rpx;
   padding-top:50rpx;
   background: #fff;
   .title{
     padding: 0 30rpx;
     font-size: 34rpx;
   }
   .service-item{
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40rpx;
    div {
      width: 50%;
      text-align: center;
      font-size: 22rpx;
      margin-top: 40rpx;
      .darenicon{
        width: 82rpx;
        height: 70rpx;
        background: url('../../../../static/images/darenIndex.png');
        background-size: 320rpx 100rpx;
        display: inline-block;
        vertical-align: middle;
      }
      .xdpy{
        background-position: 0 0;
      }
      .xdzx-icon{
        background-position: -84rpx 0;
      }
      // img {
      //   width: 82rpx;
      //   height: 82rpx;
      // }
    }
  }
 }
 .icon{
  background: url('../../../../static/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 20rpx;
  height: 35rpx;
  display: inline-block;
  vertical-align: middle;
}
.icon2{
  background: url('../../../../static/images/darenIndex.png');
  background-size: 320rpx 100rpx;
  width: 33rpx;
  height: 31rpx;
  display: inline-block;
  vertical-align: middle;
}
.column-item{
  font-size: 34rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: #fff;
  padding: 0 30rpx;
  position: relative;
  border-bottom: 1rpx solid #dcdcdc;
  .right-icon{
    background-position: -146rpx -12rpx;
    position: absolute;
    right: 30rpx;
    top: 30rpx;
  }
  .center-txt{
    display:inline-block;
    font-size: 32rpx;
    color: #666666;
    margin-left: 50rpx;
  }
}
.mt20{
  margin-top:20rpx;
}
.bor-none{
  border-bottom: none;
}
.guide-box{
  background: #fff;
  padding: 1rpx 0;
  margin-top: 20rpx;
  .title{
    margin-top: 20rpx;
    border-bottom: 1rpx solid #dcdcdc;
    padding: 0 30rpx;
    span{
      width: 25%;
      height: 60rpx;
      display: inline-block;
      color: #666666;
      text-align: center;
      line-height: 60rpx;
      font-size: 32rpx;
    }
    span.active{
      border-bottom: 6rpx solid #fbb03b;
      color:#000;
    }
    span:last-child{
      margin-right: 0;
    }
  }
}
.suc-icon{
    background-position: -2rpx -70rpx;
  }
.suc-icon.none{
  background-position: -39rpx -70rpx;
}
.close-icon{
  position: absolute;
  right: 30rpx;
  top: 20rpx;
  width: 34rpx;
  height: 33rpx;
  background-position: -80rpx -70rpx;
}
.bg-white{
  background: #fff;
  padding: 1rpx;
}
.goods-card{
  display: flex;
  flex-wrap: wrap;
  padding: 0 30rpx;
  background: #fff;
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
      img{
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
      margin-left: 10rpx;
      span{
        display: inline-block;
        width: 150rpx;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        border: 1rpx solid #ff9913;
        margin-right: 8rpx;
        font-size: 20rpx;
        color: #ff9913;
      }
      // span:nth-child(1){
      //   margin-left: 8rpx;
      // }
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
.msg-info{
  font-size: 22rpx;
  color: #666;
  margin-top: 20rpx;
}
.location-icon, .follow-icon, .msg-icon, .see-icon{
  width: 32rpx;
  height: 30rpx;
  background-position: 0 -62rpx;
  margin-right: 8rpx;
}
.detail-mask {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  font-size: 28rpx;
  color: #666;
  background: #fff;
  z-index: 999999;
  li {
    height: 81rpx;
    line-height: 81rpx;
    padding: 0 30rpx;
    .right {
      float: right;
      color: #f65631;
      margin-right: 30rpx;
    }
  }
  li:last-child {
    border-bottom: none;
  }
  .title {
    font-size: 32rpx;
    text-align: center;
    height: 88rpx;
    text-align: center;
    position: relative;
  }
  .sec-title{
    color: #333333;
    font-size: 28rpx;
  }
}
.dialog-mask {
  position: fixed;
  bottom: 350rpx;
  left: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
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
.partner-box, .travels-box{
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
.travels-box, .travels-box2{
  background: #fff;
  padding: 50rpx 30rpx;
  margin-top: 20rpx;
  position: relative;
  .title, .title2{
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
    right: 30rpx;
    top: 50rpx;
    color: #388ef8;
    font-size: 30rpx;
  }
  .location-icon, .follow-icon, .msg-icon, .forward-icon{
    width: 32rpx;
    height: 32rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
  }
  .follow-icon{
    background-position: -19rpx -55rpx;
    &.active {
      width: 25rpx;
      height: 25rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .msg-icon{
    background-position: -51rpx -55rpx;
  }
  .forward-icon{
    background-position: -80rpx -54rpx;
  }
  .follow-btn{
    border: 1rpx solid #ff9913;
    border-radius: 30rpx;
    color: #ff9913;
    width: 120rpx;
    height: 50rpx;
    display: inline-block;
    text-align: center;
    line-height: 50rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
    &.gray {
      border-color: #999;
      color: #999;
    }
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .left{
      width: 50%;
      height: 160rpx;
      .title{
        font-size: 30rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        .author{
          display: inline-block;
          color: deepskyblue;
        }
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
  .msg-info, .msg-info2{
    font-size: 22rpx;
    color: #666;
    margin-top: 20rpx;
  }
  .follow{
    margin-left: 60rpx;
  }
  .msg-mod{
    margin-left: 60rpx;
  }
  .follow-btn{
    margin-left: 80rpx;
  }
}
.travels-box2{
  padding:0;
  padding-top: 25rpx;
  .title2{
    padding:0 30rpx;
  }
  .forwardTxt{
    padding: 30rpx;
  }
  .main-box{
    background: #f4f4f4;
    padding: 25rpx 30rpx;
    margin-top: 0;
    .left{
      height: 145rpx;
    }
    .right-img{
      top: 25rpx;
      right: 30rpx;
    }
  }
  .msg-info2{
    padding: 10rpx 30rpx 30rpx 30rpx;
    display: flex;
    .location, .follow, .msg-mod{
      flex-grow: 1;
    }
    .location{
      .forward-icon{
        transform:scale(1.2);
      }
    }
    .follow{
      text-align: right;
      .follow-icon{
        transform:scale(1.2);
      }
    }
    .msg-mod{
      text-align: center;
      .msg-icon{
        transform:scale(1.2);
      }
    }
  }
  .follow-icon{
    &.active {
      width: 35rpx;
      height: 40rpx;
    }
  }
}
.look-around-box{
  background: #fff;
  padding: 50rpx 30rpx 0 30rpx;
  margin-top: 20rpx;
  position: relative;
  swiper {
    height: 460rpx;
  }
  .indicator-wrap {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    color: #fff;
    background-color: rgba(0, 0, 0, .4);
    -webkit-border-radius: 30rpx;
    -moz-border-radius: 30rpx;
    border-radius: 30rpx;
    line-height: 1;
    padding: 10rpx 20rpx;
  }
  .forwardCasualLook-wrap.look-around-box {
    margin: 0 -30rpx;
    background-color: #f4f4f4;
    padding: 10rpx 30rpx 0 30rpx;
    overflow: hidden;
    .social-box {
      display: flex;
      text-align: right;
      justify-content: right;
      padding: 0;
      float: right;
      height: auto;
      border-top: 0;
      .social-item {
        width: 160rpx;
        text-align: right;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 1;
        padding: 20rpx;
      }
    }
  }
  .forwardContent-text {
    padding: 30rpx 0;
  }
  .img-pic-flex {
    position: relative;
    width: 100%;
    flex-wrap: wrap;
    padding: 0 10rpx;
    .img {
      width: 100%;
      height: 460rpx;
    }
  }
  .img-box{
    display: flex;
    padding: 20rpx 0;
    position: relative;
    margin: 20rpx -5px 0;
    overflow: hidden;
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
  .title{
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
    right: 30rpx;
    top: 50rpx;
    color: #388ef8;
    font-size: 30rpx;
  }
  .location-icon, .follow-icon, .msg-icon, .see-icon{
    width: 20rpx;
    height: 20rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
    margin-top: -6rpx;
  }
  .follow-icon{
    background-position: -19rpx -58rpx;
    &.active {
      width: 32rpx;
      height: 35rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .msg-icon{
    background-position: -50rpx -59rpx;
  }
  .see-icon{
    background-position: -75rpx -63rpx;
    width: 25rpx;
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
  .social-box{
    height: 98rpx;
    line-height: 98rpx;
    border-top: 1rpx solid #dcdcdc;
    display: flex;
    box-sizing: border-box;
    padding: 0 60rpx;
    justify-content:space-between;
    .social-item{
      width: 33.333%;
      font-size: 28rpx;
      color: #666666;
      background: transparent;
      padding: 0;
      line-height: 98rpx;
      text-align: center;
      .zf-icon{
        background-position: -83rpx -57rpx;
        width: 33rpx;
        height: 33rpx;
        margin-right: 15rpx;
      }
      .dz-icon{
        background-position: -19rpx -58rpx;
        width: 33rpx;
        height: 33rpx;
        margin-right: 15rpx;
        vertical-align: middle;
        &.active {
          width: 33rpx;
          height: 33rpx;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
          background-size: 100%;
        }
      }
      .pl-icon{
        background-position: -50rpx -59rpx;
        width: 35rpx;
        height: 33rpx;
        margin-right: 15rpx;
      }
      &:last-child {
        text-align: right;
      }
      &:first-child {
        text-align: left;
      }
    }
    button.social-item {
      text-align: left;
    }
    button.social-item::after {
      display: none;
    }
  }
}
.travels-box:nth-child(1), .look-around-box:nth-child(1), .partner-box:nth-child(1){
  margin-top: 0;
}
</style>