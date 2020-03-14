<template>
    <div>
      <ul class="customerList">
        <li v-for="(item, index) in customerList" :key = index>
          <p>{{item.visitorName}}</p>
          <p><span>身份证</span><span>{{item.idCard}}</span></p>
        </li>
      </ul>
    </div>
</template>

<script>
    export default{
      data () {
        return {
          customerList: [] // 旅客列表
        }
      },
      mounted () {
        this.getCustomerList()
      },
      methods: {
        // 获取游客列表
        getCustomerList () {
          this.$http.post(this.API.customerList, {
            data: {
              currentPage: 1,
              pageSize: 1
            }
          }).then(res => {
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

<style scoped lang="scss">
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