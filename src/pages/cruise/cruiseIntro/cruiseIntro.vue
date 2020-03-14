<template>
  <div class="page">
    <div class="banner">
      <swiper class="swiper" interval="3000" duration="1000"  :indicator-dots= false  autoplay="true" >
        <block v-for="(item, index) in bannerImgList"  :key="index" >
            <swiper-item>
                <image :src="item" class="banner-img"/>
            </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="intro-box">
      <p class="title">{{cruiseInfo.cruiseName}}</p>
      <div class="main"  :class="{'over-hid': !isShowMore}">{{cruiseInfo.remark}}</div>
      <p class="more" @click="showMore" v-if="cruiseInfo.remark">更多内容<i class="icon bot-icon" v-if="!isShowMore"></i><i class="icon top-icon" v-if="isShowMore"></i></p>
      <div class="sec-intro">
        <div>
          <p>吨位</p>
          <p>{{cruiseInfo.tonnage}}吨</p>
        </div>
        <div>
          <p>首航</p>
          <p>{{cruiseInfo.startTime}}年</p>
        </div>
        <div>
          <p>楼层</p>
          <p>{{cruiseInfo.storey}}层</p>
        </div>
        <div>
          <p>船长</p>
          <p>{{cruiseInfo.cruiseLength}}米</p>
        </div>
        <div>
          <p>载客</p>
          <p>{{cruiseInfo.maxPassenger}}人</p>
        </div>
      </div>
    </div>
    <!-- <ul class="detail-nav">
      <li @click="changeTabList(0)" :class="{'active': 0 === currentTabList}">房型简介</li>
      <li @click="changeTabList(1)" :class="{'active': 1 === currentTabList }">海上美食</li>
      <li @click="changeTabList(2)" :class="{'active': 2 === currentTabList }">邮轮玩乐</li>
    </ul> -->
    <div class="detail-moudles">
      <p class="title">房型简介</p>
      <div class="moudles-item" v-for="(item, index) in roomList" :key = index>
        <img :src="item.setImgList[0] || traNoteImg" alt="">
        <p class="item-title">{{item.cabinType}}</p>
        <div class="character">
          <p>面积:{{item.area}}m²</p>
          <p>容纳{{item.liveNum}}人</p>
        </div>
        <div class="character right">
          <p>窗型：{{item.hasWindow === 1 ? '有' : '无'}}窗</p>
          <p>楼层： {{item.floor}}楼</p>
        </div>
      </div>
    </div>
    <div class="detail-moudles mt20">
      <p class="title">海上美食</p>
      <div class="moudles-item" v-for="(item, index) in diningList" :key = index>
        <img :src="item.setImgList[0] || traNoteImg" alt="">
        <p class="item-title">{{item.name}}</p>
        <div class="character">
          <p>消费:{{item.consume}}</p>
        </div>
      </div>
    </div>
    <div class="detail-moudles mt20">
      <p class="title">邮轮玩乐</p>
      <div class="moudles-item" v-for="(item, index) in enjoyList" :key = index>
        <img :src="item.setImgList[0] || traNoteImg" alt="">
        <p class="item-title">{{item.name}}</p>
        <div class="character">
          <p>消费:{{item.consume}}</p>
        </div>
      </div>
    </div>
    <div class="detail-moudles mt20">
      <p class="title">表演</p>
      <div class="moudles-item" v-for="(item, index) in showList" :key = index>
        <img :src="item.setImgList[0] || traNoteImg" alt="">
        <p class="item-title">{{item.name}}</p>
        <div class="character">
          <p>消费:{{item.consume}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      productId: '',
      bannerImgList: [],
      cruiseInfo: '',
      urlPrefix: '',
      enjoyList: [],
      diningList: [],
      roomList: [],
      showList: [],
      isShowMore: false,
      currentTabList: 0,
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg')
    }
  },
  onLoad (options) {
    this.productId = options.id
  },
  onShow () {
    this.getcruiseDetial()
  },
  methods: {
    showMore () {
      this.isShowMore = !this.isShowMore
    },
    getcruiseDetial () {
      this.$http.post(this.API.cruiseDetial, {
        data: {
          productId: this.productId
        }
      }).then(res => {
        if (res.code === 0) {
          this.cruiseInfo = res.result.cruiseInfo
          this.cruiseInfo.startTime = dayjs(this.cruiseInfo.startTime).format('YYYY')
          this.urlPrefix = res.result.urlPrefix
          // banner轮播图
          // this.cruiseInfo.cruiseImg = this.cruiseInfo.cruiseImg.split(',')
          // this.cruiseInfo.cruiseImg.forEach((item) => {
          //   this.bannerImgList.push(`${this.urlPrefix}${item}`)
          // })
          if (this.bannerImgList.length === 0) {
            this.bannerImgList = [] // 设置一个默认图片
          }
          this.cruiseInfo.facilities.forEach((item) => {
            // 商品第一张图
            this.$set(item, 'setImgList', [])
            item.imgUrl = item.imgUrl.split(',')
            item.imgUrl.forEach((ite) => {
              if (ite) {
                item.setImgList.push(`${this.urlPrefix}${ite}`)
              } else {
                item.setImgList.push('')
              }
            })
            if (item.type === '1') { // 娱乐设施
              this.enjoyList.push(item)
            }
            if (item.type === '2') { // 餐厅
              this.diningList.push(item)
            }
            if (item.type === '3') { // 表演
              this.showList.push(item)
            }
            if (item.type === '4') { // 舱型房型
              this.roomList.push(item)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #f4f4f4;
}
.banner{
  position: relative;
  .swiper{
    height: 420rpx;
  }
  .banner-img{
    width: 100%;
    height: 420rpx;
  }
}
.intro-box{
  background: #fff;
  padding: 30rpx;
  .title{
    text-align: center;
    font-size: 34rpx;
  }
  .sec-title{
    text-align: center;
    font-size: 30rpx;
    color: #999;
  }
  .main{
    color: #353535;
    font-size: 24rpx;
    margin-top: 20rpx;
  }
  .more{
    font-size: 24rpx;
    color: #ff9913;
    text-align: center;
    margin-top: 20rpx;
    margin-bottom: 30rpx;
  }
  .sec-intro{
    margin: 0 0 30rpx 0;
    border-top: 1rpx solid #dcdcdc;
    div{
      display: inline-block;
      width: 25%;
      font-size: 28rpx;
      text-align: center;
      margin-top: 30rpx;
      p:nth-child(1){
        color: #666666
      }
    }
  }
}
.over-hid{
  display: -webkit-box;    
  -webkit-box-orient: vertical;    
  -webkit-line-clamp: 3;    
  overflow: hidden;
}
.detail-nav{
  background: #fff;
  margin-top: 20rpx;
  padding: 15rpx 60rpx 0 60rpx;
  display: flex;
  height: 60rpx;
  line-height: 60rpx;
  justify-content: space-between;
  color: #353535;
  font-size: 30rpx;
  border-bottom: 1rpx solid #dcdcdc;
  li.active {
    color: #ff9913;
    border-bottom: 4rpx solid #ff9913;
  }
}
.detail-moudles{
  background: #fff;
  padding: 30rpx;
  .title{
    font-size: 34rpx;
    text-align: center;
  }
  .moudles-item{
    display: inline-block;
    padding-right: 29rpx;
    // border-top: 1rpx solid #dcdcdc;
    padding-top: 30rpx;
    img{
      width: 330rpx;
      height: 240rpx;
    }
    .item-title{
      font-size: 30rpx;
    }
    .character{
      display: inline-block;
      font-size: 22rpx;
      color: #666;
    }
    .character.right{
      float: right;
    }
  }
  .moudles-item:nth-child(2n+1){
    padding-right: 0;
  }
  
}
.mt20{
  margin-top: 20rpx;
}

.icon{
  background: url('../../../../static/images/travelDetail.png');
  background-size: 300rpx 150rpx;
  display: inline-block;
  width: 23rpx;
  height: 13rpx;
}
.bot-icon{
  background-position: -225rpx -1rpx;
  margin-left: 5rpx;
}
.top-icon{
  background-position: -225rpx -18rpx;
  margin-left: 5rpx;
}
</style> 