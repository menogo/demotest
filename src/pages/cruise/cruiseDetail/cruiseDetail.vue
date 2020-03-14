<template>
  <div class="page" :class="{'body-fixed': roomMaskmoreFlightMask || peopleMask}">
    <div class="qrCode-box"  @click="createWxQrcode">
      <i class="qrCode-icon"></i>
    </div>
    <div class="banner">
      <swiper class="swiper"  interval="3000" duration="1000"  :indicator-dots= false  autoplay="true"  @change="bannerImgIndex($event)">
        <block v-for="(item, index) in bannerImgList"  :key="index" >
            <swiper-item>
                <image :src="item" class="banner-img"/>
            </swiper-item>
        </block>
      </swiper>
      <div class="po-bot">
        <p class="current-img">
          <i class="current-icon"></i>
          <span>{{bannerImgNum}}/{{bannerImgList.length}}</span>
        </p>
        <p class="travel-msg">
          <span>{{proDetails.departure}}出发</span>
          <span class="goods-code">产品编号：{{proDetails.productCode}}</span>
        </p>
      </div>
    </div>
    <div class="title-msg">
      <p class="travel-title">{{proDetails.productName}}</p>
      <p class="msg-box">
        <span class="symbol">￥</span>
        <span class="price">{{proDetails.price}}</span><span>/人起</span>
        <span class="oriPrice" v-if="proDetails.originalPrice">￥{{proDetails.originalPrice}}</span>
        <span class="num">已售{{proDetails.sellNum}}人</span>
        <span class="mark">{{proDetails.score}}分</span>
      </p>
    </div>
    <div class="cruise-info">
      <span class="title">{{cruiseInfo.cruiseName}}</span>
      <span class="right" @click="getMoreInfo">了解更多<i class="icon right-icon"></i></span>
      <div class="info">
        <span>{{cruiseInfo.tonnage}}吨</span>
        <span>载客{{cruiseInfo.maxPassenger}}人</span>
        <span>{{cruiseInfo.startTime}}年首航</span>
      </div>
    </div>
    <div class="coupon-box" @click="toogleShowTicket" v-if="couponList && couponList.length > 0">
      <p>领券
        <span class="ticket-mini ml60" v-if="couponList && couponList[0]">满{{couponList[0].useAmount}}减{{couponList[0].amount}}</span>
        <span class="ticket-mini" v-if="couponList && couponList[1]">满{{couponList[1].useAmount}}减{{couponList[1].amount}}</span>
        <i class="icon right-icon"></i>
      </p>
    </div>
    <!-- 团期 -->
    <div class="team-date">
        <p class="title">
          <!-- <i class="icon loca-icon"></i> -->
          <span>日期/价格</span>
          <!-- <i class="icon right-icon comment"></i> -->
          <span class="right">{{proDetails.departure}}出发</span>
        </p>
        <div class="flex">
          <div v-for = "(item, index) in stockDateList" :key = index :class="{'active' : stockDateActive === index}" @click="changeStockDate(item, index)">
            <span>{{item.leaveDate}}</span>
            <span>￥{{item.price}}</span>
          </div>
          <div class="clo" @click="goMoreFlight" v-if="stockDateMoreList.length >= 4">
            <span>更多</span>
            <span>航期</span>
          </div>
        </div>
    </div>
    <!-- 房间信息 -->
    <div class="room-data">
      <ul class="tab">
        <li :class="{'active': roomActive === index}" v-for="(item, index) in roomTabList" :key = index @click="changeRoomTab(item, index)">{{item.type}}</li>
      </ul>
      <div class="detail">
        <div class="room-item"  v-for="(item, index) in roomList" :key = index >
          <img :src="item.room.setImgUrl[0]" alt="" v-if = "item.room && item.room.setImgUrl && item.room.setImgUrl[0]">
          <img :src="traNoteImg" alt="" v-else>
          <div class="detail" >
            <p v-if="item.room">{{item.room.cabinType}}{{item.room.roomType}}<span class="more" @click="getRoomDetail(item)">详情<i class="icon more-icon"></i> </span> </p>
            <p v-if="item.room">
              <span>{{item.room.area}}m²</span>
              <span>{{item.room.floor}}层</span>
              <span>{{item.room.hasWindow === 1 ? '有' : '无'}}窗，{{item.room.hasBalcony === 1 ? '有' : '无'}}阳台</span>
              <span>住{{item.room.liveNum}}人</span>
            </p>
          </div>
          <div class="price">
            <p><span>￥</span><span class="money">{{item.guestAdultPrice}}</span><span class="num">/人</span> </p>
            <p @click="goCruiseBuy(item)"><span>预订</span></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <div class="comment-box"  v-if="commentData.commentCount >= 1">
      <p class="title">
        <span>用户点评</span>
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
    </div>
    <!-- 店铺信息 -->
    <div class="shop-box"   @click="toMerchant(1)">
      <div  class="shop-info" >
        <img :src="merchantData.logoImg || userlogo" alt="" class="shop-img">
        <div class="shop-msg">
          <p class="name">{{merchantData.merchantName}}</p>
          <p class="focus">商家综合得分：{{merchantData.score}}分</p>
        </div>
        <i class="icon right-icon"></i>
      </div>
      <div class="goshop-info">
        <span @click.stop="toMerchant(2)">
          <i class="icon qbbb-icon"></i>
          全部商品
        </span>
        <span @click.stop="toMerchant(1)">
          <i class="icon jdgg-icon"></i>
          进店逛逛
        </span>
      </div>
    </div>
    <ul class="detail-nav">
      <li @click="changeTabList(0)" :class="{'active': 0 === currentTabList }">详细行程</li>
      <li @click="changeTabList(1)" :class="{'active': 1 === currentTabList }">费用说明</li>
      <li @click="changeTabList(2)" :class="{'active': 2 === currentTabList }">预订须知</li>
    </ul>
    <ul class="detail-nav fix-news" v-if="tabFixTop < scrollTop">
      <li @click="changeTabList(0)" :class="{'active': 0 === currentTabList }">详细行程</li>
      <li @click="changeTabList(1)" :class="{'active': 1 === currentTabList }">费用说明</li>
      <li @click="changeTabList(2)" :class="{'active': 2 === currentTabList }">预订须知</li>
    </ul>
    <!-- 详细行程 -->
    <div class="trip-detail">
      <p class="title">详细行程</p>
      <rich-text :nodes="proDetails.itineraryInfo"  v-if="proDetails.itineraryShowType === 2"></rich-text>
      <ul class="day-box" v-for="(item, index) in itineraryList" :key="index"  v-if="proDetails.itineraryShowType === 1">
        <li>
          <label>D{{item.day}}</label>
          <span>{{item.title}}</span>
        </li>
        <li class="detail-list">
          <label><i class="icon2 xc-icon"></i></label>
          <div class="main">
            <rich-text :nodes="item.remark"></rich-text>
            </div>
        </li>
        <li class="detail-list" v-if="item.breakfastDesc || item.lunchDesc || item.lunchDesc">
          <label><i class="icon2 zc-icon"></i></label>
          <div class="main">
            <p v-if="item.breakfastDesc">早餐: {{item.breakfastDesc}}</p>
            <p v-if="item.lunchDesc">午餐: {{item.lunchDesc}}</p>
            <p v-if="item.dinnerTime"> 晚餐: {{item.dinnerDesc}}</p>
          </div>
        </li>
        <li class="detail-list" v-if="item.stay">
          <label><i class="icon2 zs-icon"></i></label>
          <div class="main">
            <p class="sec-main">住宿：{{item.stay}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 费用说明 -->
    <div class="cost-expl">
      <p class="title">费用说明</p>
      <div  v-if="reserveDesc">
        <div class="sec-msg">
          <p><span class="line"></span> 费用包含</p>
          <div class="sec-main">{{reserveDesc.costInclusion}}</div>
        </div>
        <div class="sec-msg">
          <p><span class="line"></span> 费用不含</p>
          <div class="sec-main">{{reserveDesc.costExcluded}}</div>
        </div>
        <div class="sec-msg">
          <p><span class="line"></span> 儿童标准</p>
          <div class="sec-main">{{reserveDesc.childrenStandard}}</div>
        </div>
      </div>
    </div>
    <!-- 预定须知 -->
    <ul class="other-list">
      <li @click="goReserveTips">
        <span>预订须知</span>
        <i class="icon right-icon"></i>
      </li>
    </ul>
    <div class="footer">
        <p class="shop"  @click="toMerchant(1)">
          <i class="icon dp-icon"></i>
          <span>店铺</span>
        </p>
        <!-- <button open-type="contact" class="service">
          <i class="icon ke-icon"></i>
          <span>客服</span>
        </button> -->
        <div class="buy" @click="goBuy" v-if="peopleMask">立即预订</div>
        <div class="buy" @click="goBuyMod" v-else>立即预订</div>
    </div>
    <!-- 房间详情弹框 -->
    <div class="dialog-mask" v-if="roomMask"></div>
    <div class="detail-mask" v-if="roomMask">
      <p class="title">{{roomInfo.room.cabinType}}{{roomInfo.room.roomType}}</p>
      <i class="icon close-icon" @click="closeMask"></i>
      <div class="banner room-detail">
        <swiper class="swiper"  interval="3000" duration="1000" @change="bannerImgIndex($event)">
          <block v-for="(item, index) in roomInfo.room.setImgUrl"  :key="index" >
              <swiper-item>
                  <image :src="item || traNoteImg" class="banner-img"/>
              </swiper-item>
          </block>
        </swiper>
        <div class="po-bot">
          <p class="current-img">
            <i class="current-icon"></i>
            <span>{{roomImgNum}}/{{roomInfo.room.setImgUrl.length}}</span>
          </p>
        </div>
      </div>
      <div class="room-info">
        <div>
          <p>面积：{{roomInfo.room.area}}m²</p>
          <p>窗型：{{roomInfo.room.hasWindow === 1 ? '有' : '无'}}窗</p>
        </div>
        <div class="right">
          <p>入住：{{roomInfo.room.liveNum}}人</p>
          <p>楼层：{{roomInfo.room.floor}}楼</p>
        </div>
      </div>
      <div class="main-info">
        <p class="title">
          舱房设施
        </p>
        <p class="main-detail">
          {{roomInfo.room.remark}}
        </p>
      </div>
    </div>
    <!-- 更多航期弹框 -->
    <div class="dialog-mask" v-if="moreFlightMask"></div>
    <div class="detail-mask2"  v-if="moreFlightMask">
      <p class="title">请选择出发日期</p>
      <i class="icon close-icon" @click="closeMask"></i>
      <div class="city-info">
        <div :class = "{'active': stockDateActive === index}" v-for="(item, index) in stockDateMoreList" :key = index @click="changeStockDate(item, index)">
          <p>{{item.leaveDate}}</p>
          <p>￥{{item.price}}<span>起</span></p>
        </div>
      </div>
    </div>
    <!-- 选择人数弹框 -->
    <div class="dialog-mask peopleMask" v-if="peopleMask"></div>
    <div class="detail-mask3"  v-if="peopleMask">
      <p class="title">请选择出发人数</p>
      <i class="icon close-icon" @click="closeMask"></i>
      <ul class="ticker-change">
        <li>
          <span>儿童</span>
          <div class='peice-box'>
            ￥{{roomInfo.guestChildPrice}} X {{childNum}}
          </div>
          <div class="select-box">
            <i class="icon2 reduce-icon" @click="reduce('child')" :class="{'active': isActive}"></i>
            <span>{{childNum}}</span>
            <i class="icon2 add-icon"  @click="add('child')" :class="{'active': isActive}"></i>
          </div>
        </li>
        <li>
          <span>成人</span>
          <div class='peice-box'>
            ￥{{roomInfo.guestAdultPrice}} X {{adultNum}}
          </div>
          <div class="select-box">
            <i class="icon2 reduce-icon" @click="reduce('adult')" :class="{'active': isActive}"></i>
            <span>{{adultNum}}</span>
            <i class="icon2 add-icon"  @click="add('adult')" :class="{'active': isActive}"></i>
          </div>
        </li>
        <li>
          <span>合计</span>
          <div class="peice-box">￥{{total}}</div>
        </li>
      </ul>
    </div>
    <div class="mask2 show" v-if="showTicket"  @click="toogleShowTicket"></div>
    <div class="ticket-box"  v-if="showTicket">
      <p class="title">优惠</p>
      <div class="ticket-scroll">
        <div class="ticket-item" v-for="(item, index) in couponList" :key = index>
          <div class="left">
            <p><span class="symbol">￥</span>{{item.amount}}</p>
            <p>满{{item.useAmount}}可用</p>
          </div>
          <div class="center">
            <p>有效期</p>
            <p>{{item.startTime}}~{{item.endTime}}</p>
          </div>
          <div class="right" @click="getCoupon(item)"  v-if="!item.isReceive">
            <p>立即</p>
            <p>领取</p>
          </div>
          <div class="right" @click.stop="showTicket = false" v-if="item.isReceive">
            <p>立即</p>
            <p>使用</p>
          </div>
        </div>
      </div>
    </div>
    <canvas canvas-id="shareCanvas" :style="computedClassObject"></canvas>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import parse from 'mini-html-parser2'
export default {
  data () {
    return {
      giftType: '',
      timer: null, // 定时器
      cruiseId: '',
      imgErrorMsg: '',
      stockId: '',
      productId: '',
      cruiseInfo: '',
      tabFixTop: '', // 区域离顶部的高度
      scrollTop: '',
      tripDetailTop: '',
      otherTop: '',
      costTop: '',
      roomTop: '',
      proDetails: {},
      RecordDataList: [],
      stockDateList: [],
      stockDateMoreList: [],
      stockDateActive: 0, // 当前选中日期下标
      reserveDesc: '', // 产品详情-预定说明
      itineraryList: '', // 产品详情-行程
      currentCabinId: '', // 当前船舱id
      currentDeginDate: '', // 当前出发日期
      bannerImgList: [],
      roomTabList: [],
      roomList: [],
      roomActive: 0,
      bannerImgNum: 1,
      roomImgNum: 1,
      currentTabList: 0, // 当前tabList
      roomMask: false, // 房型详情弹框
      moreFlightMask: false, // 更多航班弹框
      peopleMask: false, // 选择人数弹框
      commentData: {},
      commentDataList: [],
      urlPrefix: '',
      merchantData: '',
      roomInfo: '',
      childNum: 0,
      adultNum: 0,
      total: 0,
      posterImg: '',
      showImgUrl: [],
      qrCode: '',
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      couponList: [], // 优惠券列表
      showTicket: false,
      userlogo: require('../../../../static/images/common/userlogo.png'),
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg')
    }
  },
  onLoad (options) {
    this.productId = options.productId
    if (options.giftType) { // 通过买产品送旅游方式进入
      this.giftType = options.giftType
    }
    if (options.shareCode) {
      wx.setStorageSync('promoterCode', options.shareCode) // 通过分享进入，获得推荐人code
    }
    if (options.scene) { // 通过二维码分享进入
      let scene = decodeURIComponent(options.scene)
      let shareCode = scene.split('&')[0]
      this.productId = scene.split('&')[1]
      wx.setStorageSync('promoterCode', shareCode)
    }
  },
  onShow () {
    this.reset()
    this.getCruiseDetail()
    wx.createSelectorQuery().select('.detail-nav').boundingClientRect((rect) => {
      this.tabFixTop = rect.top
    }).exec()
    wx.getSystemInfo({
      success: res => {
        this.windowWidth = res.windowWidth
        this.windowHeight = res.windowHeight
      }
    })
  },
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/travel/cruiseDetail/main?productId=${this.productId}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    reset() {
      this.bannerImgNum = 1
      this.roomMask = false
      this.peopleMask = false
      this.bannerImgList = []
      this.moreFlightMask = false
      this.tabFixTop = ''
      this.scrollTop = ''
      this.roomActive = 0
      this.currentTabList = 0
    },
    goBuyMod () {
      wx.pageScrollTo({
        scrollTop: this.roomTop
      })
      wx.showToast({
        title: '请选择预订房间',
        icon: 'none'
      })
    },
    getCruiseDetail () {
      this.$http.post(this.API.cruiseDetial, {
        data: {
          productId: this.productId
        }
      }).then(res => {
        if (res.code === 0) {
          let data = res.result
          this.proDetails = data.product
          this.queryCouponList() // 请求优惠券
          this.urlPrefix = data.urlPrefix
          if (this.proDetails.posterImg === '') {
            this.posterImg = ''
          } else {
            this.posterImg = `${this.urlPrefix}${this.proDetails.posterImg}` // 分享海报
          }
          let bannerImgList = []
          bannerImgList = this.proDetails.productUrl.split(',') // 邮轮轮播图
          bannerImgList.forEach((item) => {
            item = `${this.urlPrefix}${item}`
            this.bannerImgList.push(item)
          })
          this.cruiseId = data.cruiseId // 邮轮id
          this.cruiseInfo = data.cruiseInfo // 邮轮信息
          this.cruiseInfo.startTime = dayjs(this.cruiseInfo.startTime).format('YYYY')
          this.roomTabList = data.cabinTypeList // 舱型
          this.RecordDataList = JSON.parse(JSON.stringify(data.stockDateList)) // 存储日期价格数据
          if (this.roomTabList.length > 0) {
            this.currentCabinId = this.roomTabList[0].id
          }
          this.currentDeginDate = this.RecordDataList[0].leaveDate
          this.queryStock()
          this.stockDateMoreList = JSON.parse(JSON.stringify(data.stockDateList)) // 更多日期价格
          this.stockDateMoreList.forEach((item) => {
            item.leaveDate = dayjs(item.leaveDate).format('MM-DD')
          })
          this.stockDateList = JSON.parse(JSON.stringify(this.stockDateMoreList)) // 首页4个日期价格
          if (this.stockDateList.length >= 4) {
            this.stockDateList.length = 4
          }
          this.itineraryList = data.itineraryList // 行程
          this.itineraryList.forEach((item) => {
            // item.remark = item.remark.replace(/<img/gi, '<img style="width:100%;height:auto"')
            let content = item.remark.replace(/<img/gi, '<img style="width:100%;height:auto"')
            parse(content, (err, nodes) => { // 插件转化兼容更多图片
              if (!err) {
                item.remark = nodes
              }
            })
          })
          this.reserveDesc = data.reserveDesc // 费用说明
          this.getCommentList(this.productId) // 获取评论
          this.getMerchantDetail(this.proDetails.merchantId) // 获取商家信息
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).then((res) => {
        // 计算每个模块距离顶部的距离
        setTimeout(() => {
          wx.createSelectorQuery().select('.detail-nav').boundingClientRect((rect) => {
            if (rect) {
              this.tabFixTop = rect.top
            }
          }).exec()
          wx.createSelectorQuery().select('.trip-detail').boundingClientRect((rect) => {
            if (rect) {
              this.tripDetailTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.cost-expl').boundingClientRect((rect) => {
            if (rect) {
              this.costTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.other-list').boundingClientRect((rect) => {
            if (rect) {
              this.otherTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.room-data').boundingClientRect((rect) => {
            if (rect) {
              this.roomTop = rect.top
            }
          }).exec()
        }, 300)
      })
    },
    queryCouponList () { // 优惠券列表
      let data = {
        queryType: 1,
        merchantType: 1, // 1-旅游 2-名品名店
        createUser: this.proDetails.merchantId,
        productId: this.productId,
        parentTypeId: 11,
        productTypeId: 12
      }
      this.$http.post(this.API.couponList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.couponList = res.result.data
          this.couponList.forEach((item) => {
            this.$set(item, 'isReceive', false) // 默认展示立即领取
            item.startTime = dayjs(item.startTime).format('YYYY.MM.DD')
            item.endTime = dayjs(item.endTime).format('YYYY.MM.DD')
          })
        }
      })
    },
    getCoupon (item) { // 领取优惠券
      this.$http.post(this.API.receiveCoupon, {
        data: {
          couponId: item.couponId,
          couponAmountId: item.couponAmountId,
          merchantType: 1 // 优惠券类型：1-旅游 2-名品名店
        }
      }).then(res => {
        if (res.code === 0) {
          item.isReceive = true
          wx.showToast({
            title: '领取成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.showTicket = false
          }, 1500)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    toogleShowTicket() {
      this.showTicket = !this.showTicket
    },
    // 获取房间库存
    /* eslint-disable*/
    queryStock () {
      this.$http.post(this.API.queryStock, {
        data: {
          travelProductId: this.productId,
          beginDate: this.currentDeginDate, // 出发日期
          cabinId: this.currentCabinId // 舱型id
        }
      }).then(res => {
        if (res.code === 0) {
          this.roomList = res.result
          // 拼装房间详情图 setImgUrl
          this.roomList.forEach((item) => {
            item.room.imgUrl = item.room.imgUrl.split(',')
            this.$set(item.room, 'setImgUrl', [])
            item.room.imgUrl.forEach((ite) => {
              if (ite) {
                item.room.setImgUrl.push(`${this.urlPrefix}${ite}`)
              } else {
                item.room.setImgUrl.push('')
              }
            })
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 切换banner图片
    bannerImgIndex  (res) {
      this.bannerImgNum = res.mp.detail.current + 1
    },
    roomImgIndex  (res) {
      this.roomImgNum = res.mp.detail.current + 1
    },
    getCommentList(id) {
      this.$http.post(this.API.getTraCommentList, {
        data: {
          productId: id
        }
      }).then(res => {
        if (res.code === 0) {
          this.commentData = res.result
          this.commentDataList = res.result.pageList.data
          this.commentDataList.length = 1
          // console.log(this.commentDataList)
          // this.urlPrefix = res.result.urlPrefix
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getMerchantDetail (merchantId) {
      this.$http.post(this.API.getMerchantDetail, {
        data: {
          id: merchantId
        }
      }).then(res => {
        if (res.code === 0) {
          this.merchantData = res.result
          if (this.merchantData.logoImg === '') {
            this.merchantData.logoImg = ''
          } else {
            this.merchantData.logoImg = `${this.urlPrefix}${this.merchantData.logoImg}`
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    reduce (type) {
      if (this.giftType) {
        wx.showToast({
          title: '赠送产品无法选择人数',
          icon: 'none'
        })
        return
      }
      if (type === 'child') {
        if (this.childNum === 0) {
          return
        }
        this.childNum = this.childNum - 1
      }
      if (type === 'adult') {
        if (this.adultNum === 0) {
          return
        }
        this.adultNum = this.adultNum - 1
      }
      this.getTotal()
    },
    add (type) {
      if (this.giftType) {
        wx.showToast({
          title: '赠送产品无法选择人数',
          icon: 'none'
        })
        return
      }
      if (type === 'child') {
        this.childNum = this.childNum + 1
      }
      if (type === 'adult') {
        this.adultNum = this.adultNum + 1
      }
      this.getTotal()
    },
    getTotal () {
      let childTotal = this.childNum * this.roomInfo.guestChildPrice
      let adultTotal = this.adultNum * this.roomInfo.guestAdultPrice
      this.total = childTotal + adultTotal
      this.total = Math.round(this.total * 100) / 100
    },
    // 切换tablist
    changeTabList (index) {
      this.currentTabList = index
      if (index === 0) {
        wx.pageScrollTo({
          scrollTop: this.tripDetailTop
        })
      }
      if (index === 1) {
        wx.pageScrollTo({
          scrollTop: this.costTop
        })
      }
      if (index === 2) {
        wx.pageScrollTo({
          scrollTop: this.otherTop
        })
      }
    },
    getRoomDetail(item) {
      this.roomMask = true
      this.roomInfo = item
    },
    goMoreFlight () {
      this.moreFlightMask = true
      // wx.navigateTo({
      //   url: '/pages/cruise/flightMore/main'
      // })
    },
    closeMask() {
      this.roomMask = false
      this.peopleMask = false
      this.moreFlightMask = false
    },
    changeRoomTab(item, index) {
      this.roomActive = index
      this.currentCabinId = item.id
      this.queryStock()
    },
    changeStockDate (item, index) {
      this.stockDateActive = index
      this.currentDeginDate = this.RecordDataList[index].leaveDate
      this.queryStock()
      this.moreFlightMask = false
    },
    goCruiseBuy (item) {
      this.stockId = item.id
      this.childNum = 0
      this.adultNum = 0
      if (this.giftType) {
        this.childNum = 0
        this.adultNum = 1
      } else {
        this.childNum = 0
        this.adultNum = 0
      }
      this.peopleMask = true
      this.roomInfo = item
    },
    goBuy() {
      if (!this.giftType && this.total === 0) {
        wx.showToast({
          title: '请选择出行人数',
          icon: 'none'
        })
        return
      }
      let data = { // 订单页需要用到的数据
        confirmType: this.proDetails.confirmType, // 是否需要二次确认 1：直接下单 2：需要二次确认
        prdName: this.proDetails.productName,
        departure: this.proDetails.departure,
        reserveMsg: this.reserveDesc, // 预订限制
        parentTypeId: 2// 国内游或国外游
      }
      wx.setStorageSync('orderNeedData', data)
      let currentDayStock = {
        id: this.stockId,
        teamDateFmt: this.currentDeginDate, // 出发时间
        departure: this.proDetails.departure, // 出发地
        stockPriceList: [{'num': this.adultNum, 'typeName': '成人', 'priceTypeId': 1}, {'num': this.childNum, 'typeName': '儿童', 'priceTypeId': 2}] // 成人儿童列表
      }
      wx.setStorageSync('currentDayStock', currentDayStock) // 存储选中日期数据
      wx.redirectTo({
        url: `/pages/travel/orderPay/main?&total=${this.total}&type=cruise&giftType=${this.giftType}`
      })
    },
    getMoreInfo() {
      wx.navigateTo({
        url: `/pages/cruise/cruiseIntro/main?id=${this.productId}`
      })
    },
    toMerchant(type) {
      wx.navigateTo({
        url: `/pages/travel/travelStore/main?id=${this.proDetails.merchantId}&type=${type}`
      })
    },
    // 跳转预定须知
    goReserveTips () {
      wx.setStorageSync('reserveMsg', this.reserveDesc)
      wx.navigateTo({
        url: '/pages/travel/reserveTips/main'
      })
    },
    // 生成分享二维码
    createWxQrcode () {
      let that = this
      if (that.posterImg === '') {
        wx.showToast({
          title: '暂无海报',
          icon: 'none'
        })
        return
      }
      let shareCode = wx.getStorageSync('customerCode') // 本人分享id
      // step1:生成分享二维码
      this.$http.post(this.API.createWxQrcode, {
        data: {
          page: 'pages/cruise/cruiseDetail/main',
          scene: `${shareCode}&${this.productId}`,
          width: 80
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          // step2:把二维码地址下载到本地
          wx.downloadFile({
            url: res.result, // 后端返回的二维码地址
            success: function (res) {
              if (res.statusCode === 200) {
                that.qrCode = res.tempFilePath // 下载后的二维码地址
                // step3:canves绘3张图
                that.showImgUrl = []
                // that.getShareImg('https://deer99.com/imgSer/resource/image/share5.jpg', that.qrCode, 'shareCanvas')
                that.getShareImg(that.posterImg, that.qrCode, 'shareCanvas')
              } else {
                wx.showToast({
                  title: '二维码生成失败',
                  icon: 'none'
                })
                wx.hideLoading()
              }
            },
            fail: function (e) {
              console.log('下载海报失败', e)
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
    // 绘制分享图片
    getShareImg (imgurl, qrCode, canvasId) {
      let that = this
      wx.getImageInfo({
        src: imgurl,
        success: res => {
          let bgImg = res.path
          // wx.downloadFile({
          //   url: that.posterImg, // 后端返回的二维码地址
          //   success: function (res) {
          //     if (res.statusCode === 200) {
                that.posterImg = res.tempFilePath // 下载后的二维码地址
                const ctx = wx.createCanvasContext(canvasId)
                // 绘制背景
                ctx.drawImage(bgImg, 0, 0, that.windowWidth, that.windowHeight)
                // 绘制小程序码qrImgSize 小数是自己计算的比例 单位均为px *2=rpx
                // 距离左边距离：288
                // 距离顶部距离：that.windowHeight * 0.8
                // 二维码宽: 70
                // 二维码高: 70
                ctx.drawImage(qrCode, that.windowWidth * 0.75, that.windowHeight * 0.84, 70, 70) // 二维码
                // ctx.drawImage(that.posterImg, that.windowWidth * 0.03, that.windowHeight * 0.08, that.windowWidth * 0.94, that.windowHeight * 0.4) // 商品图
                // ctx.setFillStyle('#000000') // 文字颜色：黑色
                // ctx.setFontSize(16) // 文字字号：16px
                // let name = that.proDetails.productName
                // let prdName1 = name.slice(0, 22) // 第一行标题
                // let prdName2 = name.slice(22, 44) // 第二行标题
                // let prdName3 = '' // 第三行标题
                // if (name.length > 66) {
                //   prdName3 = `${name.slice(44, 65)}...`
                // } else {
                //   prdName3 = `${name.slice(44, 66)}`
                // }
                // ctx.fillText(prdName1, that.windowWidth * 0.03, that.windowHeight * 0.52)
                // ctx.fillText(prdName2, that.windowWidth * 0.03, that.windowHeight * 0.56)
                // ctx.fillText(prdName3, that.windowWidth * 0.03, that.windowHeight * 0.6)
                // ctx.setFontSize(17) // 文字字号 17px
                // ctx.setFillStyle('#fbb03b') // 文字颜色
                // ctx.fillText(`￥${that.proDetails.price}起`, that.windowWidth * 0.03, that.windowHeight * 0.65)
                ctx.stroke()
                ctx.draw()
                setTimeout(() => {
                  // canvas画布转换成图片地址
                  wx.canvasToTempFilePath({
                    canvasId: canvasId,
                    success: (res) => {
                      that.showImgUrl.push(res.tempFilePath)
                      that.previewImage()
                    }
                  })
                }, 100)
          //     }
          //   },
          //   fail: function (e) {
          //     console.log('下载海报失败', e)
          //   }
          // })
        },
        fail: res => {
          console.log(res)
        }
      })
    },
    // 预览图片
    previewImage () {
      wx.hideLoading()
      wx.previewImage({
        urls: this.showImgUrl
      })
    },
    showJson(style) {
      let s = []
      for (let i in style) {
        s.push(i + ':' + style[i])
      }
      s = s.join(';')
      console.log(s)
      return s
    }
  },
  computed: {
    computedClassObject () {
      return this.showJson({
        height: `${this.windowHeight}px`,
        width: '750rpx',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #f4f4f4;
  padding-bottom: 130rpx;
}
.qrCode-box{
  background: rgba(0, 0, 0, 0.21);
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  right: 20rpx;
  top: 17rpx;
  position: absolute;
  z-index: 10;
}
.qrCode-icon{
  width: 32rpx;
  height: 34rpx;
  background: url(../../../../static/images/meIcon.png);
  background-size: 400rpx 160rpx;
  background-position: -269rpx -38rpx;
  float: right;
  margin-top: 16rpx;
  margin-right: 12rpx;
}
.body-fixed{
    position:fixed;
    top:0;left:0;right:0;bottom:0;
  }
.swiper{
  height: 420rpx;
}
.banner{
  position: relative;
  .banner-img{
    width: 100%;
    height: 420rpx;
  }
  .po-bot{
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 100rpx;
    opacity: 0.4;
    background: -webkit-linear-gradient(transparent,#000);
    background: -o-linear-gradient(transparent,#000);
    background: -moz-linear-gradient(transparent,#000);
    background: -mos-linear-gradient(transparent,#000);
    background: linear-gradient(transparent,#000);
  }
  .current-img {
    position: absolute;
    color: #fff;
    font-size: 20rpx;
    right: 30rpx;
    bottom: 50rpx;
    background-color: rgba(0,0,0,0.8);
    width: 80rpx;
    height: 32rpx;
    line-height: 32rpx;
    vertical-align: top;
    border-radius: 30rpx;
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
  .travel-msg{
    position: absolute;
    color: #fff;
    font-size: 20rpx;
    right: 30rpx;
    bottom: 15rpx;
    left: 30rpx;
    .goods-code{
      float: right;
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
    .oriPrice{
      text-decoration: line-through;
      margin-left: 20rpx;
    }
    .mark{
      color: #ff9913;
      font-size: 22rpx;
      float: right;
      margin-right: 25rpx;
      margin-top: 10rpx;
    }
    .num {
      font-size: 22rpx;
      float: right;
      margin-top: 10rpx;
    }
  }
}
.cruise-info{
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  position: relative;
  .title{
    font-size: 30rpx;
  }
  .info{
    color: #888888;
    font-size: 22rpx;
    margin-top: 10rpx;
    span{
      margin-left: 25rpx;
    }
    span:nth-child(1){
      margin-left: 0;
    }
  }
  .right{
    font-size: 24rpx;
    color: #ff9913;
    float:right;
    margin-right: 20rpx;
    margin-top: 6rpx;
  }
}
.team-date{
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
  .title{
    font-size: 32rpx;
    .right{
      font-size: 24rpx;
      float: right;
      color: #888;
      margin-right:20rpx;
      margin-top: 6rpx;
    }
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
      border: 1rpx solid #fbb03b;
    }
    div.clo span:last-child{
      color: #353535;
    }
    div:last-child{
      margin-right: 0;
    }
  }
}
.room-data{
  background: #fff;
  padding: 30rpx 30rpx 0 30rpx;
  margin-top: 20rpx;
  .tab{
    display: flex;
    overflow: scroll;
    padding-bottom: 30rpx;
    li{
      display: block;
      min-width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      border: 1rpx solid #dedede;
      border-radius: 5rpx;
      margin-right: 40rpx;
      color: #353535;
      font-size: 26rpx;
      text-align: center;
    }
    li.active{
      background: #fbb03b;
      color: #fff;
      border:none;
    }
    li:last-child{
      margin-right: 0;
    }
  }
  .room-item{
    padding: 30rpx 0;
    border-top: 1rpx solid #dcdcdc;
    img{
      width: 140rpx;
      height: 120rpx;
      border-radius: 5rpx;
      display: inline-block;
    }
    .detail{
      display: inline-block;
      margin-left: 18rpx;
      width: 58%;
      padding: 15rpx 0;
      vertical-align: top;
      p:nth-child(1){
        font-size: 30rpx;
        .more{
          color: #388ef8;
          font-size: 24rpx;
          margin-left: 23rpx;
        }
      }
      p:nth-child(2){
        font-size: 20rpx;
        color: #888888;
        margin-top: 15rpx;
        span{
          margin-left: 13rpx;
        }
        span:nth-child(1){
          margin-left: 0;
        }
      }
      .more-icon{
        background-position: -170rpx -5rpx;
        width: 18rpx;
        height: 30rpx;
        vertical-align: middle;
        margin-left: 8rpx;
      }
    }
    .price{
      display: inline-block;
      vertical-align: top;
      padding: 13rpx 0;
      p:nth-child(1){
        color:  #fb3305;
        font-size: 20rpx;
        .money{
          font-size: 32rpx;
        }
        .num{
          color: #666666;
        }
      }
      p:nth-child(2){
        span{
          width: 108rpx;
          height: 40rpx;
          line-height: 40rpx;
          background: #fbb03b;
          color: #fff;
          font-size: 22rpx;
          border-radius:5rpx;
          text-align: center;
          float:right;
          margin-top: 3rpx;
        }
      }
    }
  }
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
    margin-top: 6rpx;
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
.shop-box{
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  .shop-info{
    display:flex;
    .shop-img{
      width: 58rpx;
      height: 58rpx;
      margin-top: 9rpx;
    }
    .shop-msg{
      width: 86%;
      margin-left: 15rpx;
      .name{
        font-size: 30rpx;
      }
      .focus{
        font-size: 20rpx;
        color: #888888;
      }
    }
    .right-icon {
      margin-top: 20rpx;
    }
  }
  .goshop-info{
    text-align: center;
    margin-top:30rpx;
    font-size: 24rpx;
    span{
      border:1rpx solid #dddddd;
      padding: 10rpx 38rpx;
      border-radius: 40rpx;
      display: inline-block;
      }
      span:first-child{
        margin-right: 34rpx;
      }
      span:last-child{
        margin-left: 34rpx;
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
.fix-news{
  position: fixed;
  top: -2%;
  left: 0;
  z-index: 99999;
  width: 92%;
}
.trip-detail{
  padding: 30rpx;
  background: #fff;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .icon2{
    background: url('../../../../static/images/cruise.png');
    background-size: 350rpx 150rpx;
    width: 38rpx;
    height: 40rpx;
    display: inline-block;
  }
  .title{
    text-align: center;
    font-size: 34rpx;
    margin-bottom: 20rpx;
  }
  .day-box{
    border-bottom: 1rpx solid #dcdcdc;
    margin-bottom: 30rpx;
    li:first-child{
      font-size: 30rpx;
      margin-bottom: 20rpx;
      label{
        margin-top: 0;
      }
    }
    li {
      position: relative;
      font-size: 26rpx;
      label {
        width: 55rpx;
        display: inline-block;
        vertical-align: top;
        margin-top: -5rpx;
        margin-left: -5rpx;
        .xc-icon{background-position: 0rpx -1rpx;}
        .zc-icon{background-position: -37rpx -1rpx;}
        .zs-icon{background-position: -76rpx -1rpx;}
      }
    }
    .detail-list{
      width: 100%;
      label {
        position: absolute;
      }
      .main{
        display: inline-block;
        padding-bottom: 20rpx;
        padding-left: 40rpx;
        margin-top: 9rpx;
        margin-left: 19rpx;
        border-left: 2rpx dashed #dcdcdc;
        .sec-main {
          font-size: 26rpx;
          color:#666666;
          white-space: pre-wrap;
        }
        .time{
          margin-right: 20rpx;
        }
        img{
          // width: 80%;
        }
      }
    }
    .detail-list:last-child{
      .main{
        border: none;
      }
    }
  }
  .day-box:last-child{
    border-bottom: none;
    margin-bottom: 0
  }
}
.cost-expl{
  margin-top: 20rpx;
  padding: 30rpx;
  background: #fff;
  .title{
    text-align: center;
    font-size: 34rpx;
  }
  .sec-msg{
    border-bottom: 1rpx solid #dcdcdc;
    padding-bottom: 30rpx;
    padding-top: 20rpx;
  }
  .sec-msg:last-child{
    border-bottom: none;
  }
  .line{
    width: 8rpx;
    height: 30rpx;
    background: #ff9913;
    display: inline-block;
    vertical-align: middle;
    margin-top: -5rpx;
    margin-right: 10rpx;
  }
  .sec-main{
    margin-top: 10rpx;
    font-size: 26rpx;
    color: #666;
    white-space: pre-wrap;
  }
}
.other-list{
  margin-top: 20rpx;
  background: #fff;
  font-size: 30rpx;
  padding-bottom: 25rpx;
  padding-left: 30rpx;
  li {
    padding-top: 25rpx;
    i{
      float: right;
      margin-top: 10rpx;
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
    display: inline-block;
    background-size: 500rpx 120rpx;
    background-position: 0 -1rpx;
    width: 40rpx;
    height: 40rpx;
  }
  .shop, .service{
    margin-top:12rpx;
    flex-grow: 1;
    span{
      display: block;
    }
  }
  .service{
    display: block;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    line-height: none;
    font-size: 26rpx;
    margin-top: 8rpx;
    color: #353535;
    &:after{
      border: none;
    }
    span{
      margin-top: -26rpx;
    }
  }
  .dp-icon{
    background-position: -2rpx -67rpx;
    width: 39rpx;
  }
  .ke-icon{
    background-position: -51rpx -67rpx;
  }
  .buy{
    line-height: 98rpx;
    color: #fff;
    font-size: 30rpx;
    flex-grow: 4;
    background: #ff9913;
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
.dialog-mask.peopleMask{
  bottom: 100rpx;
}
.detail-mask{
  position: fixed;
  width: 100%;
  bottom: 0;
  font-size: 24rpx;
  background: #fff;
  z-index: 999999;
  border-radius: 20rpx 20rpx 0 0;
  .title{
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    text-align: center;
  }
  .close-icon{
    background-position: -187rpx -1rpx;
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    width: 28rpx;
    height: 28rpx;
  }
  .banner.room-detail .current-img{
    bottom: 15rpx;
  }
  .room-info{
    padding: 30rpx 30rpx 36rpx 30rpx;
    display: flex;
    color: #666666;
    font-size: 30rpx;
    justify-content:space-between;
    border-bottom: 1rpx solid #dcdcdc;
    // .right{
    //   float: right;
    // }
  }
  .main-info{
    padding: 30rpx;
    height: 290rpx;
    color: #666666;
    overflow: auto;
  }
}
.detail-mask2{
  position: fixed;
  width: 100%;
  bottom: 0;
  font-size: 24rpx;
  background: #fff;
  z-index: 999999;
  border-radius: 20rpx 20rpx 0 0;
  .title{
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    text-align: center;
  }
  .close-icon{
    background-position: -187rpx -1rpx;
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    width: 28rpx;
    height: 28rpx;
  }
  .city-info{
    height: 540rpx;
    box-sizing: border-box;
    padding : 0 30rpx 30rpx 30rpx;
    overflow: auto;
    div{
      width: 218rpx;
      height:88rpx;
      border: 1rpx solid #dcdcdc;
      border-radius: 5rpx;
      display: inline-block;
      margin-right: 15rpx;
      margin-top: 15rpx;
      p{
        text-align: center;
      }
      p:nth-child(1){
        margin-top: 5rpx;
        font-size: 26rpx;
      }
      p:nth-child(2){
        font-size: 24rpx;
        color: #f65631;
        span{
          color: #999;
          font-size: 20rpx;
        }
      }
    }
    div.active{
      border: 1rpx solid #fbb03b;
    }
    div:nth-child(3n){
      margin-right: 0;
    }
  }
}
.detail-mask3{
  position: fixed;
  width: 100%;
  bottom: 98rpx;
  font-size: 24rpx;
  background: #fff;
  z-index: 999999;
  .title{
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    text-align: center;
  }
  .close-icon{
    background-position: -187rpx -1rpx;
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    width: 28rpx;
    height: 28rpx;
  }
}
.ticker-change {
  margin-top: 20rpx;
  background: #fff;
  font-size: 30rpx;
  li {
    height: 85rpx;
    line-height: 85rpx;
    margin-left: 30rpx;
    margin-right: 30rpx;
    font-size: 26rpx;
    border-bottom: 1rpx solid #dcdcdc;
    .title {
      display: inline-block;
    }
    .sel-ticker {
      display: inline-block;
    }
  }
  li:last-child {
    border-bottom: none;
  }
  .select-box {
    margin-right: 50rpx;
    float: right;
    font-size: 30rpx;
    color: #888;
    span {
      margin-left: 20rpx;
      margin-right: 20rpx;
    }
  }
  .peice-box{
    float: right;
    color: #f65631;
    margin-right: 30rpx;
  }
  .total-price{
    color: #f65631;
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
.icon2 {
  display: inline-block;
  background: url('../../../../static/images/select.png');
  background-size: 200rpx 80rpx;
  background-position: 0 0;
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin: 10rpx;
}
.reduce-icon.active {
  background-position: -39rpx 0;
}
.add-icon {
  background-position: 0 -40rpx;
}
.add-icon.active {
  background-position: -39rpx -40rpx;
}
.icon{
  background: url('../../../../static/images/travelDetail.png');
  background-size: 300rpx 150rpx;
  display: inline-block;
}
.right-icon{
  position: absolute;
  right: 25rpx;
  margin-top: 1rpx;
  background-position: -119rpx 0;
  width: 23rpx;
  height: 30rpx;
}
.right-icon.comment{
  position: absolute;
  right: 25rpx;
  margin-top: 8rpx;
}
.qbbb-icon, .jdgg-icon{
  background: url('../../../../static/images/goodsDetail.png');
  display: inline-block;
  background-size: 500rpx 120rpx;
  background-position: 0 -1rpx;
  width: 25rpx;
  height: 25rpx;
  background-position: -199rpx -1rpx;
  vertical-align: middle;
  vertical-align: top;
  margin-top: 7rpx;
}
.qbbb-icon{
  background-position: -172rpx -1rpx;
}
.mask2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: all .3s linear;
  background-color: rgba(0, 0, 0, .6);
  &.show {
    opacity: 1;
  }
}
@keyframes mymove
{
  from {transform: translateY(100%)}
  to {transform: translateY(0)}
}
@-webkit-keyframes mymove
{
  from {transform: translateY(100%)}
  to {transform: translateY(0)}
}
@keyframes hideMove
{
  from {transform: translateY(0)}
  to {transform: translateY(100%)}
}
@-webkit-keyframes hideMove
{
  from {transform: translateY(0)}
  to {transform: translateY(100%)}
}
.coupon-box{
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  p{
    font-size: 28rpx;
  }
  .ticket-mini{
    display: inline-block;
    padding:0 10rpx;
    height: 34rpx;
    line-height: 34rpx;
    background-color: #ffffff;
    color: #e60012;
    font-size: 20rpx;
    text-align: center;
    background-image: url('../../../../static/images/ticket.png');
    background-size: 100% 100%;
    margin-left: 15rpx;
  }
  .right-icon{
    float: right;
    margin-top: 10rpx;
  }
  .ml60{
    margin-left: 60rpx;
  }
}
.ticket-box{
  width: 100%;
  height: 939rpx;
  background: #fff;
  position: fixed;
  bottom: 0;
  border-radius: 15rpx 15rpx 0 0 ;
  animation: mymove .3s forwards;
  z-index: 9;
  .title{
    font-size: 36rpx;
    text-align: center;
    margin: 40rpx 0;
  }
  .ticket-scroll{
    overflow: auto;
    height: 835rpx;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .ticket-item{
    width: 690rpx;
    height: 160rpx;
    background-color: #ffffff;
    border: solid 1rpx #fbb03b;
    margin: 20rpx auto;
    .left{
      width: 29%;
      display: inline-block;
      padding: 20rpx 0;
      text-align: center;
      color: #fbb03b;
      border-right: 2rpx dashed #ddd;
      margin: 10rpx 0;
      p:nth-child(1){
        font-size: 40rpx;
        .symbol{
          font-size: 30rpx;
        }
      }
      p:nth-child(2){
        font-size: 24rpx;
      }
    }
    .center{
      width: 45%;
      display: inline-block;
      padding-left: 30rpx;
      p:nth-child(1){
        color: #999999;
        font-size: 24rpx;
      }
      p:nth-child(2){
        font-size: 24rpx;
	      color: #333333;
        margin-top: 15rpx;
      }
    }
    .right{
      width: 20%;
      background-color: #fbb03b;
      text-align: center;
      float: right;
      height: 100%;
      padding: 35rpx 0;
      box-sizing: border-box;
      position: relative;
      p{
        color: #ffffff;
        font-size: 28rpx;
      }
    }
    .right:before{
      content: '';
      display: block;
      width: 18rpx;
      height: 100%;
      background-size: 18rpx 18rpx; /* 一个repeat的大小 */
      background-repeat: repeat-y;
      background-image: radial-gradient(#fff 7rpx, transparent 7rpx);
      position: absolute;
      top: 0;
    }
    .right:before {
      left: -10rpx; /* 半圆，只显示一个repeat的一半 */
      top: -1rpx;
    }
  }
}
</style>