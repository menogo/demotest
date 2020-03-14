<template>
  <div class="shop-content">
    <swiper class="swiper"  interval="3000" duration="1000">
      <block v-for="(item, index) in sliderImgList"  :key="index">
        <swiper-item @click="goDetail(item)">
          <img :src="item.sliderImg" class="goods-img"/>
        </swiper-item>
      </block>
    </swiper>
    <div class="list-box">
      <div class="title">热门推荐</div>
      <ul class="list">
        <li class="item-wrap" v-for="(item, index) in listData1" :key="index"  @click="goDetail(item)">
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
</template>
<script>
  export default {
    props: {
      merchantId: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data () {
      return {
        listJson: ['listData1', 'listData2'],
        listData1: [],
        listData2: [],
        sliderImgList: []
      }
    },
    onLoad(options) {
      this.options = options
      if (options.scene) { // 通过二维码分享进入
        let scene = decodeURIComponent(options.scene)
        this.merchantId = scene.split('&')[1]
      }
      this.getList(1)
      this.getSliderImgs()
    },
    onShow() {},
    components: {},
    methods: {
      getList(type) {
        this.$http.post(this.API.queryShopRecommend, {
          data: {
            // mainRecommend: type,
            // currentPage: 1,
            // pageSize: 10,
            id: this.options.id
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this[this.listJson[type - 1]] = res.result
            console.log('this.listData1', this.listData1)
            if (type < this.listJson.length) this.getList(++type)
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      getSliderImgs() {
        this.$http.post(this.API.queryShopSlider, {
          data: {
            id: this.options.id
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.sliderImgList = res.result
          }
        })
      },
      goDetail(item) {
        wx.navigateTo({
          url: `/pages/goods/goodsDetail/main?id=${item.productId}`
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .goods-img{
    width: 100%;
    height: 400rpx;
    display: block;
  }
  .swiper {
    height: 200px;
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
</style>
