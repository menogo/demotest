<template>
    <div class="goods-detail-page">
      <div class="qrCode-box"  @click="createWxQrcode">
        <i class="qrCode-icon"></i>
      </div>
      <i-badge class="qrCode-box" :count="cartCount" style="right: 16px;background: transparent;">
        <i class="icon gwc-icon" @click="goCart"></i>
      </i-badge>
      <div class="goods-img-box">
        <swiper class="swiper"  interval="3000" duration="1000"  indicator-dots="true"  autoplay="true"  indicator-color="#fff" indicator-active-color="#ff9913">
          <block v-for="(item, index) in sliderImgs"  :key="index" >
            <swiper-item>
              <img :src = "item" class="goods-img"/>
            </swiper-item>
          </block>
        </swiper>

      </div>
      <div class="goods-info">
        <p class="title">{{detailData.productName}}</p>
       <!-- <p class="detail">广告词广告词广告词广告词广告词广告词广告</p> -->
        <div class="price-box" v-if="integralDeductType > 0">
          <div v-if="integralDeductType === 1">
            <span class="symbol">￥</span>
            <div class="price">{{detailData.minPrice}}+{{detailData.useIntegral}}积分</div>
            <div class="oriPrice" v-if="detailData.originalPrice && (detailData.minPrice === detailData.maxPrice)"><span>￥</span>{{detailData.originalPrice}}</div>
          </div>
          <div v-if="integralDeductType === 2">
            <span class="symbol">￥</span>
            <div class="price">{{detailData.useIntegral}}积分</div>
            <div class="oriPrice" v-if="detailData.originalPrice && (detailData.minPrice === detailData.maxPrice)"><span>￥</span>{{detailData.originalPrice}}</div>
          </div>
        </div>
        <div class="price-box" v-if="integralDeductType === 0">
          <span class="symbol">￥</span>
          <div class="price" v-if="detailData.minPrice === detailData.maxPrice">{{detailData.minPrice}}</div>
          <div class="price" v-else>{{detailData.minPrice}}~{{detailData.maxPrice}}</div>
          <div class="oriPrice" v-if="detailData.originalPrice && (detailData.minPrice === detailData.maxPrice)"><span>￥</span>{{detailData.originalPrice}}</div>
          <div class="grade-ticket" v-if="detailData && detailData.vipDiscountList && detailData.vipDiscountList.length > 0 && integralDeductType === 0">
            <span class="item" v-for="(ite, ind) in detailData.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{ite.guidePrice}}</i>
            </span>
          </div>
          <!-- <span class="integral-box">积分可抵扣50%</span> -->
          <!-- <span class="labe">12系列</span> -->
        </div>
        <div class="adress">
          <!-- <div>快递：<span>{{detailData.freightPrice === 0 ? '免运费':detailData.freightPrice}}</span></div> -->
          <div>快递：<span>{{freight}}</span></div>
          <div class="txt-cen">已售：<span>{{detailData.sellNum}}</span></div>
          <div class="txt-rig">广东深圳</div>
        </div>
        <p class="inte" v-if="integralDeductType > 0">
          <i class="icon jf-icon"></i>
          <span>积分可抵扣</span>
        </p>
      </div>
      <!-- <div class="select-box">
        <p>积分可抵扣<span class="col">最高可节省 ¥49.50</span> </p>
      </div> -->
      <div class="select-box" @click="toogleShowTicket" v-if="integralDeductType === 0 && couponList && couponList.length > 0">
        <p>领券
          <span class="ticket-mini ml60" v-if="couponList && couponList[0]">满{{couponList[0].useAmount}}减{{couponList[0].amount}}</span>
          <span class="ticket-mini" v-if="couponList && couponList[1]">满{{couponList[1].useAmount}}减{{couponList[1].amount}}</span>
          <i class="icon right-icon"></i>
        </p>
      </div>
      <div class="select-box">
        <p @click="selSpec">{{selectedSpecIds && selectedSpecIds.length>0?'已选：' + selectedSpec:'请选择规格'}}<i class="icon right-icon"></i></p>
        <p @click="showParamsEvt" class="specs">产品参数<i class="icon right-icon"></i></p>
      </div>
      <div class="travel-box" v-if="travalesActive">
        <p class="title">
          <i class="icon gift-icon"></i>
          <span>优惠信息</span>
        </p>
        <div class="main">
          <div class="travel-mod"  v-for="(item, index) in travalesGift" :key = index>
            <p class="sec-title">{{item.activityName}}</p>
            <div class="travel-mod-item" v-for="(ite, ind) in item.productList" :key = ind @click="goTravelDetail(ite.productId)">
              <img :src="ite.productImg || userlogo" alt="">
              <p class="tra-title">{{ite.productName}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-box">
        <p class="title">
          <span>用户点评</span>
          <span>({{commentData.commentCount}})</span>
          <i class="icon right-icon" v-if="commentDataList"></i>
          <span class="more" @click="toComment" v-if="commentDataList">查看全部</span>
        </p>
        <div class="text-center" style="padding: 10px 0; font-size: 14px;text-align: center" v-if="!commentDataList">暂无评价</div>
        <ul class="comment-list" v-if="commentDataList">
          <li>
            <img :src="urlPrefix + commentDataList.photo" class="head-img" v-if="commentDataList.photo">
            <img :src="userlogo" width="28" height="28"  class="head-img" v-else>
            <span class="name">{{commentDataList.mobile}}</span>
            <p class="detail">{{commentDataList.content}}</p>
          </li>
        </ul>
      </div>
      <div class="shop-box">
        <navigator :url="'/pages/goods/shop/main?id='+detailData.merchantId" class="shop-info" v-if="detailData.merchant">
          <img :src="detailData.merchant.logoImg" alt="" class="shop-img">
          <div class="shop-msg">
            <p class="name">{{detailData.merchant.merchantName}}</p>
            <p class="focus">{{detailData.merchant.followNum}}人关注</p>
          </div>
          <i class="icon right-icon"></i>
        </navigator>
        <div class="goshop-info">
          <span @click="toMerchant(2)">
            <i class="icon qbbb-icon"></i>
            全部宝贝
          </span>
          <span @click="toMerchant(1)">
            <i class="icon jdgg-icon"></i>
            进店逛逛
          </span>
        </div>
      </div>
      <div class="goods-intro">
        <p class="title">商品介绍</p>
        <div class="goods-detail" >
          <rich-text :nodes="detailData.productDesc"></rich-text>
        </div>
      </div>
      <div class="footer">
        <!-- <div class="model"> -->
          <p class="shop" @click="toMerchant(1)">
            <i class="icon dp-icon"></i>
            <span>店铺</span>
          </p>
          <!-- <button open-type="contact" class="service">
            <i class="icon ke-icon"></i>
            <span>客服</span>
          </button> -->
          <!-- <p class="follow">
            <i class="icon sc-icon"></i>
            <span>收藏</span>
          </p> -->
        <!-- </div> -->
        <!-- 无法加入购物车：1 有旅游赠品 2：会员专区商品（viptype=0是普通商品） 2：可以积分抵扣的商品integralDeductType > 0 -->
        <div class="shopping-car" @click="addCart"  v-if="!travalesActive && vipType == 0 && integralDeductType === 0 ">加入购物车</div>
        <div class="buy" @click="checkLogin(1)">&ensp;立即购买&ensp;</div>
      </div>
      <i class="icon gotop-icon" v-show="toTopShow" @click="scrollToTop"></i>

      <!-- 规格弹框 -->
      <div class="mask" :class="{show: showSpecClass || showParamsClass}" v-show="showSpec || showParams" @click="closeModal" @transitionend="closeEnd"></div>
      <div v-show="showSpec">
        <div class="modal-wrapper" :class="{show: showSpecClass}" >
          <div class="modal-header">
            <div class="img-wrap">
              <img class="img" :src="detailData.thumbnailImg" alt="" />
            </div>
            <div class="info">
              <p class="modal-name">{{detailData.productName}}</p>
              <!-- 普通商品价格展示 -->
              <p class="price" v-if="integralDeductType === 0">
                ￥<span>{{curSelPrice !== false ? curSelPrice:(detailData.minPrice === detailData.maxPrice ? detailData.minPrice : (detailData.minPrice+' ~ ￥'+ detailData.maxPrice))}}</span>
                <span class="oriPrice" v-if="originalPrice"><span>￥</span>{{originalPrice}}</span>
              </p>
              <!-- 积分抵扣商品价格展示 -->
              <p class="price" v-if="integralDeductType > 0">
                <span v-if="integralDeductType  === 1">￥{{curSelPrice !== false ? curSelPrice : detailData.originalPrice}}<span >+{{detailData.useIntegral}}积分</span></span>
                <span v-if="integralDeductType  === 2">{{detailData.useIntegral}}积分</span>
              </p>
              <p class="text">{{selectedSpecIds && selectedSpecIds.length>0?'已选：' + selectedSpec:''}}</p>
              <p class="text">库存：{{stock}}</p>
            </div>
            <icon type="clear" class="clear-icon" size="20" @click="closeModal" />
          </div>
            <div ref="specWrapper" class="modal-content">
              <dl class="list" v-for="(item, index) in specList" :key="index">
                <dt>请选择规格</dt>
                <dt>{{item.specName}}</dt>
                <dd v-for="(cItem, cIndex) in item.specValueList" :class="{'active': cItem.isActive === true}" class="spec-dd-hook" @click="specValueEvt($event, item.specValueList, cItem)" :key="cIndex">
                  <img v-if="item.hasImg == 1 && cItem.imgUrl" class="spec-icon" :src="detailData.urlPrefix+cItem.imgUrl" alt="">{{cItem.specValue}}</dd>
              </dl>
              <div class="weui-flex box-item">
                <div class="label">购买数量：</div>
                <div class="controll-content weui-flex__item">
                  <div class="button" @click="minus">-</div>
                  <!-- <input class="input" type="text" value="999"/> -->
                  <input class="input" type="text" v-model="buyCount" v-if="vipType === 0"/>
                  <input class="input" type="text" v-model="buyCount" disabled v-if="vipType !== 0"/>
                  <div class="button" @click="add">+</div>
                </div>
              </div>
              <!--<div class="weui-flex box-item">
                <div class="label">库存数量：</div>
                <div class="weui-flex__item">
                  <div class="stock-num">{{stock}}件</div>
                </div>
              </div>-->
            </div>
            <div class="modal-footer" v-if="showModalType === 0">
              <div class="button-item" @click="sureSelSpec">确定</div>
            </div>
            <div class="modal-footer" v-if="showModalType === 1">
              <div class="button-item" @click="sureAddCart">加入购物车</div>
            </div>
            <div class="modal-footer" v-if="showModalType === 2">
              <div class="button-item buy" @click="checkLogin(2)">立即购买</div>
            </div>
          </div>
      </div>
      <div v-show="showParams">
        <div class="modal-wrapper" :class="{show: showParamsClass}" >
          <div class="modal-content" style="word-break: break-all" v-if="detailData.productParameter">
            <rich-text :nodes="detailData.productParameter"></rich-text>
          </div>
        </div>
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
              <p><span class="ticket-type">{{item.couponType === 5 ? '平台优惠券' : '店铺优惠券'}}</span> </p>
              <p>{{item.startTime}}~{{item.endTime}}</p>
            </div>
            <div class="right" @click="getCoupon(item)"  v-if="!item.isReceive">
              <p>立即</p>
              <p>领取</p>
            </div>
            <div class="right" @click="showTicket = false" v-if="item.isReceive">
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
import Http from '../../../utils/http'
import parse from 'mini-html-parser2'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      isLogin: false,
      timer: null, // 定时器
      vipType: '', // 大于0为会员专区商品，不能选择数量
      integralDeductType: 0, // 积分抵扣商品 0-普通商品 1-部分抵扣 2-全额抵扣
      imgErrorMsg: '',
      goodsImg: '',
      goodsDetail: '',
      detailData: {},
      freight: '', // 运费
      sliderImgs: [],
      showModalType: 0,
      sellNum: 0,
      selectedSpec: [],
      showSpec: false,
      showParams: false,
      buyCount: 1,
      selectedSpecObj: {},
      selectedSpecIds: [],
      specList: [],
      commentData: {},
      commentDataList: false,
      urlPrefix: '',
      curSelPrice: false,
      originalPrice: false,
      stock: 0,
      toTopShow: false,
      cartCount: 0,
      showSpecClass: false,
      showParamsClass: false,
      show: false,
      travalesGift: [],
      travalesActive: false, // 是否有送旅游的活动
      posterImg: '',
      showImgUrl: [],
      qrCode: '',
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      couponList: [], // 优惠券列表
      showTicket: false,
      couponParam: false,
      userlogo: require('../../../../static/images/common/userlogo.png')
    }
  },
  onLoad(options) {
    this.id = options.id
    if (options.scene) { // 通过二维码分享进入
      let scene = decodeURIComponent(options.scene)
      let shareCode = scene.split('&')[0]
      this.id = scene.split('&')[1]
      wx.setStorageSync('promoterCode', shareCode)
    }
    this.reset()
    this.getDetail(this.id)
    this.getGiftTravel(this.id)
    this.getCartCount()
  },
  onShow() {
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        console.log('getSystemInfos', res)
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
      path: `/pages/goods/goodsDetail/main?id=${this.id}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  watch: {
    showSpec(n) {
      // 没选的话设置总库存
      if (!this.isSelected(false)) {
        console.log(this.detailData)
        this.stock = this.detailData.stock
      }
    }
  },
  methods: {
    reset() {
      this.buyCount = 1
      this.freight = ''
      this.stock = 0
      this.selectedSpec = []
      this.selectedSpecObj = {}
      this.selectedSpecIds = []
      this.couponList = []
      this.sliderImgs = []
      this.detailData = {}
      this.couponParam = ''
      this.commentDataList = false
      this.curSelPrice = false
      this.originalPrice = false
      this.showSpec = false
      this.showParams = false
      this.showSpecClass = false
      this.showParamsClass = false
      this.travalesActive = false
      this.showTicket = false
    },
    toogleShowTicket() {
      this.showTicket = !this.showTicket
    },
    getCommentList(id) {
      this.$http.post(this.API.getCommentList, {
        data: {
          productId: id
        }
      }).then(res => {
        if (res.code === 0) {
          this.urlPrefix = res.result.urlPrefix
          this.commentData = res.result
          this.commentDataList = res.result.pageList.data[0]
          let reg = new RegExp('(\\d{3})(\\d{4})(\\d{4})')
          this.commentDataList.forEach((item) => {
            item.mobile = item.mobile.replace(reg, '$1****$3')
          })
        }
      })
    },
    toComment() {
      wx.navigateTo({
        url: `/pages/goods/commentList/main?id=${this.id}`
      })
    },
    toMerchant(type) {
      wx.navigateTo({
        url: `/pages/goods/shop/main?id=${this.detailData.merchantId}&type=${type}`
      })
    },
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    minus() {
      if (this.vipType > 0) {
        wx.showToast({
          title: '会员专区商品不能选择数量',
          icon: 'none'
        })
        return
      }
      this.buyCount = Math.max(1, --this.buyCount)
    },
    add() {
      if (this.vipType > 0) {
        wx.showToast({
          title: '会员专区商品不能选择数量',
          icon: 'none'
        })
        return
      }
      if (!this.isSelected()) {
        return
      }
      let stock = this.selectedSpecObj[this.selectedSpecIds.join(',')].stock
      if (stock < ++this.buyCount) {
        wx.showToast({
          title: '超出库存数量',
          icon: 'none'
        })
        this.buyCount = Math.min(stock, this.buyCount)
        return
      }
      this.buyCount = Math.min(stock, this.buyCount)
    },
    selSpec() {
      this.showModalType = 0
      this.showSpec = true
      this.showSpecClass = true
    },
    sureSelSpec() {
      if (!this.isSelected()) {
        return
      }
      this.showSpec = false
      this.showSpecClass = false
      this.refreshSelect()
    },
    isSelected(showTips = true) {
      if (this.selectedSpecIds.length < this.detailData.specList.length) {
        if (showTips) {
          wx.showToast({
            title: '请选择规格',
            icon: 'none'
          })
        }
        return false
      }
      return true
    },
    closeModal() {
      this.showSpecClass = false
      this.showParamsClass = false
    },
    showParamsEvt() {
      this.showParams = true
      this.showParamsClass = true
    },
    /* eslint-disable*/
    getDetail(id) {
      this.$http.post(this.API.getProductDetail, {
        data: {
          id
        }
      }).then(res => {
        if (res.code === 0) {
          this.detailData = res.result
          this.queryCouponList() // 请求优惠券
          this.vipType = this.detailData.vipType
          this.integralDeductType = this.detailData.integralDeductType
          console.log('会员qqq', this.vipType)
          this.urlPrefix = res.result.urlPrefix
          this.detailData.merchant.logoImg = `${this.urlPrefix}${this.detailData.merchant.logoImg}`
          if (this.detailData.posterImg === '') {
            this.posterImg = ''
          } else {
            this.posterImg = `${this.urlPrefix}${this.detailData.posterImg}` // 分享海报
          }
          this.thumbnailImg = this.urlPrefix + res.result.thumbnailImg
          this.detailData.thumbnailImg = this.urlPrefix + this.detailData.thumbnailImg
          let  content = this.detailData.productDesc.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
          parse(content, (err, nodes) => { // 插件转化兼容更多图片
            if (!err) {
              this.detailData.productDesc = nodes
            }
          })
          let  content2 = this.detailData.productParameter.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
          parse(content2, (err, nodes) => { // 插件转化兼容更多图片
            if (!err) {
              this.detailData.productParameter = nodes
            }
          })
          let sliderImgs = []
          sliderImgs = res.result.sliderImgs.split(',')
          sliderImgs.forEach((item) => {
            this.sliderImgs.push(`${this.urlPrefix}${item}`)
          })
          this.detailData.specList.forEach(item => {
            item.specValueList.forEach(citem => {
              this.$set(citem, 'isActive', false)
            })
          })
          this.specList = this.detailData.specList
          // 将库存数组转换为对象
          this.detailData.stockList.forEach(item => {
            this.selectedSpecObj[item.specIds.split(',').sort().join(',')] = item
          })
          // 计算运费freight
          let freightType = this.detailData.freightType
          let freightPrice = this.detailData.freightPrice
          let city = wx.getStorageSync('selectCity') || wx.getStorageSync('userCity')
          let defaultDreight = '' // 默认运费
          if (freightType === 1) {
            this.freight = freightPrice === 0 ? '免运费' : `${freightPrice}元`
          }
          if (freightType === 2) {
            this.detailData.freightTemplate.parameters.forEach((item) => {
              let sendToCity = item.sendTo.split(',')
              let sendMoney = item.firstMoney
              sendToCity.forEach((ite) => {
                if (ite === city) { // 循环对应城市运费
                  this.freight = sendMoney === 0 ? '免运费' : `${sendMoney}元`
                }
              })
              if (item.sendTo === '') { // 存储默认运费
                defaultDreight = item.firstMoney === 0 ? '免运费' : `${item.firstMoney}元`
              }
            })
            if (this.freight === ''){ // 找不到对应城市就取默认运费
              this.freight = defaultDreight
            }
          }
          if (this.detailData.vipDiscountList.length > 0) {
            this.detailData.vipDiscountList.forEach((ite) => {
              this.$set(ite, 'guidePrice', Math.floor(this.detailData.minPrice * ite.discount / 10))
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
      this.getCommentList(id)
    },
    queryCouponList () { // 优惠券列表
      let data = {
        queryType: 1,
        merchantType: 2, // 1-旅游 2-名品名店
        createUser: this.detailData.merchant.id,
        productId: this.id,
        parentTypeId: this.detailData.merchant.classifyList[0].parentTypeId,
        productTypeId: this.detailData.merchant.classifyList[0].typeId
      }
      this.$http.post(this.API.couponList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.couponList = res.result.data
          this.couponList.forEach((item) => {
            this.$set(item, 'isReceive', false)
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
          merchantType : 2 // 优惠券类型：1-旅游 2-名品名店
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
    getGiftTravel(id) {
      this.$http.post(this.API.queryGiftActivityList, {
        data: {
          shopId: id
        }
      }).then(res => {
        if (res.code === 0){
          // let urlPrefix = res.result.urlPrefix
          this.travalesGift = res.result
          if (this.travalesGift.length > 0) {
            this.travalesActive = true
          }
          this.travalesGift.forEach((item) => {
            item.productList.forEach((ite) => {
              if (ite.productImg) {
                ite.productImg = `${this.urlPrefix}${ite.productImg}`
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
    /* eslint-disable*/
    getCartCount() {
      this.$http.post(this.API.getCartCount, {
        data: {},
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.cartCount = res.result
        }
      })
    },
    specValueEvt(event, item, citem) {
      item.forEach(value => {
        value.isActive = false
      })
      citem.isActive = true
      this.selectedSpecIds.push(citem.id)
      this.refreshSelect()
      if (this.selectedSpecIds.length >= this.detailData.specList.length) {
        let curItem = this.selectedSpecObj[this.selectedSpecIds.join(',')]
        this.curSelPrice = curItem.sellPrice
        this.originalPrice = curItem.originalPrice
        this.stock = curItem.stock
        this.stockId = curItem.id
        this.detailData.thumbnailImg = (this.urlPrefix + curItem.imgUrl) || this.thumbnailImg
      }
    },
    refreshSelect() {
      this.selectedSpec = []
      this.selectedSpecIds = []
      this.detailData.specList.forEach(item => {
        item.specValueList.forEach(citem => {
          if (citem.isActive) {
            this.selectedSpec.push(citem.specValue)
            this.selectedSpecIds.push(citem.id)
          }
        })
      })
      this.selectedSpecIds.sort()
    },
    addCart() {
      if (this.selectedSpec.length <= this.detailData.specList.length) {
        this.showModalType = 1
        this.showSpec = true
        this.showSpecClass = true
      } else {
        this.sureAddCart()
      }
    },
    sureAddCart() {
      if (!this.isSelected()) {
        return
      }
      let merchant = this.detailData.merchant
      this.$http.post(this.API.addCart, {
        data: {
          merchantId: merchant.id,
          merchantName: merchant.merchantName,
          stockId: this.stockId,
          num: this.buyCount,
          specName: this.selectedSpec.join('、')
        }
      }).then((res) => {
        if (res.code === 0) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success'
          })
          wx.setStorageSync('buyer_cart', res.result || '')
          this.getCartCount()
          this.showSpec = false
          this.showSpecClass = false
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    closeEnd() {
      this.showSpec = false
      this.showParams = false
    },
    goCart() {
      wx.navigateTo({
        url: '/pages/goods/shopCart/main'
      })
    },
    checkLogin(type) {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0 && res.result) {
            if (type === 1) {
              this.buy()
            }
            if (type === 2) {
              this.sureBuy()
            }
        } else {
            wx.navigateTo({
              url: `/pages/login/main`
            })
        }
      })
    },
    setItemJson() {
      this.itemJson = JSON.stringify([{
        merchantId: this.detailData.merchant.id,
        stockId: this.stockId,
        num: this.buyCount,
      }])
    },
    // setCouponParam() {
    //   // 传到下单页面的优惠券信息
    //   let couponParam = ''
    //   if (this.couponList.length > 0) { // 有优惠券
    //     couponParam = {
    //       createUser: this.detailData.merchant.id,
    //       productId: this.id,
    //       parentTypeId: this.detailData.merchant.classifyList[0].parentTypeId,
    //       productTypeId: this.detailData.merchant.classifyList[0].typeId
    //     }
    //     this.couponParam = JSON.stringify(couponParam)
    //   } else {
    //     this.couponParam = false
    //   }
    // },
    buy() {
      if (this.selectedSpecIds.length < this.detailData.specList.length) {
        this.showModalType = 2
        this.showSpec = true
        this.showSpecClass = true
        return
      }
      this.setItemJson()
      // this.setCouponParam()
      wx.navigateTo({
        url: `/pages/goods/confirmOrder/main?type=2&goodsId=${this.id}&traActive=${this.travalesActive}&itemJson=${this.itemJson}`
      })
    },
    goTravelDetail (id) {
      wx.navigateTo({
        url: `/pages/travel/travelDetail/main?parentId=${id}`
      })
    },
    sureBuy() {
      if (this.selectedSpecIds.length < this.detailData.specList.length) {
        wx.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }
      this.setItemJson()
      // this.setCouponParam()
      wx.navigateTo({
        url: `/pages/goods/confirmOrder/main?type=2&goodsId=${this.id}&traActive=${this.travalesActive}&itemJson=${this.itemJson}`
      })
    },
    // 生成分享二维码
    createWxQrcode () {
      wx.showLoading({
        title: '图片生成中'
      })
      let that = this
      if (this.posterImg === '') {
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
          page: 'pages/goods/goodsDetail/main',
          scene: `${shareCode}&${this.id}`,
          width: 90
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
                // step3:canves绘图
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
          // that.posterImg = res.tempFilePath // 下载后的二维码地址
          const ctx = wx.createCanvasContext(canvasId)
          // 绘制背景
          ctx.drawImage(bgImg, 0, 0, that.windowWidth, that.windowHeight)
          // 绘制小程序码qrImgSize 小数是自己计算的比例 单位均为px *2=rpx
          // 距离左边距离：288
          // 距离顶部距离：that.windowHeight * 0.8
          // 二维码宽: 70
          // 二维码高: 70
          ctx.drawImage(qrCode, that.windowWidth * 0.7, that.windowHeight * 0.84, 80, 80) // 二维码
          ctx.stroke()
          ctx.draw()
          setTimeout(() => {
            // canvas画布转换成图片地址
            wx.canvasToTempFilePath({
              canvasId: canvasId,
              success: (res) => {
                wx.uploadFile({ // 把临时地址改成服务器地址，解决安卓打开图片黑屏bug
                  url: Http.baseURL + '/uploadByUrl',
                  filePath: res.tempFilePath,
                  name: 'file',
                  success: function (r) {
                    r.data = JSON.parse(r.data)
                    if (r.data.code === 0) {
                      console.log('r.data.result', r.data.result)
                      that.showImgUrl.push(r.data.result)
                      that.previewImage()
                    } else {
                      wx.showToast({
                        title: '图片生成失败',
                        icon: 'none'
                      })
                    }
                  },
                  complete() {
                    wx.hideLoading()
                  }
                })
                // that.showImgUrl.push(res.tempFilePath)
                // that.previewImage()
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
.swiper{
  height: 750rpx;
}
.travel-box{
  padding-bottom: 20rpx;
  background: #fff;
  margin-top: 20rpx;
  .gift-icon{
    background-position: -253rpx 0;
    width: 35rpx;
    height: 35rpx;
    display: inline-block;
    margin: -10rpx 20rpx 0 30rpx;
  }
  .title{
    height: 98rpx;
    line-height: 98rpx;
    font-size: 30rpx;
  }
  .main{
    background: #fef8e7;
    padding: 30rpx;
    .travel-mod{
      margin-top: 20rpx;
      .sec-title{
        height: 50rpx;
        line-height: 50rpx;
        font-size: 24rpx;
        width: 65%;
        text-align: center;
        box-sizing: border-box;
        color: #fff;
        background: #88abda;
      }
      .travel-mod-item{
        margin-top: 25rpx;
        img{
          width: 130rpx;
          height: 98rpx;
          border-radius: 5rpx;
          display: inline-block;
        }
        .tra-title{
          display: inline-block;
          width: 75%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin-left: 25rpx;
          margin-top: 25rpx;
          vertical-align: top;
        }
      }
    }
    .travel-mod:nth-child(3n+2) .sec-title{
      background: #aa89bd;
    }
    .travel-mod:nth-child(3n+3) .sec-title{
      background: #eb6877;
    }
  }
}
.goods-detail-page{
  min-height: 100vh;
  background: #f4f4f4;
  padding-bottom: 99rpx;
}
.qrCode-box{
  background: rgba(0, 0, 0, 0.21);
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  right: 110rpx;
  top: 17rpx;
  position: absolute;
  z-index: 10;
  // border: 10px solid transparent;
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
.icon {
  background: url('../../../../static/images/goodsDetail.png');
  width: 62rpx;
  height: 60rpx;
  display: inline-block;
  background-size: 500rpx 120rpx;
  background-position: 0 -1rpx;
}
.right-icon{
  background-position:-232rpx 0;
  width: 15rpx;
  height: 30rpx;
  float: right;
  margin-top:2rpx;
}
.goods-img-box {
  position: relative;
  .goods-img{
    width: 100%;
    height: 750rpx;
    display: block;
  }
  .fl-top{
    position: fixed;
    top: 15rpx;
    right: 30rpx;
    .gd-icon{
      background-position: -70rpx -1rpx;
      margin-left: 18rpx;
    }
  }
}
.oriPrice{
  font-size: 20rpx;
  text-decoration: line-through;
  margin-left: 20rpx;
  display: inline-block;
  color: #888;
  span{
    color: #888;
  }
}
.grade-ticket{
  display: inline-block;
  .item{
    margin-left: 20rpx;
    i.grade-type{
      width: 40rpx;
      height: 30rpx;
      background-image: linear-gradient(-88deg, #333333 0%, #666666 100%),
      linear-gradient(#000000, #000000);
      background-blend-mode: normal, normal;
      border-radius: 5rpx 0rpx 0rpx 5rpx;
      color: #f5c56b;
      font-size: 20rpx;
      text-align: center;
      display: inline-block;
      position: relative;
    }
    // i.grade-type:after{
    //   content: ' ';
    //   position: absolute;
    //   top: 0;
    //   right: -8px;
    //   //下面为关键代码
    //   border-width: 20rpx 8rpx;
    //   border-style: solid;
    //   border-color: #fd3a51 transparent transparent transparent;
    // }
    i.grade-price{
      display: inline-block;
      text-align: center;
      color: #9f5608;
      font-size: 20rpx;
      width: 70rpx;
      height: 30rpx;
      background-image: linear-gradient(269deg,  #f0cb84 0%, #fadfab 100%),
      linear-gradient(#e0c083, #e0c083);
      background-blend-mode: normal, normal;
      border-radius: 0rpx 5rpx 5rpx 0rpx;
    }
  }
  .ml-20{
    margin-left: 20rpx;
  }
}
.goods-info{
  background: #fff;
  padding: 30rpx;
  .title {
    font-size: 30rpx;
  }
  .detail{
    font-size: 24rpx;
    color: #888;
    margin-top: 30rpx;
  }
  .price-box {
    margin-top: 30rpx;
    color: #fb3305;
    .symbol{
      font-size: 20rpx;
    }
    .price{
      font-size: 30rpx;
      display: inline-block;
    }
    .labe{
      color: #ff9913;
      border: 1rpx solid #dcdcdc;
      font-size: 20rpx;
      margin-left: 17rpx;
      padding: 7rpx 10rpx;
      border-radius: 5rpx;
      margin-top: 7rpx;
      vertical-align: top;
      display: inline-block;
    }
    .integral-box{
      display: inline-block;
      text-align: center;
      height: 45rpx;
      background-color: rgba(255, 0, 0, 0.04);
      border-radius: 30rpx;
      font-size: 22rpx;
      line-height: 45rpx;
      letter-spacing: 0rpx;
      color: #f60701;
      vertical-align: middle;
      padding: 0 20rpx;
      margin-left: 38rpx;
    }
  }
  .adress {
    display: flex;
    margin-top: 30rpx;
    div {
      flex-grow: 1;
      color: #888;
      font-size: 22rpx;
    }
    .txt-cen{
      text-align: center;
    }
    .txt-rig{
      text-align: right;
    }
  }
  .inte{
    margin-top: 30rpx;
    text-align: center;
    font-size: 24rpx;
    color: #353535;
    .jf-icon{
      background-position: -136rpx -1rpx;
      width: 28rpx;
      height: 26rpx;
    }
    span {
      vertical-align: top;
      margin-left: 10rpx ;
      margin-top: -3rpx;
      display: inline-block;
    }
  }
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
  .ml60{
    margin-left: 60rpx;
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
    margin-bottom: 30rpx;
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
    .qbbb-icon, .jdgg-icon{
      width: 24rpx;
      height: 24rpx;
    }
    .qbbb-icon{
      background-position: -172rpx -1rpx;
    }
    .jdgg-icon{
      background-position: -199rpx -1rpx;
    }
  }
}
.goods-intro {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  .title {
    padding-bottom: 30rpx;
    border-bottom: 1rpx solid #dcdcdc;
    margin-bottom: 30rpx;
  }
  .goods-detail{
    img {
      width: 100%;
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
  .shop, .service, .follow {
    margin-top:12rpx;
    flex-grow: 1;
    span{
      display: block;
    }
    button{
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
  .shopping-car, .buy{
    line-height: 98rpx;
    color: #fff;
    font-size: 30rpx;
    flex-grow: 2;
  }
  .shopping-car{
    background: #ff9913;
  }
  .buy{
    background: #f97230;
  }
}
.gotop-icon{
  // background:#fff;
  background-position: -143rpx -38rpx;
  position: fixed;
  bottom: 210rpx;
  right: 10rpx;
  width: 80rpx;
  height: 80rpx;
}
.modal-wrapper {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx;
  background-color: #fff;
  max-height: 70%;
  transform: translateY(100%);
  animation: hideMove .3s forwards;
  &.show {
    animation: mymove .3s forwards;
  }
  .modal-header {
    position: relative;
    display: flex;
    padding-bottom: 40rpx;
    border-bottom: 1px solid #eee;
    .text {
      font-size: 12px;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    padding: 20rpx 30rpx;
  }
  .modal-name {
    font-size: 16px;
  }
  .price {
    color: #fb3305;
  }
  .img {
    width: 200rpx;
    height: 200rpx;
  }
  .modal-content {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .clear-icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .label {
    line-height: 30px;
  }
  .list {
    padding: 20rpx 0;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }
  dt {
    margin: 0 20rpx;
    line-height: 30px;
  }
  dd {
    display: inline-block;
    background-color: #f2f2f2;
    padding: 10rpx 20rpx;
    border-radius: 10rpx;
    line-height: 20px;
    margin: 20rpx;
    &.active {
      background-color: #ff9913;
      color: #fff;
    }
  }
  .img-wrap {
    border-radius: 5px;
    overflow: hidden;
  }
}
.controll-content {
  display: flex;
  .button {
    display: inline-block;
    width: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #eee;
    color: #333;
    text-align: center;
  }
  .input {
    width: 120rpx;
    height: 56rpx;
    line-height: 60rpx;
    text-align: center;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}
.box-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}
.mask, .mask2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: all .3s linear;
  &.show {
    opacity: 1;
  }
}
.mask2{
  background-color: rgba(0, 0, 0, .6);
}
.stock-num {line-height: 30px}
  .modal-footer {
    display: flex;
    margin-top: 15px;
    height: 40px;
    .button-item {
      line-height: 40px;
      height: 40px;
      color: #fff;
      flex: 1;
      border-radius: 5px;
      background-color: #ff9913;
      text-align: center;
      &.buy {
        background-color: #f97230;
      }
    }
  }
  .gwc-icon {
    position: relative;
    .cart-count {
      display: inline-block;
      position: absolute;
      right: 0;
      top: 0;
      padding: 2px;
      font-size: 12px;
      color: #fff;
      background-color: #fb3305;
      line-height: 1;
      border-radius: 50%;
    }
  }
  .spec-icon {
    vertical-align: top;
    width: 40px;
    height: 20px;
    margin-right: 5px;
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
  z-index: 999;
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
        display: inline-block;
        width: 120rpx;
        height: 36rpx;
        line-height: 36rpx;
        font-size: 20rpx;
        background: #fbb03b;
        color:#fff;
        margin-right: 10rpx;
        text-align: center;
        border-radius: 20rpx;
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
