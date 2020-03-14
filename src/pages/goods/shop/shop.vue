<template>
  <div class="shop-container">
    <i class="qrCode-icon"  @click="createWxQrcode" v-if="posterImg != ''"></i>
    <div class="header">
      <div class="info">
        <div class="left">
          <img class="avatar" :src="logoImg || userlogo" alt="">
          <div class="text-wrap">
            <div class="name">{{shopDetail.merchantName}}</div>
            <div class="text">
              <span class="stars">
                <img class="star" :src="'/static/images/common/lu_icon'+(shopDetail.score > index ? '_active':'')+'.png'" alt="" v-for="(item, index) in 5" :key = index>
              </span>
              <span class="sub-text">粉丝数 {{shopDetail.followNum}}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- <span class="favo-wrap"><img class="favor" src="/static/images/common/favorite.png" alt="">关注</span> -->
          <!-- <span class="more"><img class="icon" src="/static/images/common/more_icon.png" alt=""></span> -->
        </div>
      </div>
      <div class="nav-wrap">
        <navigator :url="'/pages/goods/goodsSearch/main?searchType=3&merchantId='+shopDetail.id" class="search-box"><img class="icon" src="/static/images/common/search_icon.png" alt="">搜索</navigator>
        <div class="tab-item" :class="{active: curTab === 1}" @click="tabClick(1)">首页</div>
        <div class="tab-item" :class="{active: curTab === 2}" @click="tabClick(2)">全部商品</div>
      </div>
      <img class="bg-img" :src="backgroundImg" />
    </div>
    <div>
      <homeComponent  v-if="curTab === 1"></homeComponent>
      <shopListComponent v-else-if="curTab === 2"></shopListComponent>
    </div>
<!--    <div class="footer-box">
      <div class="item">
        <img class="icon" src="/static/images/common/shop_icon.png" alt=""><span class="text">全部商品</span>
      </div>
      <div class="item">
        <img class="icon" src="/static/images/common/cate_icon.png" alt=""><span class="text">商品分类</span>
      </div>
      <div class="item">
        <img class="icon" src="/static/images/common/service_icon.png" alt=""><span class="text">联系客服</span>
      </div>
    </div>-->
    <canvas canvas-id="shareCanvas" :style="computedClassObject"></canvas>
  </div>
</template>
<script>
import homeComponent from '@/components/goodShopHome'
import shopListComponent from '@/components/shopList'
export default {
  data () {
    return {
      logoImg: '',
      backgroundImg: [],
      userlogo: require('../../../../static/images/common/userlogo.png'),
      curTab: 1,
      shopDetail: {},
      showImgUrl: [],
      merchantId: '', // 商户id
      qrCode: '',
      windowWidth: 0, // 可使用窗口宽度
      windowHeight: 0,
      posterImg: '',
      urlPrefix: ''
    }
  },
  onLoad(options) {
    this.merchantId = options.id
    if (options.type) {
      this.curTab = Number(options.type)
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
    this.backgroundImg = []
    this.getDetail()
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
  components: {
    homeComponent,
    shopListComponent
  },
  methods: {
    tabClick(index) {
      this.curTab = index
    },
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
          if (this.shopDetail.posterImg === '') {
            this.posterImg = ''
          } else {
            this.posterImg = `${this.urlPrefix}${this.shopDetail.posterImg}`
            console.log('this.posterImg', this.posterImg)
          }
        }
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
    },
    // 生成分享二维码
    createWxQrcode () {
      let that = this
      let shareCode = wx.getStorageSync('customerCode') // 本人分享id
      // step1:生成分享二维码
      this.$http.post(this.API.createWxQrcode, {
        data: {
          page: 'pages/goods/shop/main',
          scene: `${shareCode}&${this.merchantId}`,
          width: 70
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
          ctx.drawImage(res.path, 0, 0, 375, this.windowHeight)
          // 绘制小程序码qrImgSize 小数是自己计算的比例 单位均为px *2=rpx
          // 距离左边距离：288
          // 距离顶部距离：that.windowHeight * 0.8
          // 二维码宽: 70
          // 二维码高: 70
          ctx.drawImage(qrCode, 288, this.windowHeight * 0.82, 70, 70) // 二维码
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
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
          console.log(res)
        }
      })
    },
    // 预览图片
    previewImage () {
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
        // height: `800rpx`
      })
    }
  }
}
</script>
<style>
  .shop-content {
    position: absolute;
    top: 98px;
    /*bottom: 48px;*/
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 20px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
<style lang="scss" scoped>

  .header {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    overflow: hidden;
  }
  .qrCode-icon{
    width: 37rpx;
    height: 34rpx;
    margin: 0 auto;
    background: url(../../../../static/images/meIcon.png);
    background-size: 500rpx 200rpx;
    background-position: -334rpx -49rpx;
    position: absolute;
    z-index: 9;
    right: 15rpx;
    top: 15rpx;
  }
  .info {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    .text {

    }
    .left {
      display: flex;
      .text-wrap {
        flex: 1;
        margin-left: 10px;
      }
      .text {
        display: flex;
      }
    }
    .name {
      line-height: 1;
      margin-bottom: 5px;
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
    height: 16px;
    border-radius: 20px;
    border: 1px solid #fff;
    font-size: 14px;
    line-height: 16px;
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
    height: 100px;
    z-index: -1;
    filter: blur(5rpx);
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
    .icon {
      vertical-align: top;
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
  .tab-item {
    position: relative;
    line-height: 16px;
    font-size: 14px;
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
</style>
