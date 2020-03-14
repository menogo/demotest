<template>
  <div class="travel-index-page">
    <banner :showSelect = "true" :flag = 1 :currentCity = currentCity></banner>
    <div class="cell-box">
      <!-- 旅游度假 -->
      <div class="cell-type type1" v-if="travelType">
        <div v-for="(item, index) in travelType" :key="index" @click="goSecondTra(item)">{{item.menuName}}</div>
      </div>
      <!-- 主题旅游 -->
      <div class="cell-type type2" v-if="travelTheme">
        <div v-for="(item, index) in travelTheme" :key="index" @click="goThemeTra(item)">{{item.menuName}}</div>
      </div>
      <!-- 机票酒店门票 -->
      <!-- <div class="cell-icon-box" v-if="otherModules">
        <div class="cell-icon-item" v-for="(item, index) in otherModules" :key="index">
          <img :src="item.imgUrl" alt="">
          <span>{{item.menuName}}</span>
        </div>
      </div> -->
    </div>
    <!-- 会员专区 -->
    <div class="theme-travel" >
      <div class="theme-item" @click="goMember">
        <p class="fir-title">会员中心</p>
        <p class="sec-title">尊享权益</p>
        <i class="member-icon"></i>
      </div>
      <div class="theme-item" @click="goCoupon">
        <p class="fir-title">领券中心</p>
        <p class="sec-title">神券在此</p>
        <i class="coupon-icon"></i>
      </div>
    </div>
    <!-- 超值特惠 -->
    <div class="discount-travel" v-if="discTravel.length > 0">
      <p class="headline">-  超值特惠  -</p>
      <div class="flex-box">
        <div class="flex-item"  v-for="(item, index) in discTravel" :key="index" @click="goTraDetail(item)">
          <div class="po-ret" >
            <img :src="item.shareProfitLogo" alt="" class="coinImg">
            <img :src="item.imgUrl" class="mainImg">
            <p>
              <span>{{item.departure}}出发</span>
              <span>￥{{item.price}}起</span>
            </p>
          </div>
          <p class="title">{{item.productName}}</p>
        </div>
      </div>
    </div>
    <!-- 本地特色 -->
    <div class="local-charac">
      <p class="headline">-  本地特色  -</p>
      <div class="local-charac-nav" v-if="localNavList">
        <span  v-for="(item, index) in localNavList" :key="index" @click="toggleLocalNav(item, index)" :class="{'active': index === localActive}">{{item.menuName}}</span>
      </div>
      <ul class="local-charac-tab" v-if="localList">
        <li v-for="(item, index) in localList" :key = "index"  @click="goTraDetail(item)">
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.imgUrl" alt="" class="mainImg">
          <div class="tab-right">
              <p class="title">{{item.productName}}</p>
              <p class="sign">
                <!-- <span>产品特色</span> -->
              </p>
              <p class="info">
                <span class="price"><span class="symbol">￥</span> <span class="num">{{item.price}}</span> <span>起</span></span>
                <span class="sell">已售<span>{{item.sellNum}}</span>人</span>
                <span class="grade">{{item.score}}分</span>
              </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import banner from '@/components/common/banner'
import utils from '../../utils'

export default {
  data () {
    return {
      qqmapsdk: '', // 定位
      currentCity: '',
      travelType: [], // 旅游度假列表
      travelTheme: [], // 主题旅游列表
      localNavList: [], // 本地特色tab
      otherModules: [], // 其他配置模块
      discTravel: [], // 超值特惠产品列表
      localList: [], // 本色特色列表
      localActive: 0,
      appMenuId: '',
      currentPage: 1, // 当前页数
      currentCount: 1, // 总页数
      coin2: require('../../../static/images/common/coin2.png')
      // memberImg: require('../../../static/images/common/member.jpg')
    }
  },
  onLoad (options) {
    console.log('index options', options)
    if (options.shareCode) {
      wx.setStorageSync('promoterCode', options.shareCode) // 通过分享进入，获得推荐人code(通过链接分享进入)
      console.log('index options.shareCode', options.shareCode)
      console.log('storage1', wx.getStorageSync('promoterCode'))
    }
    if (options.scene) { // 通过二维码分享进入
      let scene = decodeURIComponent(options.scene)
      wx.setStorageSync('promoterCode', scene)
      console.log('index options.scene', options.scene)
      console.log('storage2', wx.getStorageSync('promoterCode'))
    }
  },
  onShow () {
    this.reset()
    console.log(wx.getStorageSync('customerCode'))
    // flag: 1-旅游度假 2-主题旅游 3-机票酒店 4-本地特色
    this.getTravelType(1)
    this.getTravelType(2)
    this.getTravelType(3)
    // 超值特惠
    this.getDiscTravelList()
    if (wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('selectCity')
      this.getTravelType(4) // 周边游需要用到当前地
    } else {
      // if (!wx.getStorageSync('userCity')) { // 首次进入页面
      utils.getLocation().then(res => {
        this.currentCity = res.data.result.ad_info.city
        this.getTravelType(4)
      })
      // } else {
      // this.currentCity = wx.getStorageSync('userCity')
      // this.getTravelType(4)
      // }
    }
  },
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/travelIndex/main?shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  onReachBottom () { // 上拉触底事件
    if (this.currentPage >= this.currentCount) {
      console.log('数据加载完了')
    } else {
      // 下一页
      this.currentPage = this.currentPage + 1
      console.log(this.currentPage)
      this.toggleLocalNav()
    }
  },
  methods: {
    reset () {
      this.localList = []
      this.currentPage = 1
    },
    // 旅游度假
    getTravelType (flag) {
      this.$http.post(this.API.getMenu, {
        showLoading: false,
        data: {
          menuIndex: flag,
          menuType: 1, // 1、小程序 2、H5
          parentId: -1 // 一级菜单默认-1
        }
      }).then(res => {
        if (res.code === 0) {
          wx.hideLoading()
          switch (flag) {
            // flag: 1-旅游度假菜单 2-主题旅游菜单 3-机票酒店菜单 4-本地特色菜单 5-二级页面菜单
            case 1:
              this.travelType = res.result
              if (this.travelType.length > 5) {
                this.travelType.length = 5
              }
              break
            case 2:
              this.travelTheme = res.result
              if (this.travelTheme.length > 5) {
                this.travelTheme.length = 5
              }
              break
            case 3:
              this.otherModules = res.result
              break
            case 4:
              this.localNavList = res.result
              // 本地特色
              this.toggleLocalNav(this.localNavList[0], 0)
              break
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 超值特惠产品列表
    getDiscTravelList () {
      this.$http.post(this.API.getProList, {
        data: {
          recommendType: 3 // 1-推荐 2-精选 3-超值特惠
        }
      }).then(res => {
        if (res.code === 0) {
          wx.hideLoading()
          this.discTravel = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 二级旅游度假页面
    goSecondTra (item) {
      let url = ''
      // if (item.menuName.indexOf('自由') > -1) {
      //   url = `/pages/cruise/cruiseIndex/main`
      //   // url = `/pages/travel/independTra/main`
      //   wx.navigateTo({url: url})
      // }
      if (item.operate === 1) { // 1、进入二级菜单页 2、进入搜索列表页 3-跳转第三方页面(未加)
        url = `/pages/travel/travelSort/main?parentId=${item.id}&title=${item.menuName}`
      } else {
        url = `/pages/search/main?flag=3&parentId=${item.id}&title=${item.menuName}`
      }
      wx.navigateTo({
        url: url
      })
    },
    // 二级主题旅游页面
    goThemeTra (item) {
      let url = ''
      if (item.menuName.indexOf('邮轮') > -1 || item.menuName.indexOf('游轮') > -1) {
        url = `/pages/cruise/cruiseIndex/main`
        wx.navigateTo({url: url})
        return
      }
      if (item.operate === 1) { // 1、进入二级菜单页 2、进入搜索列表页 3-跳转第三方页面(未加)
        url = `/pages/travel/themeTra/main?parentId=${item.id}&title=${item.menuName}`
      } else {
        url = `/pages/search/main?flag=3&parentId=${item.id}&title=${item.menuName}`
      }
      wx.navigateTo({
        url: url
      })
    },
    // 本地特色切换
    toggleLocalNav (item, index) {
      let appMenuId = ''
      if (item && item.id) { // 点击切换
        appMenuId = item.id
        this.appMenuId = item.id
        this.currentPage = 1
        this.localList = []
      } else { // 上拉加载更多
        appMenuId = this.appMenuId
      }
      this.localActive = index
      this.$http.post(this.API.getProList, {
        data: {
          appMenuId: appMenuId,
          departure: this.currentCity,
          currentPage: this.currentPage,
          pagesize: 20
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          wx.hideLoading()
          this.localList = this.localList.concat(res.result.data)
          this.currentCount = res.result.currentCount
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 跳转产品详情页
    goTraDetail (item) {
      let url = ''
      if (item.typeName === '自由行') {
        url = `/pages/travel/independTra/main?parentId=${item.id}`
      } else {
        url = `/pages/travel/travelDetail/main?parentId=${item.id}`
      }
      wx.navigateTo({
        url: url
      })
    },
    goMember () {
      wx.navigateTo({
        url: '/pages/member/memberIndex/main'
      })
    },
    goCoupon () {
      wx.navigateTo({
        url: '/pages/goods/coupon/main'
      })
    }
  },
  components: {
    banner
  }
}
</script>

<style lang="scss" scoped>
.travel-index-page{
  min-height: 100vh;
  background: #f4f4f4;
}
.cell-box {
  padding: 30rpx;
  background: #fff;
  .cell-type.type1, .cell-type.type2{
    height: 185rpx;
    text-align: center;
    div{
      width: 237rpx;
      background: #4eabf0;
      height: 86rpx;
      float: left;
      margin-right: 5rpx;
      margin-bottom:5rpx;
      color: #fff;
      font-size: 34rpx;
      line-height: 86rpx;
    }
    div:first-child{
      background-image: url(../../../static/images/cellbg.png);
      background-size: 230rpx 370rpx;
      width: 205rpx;
      height: 175rpx;
      line-height: 175rpx;
    }
  }
  .cell-type.type2 {
    div{
      background: #f9625b;
    }
    div:first-child{
      background-position: 0 -186rpx;
    }
  }
  .cell-icon-box {
    display: flex;
    margin-top: 30rpx;
    justify-content: space-between;
    .cell-icon-item{
      flex-grow: 1;
      text-align: center;
      font-size: 26rpx;
      img{
        width: 55rpx;
        height: 55rpx;
        display: block;
        margin: 0 auto;
      }
    }
  }
}
.theme-travel, .discount-travel, .local-charac {
  margin-top: 20rpx;
  padding: 40rpx 30rpx;
  background: #fff;
  .headline {
    color: #000;
    font-size: 32rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }
}
.theme-travel {
  display: flex;
  .theme-item{
    flex-grow: 1;
    height: 180rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    border: solid 1rpx #eeeeee;
    position: relative;
    display: inline-block;
    .fir-title{
      font-size: 30rpx;
      margin-top:40rpx;
      margin-left: 25rpx;
    }
    .sec-title{
      font-size: 24rpx;
      color: #999999;
      margin-top: 20rpx;
      margin-left: 25rpx;
    }
    .member-icon, .coupon-icon{
      background-image: url(../../../static/images/common/member.png);
      background-size: 226rpx 112rpx;
      width: 112rpx;
      height: 112rpx;
      background-position: 0 0;
      position: absolute;
      right: 20rpx;
      top: 35rpx;
    }
    .coupon-icon{
      background-position: -112rpx 0;
    }
  }
  .theme-item:nth-child(1){
    margin-right:20rpx;
  }
}
.discount-travel {
  .flex-box {
    display: flex;
    overflow: scroll;
    .flex-item{
      width: 33%;
      margin-right: 15rpx;
      .po-ret {
        position: relative;
        width: 220rpx;
        height: 150rpx;
        .coinImg{
          position: absolute;
          left: 5rpx;
          top: 5rpx;
          width: 30rpx;
          height: 30rpx;
        }
        .mainImg {
          width: 100%;
          height: 100%;
          margin:0 auto;
        }
        p {
          position: absolute;
          bottom: 0;
          background: #000000;
          opacity: 0.5;
          height: 36rpx;
          line-height: 36rpx;
          color: #fff;
          width: 100%;
          span {
            font-size: 18rpx;
            margin-left: 7rpx;
            float: left;
          }
          span:last-child {
            float: right;
            margin-right: 7rpx;
          }
        }
      }
      .title{
        font-size: 22rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .flex-item:last-child{
      margin-right: 0;
    }
  }
}
.local-charac {
  padding: 30rpx 0 30rpx 0 ;
  .local-charac-nav {
    border-bottom: 1rpx solid #dcdcdc;
    padding: 0 50rpx;
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    span {
      display: inline-block;
      flex-grow: 1;
      text-align: center;
      font-size: 30rpx;
    }
    span.active {
      border-bottom: 4rpx solid #ff9913;
      color: #ff9913;
    }
  }
  .local-charac-tab {
    padding: 0 30rpx;
    li {
      margin-top: 30rpx;
      font-size: 20rpx;
      position: relative;
      .coinImg{
        position: absolute;
        left: 5rpx;
        top: 5rpx;
        width: 30rpx;
        height: 30rpx;
      }
      .mainImg {
        width: 150rpx;
        height: 120rpx;
        border-radius: 5rpx;
        display: inline-block;
      }
      .tab-right{
        float: right;
        width: 75%;
        .title {
          font-size: 26rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .sign {
          span {
            display: inline-block;
            color: #ff9913;
            border: 1rpx solid #ff9913;
            width: 100rpx;
            height: 30rpx;
            text-align: center;
            margin: 10rpx 10rpx 0 0 ;
            border-radius: 5rpx;
          }
        }
        .info {
          color: #888888;
          margin-top: 3rpx;
          .price {
            .num{
              color: #fb3305;
              font-size: 30rpx;
              margin-right: 5rpx;
            }
            .symbol{
              color: #fb3305;
            }
          }
          .sell {
            float: right;
            margin: 10rpx 10rpx 0 0 ;
          }
          .grade{
            color: #ff9913;
            float: right;
            margin: 10rpx 10rpx 0 0 ;
          }

        }
      }
    }
  }
}

</style>
