<template>
    <div>
      <div class="banner">
        <swiper class="swiper" indicator-dots="true" autoplay="true" interval="3000" duration="1000" indicator-color="#fff" indicator-active-color="#ff9913">
          <block v-for="(item, index) in bannerList"  :key="index">
              <swiper-item>
                  <image :src="item.imageUrl" class="banner-img"/>
              </swiper-item>
          </block>
        </swiper>
        <div class="search" v-if="showSelect" @click="goSearch">
          <div class="box">
            <p class="place" @click.stop="goCity"  v-if="currentCity"><span>{{currentCity}}<i class="bot-icon"></i></span></p>
            <!-- <p class="place" @click.stop="goCity" ><span>深圳市<i class="bot-icon"></i></span></p> -->
            <div>
              <i class="searchIcon"></i>
              <span class="placehol" v-if="flag === 2 || flag === 3 || flag === 7">搜索关键词</span>
              <span class="placehol"  v-if="flag === 1 || flag === 5 || flag === 6">搜索目的地/关键词</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: [
    'currentCity',
    'showSelect',
    'flag' // 1:旅游产品首页 2:名品名店 3：达人 5:旅游度假 6:主题旅游 7:会员专区
  ],
  data () {
    return {
      bannerList: []
      // currentCity: '' // 当前位置
    }
  },
  mounted () {
    console.log('currentCity', this.currentCity)
    console.log('flag', this.flag)
    this.getImgList()
  },
  methods: {
    getImgList () {
      this.$http.post(this.API.silder, {
        data: {
          imageType: this.flag
        }
      }).then(res => {
        if (res.code === 0) {
          this.bannerList = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goSearch () {
      if (this.flag === 1) {
        wx.navigateTo({
          url: `/pages/travelSearch/main`
        })
      } else if (this.flag === 2) {
        wx.navigateTo({
          url: `/pages/goods/goodsSearch/main?searchType=1&appMenuId=-1`
        })
      } else if (this.flag === 3) {
        wx.navigateTo({
          url: `/pages/daren/selectGuide/main`
        })
      } else {
        wx.navigateTo({
          url: `/pages/search/main?flag=1`
        })
      }
    },
    goCity () {
      wx.navigateTo({
        url: `/pages/city/main`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.banner {
  position: relative;
}
.swiper{
  height: 330rpx;
}
.banner-img {
  width: 100%;
  height: 330rpx;
  display: block;
}
.search{
  position: absolute;
  top: 0;
  background: none;
  width: 100%;
  .box {
    background: #fff;
    margin: 15rpx 30rpx;
    border-radius: 30rpx;
    height: 60rpx;
    font-size: 24rpx;
    display: flex;
    .place{
      flex-grow: 1;
      // width: 160rpx;
      text-align: center;
      margin: 14rpx 0;
      display: inline-block;
      border-right: 1rpx solid #dcdcdc;
    }
    div {
      flex-grow: 5;
      .searchIcon {
        background: url(../../../static/images/travelIndex.png);
        width: 27rpx;
        height: 27rpx;
        display: inline-block;
        background-size: 300rpx 150rpx;
        background-position: -264rpx -10rpx;
        margin-left: 20rpx;
        margin-top: -5rpx;
        vertical-align: middle;
      }
      .placehol{
        display: inline-block;
        color: #888888;
        font-size:26;
        margin-left: 20rpx;
        height: 60rpx;
        line-height: 60rpx;
      }
    }
    .bot-icon{
      background: url('../../../static/images/travelSort.png');
      background-size: 200rpx 200rpx;
      width: 25rpx;
      height: 17rpx;
      display: inline-block;
      vertical-align: middle;
      background-position: -57rpx -9rpx;
      margin-left: 10rpx;
      margin-top: 0;
    }
  }
}
</style>

