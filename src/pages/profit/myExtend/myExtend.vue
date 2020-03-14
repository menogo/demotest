<template>
  <div class="page">
    <div class="main-list">
      <div class="member-title"  @click="tooglePersonList">
        <i class="icon1"></i>
        <span>个人会员</span>
        <i :class="{'icon3' : showPersonList && personalList.length > 0, 'icon4': !showPersonList && personalList.length > 0}"></i>
      </div>
      <ul class="member-list" v-if="showPersonList">
        <li @click="goExtendRecord(item.level)" v-for="(item, index) in personalList" :key = index>
          <span>{{item.levelName}}</span>
          <span>直推{{item.directPush}}人</span>
          <span>间推{{item.betweenPush}}人</span>
          <i class="right-icon"></i>
        </li>
      </ul>
    </div>
    <div class="main-list mt-20" v-if="businessList.length > 0">
      <div class="member-title"   @click="toogleBusinessList">
        <i class="icon2"></i>
        <span>企业会员</span>
        <i :class="{'icon3' : showBusinessList && businessList.length > 0 , 'icon4': !showBusinessList && businessList.length > 0}"></i>
      </div>
      <ul class="member-list" v-if="showBusinessList">
        <li @click="goExtendRecord(item.level)" v-for="(item, index) in businessList" :key = index>
          <span>{{item.levelName}}</span>
          <span>直推{{item.directPush}}人</span>
          <span>间推{{item.betweenPush}}人</span>
          <i class="right-icon"></i>
        </li>
      </ul>
    </div>
    <!-- <ul class="main-list">
      <li @click="goExtendRecord(item.level)" v-for="(item, index) in pushData" :key = index>
        <span>{{item.levelName}}</span>
        <span>直推{{item.directPush}}人</span>
        <span>间推{{item.betweenPush}}人</span>
        <i class="right-icon"></i>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      pushData: [],
      personalList: [],
      businessList: [],
      showPersonList: true,
      showBusinessList: true
    }
  },
  onShow () {
    this.pushData = []
    this.personalList = []
    this.businessList = []
    this.showBusinessList = []
    this.queryPushMap()
  },
  methods: {
    queryPushMap () {
      this.$http.post(this.API.queryPushMap, {}).then(res => {
        this.pushData = res.result
        this.pushData.forEach((item) => {
          if (item.levelType === 1) {
            this.personalList.push(item)
          }
          if (item.levelType === 2) {
            this.businessList.push(item)
          }
        })
      })
    },
    tooglePersonList() {
      this.showPersonList = !this.showPersonList
    },
    toogleBusinessList() {
      this.showBusinessList = !this.showBusinessList
    },
    goExtendRecord (level) {
      wx.navigateTo({
        url: `/pages/profit/extendRecord/main?level=${level}`
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
.mt-20{
  border-top: 20rpx solid #f4f4f4;
}
.member-title{
    height: 100rpx;
    line-height: 100rpx;
    padding: 0 50rpx; 
  }
.member-list{
  li{
    height: 120rpx;
    line-height: 120rpx;
    border-bottom: 1rpx solid #f4f4f4;
    color: #333333;
    font-size: 28rpx;
    position: relative;
    margin: 0 30rpx;
    span{
      display: inline-block;
      width: 33%;
      text-align: center;
    }
  }
  li:last-child{
    border-bottom: none;
  }
}
.right-icon {
  background: url('../../../../static/images/goodsDetail.png');
  background-size: 500rpx 120rpx;
  background-position:-232rpx 0;
  width: 15rpx;
  height: 30rpx;
  top:45rpx;
  right: 30rpx;
  position: absolute;
}
.icon1, .icon2, .icon3, .icon4{
  background: url('../../../../static/images/member.png');
  background-size: 200rpx 50rpx;
  background-position:-3rpx -3rpx;
  width: 42rpx;
  height: 42rpx;
  display: inline-block;
  vertical-align: middle;
  margin-right: 15rpx;
  margin-top: -5rpx;
}
.icon2{
  background-position:-45rpx -8rpx;
}
.icon3, .icon4{
  width: 40rpx;
  height: 25rpx;
  float:right;
  margin-top: 40rpx;
  margin-right: 0;
}
.icon3{
  background-position:-90rpx -12rpx;
}
.icon4{
  background-position:-142rpx -12rpx;
}
</style>
