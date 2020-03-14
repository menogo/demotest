<template>
  <div class="page" >
    <div class="select-box">
      <div class="select-input">
        <!-- <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span> -->
        <div class="po-re">
          <i class="icon sel-icon"></i>
          <input type="text" placeholder="输入关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch($event.target.value)" autofocus>
        </div>
      </div>
    </div>
    <div class="history-box" v-if="historyList && historyList.length > 0">
        <i class="clear-icon" @click="delSearchWord"></i>
        <P class="title">历史搜索<i class="icon bot-icon"></i></P>
        <div class="history-flex" :class="{'hide': hideHisToryList}">
          <div class='flex-item' v-for="(item, index) in historyList" :key="index" @click="keyWordSearch($event.target.value)">{{item.searchKey}}</div>
        </div>
        <p class="more"  @click="toogleHistoryList" v-if="hideHisToryList && (historyList && historyList.length > 4)">更多<i class="more-icon"></i></p>
        <p class="more"  @click="toogleHistoryList" v-if="!hideHisToryList">收起<i class="hide-icon"></i></p>
    </div>
    <div class="hot-box" v-if="hotList.length > 0">
      <P class="title mt20">热门搜索<i class="icon bot-icon"></i></P>
      <div class="hot-flex">
        <div class='flex-item' v-for="(item, index) in hotList" :key="index" @click="keyWordSearch(item)">{{item}}</div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentCity: '北京市',
      isLogin: false,
      searchTxt: '',
      hotList: [],
      historyList: [],
      hideHisToryList: true
    }
  },
  onShow () {
    if (!wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('userCity')
    } else {
      this.currentCity = wx.getStorageSync('selectCity')
    }
    this.searchTxt = []
    this.hotList = []
    this.historyList = []
    this.checkLogin()
    this.getHotList()
  },
  methods: {
    toogleHistoryList () {
      this.hideHisToryList = !this.hideHisToryList
    },
    getHistoryList () {
      this.$http.post(this.API.searchWordList, {
        data: {
          currentPage: 1,
          pageSize: 50,
          searchType: 1
        }
      }).then(res => {
        if (res.code === 0) {
          this.historyList = res.result.data
          console.log('this.historyList', this.historyList)
        }
      })
    },
    getHotList () {
      this.$http.post(this.API.queryHotSearchKey, {
        data: {
          currentPage: 1,
          pageSize: 6
        }
      }).then(res => {
        if (res.code === 0) {
          this.hotList = res.result
        }
      })
    },
    keyWordSearch (item) {
      if (item) {
        this.searchTxt = item
      }
      if (this.searchTxt === '') {
        return
      }
      wx.navigateTo({
        url: `/pages/search/main?flag=4&keyword=${this.searchTxt}`
      })
    },
    delSearchWord() {
      if (!this.isLogin) {
        wx.removeStorageSync('searchList')
        this.historyList = []
        return
      }
      this.$http.post(this.API.delSearchWord, {}).then(res => {
        if (res.code === 0) {
          this.historyList = []
        }
      })
    },
    checkLogin() {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0) {
          this.isLogin = res.result
          if (this.isLogin) {
            this.getHistoryList()
          } else {
            this.historyList = wx.getStorageSync('searchList')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #fff;
}
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
      // width: 130rpx;
      margin: 17rpx 0;
      line-height: 30rpx;
      text-align: center;
      border-right: 1rpx solid #aaa;
      // margin: 18rpx 0;
      padding: 0 20rpx 0 40rpx;
      .icon{
        // margin-left: 10rpx;
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
        margin-left: 20rpx;
        color: #353535;
        margin-top: -5rpx;
        width: 80%;
      }
    }
  }
}
.hot-box, .history-box{
  background: #fff;
  padding: 30rpx;
  position: relative;
  .title{
      font-size: 30rpx;
      padding-bottom: 20rpx;
      .icon{
      float: right;
      }
      .bot-icon{
      background-position: -110rpx -5rpx;
      width: 35rpx;
      height: 17rpx;
      margin-top: 17rpx;
      }
      .top-icon{
      background-position: 0 -38rpx;
      width: 35rpx;
      height: 17rpx;
      margin-top: 17rpx;
      }
  }
  .clear-icon{
      background: url('../../../static/images/travelSort.png');
      background-size: 200rpx 200rpx;
      background-position:-44rpx -164rpx;
      vertical-align: middle;
      width: 35rpx;
      height: 35rpx;
      float: right;
    }
  .hot-flex, .history-flex{
    display: flex;
    flex-wrap: wrap;
      .flex-item{
      min-width: 100rpx;
      padding: 0 13rpx;
      height: 60rpx;
      line-height: 60rpx;
      background-color: #f4f4f4;
      border-radius: 8rpx;
      color: #666;
      font-size: 30rpx;
      text-align: center;
      margin:30rpx 9rpx 0 9rpx;
      }
  }
  .more{
    margin-top: 10rpx;
    color: #999;
    text-align: center;
    position: absolute;
    bottom: -35rpx;
    width: 90%;
    z-index: 9;
    .more-icon, .hide-icon{
      background: url('../../../static/images/travelSort.png');
      background-size: 200rpx 200rpx;
      background-position:-111rpx -6rpx;
      display: inline-block;
      vertical-align: middle;
      width: 32rpx;
      height: 25rpx;
      margin-top: 10rpx;
      margin-left: 13rpx;
    }
    .hide-icon{
      background-position:-3rpx -35rpx;
      margin-top: 0;
    }
  }
}
.mt20{
  margin-top: 20rpx;
}
.history-box .history-flex.hide{
  height: 100rpx;
  overflow: hidden;
}
</style>