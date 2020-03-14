<template>
  <div class="me-page">
    <banner :showSelect = "true" :flag = 2></banner>
    <div class="config-modules-box">
      <div class="config-item" v-for="(item, index) in navData" @click="goList(item.id)" :key = index>
        <img :src="item.imgUrl" alt="" />
        <p>{{item.menuName}}</p>
      </div>
    </div>
    <div class="integral-box"  @click="goIntegral">
      <img src="https://deer99.com/imgSer/resource/image/score.png" alt="">
    </div>
    <!-- 优选清单 -->
    <div class="fine-select" v-if="listData1.length > 0">
      <p class="title"><span class="line"></span>优选清单</p>
      <div class="goods-card" >
        <div class="goods-card-item" @click="goGoodsDetail(item.id, item.sellNum)" v-for="(item, index) in listData1" :key = index>
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.thumbnailImg" alt="">
          <p class="goods-title">{{item.productName}}</p>
          <p class="grade-ticket" v-if="item.vipDiscountList.length > 0">
            <span class="item" v-for="(ite, ind) in item.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{guidePrice}}</i>
            </span>
          </p>
          <p>
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <!-- <span class="ticket">券</span> -->
            <span class="buynum">已售:{{item.sellNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 新品精选 -->
    <div class="news-select" v-if="listData2.length > 0">
      <p class="title"><span class="line"></span>新品精选</p>
      <div class="goods-card" >
        <div class="goods-card-item" @click="goGoodsDetail(item.id, item.sellNum)" v-for="(item, index) in listData2" :key = index>
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.thumbnailImg" alt="">
          <p class="goods-title">{{item.productName}}</p>
          <p class="grade-ticket" v-if="item.vipDiscountList.length > 0">
            <span class="item" v-for="(ite, ind) in item.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{guidePrice}}</i>
            </span>
          </p>
          <p>
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <span class="buynum">已售:{{item.sellNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 热门精选 -->
    <div class="hot-select" v-if="listData3.length > 0">
      <p class="title"><span class="line"></span>热门精选</p>
      <div class="goods-card" >
        <div class="goods-card-item" @click="goGoodsDetail(item.id, item.sellNum)" v-for="(item, index) in listData3" :key = index>
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.thumbnailImg" alt="">
          <p class="goods-title">{{item.productName}}</p>
          <p class="grade-ticket" v-if="item.vipDiscountList.length > 0">
            <span class="item" v-for="(ite, ind) in item.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{guidePrice}}</i>
            </span>
          </p>
          <p>
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <span class="buynum">已售:{{item.sellNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 猜你喜欢 -->
    <div class="guess-like" v-if="listData4.length > 0">
      <p class="title"><span class="line"></span>猜你喜欢</p>
      <div class="goods-card" >
        <div class="goods-card-item" @click="goGoodsDetail(item.id, item.sellNum)" v-for="(item, index) in listData4"  :key = index>
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.thumbnailImg" alt="">
          <p class="goods-title">{{item.productName}}</p>
          <p class="grade-ticket" v-if="item.vipDiscountList.length > 0">
            <span class="item" v-for="(ite, ind) in item.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{guidePrice}}</i>
            </span>
          </p>
          <p>
            <span class="symbol">￥</span>
            <span class="price">{{item.price}}</span>
            <span class="buynum">已售:{{item.sellNum}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import banner from '@/components/common/banner'
  export default {
    data() {
      return {
        navData: [],
        listJson: ['listData1', 'listData2', 'listData3', 'listData4'],
        listData1: [],
        listData2: [],
        listData3: [],
        listData4: [],
        coin1: require('../../../static/images/common/coin1.png'),
        coin2: require('../../../static/images/common/coin2.png')
      }
    },
    onShow() {
      this.getNav()
      this.getList(1)
    },

    components: {
      banner
    },

    methods: {
      goGoodsDetail (id, count) {
        wx.navigateTo({
          url: '/pages/goods/goodsDetail/main?id=' + id
          // url: '/pages/goods/goodsPay/main'
        })
      },
      getNav() {
        this.$http.post(this.API.getMenu, {
          data: {
            menuIndex: 7,
            menuType: 1 // 1、小程序 2、H5
          }
        }).then(res => {
          if (res.code === 0) {
            this.navData = res.result
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      goList(id) {
        wx.navigateTo({
          url: `/pages/goods/goodsSearch/main?searchType=2&appMenuId=${id}`
        })
      },
      getList(type) {
        this.$http.post(this.API.getShopList, {
          data: {
            recommendType: type
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            res.result.data.forEach((item) => {
              if (item.vipDiscountList.length > 0) {
                item.vipDiscountList.forEach((ite) => {
                  this.$set(ite, 'guidePrice', Math.floor(item.price * ite.discount / 10))
                })
              }
            })
            this[this.listJson[type - 1]] = res.result.data
            if (type < 4) this.getList(++type)
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      goIntegral () {
        this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
          if (res.code === 0) {
            if (res.result) {
              wx.navigateTo({
                url: `/pages/integral/index/main`
              })
            } else {
              wx.setStorageSync('loginPage', '/pages/integral/index/main') // 存储登录后要跳转的页面
              wx.navigateTo({
                url: '/pages/login/main'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .me-page {
    min-height: 100vh;
    background: #f4f4f4;
  }
  .config-modules-box {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    // height: 375rpx;
    font-size: 24rpx;
    color: #141414;
    padding-bottom: 30rpx;
    align-content: space-around;
    .config-item {
      width: 25%;
      text-align: center;
      margin-top: 30rpx;
      img {
        width: 100rpx;
        height: 100rpx;
      }
    }

  }
  .fine-select, .news-select, .hot-select, .guess-like{
    padding: 35rpx 20rpx 0 20rpx;
    .title {
      font-size: 35rpx;
      margin-bottom: 10rpx;
      .line {
        display: inline-block;
        width: 5rpx;
        height: 35rpx;
        background: #ff9913;
        vertical-align: text-top;
        margin-top: 6rpx;
        margin-right: 15rpx;
      }
    }
    .goods-card{
      display: flex;
      flex-wrap: wrap;
      .goods-card-item:nth-child(2n){
        margin-right: 0;
      }
      .goods-card-item{
        position: relative;
        background: #fff;
        border-radius: 10rpx;
        margin: 20rpx 20rpx 0 0 ;
        width: 345rpx;
        font-size: 28rpx;
        padding-bottom: 20rpx;
        img{
          width: 100%;
          height: 330rpx;
          margin: 0 auto;
          border-radius: 10rpx 10rpx 0 0;
          display: block;
        }
        .coinImg{
          position: absolute;
          left: 5rpx;
          top: 5rpx;
          width: 40rpx;
          height: 40rpx;
        }
        p {
          padding: 0 10rpx;
        }
        .goods-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin:15rpx 0;
          height: 95rpx;
        }
        .grade-ticket{
          .item{
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
        .symbol{
          font-size: 19rpx;
          color: #ff9913;
        }
        .ticket{
          width: 24rpx;
          height: 24rpx;
          border-radius: 3rpx;
          border: solid 1rpx #ff0000;
          font-size: 20rpx;
          color: #ff0000;
          margin-left: 10rpx;
          display: inline-block;
          text-align: center;
          line-height: 24rpx;
          vertical-align: middle;
        }
        .price{
          font-size:28rpx;
          color: #ff9913;
        }
        .buynum{
          color: #7d7d7d;
          font-size: 18rpx;
          float: right;
          margin-top: 10rpx;
          margin-right: 20rpx;
        }

      }
    }
  }
  .integral-box{
    background: #fff;
    margin-top: 20rpx;
    margin-bottom:20rpx;
    padding:30rpx;
    img{
      display: block;
      width: 100%;
      height:197rpx;
    }
  }
</style>
