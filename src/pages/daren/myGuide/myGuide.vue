<template>
    <div>
      <i-tabs :current="currentTab" color="#fbb03b" @change="tabChange" >
        <i-tab key=" " title="全部"></i-tab>
        <i-tab key="2" title="销售中"></i-tab>
        <i-tab key="1" title="审核中"></i-tab>
        <i-tab key="3" title="审核未通过"></i-tab>
        <i-tab key="4" title="下架"></i-tab>
      </i-tabs>
      <div class="item-modules" v-for="(item, index) in guideList" :key = index>
        <p class="sec-data">
          <span class="code">产品编号：{{item.productCode}}</span>
          <span class="date">{{item.createTime}}</span>
        </p>
        <p class="title">{{item.productName}}</p>
        <div class="thi-data">
          <!-- status：状态：0-草稿 1-待审核 2-上架 3-审核不通过 4-下架 5-删除 -->
          <span class="type"><span v-if="item.status === 2">销售中</span></span>
          <div class="right-box">
            <span class="edit" @click="goEdit(item)">编辑</span>
            <span :class="{'gray': (item.status === 0) || (item.status === 1) || (item.status === 2) || (item.status === 3)}" @click="toogleStatus(item, 2)">上架</span>
            <span :class="{'gray': (item.status === 0) || (item.status === 1) || (item.status === 3) || (item.status === 4)}" @click="toogleStatus(item, 4)">下架</span>
            <!-- 只有待审核或者下架的可以删 -->
            <span :class="{'gray': (item.status === 2) || (item.status === 3)}" @click="toogleStatus(item, 5)">删除</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      currentTab: ' ',
      maskTop: 0,
      guideList: [],
      currentPage: 1, // 当前页数
      currentCount: 1, // 总页数
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onShow () {
    this.getGuideList()
  },
  methods: {
    tabChange (detail) {
      this.currentTab = detail.mp.detail.key
      this.getGuideList()
    },
    getGuideList() {
      this.$http.post(this.API.myGuide, {
        data: {
          status: this.currentTab, // 全部
          type: 2,
          pageSize: 20,
          currentPage: this.currentPage
        }
      }).then(res => {
        if (res.code === 0) {
          this.guideList = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    toogleStatus (item, status) {
      // 置灰的不能点击
      if (status === 2) {
        if ((item.status === 1) || (item.status === 2) || (item.status === 3)) {
          return
        }
      }
      if (status === 4) {
        if ((item.status === 1) || (item.status === 3) || (item.status === 4)) {
          return
        }
      }
      if (status === 5) {
        if ((item.status === 2) || (item.status === 3)) {
          return
        }
      }
      this.$http.post(this.API.updateStatus, {
        data: {
          ids: item.id,
          status: status
        }
      }).then(res => {
        if (res.code === 0) {
          this.guideList = []
          this.getGuideList()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goEdit(item) {
      wx.navigateTo({
        url: `/pages/daren/pushGuideF/main?id=${item.id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.item-modules{
  background: #fff;
  padding: 40rpx 30rpx 50rpx 30rpx;
  margin-top: 20rpx;
}
.sec-data{
  .code, .date{
    font-size: 22rpx;
    color: #666666;
  }
  .date{
    float: right;
    margin-top: 8rpx;
  }
}
.title{
  color: #333333;
  font-size: 30rpx;
  margin-top: 30rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.thi-data{
  margin-top: 30rpx;
  .type{
    color: #388ef8;
    font-size: 24rpx;
    margin-top: 5rpx;
    display:inline-block;
    width: 100rpx;
  }
  .right-box{
    float:right;
    span{
      width: 100rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 24rpx;
      display: inline-block;
      border-radius: 20rpx;
      border: 1rpx solid #ff9913;
      color: #ff9913;
      margin-right: 20rpx;
    }
    .edit{
      color: #fff;
      background: #ff9913;
    }
    .gray{
      border: 1rpx solid #999999;
      color: #999999;
    }
    span:last-child{
      margin-right:0;
    }
  }
}

</style>