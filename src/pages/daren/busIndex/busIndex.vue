<template>
    <div>
      <div class="select-box">
        <div class="select-input">
          <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span>
          <div class="po-re">
            <i class="icon sel-icon"></i>
            <input type="text" placeholder="搜索目的地/关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch">
          </div>
        </div>
      </div>
      <div class="select-main">
        <ul class="tab">
          <li @click="openSelect('bus')"   :class="{'active': mode === 'guide'}" >包车接送<i class="icon bot-icon"></i></li>
          <li @click="openSelect('date')"  :class="{'active': mode === 'date'}">出发日期<i class="icon bot-icon"></i></li>
          <li @click="openSelect('sort')"   :class="{'active': mode === 'sort'}">综合排序<i class="icon bot-icon"></i></li>
          <li @click="openSelect('allSel')" :class="{'active': mode === 'allSel'}">筛选<i class="icon select-icon"></i></li>
        </ul>
      </div>
      <ul class="sel-tab">
        <li>
          <div class="po-re">
            <img :src="miniIcon2" alt="" class="coinImg">
            <img :src="themeImg" alt="" class="mainImg">
            <span class="place">包车接机</span>
          </div>
          <div class="tab-right">
              <p class="title">标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</p>
              <p class="date">7座车型</p>
              <p class="sign">
                <span>特色内容</span>
                <span>特色内容</span>
              </p>
              <p class="info">
                <span class="sell">向导名称</span>
                <span class="grade">333分</span>
                <span class="price"><span class="symbol">￥</span> <span class="num">12222</span> <span>起</span></span>
              </p>
          </div>
        </li>
        <li>
          <div class="po-re">
            <img :src="miniIcon2" alt="" class="coinImg">
            <img :src="themeImg" alt="" class="mainImg">
            <span class="place">包车接机</span>
          </div>
          <div class="tab-right">
              <p class="title">标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</p>
              <p class="date">7座车型</p>
              <p class="sign">
                <span>特色内容</span>
                <span>特色内容</span>
              </p>
              <p class="info">
                <span class="sell">向导名称</span>
                <span class="grade">333分</span>
                <span class="price"><span class="symbol">￥</span> <span class="num">12222</span> <span>起</span></span>
              </p>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
import utils from '../../../utils'

export default {
  data () {
    return {
      currentCity: '',
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onShow () {
    if (wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('selectCity')
    } else {
      if (!wx.getStorageSync('userCity')) { // 首次进入页面
        utils.getLocation().then(res => {
          this.currentCity = res.data.result.ad_info.city
        })
      } else {
        this.currentCity = wx.getStorageSync('userCity')
      }
    }
  },
  methods: {
    goCity () {
      wx.navigateTo({
        url: `/pages/city/main`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-box{
  background: #fff;
  padding: 24rpx 30rpx 30rpx 30rpx;
  .select-input{
    width: 100%;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #353535;
    background: #f4f4f4;
    border-radius: 30rpx;
    display: flex;
    span{
      flex-grow: 1;
      margin: 18rpx 0;
      line-height: 30rpx;
      text-align: center;
      border-right: 1rpx solid #dcdcdc;
      padding: 0 20rpx 0 40rpx;
      .icon{
        float: right;
        margin-top: 13rpx;
      }
    }
    .po-re{
      flex-grow: 5;
      position: relative;
      display: inline-block;
      .txt{
        display: inline-block;
        vertical-align: middle;
        color: #353535;
      }
    }
  }
}
.icon{
  background: url('../../../../static/images/travelSort.png');
  background-size: 200rpx 200rpx; 
  background-position: -57rpx -10rpx;
  width: 20rpx;
  height: 12rpx;
  display: inline-block;
  vertical-align: middle;
}
.sel-icon{
  background-position: -80rpx -1rpx;
  width: 28rpx;
  height: 28rpx;
  margin: 0 10rpx 0 20rpx;
}
.select-main{
  padding: 0 30rpx 0 30rpx;
  background: #fff;
  font-size: 28rpx;
  position: relative;
  .tab{
    display: flex;
    height: 89rpx;
    line-height: 89rpx;
    justify-content: space-between;
    .bot-icon{
      background-position: -146rpx -6rpx;
      margin-left: 10rpx; 
    }
    .select-icon {
      background-position: -166rpx -5rpx;
      margin-left: 10rpx; 
      width: 22rpx;
      height: 25rpx;
    }
    li.active{
      color: #ff9913;
      .bot-icon{
        background-position: -146rpx -17rpx;
      }
      .select-icon {
        background-position: -38rpx -35rpx;
      }
    }
  }
}
.sel-tab {
  background: #fff;
  padding:30rpx;
  margin-top:20rpx;
  li {
    margin-top: 30rpx;
    font-size: 20rpx;
    border-bottom: 1rpx solid #dcdcdc;
    padding-bottom: 30rpx; 
    .po-re{
      position: relative;
      display: inline-block;
      span{
        position: absolute;
        color: #fff;
        display: block;
        font-size: 22rpx;
        background: rgba(0,0,0,0.5);
        text-align: center;
      }
      .place{
        bottom: 0;
        width: 100%;
        height: 36rpx;
        border-radius:0 0 5rpx 5rpx ;
      }
      .mainImg {
        width: 220rpx;
        height: 220rpx;
        border-radius: 5rpx;
        display: block;
      }
      .coinImg{
        position: absolute;
        right: 5rpx;
        top: 5rpx;
        width: 30rpx;
        height: 30rpx;
      }
    }
    .tab-right{
      float: right;
      width: 66%;
      .title {
        font-size: 30rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding-right: 10rpx;
        height: 95rpx;
      }
      .sign {
        span {
          display: inline-block;
          color: #388ef8;
          border: 1rpx solid #388ef8;
          width: 102rpx;
          height: 34rpx;
          text-align: center;
          margin: 10rpx 15rpx 0 0 ;
          border-radius: 5rpx;
          font-size: 23rpx;
        }
      }
      .date{
        font-size: 24rpx;
        color: #666;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        // margin: 10rpx 0 0rpx 0;
        padding-right: 10rpx;
      }
      .info {
        color: #888888;
        margin-top: 15rpx;
        .price {
          float: right;
          .num{
            color: #fb3305;
            font-size: 34rpx;
            margin-right: 5rpx;
          }
          .symbol{
            color: #fb3305;
          }
        }
        .sell {
          font-size: 26rpx;
          color: #333;
        }
        .grade{
          color: #ff9913;
          margin-left: 15rpx;
          font-size: 26rpx;
        }

      }
    }
  }
  li:first-child{
    margin-top: 0
  }
  li:last-child{
    border-bottom: none;
    padding-bottom: 0 ;
  }
}
</style>