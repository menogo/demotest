<template>
  <div class="shop-container">
    <div class="header">
      <i class="qrCode-icon"  @click="createWxQrcode" v-if="posterImg != ''"></i>
      <div class="info">
        <div class="left">
          <img class="avatar" :src="logoImg || userlogo" alt="">
          <div class="text-wrap">
            <div class="name">{{shopDetail.merchantName}}</div>
            <div class="text">
              <span class="stars">
                <img class="star" :src="'/static/images/common/lu_icon'+ (shopDetail.score  > index ? '_active':'' )+'.png'" alt="" v-for="(item, index) in 5" :key = index>
              </span>
              <span class="sub-text">粉丝数 {{shopDetail.followNum}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- <span class="favo-wrap"><img class="favor" src="/static/images/common/favorite.png" alt="">关注</span> -->
        </div>
      </div>
      <div class="nav-wrap">
        <div  class="search-box" @click="goStoreSearch"><img class="icon-search" src="/static/images/common/search_icon.png" alt="">搜索</div>
        <div class="tab-item" :class="{active: curTab === 1}" @click="tabClick(1)">首页</div>
        <div class="tab-item" :class="{active: curTab === 2}" @click="tabClick(2)">全部商品</div>
      </div>
      <img class="bg-img" :src="backgroundImg" />
    </div>
    <!-- 首页 -->
    <div v-if="curTab === 1">
      <swiper class="swiper" :indicator-dots="false" autoplay="true" interval="3000" duration="1000" v-if="sliderImgList.length > 0">
        <block v-for="(item, index) in sliderImgList"  :key="index"  @click="goSlideDetail(item)">
          <swiper-item>
            <img :src="item.sliderImg" class="goods-img"/>
          </swiper-item>
        </block>
        </swiper>
        <div class="list-box">
        <div class="title">热门推荐</div>
        <ul class="list">
            <li class="item-wrap" v-for="(item, index) in recommendList" :key="index"  @click="goDetail(item.productId)">
              <div class="item">
                  <div class="img-wrap">
                  <img class="img" :src="item.productImg" alt="">
                  </div>
                  <div class="info-text">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">￥{{item.sellPrice}}</div>
                  </div>
            </div>
            </li>
        </ul>
      </div>
    </div>
    <!-- 全部商品 -->
    <div v-if="curTab === 2" >
      <div class="shop-content">
        <div class="select-main">
          <ul class="tab">
            <li @click="getSelectData(0)" :class="{'active': mode === 0}">综合</li>
            <li @click="getSelectData(1)" :class="{'active': mode === 1}">销量</li>
            <li @click="getSelectData()" :class="{'active': mode === ''}">新品</li>
            <li @click="getSelectData('price')">
              价格
              <i class="icon top-icon" :class="{'active': mode === 2}"></i>
              <i class="icon bot-icon" :class="{'active': mode === 3}"></i>
            </li>
            <!-- <li @click="openSelect('allSel')" >筛选<i class="icon select-icon active"></i></li> -->
          </ul>
        </div>
        <scroll-view scroll-y  @scrolltolower="scrollBot" class="list-box">
          <ul class="list">
            <li class="item-wrap" v-for="(item, index) in goodsList" :key="index">
              <div class="item" @click="goDetail(item.id)">
                <div class="img-wrap">
                  <img class="img" :src="item.imgUrl" alt="">
                </div>
                <div class="info-text">
                  <div class="name">{{item.productName}}</div>
                  <div class="footer-text"><div class="price">￥{{item.price}}</div><span class="c-9">已售:{{item.sellNum}}</span></div>
                </div>
              </div>
            </li>
          </ul>
        </scroll-view>
      </div>
    </div>
    <canvas canvas-id="shareCanvas" :style="computedClassObject"></canvas>
  </div>
</template>
<script>
export default {
  data () {
    return {
      logoImg: '',
      backgroundImg: '',
      sliderImgList: [],
      curTab: 1,
      merchantId: '', // 店铺id
      shopDetail: {}, // 店铺详情
      recommendList: [], // 更多推荐列表
      goodsList: [], // 商品排序列表
      showImgUrl: [],
      qrCode: '',
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      curPage: 1,
      mode: 0,
      posterImg: '',
      urlPrefix: '',
      sortType: '', // 排序入参
      isPriceRise: true, // 价格排序是降序
      userlogo: require('../../../../static/images/common/userlogo.png'),
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onLoad(options) {
    this.merchantId = options.id
    if (options.type) {
      this.curTab = Number(options.type)
      this.tabClick(this.curTab)
    }
    if (options.scene) { // 通过二维码分享进入
      let scene = decodeURIComponent(options.scene)
      let shareCode = scene.split('&')[0]
      this.merchantId = scene.split('&')[1]
      console.log('scene', scene)
      console.log('shareCode', shareCode)
      console.log('merchantId', this.merchantId)
      wx.setStorageSync('promoterCode', shareCode)
    }
  },
  onShow () {
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.windowWidth = res.windowWidth
        this.windowHeight = res.windowHeight
      }
    })
    this.getDetail()
  },
  methods: {
    tabClick(index) {
      this.curTab = index
      if (this.curTab === 1) {
        this.getProList()
        this.getSliderImgs()
      }
      if (this.curTab === 2) {
        this.getAllPrdList()
        this.goodsList = []
      }
    },
    // 商家详情
    getDetail() {
      this.$http.post(this.API.getMerchantDetail, {
        data: {
          id: this.merchantId
        }
      }).then(res => {
        if (res.code === 0) {
          this.shopDetail = res.result
          this.urlPrefix = res.result.urlPrefix
          this.backgroundImg = `${this.urlPrefix}${this.shopDetail.backgroundImg}`
          if (this.shopDetail.logoImg === '') {
            this.logoImg = ''
          } else {
            this.logoImg = `${this.urlPrefix}${this.shopDetail.logoImg}` // 店铺头像
          }
          if (this.shopDetail.posterImg === '') { // 分享海报
            this.posterImg = ''
          } else {
            this.posterImg = `${this.urlPrefix}${this.shopDetail.posterImg}`
          }
          // let sliderImgList = res.result.sliderImgList // 轮播图
          // sliderImgList.forEach((item) => {
          //   this.sliderImgs.push(`${this.urlPrefix}${item}`)
          // })
          console.log(this.sliderImgs)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 轮播图推荐
    getSliderImgs() {
      this.$http.post(this.API.queryShopSlider, {
        data: {
          id: this.merchantId
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.sliderImgList = res.result
        }
      })
    },
    // 更多推荐列表
    getProList() {
      this.$http.post(this.API.queryShopRecommend, {
        data: {
          id: this.merchantId
        }
      }).then(res => {
        if (res.code === 0) {
          this.recommendList = res.result
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 全部商品
    getAllPrdList(sortType) {
      this.goodsList = []
      this.$http.post(this.API.getProList, {
        data: {
          merchantId: this.merchantId,
          currentPage: this.curPage,
          pageSize: 10,
          sortType: sortType || ''
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          if (res.result.data.length > 0) {
            this.goodsList = this.goodsList.concat(res.result.data)
            this.curPage = res.result.currentPage
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getSelectData (mode) {
      this.curPage = 1
      this.mode = mode
      if (mode === 'price') {
        this.isPriceRise = !this.isPriceRise
        if (this.isPriceRise === true) {
          this.mode = 3 // 价格由高到低
        } else {
          this.mode = 2 // 价格由低到高
        }
      }
      this.sortType = this.mode
      this.getAllPrdList(this.sortType)
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
      let that = this
      let shareCode = wx.getStorageSync('customerCode') // 本人分享id
      // step1:生成分享二维码
      this.$http.post(this.API.createWxQrcode, {
        data: {
          page: 'pages/travel/travelStore/main',
          scene: `${shareCode}&${this.merchantId}`,
          width: 80
        }
      }).then(res => {
        if (res.code === 0) {
          // step2:把二维码地址下载到本地
          wx.downloadFile({
            url: res.result, // 后端返回的二维码地址
            success: function (res) {
              if (res.statusCode === 200) {
                that.qrCode = res.tempFilePath // 下载后的二维码地址
                // step3:canves绘1张图
                that.showImgUrl = []
                that.getShareImg(that.posterImg, that.qrCode, 'shareCanvas')
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
      wx.getImageInfo({
        src: imgurl,
        success: res => {
          const ctx = wx.createCanvasContext(canvasId)
          // 绘制背景
          ctx.drawImage(res.path, 0, 0, this.windowWidth, this.windowHeight)
          // 绘制小程序码qrImgSize 小数是自己计算的比例 单位均为px *2=rpx
          // 距离左边距离：288
          // 距离顶部距离：that.windowHeight * 0.8
          // 二维码宽: 70
          // 二维码高: 70
          ctx.drawImage(qrCode, this.windowWidth * 0.75, this.windowHeight * 0.84, 70, 70) // 二维码
          ctx.stroke()
          ctx.draw()
          setTimeout(() => {
            // canvas画布转换成图片地址
            wx.canvasToTempFilePath({
              canvasId: canvasId,
              success: (res) => {
                this.showImgUrl.push(res.tempFilePath)
                this.previewImage()
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
      wx.previewImage({
        urls: this.showImgUrl
      })
    },
    goStoreSearch () {
      wx.navigateTo({
        url: `/pages/traStoreSearch/main?merchantId=${this.merchantId}`
      })
    },
    goDetail (id) {
      wx.navigateTo({
        url: `/pages/travel/travelDetail/main?parentId=${id}`
      })
    },
    goSlideDetail(item) {
      if (item.productTypeId === 3 || item.productTypeId === 4 || item.productTypeId === 6 || item.productTypeId === 9) { // 普通
        wx.navigateTo({
          url: `/pages/travel/travelDetail/main?parentId=${item.productId}`
        })
      }
      if (item.productTypeId === 5 || item.productTypeId === 8) { // 自由行
        wx.navigateTo({
          url: `/pages/travel/independTra/main?parentId=${item.productId}`
        })
      }
      if (item.productTypeId === 12) { // 邮轮
        wx.navigateTo({
          url: `/pages/cruise/cruiseDetail/main?productId=${item.productId}`
        })
      }
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
        // height: `800rpx`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, .3);
  color: #fff;
  overflow: hidden;
  height: 200rpx;
  box-sizing: border-box;
}
.qrCode-icon{
  width: 37rpx;
  height: 34rpx;
  margin: 0 auto;
  background: url(../../../../static/images/meIcon.png);
  background-size: 500rpx 200rpx;
  background-position: -334rpx -49rpx;
  float: right;
}
.info {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  .left {
    display: flex;
    .text-wrap {
      flex: 1;
      margin-left: 10px;
    }
    .text {
      display: flex;
      font-size: 20rpx;
    }
  }
  .name {
    line-height: 1;
    margin-bottom: 5px;
    font-size: 34rpx;
  }
  .stars {
    display: flex;
    margin-right: 10px;
  }
  .star {
    width: 14px;
    height: 14px;
    margin: 0 1px;
    background-size: auto 14px;
  }
  .sub-text {
    font-size: 10px;
  }
}
.nav-wrap {
  display: flex;
}
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.right {
  display: flex;
}
.favo-wrap {
  display: block;
  padding: 4px 8px;
  height: 46rpx;
  border-radius: 20px;
  border: 1px solid #fff;
  font-size: 26rpx;
  line-height: 32rpx;
  box-sizing: border-box;
}
.favor {
  vertical-align: top;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.more {
  display: inline-block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  margin-left: 20px;
  text-align: center;
  background-color: #a5b1b0;
  .icon {
    width: 4px;
    height: 12px;
  }
}
.bg-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: -1;
  filter: blur(10rpx);
  height: 200rpx;
}
.search-box {
  display: flex;
  padding: 4px 8px;
  height: 16px;
  background-color: rgba(169,169,169,.3);
  border-radius: 20px;
  margin-right: 27px;
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  .icon-search {
    vertical-align: top;
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
}
.tab-item {
  position: relative;
  line-height: 16px;
  font-size: 30rpx;
  margin-right: 25px;
  &.active::after {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    bottom: 0;
    border: 1px solid #fff;
  }
}
.nav-wrap {
  display: flex;
}
.footer-box {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #eee;
  .item {
    display: flex;
    align-items: center;
    padding-left: 14px;
    flex: 1;
    background-color: #fff;
    line-height: 48px;
  }
  .icon {
    vertical-align: top;
    width: 17px;
    height: 17px;
    margin-right: 5px;
  }
}
.goods-img{
    width: 100%;
    height: 500rpx;
    display: block;
  }
  .swiper {
    height: 500rpx;
  }
  .list-box {
    padding: 0 14px;
    .title {
      line-height: 18px;
      font-size: 16px;
      padding-left: 10px;
      margin-top: 35px;
      margin-bottom: 7px;
      border-left: 3px solid #fbb03b;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -7px;
    }
    .item-wrap {
      width: 50%;
      padding: 7px;
      box-sizing: border-box;
      border-radius:8rpx;
    }
    .item {
      background-color: #fff;
    }
    .info-text {
      padding: 7px 14px 14px;
      font-size: 14px;
    }
    .name {
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient: vertical;
      line-height: 16px;
    }
    .price {
      margin-top: 5px;
      color: #fbb03b;
    }
    .img-wrap {
      position: relative;
      height: 250rpx;
      .img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 8rpx 8rpx 0 0 ;
      }
    }
  }
  .select-main{
    background: #fff;
    font-size: 28rpx;
    position: relative;
    .tab{
      display: flex;
      height: 89rpx;
      line-height: 89rpx;
      justify-content: space-between;
      padding: 0 30rpx;
      li {
        width: 100rpx;
        text-align: center;
      }
      li.active{
        color: #fbb03b
      }
    }
  }
  .prd-box {
    margin: 30rpx 30rpx 0 30rpx;
    .title{
      color:#888;
      margin-top: 50rpx;
      text-align: center;
      font-size:28rpx;
    }
    .select-item{
      background: #fff;
      padding-bottom: 20rpx;
      margin-bottom: 35rpx;
      width: 330rpx;
      display: inline-block;
      border-radius: 8rpx;
      img{
        width: 330rpx;
        height: 330rpx;
        display: block;
        border-radius: 8rpx 8rpx  0 0;
      }
      .main-title{
        margin: 15rpx 25rpx 5rpx 25rpx;
        font-size: 28rpx;
        text-align: left;
        color: #353535;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .select-item:nth-child(2n+1){
      margin-right: 30rpx;
    }
    .main{
      color: #ff9913;
      margin: 0 25rpx 5rpx 25rpx;
      .price{
        font-size: 32rpx;
      }
      .fz20{
        font-size: 20rpx;
      }
    }
  }
  .icon{
    background: url('../../../../static/images/travelSort.png');
    background-size: 200rpx 200rpx;
    width: 20rpx;
    height: 10rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .top-icon, .top-icon.active{
    background-position: -92rpx -35rpx;
    margin-top: -12rpx;
    margin-left: 2rpx;
  }
  .top-icon.active{
    background-position: -144rpx -19rpx;
  }
  .bot-icon, .bot-icon.active{
    background-position: -92rpx -44rpx;
    margin-left: -21rpx;
    margin-top: 11rpx;
  }
  .bot-icon.active{
    background-position: -110rpx -44rpx;
    margin-left: -23rpx;
  }
  .select-icon, .select-icon.active{
    background-position: -165rpx -5rpx;
    margin-left: 5rpx;
    width: 25rpx;
    height: 25rpx;
  }
  .select-icon.active{
    background-position: -36rpx -36rpx;
  }
  .list-box {
    // position: absolute;
    // top: 44px;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 7px 14px;
    box-sizing: border-box;
    .title {
      line-height: 18px;
      font-size: 16px;
      padding-left: 10px;
      margin-top: 40rpx;
      margin-bottom: 7px;
      border-left: 3px solid #fbb03b;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -7px;
    }
    .item-wrap {
      width: 50%;
      padding: 7px;
      box-sizing: border-box;
    }
    .item {
      background-color: #fff;
    }
    .info-text {
      padding: 15rpx 15rpx 15rpx 20rpx;
      font-size: 14px;
    }
    .name {
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient: vertical;
      line-height: 16px;
      font-size: 26rpx;
    }
    .price {
      margin-top: 5px;
      color: #fbb03b;
    }
    .img-wrap {
      position: relative;
      height: 250rpx;
      .img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px 5px 0 0 ;
      }
    }
  }
  .footer-text {
    display: flex;
    justify-content: space-between;
  }
  .c-9 {
    height: 12px;
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }
</style>
