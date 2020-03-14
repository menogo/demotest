<template>
  <div class="page" :class="{'body-fixed': isShowMask}">
    <div class="qrCode-box"  @click="createWxQrcode">
        <i class="qrCode-icon"></i>
      </div>
    <div class="banner">
      <swiper class="swiper"  interval="3000" duration="1000"  :indicator-dots= false  autoplay="true"  @change="bannerImgIndex($event)">
        <block v-for="(item, index) in bannerList"  :key="index" >
            <swiper-item>
                <image :src="item" class="banner-img"/>
            </swiper-item>
        </block>
      </swiper>
      <div class="po-bot">
        <p class="current-img">
          <i class="current-icon"></i>
          <span>{{bannerImgNum}}/{{bannerList.length}}</span>
        </p>
        <p class="travel-msg">
          <span>{{proDetails.departure}}出发·{{proDetails.productTypeName}}</span>
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
    <div class="select-box" @click="toogleShowTicket" v-if="couponList && couponList.length > 0">
      <p>领券
        <span class="ticket-mini ml60" v-if="couponList && couponList[0]">满{{couponList[0].useAmount}}减{{couponList[0].amount}}</span>
        <span class="ticket-mini" v-if="couponList && couponList[1]">满{{couponList[1].useAmount}}减{{couponList[1].amount}}</span>
        <i class="icon right-icon"></i>
      </p>
    </div>
    <!-- 产品经理介绍 -->
    <div class="recommend" v-if="proDetails.recommend">
        <p>产品亮点</p>
        <p>{{proDetails.recommend}}</p>
    </div>
    <!-- 班期 -->
    <div class="team-date">
        <p class="title">
          <i class="icon loca-icon"></i>
          <span>{{selectDeparture}}出发</span>
          <i class="icon right-icon comment"></i>
          <span class="right" @click="changeCity">切换城市</span>
        </p>
        <div class="flex">
          <div v-for="(item, index) in stockList" :key = index @click="selectStockList(item, index)" :class="{'active' : selectStockId === item.id}">
            <span>{{item.teamDateFmt}}</span>
            <span>￥{{item.guestPrice}}</span>
          </div>
          <div @click="goTraBuy()">
            <span class="col">更多</span>
            <span class="col">班期</span>
          </div>
        </div>
    </div>
    <!-- 评论 -->
    <div class="comment-box" v-if="commentData.commentCount >= 1">
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
      <li @click="changeTabList(0)" :class="{'active': 0 === currentTabList }">行程推荐</li>
      <li @click="changeTabList(1)" :class="{'active': 1 === currentTabList}">航班信息</li>
      <li @click="changeTabList(2)" :class="{'active': 2 === currentTabList }">酒店信息</li>
      <li @click="changeTabList(3)" :class="{'active': 3 === currentTabList }">预订须知</li>
    </ul>
    <!-- 行程推荐 -->
    <div class="goods-feature" v-if="proDetails.productFeature">
      <p class="title">行程推荐</p>
      <rich-text :nodes="proDetails.productFeature"></rich-text>
    </div>
    <!-- 航班信息 -->
    <div class="flight-info">
      <p class="title">航班信息</p>
      <div class="flight-item" v-for="(item, index) in flightList" :key = index v-if="flightList.length > 0">
        <p>{{item.company}}{{item.flightNumber}} <span>|</span> 全程{{item.duration}} <span>|</span> {{item.isThrough === "1" ? '直达' : ''}}</p>
        <div class="flight-detail">
          <div>
            <p>{{item.departTime}}</p>
            <p>{{item.departTity}} {{item.departAirport}}</p>
          </div>
          <div>
            <span class="line-icon"></span>
          </div>
          <div>
            <p>{{item.arriveTime}}</p>
            <p>{{item.arriveCity}} {{item.arriveAirport}}</p>
          </div>
        </div>
      </div>
      <div v-if="flightList.length < 1" class="none-tips">暂无</div>
    </div>
    <!-- 酒店信息 -->
    <div class="hotel-feature">
      <p class="title">酒店信息</p>
      <rich-text :nodes="proDetails.hotelInfo"></rich-text>
    </div>
    <!-- 费用说明 -->
    <div class="cost-expl" v-if="reserveDesc">
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
      <li @click="goCancleTips">
        <span>违约条款</span>
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
      <div class="buy" @click="goTraBuy()">立即预订</div>
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
    <div class="dialog-mask" v-if="isShowMask"></div>
    <div class="detail-mask"  v-if="isShowMask">
      <p class="title">请选择出发地</p>
      <i class="icon close-icon" @click="closeMask"></i>
      <div class="city-info">
        <div v-for="(item, index) in departureList" :key = index @click="changeDeparture(item)">
          <p>{{item.departure}}</p>
          <p>￥{{item.price}}<span>起</span></p>
        </div>
      </div>
    </div>
    <canvas canvas-id="shareCanvas" :style="computedClassObject"></canvas>
  </div>
</template>

<script>
import parse from 'mini-html-parser2'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      giftType: '', // 买商品送旅游进入
      timer: null, // 定时器
      imgErrorMsg: '',
      isShowMask: false,
      bannerImgNum: 1,
      proDetails: {},
      serviceList: [],
      commentData: {},
      commentDataList: [],
      merchantData: {},
      currentTabList: 0,
      urlPrefix: '',
      departureList: [],
      selectDeparture: '', // 出发地
      stockList: [], // 团期
      flightList: [],
      reserveDesc: '', // 产品详情-预定说明
      bannerList: [], // banner轮播图
      tabFixTop: '', // 区域离顶部的高度
      featureTop: '',
      flightTop: '',
      hotelTop: '',
      otherTop: '',
      selectStockId: 0, // 当前选中日期id
      posterImg: '',
      showImgUrl: [],
      qrCode: '',
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      couponList: [], // 优惠券列表
      showTicket: false,
      userlogo: require('../../../../static/images/common/userlogo.png')
    }
  },
  onLoad (options) {
    this.parentId = options.parentId
    if (options.giftType) { // 通过买产品送旅游方式进入
      this.giftType = options.giftType
    }
    if (options.shareCode) {
      wx.setStorageSync('promoterCode', options.shareCode) // 通过分享进入，获得推荐人code
    }
    if (options.scene) { // 通过二维码分享进入
      let scene = decodeURIComponent(options.scene)
      let shareCode = scene.split('&')[0]
      this.parentId = scene.split('&')[1]
      wx.setStorageSync('promoterCode', shareCode)
    }
  },
  onShow () {
    this.resetData()
    this.getTravelDetail()
    wx.createSelectorQuery().select('.detail-nav').boundingClientRect((rect) => {
      this.tabFixTop = rect.top + 125
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
      path: `/pages/travel/independTra/main?parentId=${this.parentId}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  methods: {
    resetData () {
      this.currentTabList = 0
      this.bannerImgNum = 1
      this.bannerList = []
      this.tabFixTop = ''
      this.scrollTop = ''
      this.isShowMask = false
    },
    // 切换banner图片
    bannerImgIndex  (res) {
      this.bannerImgNum = res.mp.detail.current + 1
    },
    getTravelDetail () {
      this.$http.post(this.API.queryProductDetial, {
        data: {
          productId: this.parentId
        }
      }).then(res => {
        if (res.code === 0) {
          let data = res.result
          this.serviceList = data.serviceList // 附加服务
          this.proDetails = data.product // 基本信息
          this.queryCouponList() // 请求优惠券
          this.urlPrefix = res.result.product.urlPrefix
          if (this.proDetails.productPoster && this.proDetails.productPoster.imgUrl !== '') {
            this.posterImg = `${this.urlPrefix}${this.proDetails.productPoster.imgUrl}` // 分享海报
          } else {
            this.posterImg = ''
          }
          this.departureList = data.departureList
          this.selectDeparture = this.departureList[0].departure
          this.getFreeTravelStock()
          this.getCommentList(this.parentId) // 获取评论
          this.getMerchantDetail(this.proDetails.merchantId) // 获取商家信息
          // 拼装banner轮播图
          data.product.productImgList.forEach((i) => {
            this.bannerList.push(`${data.product.urlPrefix}${i.imgUrl}`)
          })
          let content = this.proDetails.productFeature.replace(/<img/gi, '<img style="width:100%;height:auto"') // 行程推荐
          parse(content, (err, nodes) => { // 插件转化兼容更多图片
            if (!err) {
              this.proDetails.productFeature = nodes
            }
          })
          let content2 = this.proDetails.hotelInfo.replace(/<img/gi, '<img style="width:100%;height:auto"') // 酒店信息
          parse(content2, (err, nodes) => { // 插件转化兼容更多图片
            if (!err) {
              this.proDetails.hotelInfo = nodes
            }
          })
          this.reserveDesc = data.reserveDesc // 预定说明
          return res
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
          wx.createSelectorQuery().select('.flight-info').boundingClientRect((rect) => {
            if (rect) {
              this.flightTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.hotel-feature').boundingClientRect((rect) => {
            if (rect) {
              this.hotelTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.goods-feature').boundingClientRect((rect) => {
            if (rect) {
              this.featureTop = rect.top - 40
            }
          }).exec()
          wx.createSelectorQuery().select('.other-list').boundingClientRect((rect) => {
            if (rect) {
              this.otherTop = rect.top - 40
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
        productId: this.parentId,
        parentTypeId: this.proDetails.parentTypeId,
        productTypeId: this.proDetails.productTypeId
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
    // 航班信息
    getFreeTravelStock () {
      this.$http.post(this.API.queryFreeTravelStock, {
        data: {
          productId: this.parentId,
          departure: this.selectDeparture
        }
      }).then(res => {
        if (res.code === 0) {
          wx.setStorageSync('stockList', res.result.stockList) // 缓存价格库存信息
          this.stockList = res.result.stockList
          if (this.stockList.length > 4) {
            this.stockList.length = 4
          }
          let dataSelectId = wx.getStorageSync('dataSelectId') // 从查询页点击回来选中的id 展示航班
          this.selectStockId = dataSelectId
          if (dataSelectId) {
            this.stockList.forEach((item) => {
              if (item.id === dataSelectId) {
                this.flightList = item.flightList
              }
            })
          } else {
            this.selectStockId = this.stockList[0].id
            this.flightList = this.stockList[0].flightList
          }
          this.stockList.forEach((item) => {
            item.teamDateFmt = dayjs(item.teamDateFmt).format('MM-DD')
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    selectStockList (item, index) {
      this.selectStockId = item.id
      this.flightList = this.stockList[index].flightList
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
          this.urlPrefix = res.result.urlPrefix
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
    // 切换tablist
    changeTabList (index) {
      this.currentTabList = index
      if (index === 0) {
        wx.pageScrollTo({
          scrollTop: this.featureTop
        })
      }
      if (index === 1) {
        wx.pageScrollTo({
          scrollTop: this.flightTop
        })
      }
      if (index === 2) {
        wx.pageScrollTo({
          scrollTop: this.hotelTop
        })
      }
      if (index === 3) {
        wx.pageScrollTo({
          scrollTop: this.otherTop
        })
      }
    },
    changeCity () {
      this.isShowMask = !this.isShowMask
    },
    changeDeparture (item) {
      this.selectDeparture = item.departure
      this.isShowMask = false
      this.getFreeTravelStock()
    },
    closeMask () {
      this.isShowMask = false
    },
    // 跳转预定须知
    goReserveTips () {
      wx.setStorageSync('reserveMsg', this.reserveDesc)
      wx.navigateTo({
        url: '/pages/travel/reserveTips/main'
      })
    },
    // 跳转取消政策
    goCancleTips () {
      wx.setStorageSync('reserveMsg', this.reserveDesc)
      wx.navigateTo({
        url: '/pages/travel/cancelTips/main'
      })
    },
    toMerchant(type) {
      wx.navigateTo({
        url: `/pages/travel/travelStore/main?id=${this.proDetails.merchantId}&type=${type}`
      })
    },
    // 跳转旅游下单页
    goTraBuy () {
      // type 1: 选择团期预定页 2：查看团期
      let data = { // 订单页需要用到的数据
        travelDays: this.proDetails.days, // 游玩天数
        serviceList: this.serviceList, // 附加服务
        confirmType: this.proDetails.confirmType, // 是否需要二次确认 1：直接下单 2：需要二次确认
        prdName: this.proDetails.productName,
        departure: this.proDetails.departure,
        reserveMsg: this.reserveDesc, // 预订限制
        parentTypeId: this.proDetails.parentTypeId // 国内游或国外游
      }
      wx.setStorageSync('orderNeedData', data)
      wx.navigateTo({
        url: `/pages/travel/traOrder/main?giftType=${this.giftType}&travType=2`
      })
    },
    showJson(style) {
      let s = []
      for (let i in style) {
        s.push(i + ':' + style[i])
      }
      s = s.join(';')
      return s
    },
    // 生成分享二维码
    createWxQrcode () {
      wx.showLoading({
        title: '图片生成中'
      })
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
          page: 'pages/travel/independTra/main',
          scene: `${shareCode}&${this.parentId}`,
          width: 70
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          wx.showLoading({
            title: '图片生成中'
          })
          // step2:把二维码地址下载到本地
          wx.downloadFile({
            url: res.result, // 后端返回的二维码地址
            success: function (res) {
              if (res.statusCode === 200) {
                that.qrCode = res.tempFilePath // 下载后的二维码地址
                // step3:canves绘3张图
                that.showImgUrl = []
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
  padding-bottom: 98rpx;
  margin-bottom: 98rpx;
}
.none-tips{
  text-align: center;
  margin-top: 20rpx;
  font-size: 30rpx;
}
.body-fixed{
  position:fixed;
  top:0;left:0;right:0;bottom:0;
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
.recommend{
  padding: 30rpx;
  background:#fff;
  margin-top: 20rpx;
  p:nth-child(1){
    font-size: 32rpx;
  }
  p:nth-child(2){
    font-size: 26rpx;
    margin-top: 10rpx;
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
      color: #ff9913;
      margin-right:20rpx;
      margin-top: 6rpx;
    }
  }
  .flex{
    margin-top: 30rpx;
    display: flex;
    div {
      // flex-grow: 1;
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
      span.col{
        color: #ff9913;
      }
      span:last-child{
        color: #ff9913;
      }
    }
    div.active{
      border: 1rpx solid #ff9913;
      span {
        color: #ff9913;
      }
    }
    div:last-child{
      margin-right: 0;
    }
  }
  .loca-icon{
    background-position: -87rpx -1rpx;
    width: 27rpx;
    height: 33rpx;
    vertical-align: middle;
    margin-right: 10rpx;
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
    // display: flex;
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
.flight-info{
  background: #fff;
  padding: 30rpx;
  margin-top: 0.2rem;
  .title {
    text-align: center;
    font-size: 34rpx;
    // margin-bottom: 20rpx;
  }
  .flight-item{
    height: 200rpx;
    background: #f4f4f4;
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    font-size: 24rpx;
    margin-top: 30rpx;
    .flight-detail{
      margin-top: 30rpx;
      display:flex;
      div{
        flex-grow: 1;
        text-align: center;
        p:nth-child(1){
          font-size: 26rpx;
        }
        p:nth-child(2){
          color: #666;
          font-size: 30rpx;
          margin-top: 5rpx;
        }
      }
      .line-icon{
        background: url('../../../../static/images/travelIndex.png');
        background-size: 300rpx 150rpx;
        background-position: -35rpx -73rpx;
        width: 137rpx;
        height: 8rpx;
        display: inline-block;
        margin-top: 30rpx;
        vertical-align: middle;
      }
    }
  }
}
.goods-feature, .hotel-feature{
  background: #fff;
  padding: 30rpx;
  .title {
    text-align: center;
    font-size: 34rpx;
    margin-bottom: 20rpx;
  }
}
.hotel-feature{
  margin-top: 20rpx;
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
      margin-right: 30rpx;
      margin-top: 10rpx;
    }
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
    div:nth-child(3n){
      margin-right: 0;
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
  .shop, .service, .follow {
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
  .icon{
    width: 40rpx;
    height: 40rpx;
  }
  .dp-icon{
    background-position: -2rpx -67rpx;
    width: 39rpx;
  }
  .ke-icon{
    background-position: -51rpx -67rpx;
  }
  .sc-icon{
    background-position: -100rpx -67rpx;
  }
  .buy{
    line-height: 98rpx;
    color: #fff;
    font-size: 30rpx;
    flex-grow: 4;
    background: #ff9913;
  }
}
.icon{
  background: url('../../../../static/images/travelDetail.png');
  background-size: 300rpx 150rpx;
  background-position: -1rpx -36rpx;
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
}
.right-icon{
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
.select-box{
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  p{
    font-size: 28rpx;
  }
  .specs {
    margin-top: 30rpx;
  }
  .col{
    color: #f60701;
    font-size: 24rpx;
    margin-left: 60rpx;
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