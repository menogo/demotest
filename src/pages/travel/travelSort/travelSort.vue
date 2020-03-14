<template>
  <div class="page">
    <banner :showSelect = "false" :flag = 5></banner>
    <ul class="select-box">
      <li>
        <label>我的位置 ></label>
        <input type="text" class="local-txt" value="myLocation" v-model="myLocation" disabled='disabled'>
        <!-- <span class="local-txt">{{myLocation}}</span> -->
        <span class="local-right" @click="goCity">
          <span>手动定位</span> 
          <i class="icon"></i>
        </span>
      </li>
      <!-- <li>
        <label>出发地</label>
        <input type="text" :placeholder = "myLocation" v-model="departure">
        <i class="icon right-icon"></i>
      </li> -->
      <li>
        <label>目的地</label>
        <input type="text" placeholder = "选择前往目的地" v-model="destination" class="des-txt">
        <i class="icon right-icon"  @click="goCity('destina')"></i>
      </li>
      <li>
        <p class="button" @click="goSearch()">立即搜索</p>
      </li>
    </ul>
    <!-- 二级菜单 -->
    <div class="modules-box" v-if="secTravelType && secTravelType.length > 0">
      <div class="modules-col">
        <div class="modules-item" v-for="(item, index) in secTravelType" :key="index" @click="goSecondTra(item)">
          <img :src="item.imgUrl" alt="">
          <p>{{item.menuName}}</p>
        </div>
        <!-- <div class="modules-item">
          <img :src="freetimeImg" alt="">
          <p>美食走廊</p>
        </div> -->
      </div>
    </div>
    <!-- 精选路线 -->
    <selectedTra :parentId = "parentId" v-if="parentId"></selectedTra> 
    <!-- 热门推荐 -->
    <recommend :parentId = "parentId" v-if="parentId"></recommend>
  </div>
</template>

<script>
import banner from '@/components/common/banner'
import recommend from '@/components/travel/recommend'
import selectedTra from '@/components/travel/selectedTra'
// import { cities } from './city';
export default {
  components: {
    banner,
    recommend,
    selectedTra
  },

  data () {
    return {
      parentId: '',
      secTravelType: {},
      customItem: '',
      myLocation: '北京市', // 我的位置
      // departure: '', // 出发地
      destination: '' // 目的地
    }
  },

  onLoad (options) {
    this.parentId = options.parentId
    wx.setNavigationBarTitle({
      title: options.title
    })
  },

  onShow () {
    if (wx.getStorageSync('destinaCity')) {
      this.destination = wx.getStorageSync('destinaCity')
    }
    if (!wx.getStorageSync('selectCity')) {
      this.myLocation = wx.getStorageSync('userCity')
    } else {
      this.myLocation = wx.getStorageSync('selectCity')
    }
    this.getSecTravelList()
  },

  methods: {
    // 获取二级菜单
    getSecTravelList() {
      this.$http.post(this.API.getMenu, {
        data: {
          menuIndex: 5, // 1-旅游度假菜单 2-主题旅游菜单 3-机票酒店菜单 4-本地特色菜单 5-旅游产品二级菜单 6-主题二级菜单
          parentId: this.parentId // 一级菜单默认-1
        }
      }).then(res => {
        if (res.code === 0) {
          this.secTravelType = res.result
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goSecondTra(item) {
      wx.navigateTo({
        url: `/pages/search/main?flag=3&parentId=${item.id}&title=${item.menuName}`
      })
    },
    goCity (flag) {
      let url = ''
      if (flag) {
        url = `/pages/city/main?flag=${flag}`
      } else {
        url = `/pages/city/main`
      }
      wx.navigateTo({
        url: url
      })
    },
    // 跳转搜索页
    goSearch () {
      let url = `/pages/search/main?flag=2&myLocation=${this.myLocation}&destination=${this.destination}`
      wx.navigateTo({
        url: url
      })
      console.log(url)
    }
  }
}
</script>

<style lang="scss" scope>
.page{
  min-height: 100vh;
  background: #f4f4f4;
}
.select-box {
  background: #fff;
  padding: 0 30rpx 30rpx 30rpx;
  li {
    border-bottom: 1rpx solid #dcdcdc;
    height: 89rpx;
    line-height: 89rpx;
    font-size: 30rpx;
    color: #353535;
    .des-txt, .local-txt{
      width: 65%;
      display: inline-block;
      vertical-align: middle;
      margin-top: -10rpx;
    }
    .local-txt{
      width: 45%;
    }
    label{
      width:155rpx;
      display: inline-block;
    }
    .local-right{
      float: right;
      color: #b2b2b2;
      span {
        display:inline-block;
      }
    }
    .icon{
      background: url('../../../../static/images/travelSort.png');
      background-size: 200rpx 200rpx; 
      background-position: 0 0;
      width: 25rpx;
      height: 30rpx;
      display:inline-block;
      vertical-align: middle;
      margin-left: 6rpx;
    }
    .right-icon{
      background-position: -32rpx 0;
      margin-left: 40rpx;
      margin-top: 35rpx;
      float: right;
    }
    .button{
      background: #fbb03b;
      color: #fff;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      margin-top: 30rpx;
      border-radius: 8rpx;
    }
  }
  li:last-child{
    border-bottom: none;
  }
}
.modules-box {
  background: #fff;
  margin-top: 20rpx;
  .modules-col{
    display: flex;
    flex-wrap: wrap;
    font-size: 24rpx;
    color: #141414;
    padding-bottom: 30rpx;
    align-content: space-around;
    .modules-item {
      width: 25%;
      text-align: center;
      margin-top: 30rpx;
      img {
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
