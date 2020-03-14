<template>
  <div class="shop-content">
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
    <scroll-view scroll-y  @scrolltolower="scrollBot" class="list-box">
      <ul class="list">
        <li class="item-wrap" v-for="item in goodsList" :key="index">
          <div class="item" @click="goDetail(item.id)">
            <div class="img-wrap">
              <img class="img" :src="item.thumbnailImg" alt="">
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
</template>
<script>
  export default {
    data () {
      return {
        sliderImgs: ['http://47.107.108.203:81/resource/image/f3f7ada1-d202-4e0d-8440-793074ef0c01.jpg', 'http://47.107.108.203:81/resource/image/f3f7ada1-d202-4e0d-8440-793074ef0c01.jpg'],
        mode: 0,
        isPriceRise: true, // 价格排序是降序
        goodsList: [],
        curPage: 1
      }
    },
    onLoad(options) {
      this.options = options
      this.getList()
    },
    onShow() {},
    components: {},
    methods: {
      goDetail(id) {
        wx.navigateTo({
          url: '/pages/goods/goodsDetail/main?id=' + id
        })
      },
      getSelectData (mode) {
        this.curPage = 1
        this.goodsList = []
        this.mode = mode
        if (mode === 'price') {
          this.isPriceRise = !this.isPriceRise
          if (this.isPriceRise === true) {
            this.mode = 4 // 价格由高到低
          } else {
            this.mode = 3 // 价格由低到高
          }
        }
        this.sortType = this.mode
        this.getList()
      },
      getList() {
        this.$http.post(this.API.getShopList, {
          data: {
            currentPage: this.curPage,
            pageSize: 10,
            merchantId: this.options.id,
            sortType: this.mode
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            if (res.result.data.length > 0) {
              this.goodsList = this.goodsList.concat(res.result.data)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      scrollBot() {
        this.curPage++
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>
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
    background: url('../../static/images/travelSort.png');
    background-size: 200rpx 200rpx;
    width: 20rpx;
    height: 10rpx;
    display: inline-block;
    vertical-align: middle;
    // background-position: -95rpx -35rpx;
  }
  .top-icon, .top-icon.active{
    background-position: -92rpx -35rpx;
    margin-top: -12rpx;
    margin-left: 2rpx;
  }
  .top-icon.active{
    background-position: -144rpx -18rpx;
  }
  .bot-icon, .bot-icon.active{
    background-position: -92rpx -44rpx;
    margin-left: -19rpx;
    margin-top: 11rpx;
  }
  .bot-icon.active{
    background-position: -110rpx -45rpx;
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
    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 7px 14px;
    box-sizing: border-box;
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
      padding-bottom: 100%;
      .img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
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
