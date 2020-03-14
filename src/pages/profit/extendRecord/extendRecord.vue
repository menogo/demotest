<template>
  <div class="page">
    <div class="header-bg">
      <p class="num">{{total}}</p>
      <p>总人数</p>
    </div>
    <ul class="tab">
      <li @click="changeTab(1)" :class="{'active': currentTab}">直接推广({{directPushList.length}}人)</li>
      <li @click="changeTab(2)" :class="{'active': !currentTab}">间接推广({{betweenPush.length}}人)</li>
    </ul>
    <ul class="main-list" v-if="showDirectPush">
      <li v-for="(item, index) in directPushList" :key = index>
        <span>
          <i class="icon"></i>
          <input class="change-name" maxlength ='4' :value="item.remarkName || item.realName" @blur="changeName($event, item)"/>
        </span>
        <span>{{item.mobile}}</span>
        <span>{{item.createTimeStr}}</span>
      </li>
    </ul>
    <ul class="main-list" v-if="showBetweenPush">
      <li v-for="(item, index) in betweenPush" :key = index>
        <span>
          <i class="icon"></i>
          <input class="change-name" maxlength ='4' :value="item.remarkName || item.realName" @blur="changeName($event, item)"/>
        </span>
        <span>{{item.mobile}}</span>
        <span>{{item.createTimeStr}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTab: true,
      level: '',
      directPushList: [],
      betweenPush: [],
      showDirectPush: false,
      showBetweenPush: false,
      total: 0
    }
  },
  onLoad (options) {
    this.level = options.level
  },
  onShow () {
    this.queryPushList()
    this.changeTab(1)
  },
  methods: {
    queryPushList () {
      this.$http.post(this.API.queryPushList, {
        data: {
          level: this.level
        }
      }).then(res => {
        this.directPushList = res.result.directPushList // 直推列表
        this.betweenPush = res.result.betweenPush // 间推列表
        this.total = Number(this.directPushList.length) + Number(this.betweenPush.length)
      })
    },
    changeTab (index) {
      this.currentTab = !this.currentTab
      if (index === 1) {
        this.showDirectPush = true
        this.showBetweenPush = false
      } else {
        this.showDirectPush = false
        this.showBetweenPush = true
      }
    },
    changeName (e, item) {
      this.$http.post(this.API.saveRemark, {
        data: {
          remarkCode: item.code,
          remarkName: e.mp.detail.value
        }
      }).then(res => {
        if (res.code === 0) {
          this.queryPushList()
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
    height: 178rpx;
    background-color: #fbb03b;
    text-align: center;
    color: #fff;
    p{
      padding-top: 5rpx;
      font-size: 26rpx;
    }
    .num{
      padding-top: 15rpx;
      font-size: 40rpx;
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
  font-size: 28rpx;
  li{
    flex-grow: 1;
    text-align: center;
    color: #fff;
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
    background: #fff;
    span{
      display: inline-block;
      width: 33%;
      text-align: center;
      position: relative;
      .change-name{
        display: inline-block;
        margin-top: -7rpx;
        vertical-align: middle;
      }
    }
    span:nth-child(2){
      color: #f7a012;
    }
  }
}
.icon {
  background: url('../../../../static/images/cruise.png');
  display: inline-block;
  background-size: 350rpx 150rpx;
  background-position: -115rpx -5rpx;
  width: 28rpx;
  height: 28rpx;
  vertical-align: middle;
  position: absolute;
  top: 37rpx;
  left: 35rpx;
}
</style>
