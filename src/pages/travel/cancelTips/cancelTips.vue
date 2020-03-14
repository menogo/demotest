<template>
  <div>
    <div class="main-box">
      <p class="title">取消政策</p>
      <p>【买家违约】在行程前解除合同的，必要的费用扣除标准为： </p>
      <table class="table">
        <thead>
          <tr>
            <th>出行前</th>
            <th>违约金（占订单总费用）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{reserveMsg.beforeDay}}日及以上</td>
            <td>{{reserveMsg.beforeBuyerRate}}%</td>
          </tr>
          <tr>
            <td>{{reserveMsg.startDay}}日至{{reserveMsg.endDay}}日</td>
            <td>{{reserveMsg.betweenBuyerRate}}%</td>
          </tr>
          <tr>
            <td>出行当日</td>
            <td>{{reserveMsg.dayBuyerRate}}%</td>
          </tr>
        </tbody> 
      </table>
      <p>【商家违约】在规定时间内违约，除退还全额旅游费用外，另支付违约金比例如下： </p>
      <table class="table">
        <thead>
          <tr>
            <th>出行前</th>
            <th>违约金（占订单总费用）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{reserveMsg.beforeDay}}日及以上</td>
            <td>{{reserveMsg.beforeSellerRate}}%</td>
          </tr>
          <tr>
            <td>{{reserveMsg.startDay}}日至{{reserveMsg.endDay}}日</td>
            <td>{{reserveMsg.betweenSellerRate}}%</td>
          </tr>
          <tr>
            <td>出行当日</td>
            <td>{{reserveMsg.daySellerRate}}%</td>
          </tr>
        </tbody> 
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reserveMsg: '' // 取消政策数据
    }
  },
  mounted () {
    this.reserveMsg = wx.getStorageSync('reserveMsg')
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  padding: 30rpx;
  font-size: 26rpx;
  color: #353535;
  .title{
    font-size: 30rpx;
    color: #000;
    margin-bottom: 18rpx;
    font-weight: bold;
  }
}
.table {
  margin-top: 18rpx;
  margin-bottom: 30rpx;
  font-size: 26rpx;
  border: 1rpx solid #dcdcdc;
  thead tr, tbody tr{
    display: flex;
    border-bottom: 1rpx solid #dcdcdc;
  }
  thead tr{
    background: #f4f4f4;
  }
  thead tr th, tbody tr td {
    width: 50%;
    text-align: center;
    height: 45rpx;
    line-height: 45rpx;
    padding:  15rpx 0;
  }
  thead tr th:first-child, tbody tr td:first-child {
    border-right: 1rpx solid #dcdcdc;
  }
}
</style>