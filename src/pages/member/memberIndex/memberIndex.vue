<template>
    <div class="page">
      <banner :showSelect = "false" :flag = 7 :currentCity = currentCity></banner>
      <div class="member-modules">
        <p class="title"  @click="goGoodsSearch('1,2')">
          <span>个人会员专享</span>
          <span class="all-icon">查看全部<i></i></span>
        </p>
        <div class="flex">
          <div>
            <!-- 99专区 -->
            <img :src="lab1" alt="" @click="goGoodsSearch('1')">
            <!-- 199专区 -->
            <img :src="lab2" alt="" @click="goGoodsSearch('2')">
          </div>
          <!-- <div>
            <img :src="lab3" alt="" @click="goGoodsSearch('3')">
            <img :src="lab4" alt="" @click="goGoodsSearch('4')">
          </div> -->
        </div>
      </div>
      <div class="member-modules">
        <p class="title"  @click="goGoodsSearch('3,4')">
          <span>企业会员专享</span>
          <span class="all-icon">查看全部<i></i></span>
        </p>
        <div class="flex">
          <!-- <div>
            <img :src="lab1" alt="" @click="goGoodsSearch('1')">
            <img :src="lab2" alt="" @click="goGoodsSearch('2')">
          </div> -->
          <div>
            <!-- 3600专区 -->
            <img :src="lab3" alt="" @click="goGoodsSearch('3')">
            <!-- 10000专区 -->
            <img :src="lab4" alt="" @click="goGoodsSearch('4')">
          </div>
        </div>
      </div>
      <!-- <div class="recommend-box">
        <p class="title">为您推荐</p>
        <div class="select-item" v-for="(item, index) in moreRecommend" :key = index @click="goGoodsDetail(item)">
          <img :src="item.thumbnailImg" alt="">
          <p class="main-title">{{item.productName}}</p>
          <div class="main">
            <span class="price"><span class="fz20">￥</span>{{item.price}}<span class="fz20">起</span></span>
          </div>
        </div>
      </div> -->
    </div>
</template>
<script>
import banner from '@/components/common/banner'
import utils from '../../../utils'
export default {
  data () {
    return {
      status: '', // 合伙人审核状态
      currentCity: '',
      moreRecommend: [],
      lab1: require('../../../../static/images/common/lab1.png'),
      lab2: require('../../../../static/images/common/lab2.png'),
      lab3: require('../../../../static/images/common/lab3.png'),
      lab4: require('../../../../static/images/common/lab4.png'),
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onShow () {
    if (wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('selectCity')
    } else {
      if (!wx.getStorageSync('userCity')) {
        utils.getLocation().then(res => {
          console.log('getLocation =>', res)
          this.currentCity = res.data.result.ad_info.city
        })
      } else {
        this.currentCity = wx.getStorageSync('userCity')
      }
    }
    // this.getRecommend()
  },
  methods: {
    getRecommend() {
      this.$http.post(this.API.goodsList, {
        data: {
          recommendType: 5,
          vipType: 10
        }
      }).then(res => {
        if (res.code === 0) {
          this.moreRecommend = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goPartnerRegister () {
      this.$http.post(this.API.customer).then(res => {
        if (res.code === 0) {
          if (res.result && res.result.license && res.result.license.status) {
            this.status = res.result.license.status
          }
          let url = ''
          wx.setStorageSync('license', res.result.license)
          if (this.status === 1) {
            url = `/pages/member/partnerRegister/main?status=1`
          } else if (this.status === 2) { // 审核通过
            url = `/pages/member/partnerRegister/main?status=2`
          } else if (this.status === 3) { // 审核驳回
            url = `/pages/member/partnerRegister/main?status=3`
          } else if (this.status === 4) { // 审核通过且支付成功
            url = `/pages/member/partnerRegister/main?status=4`
          } else {
            url = `/pages/member/partnerRegister/main?status=0` // 未提交过审核
          }
          wx.navigateTo({
            url: url
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goGoodsSearch (flag) {
      wx.navigateTo({
        url: `/pages/goods/goodsSearch/main?searchType=4&vipType=${flag}`
      })
    },
    goGoodsDetail (item) {
      wx.navigateTo({
        url: `/pages/goods/goodsDetail/main?id=${item.id}&type=vip`
      })
    }
  },
  components: {
    banner
  }
}
</script>
<style lang="scss" scoped>
  .page{
    background: #fff;
    min-height: 100vh;
  }
  .member-modules{
    padding: 47rpx 30rpx 0 30rpx;
    background: #fff;
    font-size: 34rpx;
    position: relative;
    .flex{
      div{
        img{
          display: inline-block;
          height: 167rpx;
          width: 335rpx;
          margin-top: 15rpx;
          margin-right: 20rpx;
        }
        img:nth-child(2n){
          margin-right:0;
        }
      }
    }
    .all-icon{
      float: right;
      // position: absolute;
      // right: 30rpx;
      // top: 47rpx;
      color: #ff9913;
      font-size: 33rpx;
      width:180rpx;
      height: 34rpx;
      line-height: 34rpx;
      text-align: center;
      border-radius: 20rpx;
      vertical-align: middle;
      i{
        background: url('../../../../static/images/travelSort.png');
        background-size: 200rpx 200rpx; 
        background-position: -173rpx -31rpx;
        width: 21rpx;
        height: 31rpx;
        display: inline-block;
        vertical-align: middle;
        margin-top: -10rpx;
        margin-left: 8rpx;
      }
    }
  }
  .recommend-box {
  margin: 30rpx 30rpx 0 30rpx;
  .title{
    text-align: left;
    font-size: 30rpx;
    margin-bottom: 30rpx;
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
  .select-item:nth-child(2n){
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
</style>