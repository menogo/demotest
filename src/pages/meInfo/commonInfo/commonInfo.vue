<template>
  <div class="page">
    <i-tabs :current="current" color="#fbb03b" @change="tabChange" >
      <i-tab key="tab1" title="旅客"></i-tab>
      <i-tab key="tab2" title="地址"></i-tab>
    </i-tabs>
    <div v-if="current === 'tab1'">
      <p class="add" @click="addCustomer">
        <span><i-icon type="add" size="15" class="add-icon"/></span>
        <span>新增旅客</span>
      </p>
      <ul class="customerList">
        <li v-for="(item, index) in customerList" :key = index @click="toDetail(item)">
          <p>{{item.visitorName}}</p>
          <p><span>{{item.cardTypeStr}}</span><span>{{item.idCard}}</span></p>
        </li>
      </ul>
    </div>
    <div v-if="current === 'tab2'">
      <addressList></addressList>
    </div>

  </div>
</template>

<script>
import addressList from '@/components/address'
export default {
  data () {
    return {
      current: 'tab1',
      customerList: [] // 旅客列表
    }
  },
  components: {
    addressList
  },
  onShow () {
    this.getCustomerList()
  },
  methods: {
    addCustomer () { // 新增旅客信息
      wx.navigateTo({
        url: `/pages/meInfo/addCustomer/main`
      })
    },
    toDetail(item) { // 编辑旅客信息
      wx.navigateTo({
        url: `/pages/meInfo/addCustomer/main?id=${item.id}`
      })
    },
    tabChange (detail) {
      this.current = detail.mp.detail.key
      if (this.current === 'tab1') {
        this.getCustomerList()
      }
    },
    // 获取游客列表
    getCustomerList () {
      this.$http.post(this.API.customerList, {
        data: {
          // currentPage: 1,
          // pageSize: 1
        }
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.customerList = res.result.data
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
  min-height: 100vh;
  background: #f4f4f4;
}
.add{
  background: #fff;
  height:70rpx;
  line-height: 70rpx;
  // padding: 20rpx 0;
  text-align: center;
  color: #ccc;
  font-size: 26rpx;
  margin-top: 24rpx;
  span{
    display: inline-block;
    // margin-top: 0;
    // margin-left: 10rpx;
    vertical-align: top;

  }
}
.customerList{
  li {
    padding: 10rpx 30rpx;
    background: #fff;
    margin-top: 20rpx;
  }
  li p:first-child{
    font-size: 28rpx;
    color: #353535;
  }
  li p:last-child{
    font-size: 22rpx;
    color: #888888;
    span:last-child{
      margin-left: 20rpx;
    }
  }
}
</style>
