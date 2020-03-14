<template>
  <div class="page">
    <div v-if="reserveMsg">
      <div class="modu-box">
        <p class="title">预订限制</p>
        <div class="main">
          <p>本产品不接受{{reserveMsg.rejectAge}}岁以上的人员预定</p>
          <p>本产品{{reserveMsg.lowerAge}}岁以下的人员预定，必须要有监护人陪行</p>
          <p>本产品{{reserveMsg.upperAge}}岁以上的人员预定，必须要提供医院开的健康证明</p>
          <p>
            <span v-if="reserveMsg.acceptForeign === 1">本产品接受外籍顾客预定</span>
            <span v-else>本产品不接受外籍顾客预定</span>
            <span v-if="reserveMsg.acceptHmt === 1">包含港澳台</span>
            <span v-else>不包含港澳台</span>
          </p>
        </div>
      </div>
      <div class="modu-box" v-if="reserveMsg.reserveDesc">
        <p class="title">预订说明</p>
        <div class="main">
          {{reserveMsg.reserveDesc}}
        </div>
      </div>
      <div class="modu-box" v-if="reserveMsg.productDesc">
        <p class="title">产品说明</p>
        <div class="main">
          {{reserveMsg.productDesc}}
        </div>
      </div>
      <div class="modu-box" v-if="reserveMsg.remind">
        <p class="title">温馨提示</p>
        <div class="main">
          {{reserveMsg.remind}}
        </div>
      </div>
      <div class="modu-box" v-if="reserveMsg.visaNotes">
        <p class="title">签证说明</p>
        <div class="main">
          {{reserveMsg.visaNotes}}
        </div>
      </div>
    </div>
    <div class="main-box">
      <p class="title">取消政策</p>
      <p>【买家违约】在行程前解除合同的，必要的费用扣除标准为： </p>
      <table class="table" width="100%">
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
      <table class="table" width="100%">
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
        orderNeedData: '',
        reserveMsg: ''
      }
    },
    onShow() {
      this.orderNeedData = wx.getStorageSync('orderNeedData') // 详情页存储的订单页需要的数据
      this.reserveMsg = this.orderNeedData.reserveMsg
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
    .page {
      min-height: 100vh;
      background: #f4f4f4;
    }
    .modu-box{
      background: #fff;
      padding: 30rpx 20rpx;
      margin-top: 20rpx;
      .title{
        font-size: 30rpx;
        margin-bottom: 10rpx;
        font-weight: bold;
      }
      .main{
        font-size: 26rpx;
        color: #353535;
        white-space: pre-wrap;
      }
    }
    .main-box {
        background: #fff;
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
