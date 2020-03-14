<template>
  <div class='page'>
    <div class="search-box">
      <i class="searchIcon"></i>
      <input type="text" placeholder="搜索"  v-model="searchTxt" @confirm="keyWordSearch">
    </div>
    <div class="select-main">
      <ul class="tab">
        <li @click="getSelectData(0)" :class="{'active': mode === 0}">综合</li>
        <li @click="getSelectData(1)" :class="{'active': mode === 1}">销量</li>
        <li @click="getSelectData(2)" :class="{'active': mode === 2}">新品</li>
        <li @click="getSelectData('price')">
          价格
          <i class="icon top-icon" :class="{'active': mode === 3}"></i>
          <i class="icon bot-icon" :class="{'active': mode === 4}"></i>
        </li>
        <!-- <li @click="openSelect('allSel')" >筛选<i class="icon select-icon active"></i></li> -->
      </ul>
    </div>
    <div class="coupon-box" v-if="searchType === 5">
      <p class="coupon-txt">限时促销：以下商品可使用{{couponParam.useAmount}}减{{couponParam.amount}}的优惠券</p>
      <p class="count-down" v-if="false">
        <span class="txt">距离结束时间</span>
        <span class="time ml20">10</span>
        <span class="symbol">:</span>
        <span class="time">20</span>
        <span class="symbol">:</span>
        <span class="time">56</span>
      </p>
    </div>
    <div class="prd-box">
      <p class="title" v-if="goodsList && goodsList.length === 0">暂无更多数据</p>
        <div class="select-item" v-for="(item, index) in goodsList" :key = index @click="goGoodsDetail(item)">
          <img :src="coin2" alt="" class="coinImg">
          <img :src="item.thumbnailImg" alt="">
          <p class="main-title">{{item.productName}}</p>
          <p class="grade-ticket" v-if="item.vipDiscountList.length > 0">
            <span class="item" v-for="(ite, ind) in item.vipDiscountList" :key = ind>
              <i class="grade-type" v-if="ite.level === 1">金</i>
              <i class="grade-type" v-if="ite.level === 2">钻</i>
              <i class="grade-price">￥{{ite.guidePrice}}</i>
            </span>
          </p>
          <div class="main">
            <span class="price"><span class="fz20">￥</span>{{item.price}}<span class="fz20"></span></span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
// Use Vuex
export default {
  data () {
    return {
      searchType: '', // 1:名品名店所有商品搜索 2：名品名店类型搜索 3：名品名店店铺内商品 4：会员专区搜索 5:优惠券进入 6:免费兑换积分商品 7：我可兑换的积分商品
      vipType: '', // 1：99元专区 2：199元专区  3：3600专区  4:10000元专区  10：全部会员专区类型
      couponParam: {},
      data: {}, // 后台入参
      mode: 0,
      isPriceRise: true, // 价格排序是降序
      goodsList: [],
      searchTxt: '',
      currentPage: 1,
      currentCount: 1,
      coin2: require('../../../../static/images/common/coin2.png')
    }
  },

  onLoad (options) {
    this.options = options
    this.searchType = parseInt(options.searchType)
    if (this.searchType === 5) {
      this.couponParam = JSON.parse(options.couponParam)
    }
  },
  onShow () {
    this.goodsList = []
    this.getGoodsList()
  },
  onReachBottom () { // 上拉触底事件
    if (this.currentPage >= this.currentCount) {
      console.log('数据加载完了')
    } else {
      // 下一页
      this.currentPage = this.currentPage + 1
      console.log(this.currentPage)
      this.getGoodsList()
    }
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    getGoodsList () {
      if (this.searchType === 1) {
        this.data.appMenuId = this.options.appMenuId
      }
      if (this.searchType === 2) {
        this.data.appMenuId = this.options.appMenuId
      }
      if (this.searchType === 3) {
        this.data.merchantId = this.options.merchantId
      }
      if (this.searchType === 4) {
        this.data.vipTypeStr = this.options.vipType
      }
      if (this.searchType === 5) {
        this.data.scope = this.couponParam.scope
        this.data.relationIds = this.couponParam.relationIds
      }
      if (this.searchType === 6) {
        this.data.integralDeductType = 2
      }
      if (this.searchType === 7) {
        this.data.integralDeductType = 11
      }
      this.data.currentPage = this.currentPage
      this.data.pagesize = 20
      this.$http.post(this.API.goodsList, {
        data: this.data
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach((item) => {
            if (item.vipDiscountList.length > 0) {
              item.vipDiscountList.forEach((ite) => {
                this.$set(ite, 'guidePrice', Math.floor(item.price * ite.discount / 10))
              })
            }
          })
          this.goodsList = this.goodsList.concat(res.result.data)
          this.currentCount = res.result.currentCount
        }
      })
    },
    getSelectData (mode) {
      this.mode = mode
      this.data.currentPage = 1
      if (mode === 'price') {
        this.isPriceRise = !this.isPriceRise
        if (this.isPriceRise === true) {
          this.mode = 4 // 价格由高到低
        } else {
          this.mode = 3 // 价格由低到高
        }
      }
      this.data.sortType = this.mode // 0-综合 1-销量 2-新品 3-价格由低到高 4-价格由高到低
      this.querySelect(this.data)
    },
    // 按关键字搜索
    keyWordSearch () {
      this.data.currentPage = 1
      this.data.keyword = this.searchTxt
      this.querySelect(this.data)
    },
    querySelect (data) {
      this.$http.post(this.API.goodsList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.goodsList = res.result.data
        }
      })
    },
    goGoodsDetail (item) {
      wx.navigateTo({
        url: `/pages/goods/goodsDetail/main?id=${item.id}&type=vip`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-box {
    background: #fbb03b;
    position: relative;
    padding: 30rpx 0;
    input{
      background: #fff;
      width: 690rpx;
      border-radius: 30rpx;
      margin: 0 auto;
      height: 62rpx;
      line-height: 62rpx;
      font-size: 28rpx;
      padding-left: 80rpx;
      box-sizing: border-box;
    }
    .searchIcon{
      background: url(../../../../static/images/travelIndex.png);
      width: 27rpx;
      height: 27rpx;
      display: inline-block;
      background-size: 300rpx 150rpx;
      background-position: -264rpx -10rpx;
      margin-left: 20rpx;
      vertical-align: middle;
      position: absolute;
      top: 50rpx;
      left: 50rpx;
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
      position: relative;
      img{
        width: 330rpx;
        height: 330rpx;
        display: block;
        border-radius: 8rpx 8rpx  0 0;
      }
      .coinImg{
        position: absolute;
        left: 5rpx;
        top: 5rpx;
        width: 40rpx;
        height: 40rpx;
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
        height: 90rpx;
      }
      .grade-ticket{
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
    // background-position: -95rpx -35rpx;
  }
  .top-icon, .top-icon.active{
    background-position: -90rpx -35rpx;
    margin-top: -12rpx;
    margin-left: 2rpx;
  }
  .top-icon.active{
    background-position: -142rpx -19rpx;
  }
  .bot-icon, .bot-icon.active{
    background-position: -92rpx -44rpx;
    margin-left: -19rpx;
    margin-top: 11rpx;
  }
  .bot-icon.active{
    background-position: -112rpx -45rpx;
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
  .coupon-box{
  padding: 20rpx 30rpx 0 30rpx;
  .coupon-item{
    margin: 0 auto;
    margin-top: 20rpx;
    .left{
      background-color: #ffffff;
      border-radius: 8rpx;
      display: inline-block;
      width: 70%;
      vertical-align: top;
      padding: 20rpx 25rpx;
      box-sizing: border-box;
      height: 260rpx;
      position: relative;
      .title{
        font-size: 24rpx;
      }
      .time{
        color: #999999;
        font-size: 20rpx;
        margin-top: 10rpx;
      }
      .radius, .radius2{
        width: 28rpx;
        height: 28rpx;
        background-color: #f4f4f4;
        position: absolute;
        right: -15rpx;
        top: -15rpx;
        border-radius: 50%;
        z-index:99
      }
      .radius2{
        top: 245rpx;
      }
      .flex{
        margin-left: -25rpx;
        margin-top: 15rpx;
        .flex-item{
          display: inline-block;
          width: 33%;
          text-align: center;
          img{
            width: 100rpx;
	          height: 100rpx;
            display: block;
            margin: 0 auto;
          }
          .price{
            color: #999999;
            font-size: 20rpx;
          }
        }
      }
    }
    .right{
      background-color: #feefd8;
      border-radius: 8rpx;
      display: inline-block;
      width: 30%;
      vertical-align: top;
      height: 260rpx;
      color: #fbb03b;
      text-align: center;
      position: relative;
      p:nth-child(1){
        font-size: 40rpx;
        margin-top: 30rpx;
        .symbol{
          font-size: 30rpx;
        }
      }
      p:nth-child(2){
        font-size: 24rpx;
      }
      p:nth-child(3){
        width: 140rpx;
        height: 50rpx;
        line-height: 50rpx;
        background-color: #fbb03b;
        border-radius: 25rpx;
        color: #f4f4f4;
        font-size: 22rpx;
        margin: 0 auto;
        margin-top: 30rpx;
      }
    }
    .right:before{
      content: '';
      display: block;
      width: 18rpx;
      height: 80%;
      background-size: 18rpx 18rpx; /* 一个repeat的大小 */
      background-repeat: repeat-y;
      background-image: radial-gradient(#fff 7rpx, transparent 7rpx);
      position: absolute;
      top: 0;
      z-index:9
    }
    .right:before {
      left: -10rpx; /* 半圆，只显示一个repeat的一半 */
      top: 24rpx;
    }
  }
}
</style>
