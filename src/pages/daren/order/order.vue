<template>
  <div class='page'>
    <i-tabs :current="wrapCurrent" color="#ff9913" @change="tabWrapChange" class="i-tabs">
      <i-tab key="0" title="陪游包车"></i-tab>
      <i-tab key="1" title="向导咨询"></i-tab>
      <i-tab key="2" title="代购订单"></i-tab>
    </i-tabs>
    <i-tabs :current="current" color="#ff9913" @change="tabChange" class="i-tabs" style="margin-top: 42px" v-if="wrapCurrent != 2">
      <i-tab key="all" title="全部"></i-tab>
      <i-tab key="dfk" title="待付款"></i-tab>
      <i-tab key="yfk" title="已付款"></i-tab>
      <i-tab key="ctz" title="出团中"></i-tab>
      <i-tab key="dpj" title="待评价"></i-tab>
      <i-tab key="tk" title="退款"></i-tab>
    </i-tabs>
    <i-tabs :current="current" color="#ff9913" @change="tabChange" class="i-tabs" style="margin-top: 42px" v-else >
      <i-tab key="all" title="全部"></i-tab>
      <i-tab key="dfk" title="待付款"></i-tab>
      <i-tab key="yfk" title="待发货"></i-tab>
      <i-tab key="ctz" title="待收货"></i-tab>
      <i-tab key="dpj" title="待评价"></i-tab>
      <i-tab key="tk" title="售后/退款"></i-tab>
    </i-tabs>
    <ul class="order-list">
      <li class="fui-list-group noclick" v-for="(item, index) in orderList" :key = index v-if="wrapCurrent == 2">
        <navigator hover-class="none" :url="'/pages/goods/orderDetail/main?id='+item.id">
          <div class="fui-list-group-title">
            <div class="order-num">订单号：
              <text>{{item.orderNo}}</text>
            </div>
            <div class="statuscss">{{statusJson[item.status]}}</div>
          </div>
          <block v-for="(val, key) in item.detailList" :key = key>
            <div class="fui-list goods-info">
              <div class="fui-list-media">
                <image :src="val.productImg" class="round goods_img"></image>
              </div>
              <div class="fui-list-inner">
                <div class="text text-left">{{val.productName}}</div>
                <div class="subtitle text-left">{{val.specName}}</div>
              </div>
              <div class="num">
                <div class="text-right">￥
                  <text>{{val.costPrice}}</text>
                </div>
                <div class="text-right">x
                  <text>{{val.num}}</text>
                </div>
              </div>
            </div>
          </block>
          <div class="fui-list list-padding" v-if="item.detailList">
            <text class="fui-list-inner text-right totle">
              <text>共</text>
              <text class="text-danger">{{item.detailList.length}}</text>
              <text>个商品 实付</text>
              <text class="text-danger">
                <text>￥</text>
                <text>{{item.orderPrice}}</text>
              </text>
            </text>
          </div>
        </navigator>
        <div class="fui-list list-padding" v-if="item.status != 5 && item.status != 6 && item.status != 7 && item.status != 8 && item.status != 9 && item.status != 10">
          <div class="fui-list-inner text-right">
            <block>
              <div class="btn btn-default btn-default-o" v-if="item.status == 1">
                <picker @change="pickerCancel($event, item.id)" :range="cancel" :value="cancelindex">
                  取消订单
                </picker>
              </div>
              <div class="btn btn-default btn-default-o" v-if="item.status == 2 && item.status <= 4">
                <picker @change="pickerRefund($event, item.id)" :range="reasonArr" :value="refundindex">
                  申请退款
                </picker>
              </div>
              <navigator class="btn btn-danger" :url="'/pages/goods/orderDetail/main?id='+item.id" v-if="item.status == 1">
                去付款
              </navigator>
              <navigator class="btn btn-default btn-default-o" :url="'/pages/goods/comment/main?id='+item.id" v-if="item.status == 4">
                评价
              </navigator>
              <navigator class="btn btn-default btn-default-o" :url="'/pages/goods/express/main?id='+item.id" v-if="item.status == 3">
                查看物流
              </navigator>
              <div @click="finish(item.id)" class="btn btn-default btn-default-o" v-if="item.status == 3">确认收货</div>
              <div v-if="item.status == 8 || item.status == 9 || item.status == 10" class="refund-text">原因: {{item.refundDesc}}</div>
            </block>
          </div>
        </div>
      </li>
      <!-- <li>
        <p class="title">
          <i-icon type="document" size="18" class="icon"/>
          <span>LINLIN</span>
          <span class="right">已取消</span>
        </p>
        <div class="img-main">
          <img :src="themeImg" alt="">
          <div class="txt-right">
            <p><span class="icon">旅游订单</span> 一日爱上深圳一日深圳深圳一日爱上深圳一日爱上深圳一日爱上深圳一日爱上深圳一日爱上深圳一日爱上深圳</p>
          </div>
        </div>
        <div class="txt-main">
          <p>出发时间： 2019-03-31</p>
          <p>行程天数： 6天5晚</p>
          <p>套餐包含： 成人 1</p>
          <p class="right">合计：￥8999</p>
        </div>
      </li> -->
    </ul>
  </div>
</template>

<script>
  // import dayjs from 'dayjs'
  export default {
    data () {
      return {
        statusJson: {
          1: '待付款',
          2: '待发货',
          3: '待收货',
          4: '待评价',
          5: '已完成',
          6: '已取消',
          7: '已关闭',
          8: '退款中',
          9: '拒绝退款',
          10: '已退款'
        },
        current: 'all',
        wrapCurrent: 0,
        orderList: [], // 订单列表
        themeImg: require('../../../../static/images/common/themeBg.jpg')
      }
    },
    onShow() {
      this.current = 'all'
      this.getList()
    },
    methods: {
      tabChange (detail) {
        this.current = detail.mp.detail.key
        this.getList()
      },
      tabWrapChange (detail) {
        this.wrapCurrent = detail.mp.detail.key
        this.current = 'all'
        this.getList()
      },
      getList () {
        this.orderList = []
        let status = ''
        switch (this.current) {
          case 'all': status = ''; break
          case 'dfk': status = 1; break
          case 'yfk': status = 1; break
          case 'ctz': status = 2; break
          case 'dpj': status = 3; break
          case 'tk': status = '7,8,9'; break
        }
        this.$http.post(this.API.getShopOrderList, {
          data: {
            currentPage: 1,
            pageSize: 10,
            status: status
          }
        }).then(res => {
          if (res.code === 0) {
            if (res.result.data.length > 0) {
              this.page++
              this.orderList = this.orderList.concat(res.result.data)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
        /* this.$http.post(this.API.talent, {
          data: {
            statusStr: status
          }
        }).then(res => {
          if (res.code === 0) {
            this.orderList = res.result.data
            this.orderList.forEach((item) => {
              item.serviceTime = dayjs(item.serviceTime).format('YYYY-MM-DD') // 出发时间
              switch (item.status) {
                case 1:
                  item.status = '待付款'
                  break
                case 2:
                  item.status = '待确认'
                  break
                case 3:
                  item.status = '待出行'
                  break
                case 4:
                  item.status = '待评价'
                  break
                case 5:
                  item.status = '已完成'
                  break
                case 6:
                  item.status = '已取消'
                  break
                case 7:
                  item.status = '已关闭'
                  break
                case 8:
                  item.status = '退款中'
                  break
                case 9:
                  item.status = '拒绝退款'
                  break
                case 10:
                  item.status = '已退款'
                  break
              }
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        }) */
      },
      goEvaluate (item) {
        console.log(item.id)
        wx.navigateTo({
          url: `/pages/travel/addEvaluate/main?id=${item.id}&logoImg=${item.logoImg}&productId=${item.productId}`
        })
      },
      goDetail (id) {
        wx.navigateTo({
          url: `/pages/travel/travelOrderDetail/main?id=${id}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../scss/fui.scss";
  .page {
    min-height: 100vh;
    background: #f4f4f4;
  }
  .i-tabs{
    top: 0;
    position: fixed;
    width: 100%;
    background: #fff;
    z-index: 9;
  }
  .order-list{
    background: #fff;
    font-size:24rpx;
    color:#353535;
    margin-top: 84px;
  }
  .fui-number {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    box-sizing: border-box;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    font-size: 26rpx;
    margin: 0;
    height: 60rpx;
    width: 200rpx;
    border: 1px solid #d9d9d9;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    overflow: hidden;
  }

  .minus, .plus {
    width: 60rpx;
    height: 60rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #999;
    position: relative;
    text-align: center;
    background: #f7f7f7;
    line-height: 60rpx;
    z-index: 1;
  }

  .plus {
    border-left: 1px solid #d9d9d9;
  }

  .minus {
    border-right: 1px solid #d9d9d9;
  }

  .fui-number .num {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 40rpx;
    color: #666;
    text-align: center;
    border: 0;
  }

  .disabled {
    background: #fff;
  }

  .adress {
    font-size: 27rpx;
    color: #666;
  }

  .shop {
    margin: 8rpx 0 0 10rpx;
  }

  .edtion {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 20rpx 0;
  }

  .consume, .store {
    margin-left: 10rpx;
  }

  .goods-info .num {
    font-size: 28rpx;
    color: #999;
    width: 260rpx;
    margin-right: 10rpx;
  }

  .list-padding {
    padding: 16rpx 30rpx;
  }

  .totle {
    font-size: 28rpx;
  }

  .order-status {
    color: #888;
    text-align: right;
    font-size: 30rpx;
    margin-right: 8rpx;
  }

  .fui-modal {
    position: fixed;
    background: rgba(0, 0, 0, 0.7) none repeat scroll 0 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
  }

  .fui-modal-info {
    position: fixed;
    width: 100%;
    z-index: 1001;
    text-align: center;
    top: 50rpx;
  }

  .fui-modal-info .code {
    width: 450rpx;
    height: 450rpx;
    margin: 50rpx 0;
  }

  .tap {
    text-align: center;
    color: #f90;
    font-size: 40rpx;
    line-height: 50rpx;
  }

  .close {
    text-align: right;
    padding: 30rpx;
  }

  .close image {
    width: 80rpx;
    height: 80rpx;
  }

  .send-code {
    display: none;
  }

  .fui-cell-group.toggleSend-group .send-code {
    display: block;
    font-size: 26rpx;
  }

  .fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after {
    -webkit-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  .cart-option {
    margin-top: 8rpx;
  }

  body {
    background: #f7f7f7;
  }

  .goods-info {
    width: auto;
  }

  .order .contain {
    margin-top: 90rpx;
  }

  .order .btn {
    margin: 10rpx 0 10rpx 20rpx;
    padding: 10rpx 10rpx;
    height: 50rpx;
    line-height: 30rpx;
  }

  .order .empty {
    padding: 260rpx 150rpx;
    font-size: 34rpx;
  }

  .order .empty .btn {
    padding: 20rpx 20rpx;
    height: 80rpx;
    line-height: 40rpx;
    font-size: 34rpx;
  }

  .order .light {
    height: 260rpx;
    width: 240rpx;
    margin-bottom: 55rpx;
  }

  .order .text-cancel {
    padding: 10rpx;
  }

  .order .order-num {
    -webkit-flex: 1;
    flex: 1;
  }

  .fui-tab-scroll .item {
    padding: 0 30rpx;
    font-size: 26rpx;
    color: #888
  }

  .order .fui-list-inner .subtitle {
    line-height: 44rpx;
  }

  .refund-text {
    font-size: 14px;
  }

  .view-input {
    padding: 0 20px;
    .input {
      padding: 5px 10px;
      border: 1px solid #dadada;
      border-radius: 5px;
    }
  }
  .fui-list-group-title {
    justify-content: space-between;

  }


</style>
