<template>
    <div>
      <div class="select-main">
        <ul class="tab">
          <li @click="toogleTab(0)" :class="{'active': tabActive === 0}">查看最新</li>
          <li @click="toogleTab(1)" :class="{'active': tabActive === 1}">查看最近</li>
          <li @click="toogleTab(2)" :class="{'active': tabActive === 2}">我的</li>
        </ul>
      </div>
      <div class="page-wrap">
        <div v-if="tabActive === 0 || tabActive === 1">
          <div class="look-around-box" @click="goDetail(item)" v-for="(item, index) in dataList" :key="index">
            <div v-if="item.forwardCasualLook" >
              <!-- 转发 -->
              <div class="title">
                <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" @click.stop="goPersonIndex(item)">
                <div class="name-box"  @click.stop="goPersonIndex(item)">
                  <p class="name">{{item.nickName}}</p>
                  <p class="data">{{item.createTimeStr}}</p>
                </div>
              </div>
              <div class="right'"  v-if="customerId !== item.customerId"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
              <div class="main forwardContent-text">
                <wxParse :content="item.forwardContent" @navigate="navigate" />
              </div>
              <div class="look-around-box forwardCasualLook-wrap">
                <div class="img-box">
                  <!--<div class="img-pic-flex" v-if="item.forwardCasualLook.imgUrl.length <= 2">
                    <image mode="aspectFill" class="img" :src="item.urlPrefix + url" v-for="(url, uIndex) in  item.forwardCasualLook.imgUrl" :key="uIndex"></image>
                  </div>
                  <template v-else>
                    <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[0]" class="img1" ></image>
                    <div class="right-img">
                      <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[1]" class="img2"></image>
                      <image mode="aspectFill" :src="item.urlPrefix + item.forwardCasualLook.imgUrl[2]" class="img3"></image>
                    </div>
                  </template>-->
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
                  <!-- <div class="fr" style="float: right">
                    <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
                    <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
                  </div> -->
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
                 <!-- <span>{{item.forwardNum}}</span> -->
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
                <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" class="header-img" @click.stop="goPersonIndex(item)">
                <div class="name-box" @click.stop="goPersonIndex(item)">
                  <p class="name">{{item.nickName}}</p>
                  <p class="data">{{item.createTimeStr}}</p>
                </div>
              </div>
              <div class="right'" v-if="customerId !== item.customerId"><span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span></div>
              <div class="img-box">
                <!--<div class="img-pic-flex" v-if="item.imgUrl.length <= 2">
                  <image mode="aspectFill" class="img" :src="item.urlPrefix + url" v-for="(url, uIndex) in  item.imgUrl" :key="uIndex"></image>
                </div>
                <template v-else>
                  <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[0]" class="img1" ></image>
                  <div class="right-img">
                    <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[1]" class="img2"></image>
                    <image mode="aspectFill" :src="item.urlPrefix + item.imgUrl[2]" class="img3"></image>
                  </div>
                </template>-->
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
                <!-- <div class="fr" style="float: right">
                  <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
                  <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
                </div> -->
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
        </div>
        <div v-if="tabActive === 2">
          <div class="my-look-around-box"  v-for="(date, key, dateIndex) in dateList" :key="key">
            <p class="date">
              <span class="year">{{date.year}}年</span>
              <span class="calendar">
              <i class="calendar-icon">{{date.month}}</i>
            </span>
            </p>
            <div class="my-look-around-item look-around-box" @click="goDetail(item)" v-for="(item, index) in dateList[key].data" :key = index>
              <div class="title">
                <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" alt="" class="header-img"  mode='aspectFill' @click.stop="goPersonIndex(item)">
                <div class="name-box" @click.stop="goPersonIndex(item)">
                  <p class="name">{{item.nickName}}</p>
                  <p class="data">{{item.createTime}}</p>
                </div>
              </div>
              <div class="right'"><span class="follow-btn" @click.stop="deleteAround(item)">删除</span></div>
              <div class="main forwardContent-text" v-if="item.forwardCasualLook">
                <wxParse :content="item.forwardContent" @navigate="navigate"/>
              </div>
              <div class="look-around-box forwardCasualLook-wrap" v-if="item.forwardCasualLook">
                <div class="img-pic-flex"style="padding: 20rpx 0">
                  <swiper @animationfinish="swiperChange($event, item)">
                    <swiper-item v-for="(url, uIndex) in  item.forwardCasualLook.imgUrl" :key="uIndex">
                      <image mode="aspectFill" class="img" :src="item.urlPrefix + url"></image>
                    </swiper-item>
                  </swiper>
                  <div class="indicator-wrap">{{item.curIndex}} / {{item.forwardCasualLook.imgUrl.length}}</div>
                </div>
                <div class="main">
                  <wxParse :content="item.forwardCasualLook.content" @navigate="navigate"/>
                </div>
                <div class="msg-info" style="padding-bottom: 30rpx;">
                  <span class="location"><i class="icon location-icon"></i>{{item.forwardCasualLook.address}}</span>
                  <span class="msg" ><i class="icon msg-icon"></i>{{item.forwardCasualLook.commentNum}}<span class="newNum" v-if="item.forwardCasualLook.newCommentNum > 0">+{{item.forwardCasualLook.newCommentNum}}</span></span>
                  <span class="follow" style="margin-left: 160rpx;"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}<span class="newNum" v-if="item.newLikeNum > 0">+{{item.newLikeNum}}</span></span>
                </div>
              </div>
              <div class="msg-info" v-if="item.forwardCasualLook">
                <span class="location"><i class="icon location-icon"></i>{{item.address}}</span>
                <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}<span class="newNum" v-if="item.newCommentNum > 0">+{{item.newCommentNum}}</span></span>
                <span class="follow" style="margin-left: 160rpx;" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}<span class="newNum" v-if="item.newLikeNum > 0">+{{item.newLikeNum}}</span></span>
              </div>
              <div v-else>
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
                  <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}<span class="newNum" v-if="item.newCommentNum > 0">+{{item.newCommentNum}}</span></span>
                  <span class="follow" style="margin-left: 160rpx;" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}<span class="newNum" v-if="item.newLikeNum > 0">+{{item.newLikeNum}}</span></span>
                </div>
              </div>
            </div>
            <!-- <div class="social-box">
              <div class="social-item">
                <i class="icon zf-icon"></i>
                <span>20</span>
              </div>
              <div class="social-item">
                <i class="icon pl-icon"></i>
                <span>28</span>
              </div>
              <div class="social-item">
                <i class="icon dz-icon"></i>
                <span>30</span>
              </div>
            </div> -->
          </div>
        </div>
        <empty :list = listItems ></empty>
      </div>
      <a href="/pages/daren/addLookArround/main" class="look-btn"></a>
      <!-- 表情 -->
      <!-- <span v-for="(item, index) in emojiData" :key = index @click="selemoji(index)">
        {{item}}
      </span> -->
    </div>
</template>
<script>
// import Utils from '../../../utils/util'
import empty from '@/components/common/empty'
import emoji from '../../../../static/js/emoji'
import wxParse from 'mpvue-wxparse'
export default {
  data () {
    return {
      customerId: '',
      page: 1, // 当前分页
      count: 1,
      tabActive: 0,
      dataList: [], // 最近，最新数据
      dateList: {}, // 日期数组
      emojiData: [],
      listItems: [],
      userLogo: require('../../../../static/images/common/userlogo.png'),
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onLoad (options) {
    this.tabActive = typeof options.tab !== 'undefined' ? parseInt(options.tab) : 0
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.latitude = res.latitude
        this.longitude = res.longitude

        this.getList()
      },
      fail: function (res) {
        // 未开启定位权限，拉起授权
        if (res.errMsg === 'getLocation:fail auth deny') {
          // 重新拉起授权
          wx.openSetting({
            success: function (res) {
              if (res.authSetting['scope.userLocation'] === false) {
                wx.showModal({
                  title: '提示',
                  content: '您未开启定位权限!',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '您已开启定位权限，请重新点击登录',
                  showCancel: false
                })
              }
            }
          })
        }
      }
    })
  },
  onShow () {
    this.customerId = parseInt(wx.getStorageSync('customerId'))
    this.page = 1
    this.dataList = []
    this.dateList = {}
    if (this.latitude && this.longitude) {
      this.getList()
    }
    this.initEmoji()
  },
  onReachBottom() {
    if (this.page >= this.count) {
      console.log('数据加载完了')
    } else {
      this.getList()
    }
  },
  components: {
    empty,
    wxParse
  },
  methods: {
    goForward (item) {
      wx.navigateTo({
        url: `/pages/daren/lookForward/main?id=${item.id}`
      })
    },
    selemoji (index) {
      console.log(index)
    },
    initEmoji () {
      this.emojiData.push(emoji[3])
      this.emojiData.push(emoji[49])
      this.emojiData.push(emoji[33])
      this.emojiData.push(emoji[52])
    },
    toogleTab (index) {
      this.page = 1
      this.tabActive = index
      this.dataList = []
      this.dateList = {}
      this.getList()
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
          item.photoList = res.result
          this.dataList.splice(0, 0)
        }
      })
    },
    followEvt (item) {
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
          if (like === 1) {
            text = '关注成功'
          } else {
            text = '取消成功'
          }
          // 找到所有列表中被关注人的id, 批量设置
          this.dataList.forEach(data => {
            if (item.customerId === data.customerId) {
              data.isFollow = like
            }
          })
          wx.showToast({title: text})
          this.dataList.splice(0, 0)
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    deleteAround (item) {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            self.$http.post(self.API.delCasualLook, {
              data: {
                id: item.id
              }
            }).then(res => {
              if (res.code === 0) {
                wx.showToast({title: '删除成功'})
                setTimeout(() => {
                  self.page = 1
                  self.dateList = {}
                  self.getList()
                }, 1000)
              }
            })
          }
        }
      })
    },
    swiperChange(e, item) {
      item.curIndex = e.mp.detail.current + 1
    },
    getList () {
      let params = {
        currentPage: this.page,
        pageSize: 10,
        type: this.tabActive
      }
      params.longitude = this.longitude
      params.latitude = this.latitude
      let url = this.API.casualLookList
      if (this.tabActive === 2) {
        url = this.API.myCasualLookList
      }
      this.$http.post(url, {
        data: params
      }).then(res => {
        if (res.code === 0) {
          this.count = res.result.currentCount
          if (res.result.data.length > 0) {
            this.page++
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
              this.dateList[item.createYear + '-' + item.createMonth] = {
                year: item.createYear,
                month: item.createMonth,
                data: []
              }
              // 过滤时间
              // item.createTime = Utils.timestampFormat(item.createTime)
            })
            this.initDataList(res.result.data)
            this.dataList = this.dataList.concat(res.result.data)
            console.log('this.dataList', this.dataList)
            if (this.tabActive === 0 || this.tabActive === 1) {
              this.listItems = this.dataList
            } else {
              this.listItems = Object.keys(this.dateList)
            }
          }
        }
      })
    },
    navigate(href, e) {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${href}`
      })
    },
    initDataList (data) {
      data.forEach(item => {
        this.dateList[item.createYear + '-' + item.createMonth].data.push(item)
      })
    },
    goDetail (item) {
      let urlStr = `&longitude=${this.longitude}&latitude=${this.latitude}`
      let type = this.tabActive
      wx.navigateTo({
        url: `/pages/daren/lookAroundDetail/main?id=${item.id}&type=${type}${urlStr}`
      })
    },
    goPersonIndex (item) {
      if (item.talentStatus === 2) {
        wx.navigateTo({
          url: `/pages/daren/darenIndex/main?id=${item.customerId}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/meInfo/meIndex/main?id=${item.customerId}`
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
.select-main{
  padding: 0 30rpx 0 30rpx;
  background: #fff;
  font-size: 28rpx;
  position: relative;
  .tab{
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 89rpx;
    line-height: 89rpx;
    justify-content: space-between;
    z-index: 999;
    background-color: #fff;
    li{
      width: 33%;
      text-align: center;
    }
    li.active{
      border-bottom: 5rpx solid #ff9913;
    }
  }
}
.look-around-box{
  background: #fff;
  padding: 50rpx 30rpx 0 30rpx;
  margin-top: 20rpx;
  position: relative;
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
}
.my-look-around-box{
  .date{
    margin: 30rpx;
    position: relative;
    .year{
      font-size: 36rpx;
    }
    .calendar{
      position: absolute;
      right: 0 ;
      top: 10rpx;
    }
    .calendar-icon{
      background: url('../../../../static/images/travelPerson/guide.png');
      background-size: 200rpx 200rpx;
      display: inline-block;
      vertical-align: middle;
      width: 38rpx;
      height: 38rpx;
      background-position: 0 -147rpx;
      text-align: center;
      font-size: 24rpx;
      padding-top: 2px;

    }
  }
}
.my-look-around-item{
  background: #fff;
  padding: 30rpx;
  margin: 20rpx;
  position: relative;
  border-radius: 10rpx;
  .img-box{
    background-color:#fff;
    position: relative;
    margin-top: 20rpx;
    padding: 0;
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
    .follow{
      float: right;
      margin-right: 15rpx;
    }
    .msg{
      float: right;
      margin-right: 5rpx;
    }
  }
  .title{
    color: #333333;
    font-size: 30rpx;
    position: relative;
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
  .location-icon, .follow-icon, .msg-icon{
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
  .follow-icon, .msg-icon, .see-icon{
    width: 33rpx;
    height: 30rpx;
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
swiper {
  height: 460rpx;
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
.page-wrap {
  padding-top: 89rpx;
}
.look-btn {
  position: fixed;
  bottom: 100rpx;
  right: 60rpx;
  width: 100rpx;
  height: 100rpx;
  background: url('../../../../static/images/common/causelook_btn.png');
  background-size: 100%;
  z-index: 999;
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
</style>
