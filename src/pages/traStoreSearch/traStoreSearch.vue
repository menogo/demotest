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
    <div class="prd-box">
      <!-- <p class="title" v-if="goodsList && goodsList.length === 0">暂无更多数据</p> -->
      <div class="select-item" v-for="(item, index) in goodsList" :key = index @click="goGoodsDetail(item)">
        <img :src="item.imgUrl" alt="">
        <p class="main-title">{{item.productName}}</p>
        <div class="main">
          <span class="price"><span class="fz20">￥</span>{{item.price}}<span class="fz20"></span></span>
        </div>
      </div>
    </div>
    <empty :list = goodsList></empty>
  </div>
</template>

<script>
// Use Vuex
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      mode: 0,
      isPriceRise: true, // 价格排序是降序
      goodsList: [],
      searchTxt: '',
      curPage: 1, // 当前页数
      totalPage: '', // 总页数
      merchantId: '', // 商户id
      selData: {
        merchantId: '',
        sortType: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20
      }
    }
  },

  onLoad (options) {
    this.merchantId = options.merchantId
    this.selData.merchantId = this.merchantId
  },
  onShow () {
    this.getAllGoodsList(this.selData)
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  onReachBottom () { // 上拉触底事件
    // console.log('触底了')
    if (this.selData.currentPage > this.totalPage) {
      console.log('数据加载完了')
    } else {
      // 下一页
      this.selData.currentPage = this.selData.currentPage + 1
      this.getAllGoodsList(this.selData)
    }
  },
  methods: {
    getAllGoodsList (data) {
      this.$http.post(this.API.getProList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          if (res.result.data.length > 0) {
            this.goodsList = this.goodsList.concat(res.result.data)
            this.totalPage = res.result.currentCount
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
      this.mode = mode
      this.curPage = 1
      if (this.mode === 'price') {
        this.isPriceRise = !this.isPriceRise
        if (this.isPriceRise === true) {
          this.mode = 4 // 价格由高到低
        } else {
          this.mode = 3 // 价格由低到高
        }
      }
      this.selData = {
        merchantId: this.merchantId,
        currentPage: this.curPage,
        pageSize: 20,
        sortType: this.mode // 0-综合 1-销量 2-新品 3-价格由低到高 4-价格由高到低
      }
      this.goodsList = []
      this.getAllGoodsList(this.selData)
    },
    // 按关键字搜索
    keyWordSearch () {
      this.selData = {
        merchantId: this.merchantId,
        keyword: this.searchTxt,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
      this.goodsList = []
      this.getAllGoodsList(this.selData)
    },
    goGoodsDetail (item) {
      wx.navigateTo({
        url: `/pages/travel/travelDetail/main?parentId=${item.id}`
      })
    }
  },
  components: {
    empty
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
      background: url(../../../static/images/travelIndex.png);
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
        height: 90rpx;
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
    background: url('../../../static/images/travelSort.png');
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
</style>
