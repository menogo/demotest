<template>
  <div class="page" v-if="show">
    <div class="fui-list-group">
      <div class="fui-list-group-title">
        <image src="/static/images/icon/shop.png" class="round "></image>
        <text class="shop">{{order.merchantName}}</text>
      </div>
      <block v-for="(item, index) in order.detailList" :key = index>
        <navigator open-type="redirect" class="fui-list goods-item" :url="'/pages/goods/goodsDetail/main?id='+item.productId">
          <div class="fui-list-media">
            <image :src="item.productImg" class="round goods_img"></image>
          </div>
          <div class="fui-list-inner">
            <div class="text">{{item.productName}}</div>
            <div class="subtitle">{{item.specName}}</div>
          </div>
          <div class="price text-right">
            <div class="text-right">￥
              <text>{{item.amount}}</text>
            </div>
            <div class="text-right">x
              <text>{{item.num}}</text>
            </div>
          </div>
        </navigator>
      </block>
    </div>
    <div class="fui-list-group">
      <div class="fui-list express-top">
        <div class="fui-list-inner">
          <div class="fui-list-inner">
            物流状态：
            <text class="text-success">{{statusJson[expressInfo.State]}}</text>
            <div class="text">快递公司：{{expressInfo.ShipperCode}}
              <text></text>
            </div>
            <div class="text">快递单号：{{expressInfo.LogisticCode}}
              <text></text>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" v-if="!expressInfo">
        <image class="light" src="/static/images/icon/deliver-48.png"></image>
        <div class="text-cancel">暂时没有物流信息</div>
      </div>
      <div class="fui-list-group express-list" v-if="expressInfo.Traces">
        <block v-for="(item, index) in expressInfo.Traces" :key="index">
          <div :class="{current: index == 0}" class="fui-list">
            <div class="fui-list-inner">
              <div class="text step">{{item.AcceptStation}}</div>
              <div class="text time">{{item.AcceptTime}}</div>
            </div>
          </div>
        </block>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show: false,
        expressInfo: {},
        order: {},
        statusJson: { 2: '在途中', 3: '已签收', 4: '问题件' }
      }
    },
    onLoad(options) {
      this.expressInfo = {}
      this.order = {}
      this.options = options
      this.get_list()
      this.getData()
    },
    onShow() {
    },
    components: {
    },
    methods: {
      getData() {
        this.$http.post(this.API.getExpress, {
          data: this.options
        }).then(res => {
          this.show = true
          if (res.code === 0) {
            this.expressInfo = res.result
          }
        })
      },
      get_list () {
        this.$http.post(this.API.getShopOrderDetail, {
          data: this.options
        }).then(res => {
          if (res.code === 0) {
            this.show = true
            this.order = res.result
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
  @import "../../../scss/fui.scss";
  .empty {
    padding: 150rpx;
    text-align: center;
  }

  .light {
    height: 260rpx;
    width: 240rpx;
  }

  .text-cancel {
    padding: 40rpx;
  }

  .fui-list.express-top {
    padding: 20rpx 30rpx 0 30rpx;
  }

  .goodsNum {
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    height: 40rpx;
    width: 130rpx;
    font-size: 24rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
  }

  .fui-list-group.express-list .fui-list .fui-list-inner:before {
    content: " ";
    width: 0;
    height: 100%;
    position: absolute;
    border-left: 4rpx solid #c9c9c9;
    top: 0;
    left: 40rpx;
    z-index: 9999;
  }

  .express-list .fui-list:first-child .fui-list-inner:before {
    top: 40rpx;
  }

  .express-list .fui-list:last-child .fui-list-inner:before {
    height: 40rpx;
  }

  .express-list .fui-list .fui-list-inner {
    padding: 30rpx 70rpx;
  }

  .express-list .fui-list.current .fui-list-inner .text {
    color: #ef4f4f;
    font-size: 26rpx;
  }

  .express-list .fui-list .fui-list-inner .text.step:before {
    content: " ";
    height: 16rpx;
    width: 16rpx;
    background: #aaa;
    border: 2rpx solid #c9c9c9;
    border-radius: 050%;
    position: absolute;
    z-index: 9999;
    top: 10rpx;
    left: -37rpx;
  }

  .express-list .fui-list.current .fui-list-inner .text.step:before {
    background: #ef4f4f;
    border: 0.1rem solid #fd9797;
  }

  .express-list .fui-list {
    padding: 0;
  }

  .fui-list-inner .text {
    position: relative;
    font-size: 26rpx;
    line-height: 34rpx;
    color: #666;
  }

  .fui-list-media image {
    width: 130rpx;
    height: 130rpx;
  }
  @import "../../../scss/fui.scss";
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
    font-size: 27rpx;
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

  .fui-footer {
    text-align: right;
  }

  .bg {
    background: #ff9326;
    margin-top: 0;
    color: #fff;
  }

  .row {
    font-size: 30rpx;
    font-weight: bold;
  }

  .order-price {
    font-size: 27rpx;
    color: #fff;
    line-height: 44rpx;
  }

  .adress {
    font-size: 27rpx;
    color: #666;
  }

  .order-info {
    padding: 20rpx 0;
  }

  .order-info view, .send-code {
    padding: 6rpx 25rpx;
    color: #666;
    font-size: 28rpx;
  }

  .send-code.send-code1 {
    padding: 6rpx 10rpx;
    color: #666;
    font-size: 28rpx;
  }

  .price {
    font-size: 30rpx;
    color: #999;
    width: 260rpx;
  }

  .fui-list-inner .subtitle {
    line-height: 40rpx;
  }

  .send-code {
    display: none;
  }

  .fui-cell-group.toggleSend-group .send-code {
    display: block;
    font-size: 30rpx;
  }

  .fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after {
    -webkit-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  .fui-list-media .image-48 {
    height: 48rpx;
    width: 48rpx;
  }

  .text-padding {
    padding: 0 10rpx;
  }

  .image-48 {
    margin: 8rpx 0;
  }

  .operate {
    display: -webkit-flex;
    display: flex;
  }

  .operate navigator {
    -webkit-flex: 1;
    flex: 1;
  }

  .fui-cell-group .fui-cell .fui-cell-remark {
    color: #888;
    text-align: right;
    font-size: 28rpx;
    margin-right: 8rpx;
  }

  .btn.btn-default {
    background-color: #fff;
  }
  .refund-text {
    font-size: 14px;
  }
</style>
