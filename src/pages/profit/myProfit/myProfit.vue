<template>
  <div class="page">
    <div class="header-bg">
      <p>累计收益 <span>￥{{customerDetail.totalAmount || 0}}</span></p>
      <p>可提现 <span>￥{{customerDetail.withdrawAmount || 0}}</span></p>
      <span class="header-btn" @click="withDrawal">提现</span>
      <span class="header-btn" @click="withDrawalList" style="margin-left: 10px;">提现列表</span>
    </div>
    <ul class="tab">
      <li v-for="(item, index) in tabList" :key="index" :class="{'active': index === currentTabIndex}" @click = changeTab(index)>{{item}}</li>
      <!-- <li>商城</li>
      <li>分润</li> -->
    </ul>
    <ul class="main-list">
      <li  v-for="(item, index) in shareList" :key = "index">
        <!-- <span>{{item.customerName || item.mobile}}</span> -->
        <span>{{item.consumeName || item.consumeMobile}}</span>
        <span><i v-if="item.shareType === 1">+</i><i v-if="item.shareType === 2">-</i>¥{{item.amount}}</span>
        <span>{{item.createTime}}</span>
        <span>{{item.shareMode}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTabIndex: 0,
      tabList: ['推广', '商城'],
      customerDetail: {},
      shareList: []
    }
  },
  onShow () {
    this.changeTab(0)
    this.customerData()
  },
  methods: {
    withDrawal() {
      wx.navigateTo({
        url: '/pages/cashOut/main'
      })
    },
    changeTab (index) {
      this.currentTabIndex = index
      let data = {}
      if (index === 0) { // 推广
        data.type = 2
      }
      if (index === 1) { // 商城
        data.type = 10
      }
      this.$http.post(this.API.queryShareProfitList, {
        data: data
      }).then(res => {
        this.shareList = res.result.data
        this.shareList.forEach((item) => {
          item.createTime = item.createTime.substring(0, 11)
          if (item.type === 1) {
            item.shareMode = '消费分润'
          }
          if (item.type === 2) {
            item.shareMode = item.shareMode === 1 ? '直推' : '间推'
          }
          if (item.type === 3) {
            item.shareMode = '营业分润'
          }
          if (item.type === 4) {
            item.shareMode = '推广分润'
          }
        })
      })
    },
    withDrawalList() {
      wx.navigateTo({
        url: '/pages/withDrawalList/main'
      })
    },
    customerData () {
      this.$http.post(this.API.customer).then(res => {
        if (res.code === 0) {
          this.customerDetail = res.result
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.page{
  background: #fff;
  height: 100vh;
}
.header-bg{
    height: 253rpx;
    background-color: #fbb03b;
    text-align: center;
    color: #fff;
    p{
      padding-top: 20rpx;
    }
    .header-btn{
      width: 140rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 25rpx;
      border: solid 2rpx #ffffff;
      display: inline-block;
      font-size: 26rpx;
      margin-top: 35rpx;
    }
}
.tab{
  height: 80rpx;
  line-height: 80rpx;
	background-color: #f89e12;
  display: flex;
  li{
    flex-grow: 1;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
  }
  li.active{
    background-color: #fec46a;
  }
}
.main-list{
  li{
    height: 100rpx;
    line-height: 100rpx;
    border-bottom: 20rpx solid #f4f4f4;
    color: #333333;
    font-size: 28rpx;
    span{
      display: inline-block;
      width: 25%;
      text-align: center;
      i{
        display: inline-block;
      }
    }
    span:nth-child(2){
      color: #f7a012;
    }
  }
}
</style>
