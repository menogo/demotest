<template>
    <div class="page">
      <div class="banner">
        <swiper class="swiper"  interval="3000" duration="1000" :indicator-dots= false  autoplay="true" @change="bannerImgIndex($event)">
          <block v-for="(item, index) in bannerList"  :key="index" >
              <swiper-item>
                  <image :src="item" class="banner-img"/>
              </swiper-item>
          </block>
        </swiper>
        <div class="po-bot">
          <span class="title">达人陪游</span>
          <p class="current-img">
            <i class="current-icon"></i>
            <span>{{bannerImgNum}}/{{bannerList.length}}</span>
          </p>
        </div>
      </div>
      <div class="title-msg">
        <p class="travel-title">{{guideDetail.productName}}</p>
        <div class="card-type">
          <span v-for="(item, index) in labList" :key = index>{{item}}</span>
        </div>
        <p class="msg-box">
          <span class="symbol">￥</span>
          <span class="price">{{guideDetail.price}}</span><span>/人起</span>
          <span class="mark">{{guideDetail.score}}分</span>
        </p>
      </div>
      <!-- 出发日期 -->
      <div class="team-date">
          <p class="title">
            <span>选择日期</span>
          </p>
          <div class="flex">
            <div v-for="(item, index) in stockList" :key = index   @click="goTraBuy(item, index)" :class="{'active': index === teamDayActive}">
              <span>{{item.showTeamDate}}</span>
              <span>￥{{item.price}}</span>
            </div>
            <div  @click="goTraBuy()">
              <span>选择更多</span>
              <span>出发日期</span>
            </div>
          </div>
      </div>
      <!-- 向导名字 -->
       <!-- @click="goDarenIndex" -->
      <div class="travels-name" @click="goDarenIndex" >
        <img :src="darenDetail.photo" alt="" class="header-img">
        <div class="right">
          <p>
            <span class="name">{{darenDetail.realName || darenDetail.nickName}}</span>
            <!-- <span class="score">4.8分</span> -->
          </p>
          <p class="msg">
            <span>从业{{workTime}}</span>
            <span class="line">|</span>
            <span>已实名认证</span>
            <!-- <span class="line">|</span>
            <span><span class="comment">{{darenDetail.}}</span>条评论</span> -->
          </p>
          <p class="main">{{darenDetail.remark}}</p>
        </div>
      </div>
      <!-- 评论 -->
      <!-- <div class="comment-box">
        <p class="title">
          <span>游客点评</span>
          <span v-if="commentData.commentCount">({{commentData.commentCount}})</span>
          <i class="icon right-icon comment"></i>
          <span class="more" @click="toComment">查看全部</span>
        </p>
        <ul class="comment-list" v-if="commentData.commentCount >= 1">
          <li v-for="(item, index) in commentDataList" :key = index>
            <img :src="urlPrefix + item.photo" class="head-img" v-if="item.photo">
            <img :src="userlogo" width="28" height="28"  class="head-img" v-else>
            <span class="name">{{item.mobile}}</span>
            <p class="detail">{{item.content}}</p>
          </li>
        </ul>
      </div> -->
      <!-- 列表栏 -->
      <!-- <ul class="detail-nav">
        <li @click="changeTabList(0)" :class="{'active': 0 === currentTabList}">服务特色</li>
        <li @click="changeTabList(1)" :class="{'active': 1 === currentTabList }">服务说明</li>
        <li @click="changeTabList(2)" :class="{'active': 2 === currentTabList }">费用说明</li>
        <li @click="changeTabList(3)" :class="{'active': 3 === currentTabList }">预订须知</li>
      </ul> -->
      <div class="mt20">
        <!-- 服务特色 -->
        <div class="service-feature" v-if="guideDetail.serviceSpecial">
          <p class="title">服务特色</p>
          <p class="main">{{guideDetail.serviceSpecial}}</p>
        </div>
        <!-- 服务说明 -->
        <div class="service-explain" v-if="guideDetail.serviceDesc">
          <p class="title">服务说明</p>
          <p class="main">{{guideDetail.serviceDesc}}</p>
        </div>
        <!-- 费用说明 -->
        <div class="service-explain"  v-if="guideDetail.costDesc">
          <p class="title">费用说明</p>
          <p class="main">{{guideDetail.costDesc}}</p>
        </div>
        <!-- 预订须知 -->
        <div class="service-explain" v-if="guideDetail.reserveDesc">
          <p class="title">预订须知</p>
          <p class="main">{{guideDetail.reserveDesc}}</p>
        </div>
      </div>
      
      <div class="footer">
          <!-- <p class="follow">
            <i class="icon sc-icon"></i>
            <span>收藏</span>
          </p> -->
          <!-- <div class="seek">在线咨询</div> -->
          <div class="buy" @click="goTraBuy()">立即预订</div>
      </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      id: '',
      teamDayActive: 0,
      guideDetail: '',
      talentId: '', // 达人id
      stockList: [],
      darenDetail: '',
      workTime: '',
      labList: [], // 亮点
      bannerImgNum: 1,
      currentTabList: 0, // 当前tabList
      bannerList: [],
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow () {
    this.bannerList = []
    this.stockList = []
    this.getGuideDetail()
  },
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/daren/guideDetail/main?id=${this.id}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  methods: {
    getGuideDetail () {
      this.$http.post(this.API.guideDetail, {
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 0) {
          this.guideDetail = res.result
          let urlPrefix = res.result.urlPrefix
          this.labList = this.guideDetail.productLabel.split(',')
          if (this.guideDetail.stockList.length >= 4) {
            this.guideDetail.stockList.length = 4
          }
          this.guideDetail.stockList.forEach((item) => {
            this.stockList.push({
              'showTeamDate': dayjs(item.teamDate).format('MM/DD'),
              'teamDate': dayjs(item.teamDate).format('YYYY-MM-DD'),
              'price': item.price,
              'id': item.id
            })
          })
          console.log(this.stockList, 'this.stockList')
          this.guideDetail.productUrl = this.guideDetail.productUrl.split(',')
          this.guideDetail.productUrl.forEach((item) => {
            this.bannerList.push(`${urlPrefix}${item}`)
          })
          this.talentId = this.guideDetail.talentId
          this.getDarenDetail(this.talentId)
        }
      })
    },
    getDarenDetail(talentId) {
      this.$http.post(this.API.darenDetail, {
        data: {
          id: talentId
        }
      }).then(res => {
        if (res.code === 0) {
          this.darenDetail = res.result
          this.darenDetail.photo = `${this.darenDetail.urlPrefix}${this.darenDetail.photo}`
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
        }
      })
    },
    changeTabList (index) {
      this.currentTabList = index
    },
    bannerImgIndex  (res) {
      this.bannerImgNum = res.mp.detail.current + 1
    },
    goDarenIndex () {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${this.talentId}`
      })
    },
    // 跳转旅游下单页
    goTraBuy (item, index) {
      let initSelectDay = ''
      if (item) {
        console.log(item)
        initSelectDay = item
        this.teamDayActive = index
      }
      let data = { // 订单页需要用到的数据
        productName: this.guideDetail.productName,
        destination: this.guideDetail.destination, // 出发地
        stockList: this.guideDetail.stockList, // 日期价格
        initSelect: initSelectDay // 选中的日期价格
      }
      wx.setStorageSync('orderNeedData', data)
      wx.navigateTo({
        url: `/pages/daren/guidePay/main`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  padding-bottom: 98rpx;
}
.banner{
  position: relative;
  .swiper{
    height: 420rpx;
  }
  .banner-img{
    width: 100%;
    height: 420rpx;
  }
  .po-bot{
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 55rpx;
    .title{
      color: #fff;
      font-size: 24rpx;
      margin-left: 30rpx;
    }
  }
  .current-img {
    position: absolute;
    color: #fff;
    font-size: 20rpx;
    right: 30rpx;
    bottom: 15rpx;
    background-color: rgba(0,0,0,0.8);
    width: 80rpx;
    height: 32rpx;
    line-height: 32rpx;
    vertical-align: top;
    border-radius: 30rpx;
    opacity: 0.4;
    i{
      background: url('../../../../static/images/travelDetail.png');
      background-size: 300rpx 150rpx;
      background-position: -144rpx -3rpx;
      width: 20rpx;
      height: 20rpx;
      display: inline-block;
      margin-left: 12rpx;
    }
  }
}
.title-msg{
  padding: 30rpx;
  color: #353535;
  background: #fff;
  .travel-title{
    font-size: 32rpx;
    font-weight: bold;
    line-height: 40rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .msg-box{
    margin-top: 10rpx;
    font-size: 20rpx;
    color: #888;
    .symbol{
      color: #f65631;
    }
    .price{
      color: #f65631;
      font-size: 36rpx;
    }
    .mark{
      color: #ff9913;
      font-size: 22rpx;
      float: right;
      margin-right: 25rpx;
      margin-top: 10rpx;
    }
  }
  .card-type{
    span{
      width: 155rpx;
      height: 36rpx;
      line-height: 36rpx;
      border: solid 1rpx #388ef8;
      font-size: 22rpx;
      color: #388ef8;
      margin-right: 15rpx;
      display: inline-block;
      text-align: center;
    }
  }
}
.team-date{
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
  .title{
    font-size: 32rpx;
  }
  .flex{
    margin-top: 30rpx;
    display: flex;
    div {
      width:128rpx;
      height:85rpx;
      border: 1rpx solid #dcdcdc;
      border-radius: 5rpx;
      margin-right: 10rpx;
      text-align: center;
      padding-top: 15rpx;
      span{
        display: block;
        font-size:22rpx;
        color: #353535;
      }
      span:last-child{
        color: #ff9913;
      }
    }
    div.active{
      border: 1rpx solid #ff9913;
    }
    div:last-child{
      margin-right: 0;
      span{
        color: #ff9913;
      }
    }
  }
}
.mt20{
  margin-top: 20rpx;
}
.travels-name{
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  .header-img{
    width: 160rpx;
    height: 160rpx;
    display: inline-block;
    border-radius: 50%;
    vertical-align: top;
  }
  .right{
    display: inline-block;
    margin-left: 30rpx;
    font-size: 24rpx;
    width: 71%;
    .name{
      font-size: 30rpx;
    }
    .score{
      font-size: 26rpx;
      margin-left: 40rpx;
      color: #ff9913;
    }
    .msg{
      margin-top: 5rpx;
      color: #333333;
      .comment{
        color: #388ef8;
      }
      .line{
        margin: 0 25rpx;
      }
    }
    .main{
      color: #666;
      margin-top: 5rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.detail-nav{
  background: #fff;
  margin-top: 20rpx;
  padding: 15rpx 30rpx 0 30rpx;
  display: flex;
  height: 60rpx;
  line-height: 60rpx;
  justify-content: space-between;
  color: #353535;
  font-size: 30rpx;
  border-bottom: 1rpx solid #dcdcdc;
  li.active {
    color: #ff9913;
    border-bottom: 4rpx solid #ff9913;
  }
}
.service-feature, .service-explain{
  background: #fff;
  padding: 30rpx;
  .title {
    text-align: center;
    font-size: 34rpx;
    margin-bottom: 20rpx;
  }
  .main{
    font-size: 26rpx;
  }
}
.service-explain{
  margin-top: 20rpx;
}
.comment-box{
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  .title {
    font-size: 28rpx;
    padding-bottom: 30rpx;
  }
  .more{
    color: #ff9913;
    float: right;
    margin-right: 20rpx;
    font-size: 24rpx;
    // margin-top: -40rpx;
  }
  .comment-list li {
    color: #353535;
    padding-top: 30rpx;
    border-top: 1rpx solid #dcdcdc;
    .head-img {
      width: 50rpx;
      height: 50rpx;
      border-radius: 25rpx;
    }
    .name{
      font-size: 24rpx;
      vertical-align: top;
      margin-top: 10rpx;
      display: inline-block;
      margin-left: 15rpx;
    }
    .detail{
      margin-top: 10rpx;
      font-size: 22rpx;
      padding-bottom: 30rpx;
    }
  }
  .comment-list li:last-child {
    .detail{
      padding-bottom: 0;
    }
  }
}
.footer{
  display: flex;
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  font-size: 26rpx;
  color: #353535;
  border-top: 1rpx solid #dcdcdc;
  height: 98rpx;
  text-align: center;
  .icon {
    background: url('../../../../static/images/goodsDetail.png');
    width: 62rpx;
    height: 60rpx;
    display: inline-block;
    background-size: 500rpx 120rpx;
    background-position: 0 -1rpx;
  }
  .follow {
    margin-top:12rpx;
    flex-grow: 1;
    span{
      display: block;
    }
  }
  .icon{
    width: 40rpx;
    height: 40rpx;
  }
  .ke-icon{
    background-position: -51rpx -67rpx;
  }
  .sc-icon{
    background-position: -100rpx -67rpx;
  }
  .buy, .seek{
    line-height: 98rpx;
    color: #fff;
    font-size: 30rpx;
    flex-grow: 4;
    background: #f97230;
  }
  .seek{
    background: #fbb03b;
  }
}
</style>