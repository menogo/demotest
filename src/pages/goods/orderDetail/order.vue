<template>
  <div class="page navbar" v-if="show">
    <div class="fui-list bg">
      <div class="fui-list-inner">
        <div class="row">
          <div class="">{{statusJson[order.status]}}{{order.status == 9 || order.status == 8 || order.status == 10 || order.status ==11 || order.status == 13 ? '(' + (order.refundApplyDesc || '') + ')' : ''}}</div>
        </div>
        <div class="order-price">订单金额(含运费):￥
          <text>{{order.orderPrice}}</text>
        </div>
      </div>
      <div class="">
        <image class="round image-88" src="/static/images/icon-white/money.png"></image>
      </div>
    </div>
    <div class="fui-list-group" v-if="order.receiver">
      <navigator class="fui-list" :url="'/pages/goods/express/main?id='+order.id" v-if="order.status == 3">
        <div class="fui-list-media">
          <image class="fui-list-icon" src="/static/images/icon/deliver-48.png"></image>
        </div>
        <div class="fui-list-inner">
          <block v-if="order.expressNumber">
            <div class="text">查看物流</div>
          </block>
        </div>
        <div class="fui-list-angle">
          <text class="angle"></text>
        </div>
      </navigator>
      <div class="fui-list" v-else>
        <div class="fui-list-media">
          <image class="fui-list-icon" src="/static/images/icon/deliver-48.png"></image>
        </div>
        <div class="fui-list-inner">
          <block>
            <div class="text">暂无物流信息</div>
            <div class="text"></div>
          </block>
        </div>
      </div>
      <div class="fui-list">
        <div class="fui-list-media">
          <image class="fui-list-icon" src="/static/images/icon/location.png"></image>
        </div>
        <div class="fui-list-inner">
          <div class="">{{order.receiver.receiver}} {{order.receiver.mobile}}</div>
          <div class="text">{{order.receiver.area + ' ' + order.receiver.address}}</div>
        </div>
      </div>
    </div>
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
    <div class="fui-cell-group price-cell-group">
      <div class="fui-cell">
        <div class="fui-cell-label">运费</div>
        <div class="fui-cell-info"></div>
        <div class="fui-cell-remark noremark">¥ {{order.freightPrice}}</div>
      </div>
      <div class="fui-cell">
        <div class="fui-cell-label" style="width:auto;">实付费(含运费)</div>
        <div class="fui-cell-info"></div>
        <div class="fui-cell-remark noremark">
          <text class="text-danger">
            <text style="font-size: 32rpx">¥ {{order.orderPrice}}</text>
          </text>
        </div>
      </div>
    </div>
    <div class="fui-cell-group">
      <div class="order-info">
        <div class="fui-cell-label"><span>订单编号：</span>
          <text class="fui-cell-label">{{order.orderNo}}</text>
        </div>
        <div class="fui-cell-label"><span>创建时间：</span>
          <text class="fui-cell-label">{{order.createTime}}</text>
        </div>
        <div class="fui-cell-label" v-if="order.payTime"><span>支付时间：</span>
          <text class="fui-cell-label">{{order.payTime}}</text>
        </div>
        <div class="fui-cell-label" v-if="order.sendTime"><span>发货时间：</span>
          <text class="fui-cell-label">{{order.sendTime}}</text>
        </div>
        <div class="fui-cell-label" v-if="order.finishTime"><span>完成时间：</span>
          <text class="fui-cell-label">{{order.finishTime}}</text>
        </div>
        <div class="fui-cell-label" v-if="order.remark"><span>留&emsp;&emsp;言：</span>
          <text class="fui-cell-label">{{order.remark}}</text>
        </div>
      </div>
    </div>
    <div class="operate">
      <navigator open-type="redirect" url="/pages/goods/order/main" class="btn btn-default">
        我的订单
      </navigator>
      <navigator open-type="switchTab" url="/pages/travelIndex/main" class="btn btn-default">
        返回首页
      </navigator>
    </div>
    <div class="fui-footer" v-if="order.status != 5 && order.status != 6 && order.status != 7 && order.status != 8 && order.status != 9 && order.status != 10">
      <div class="btn btn-default btn-default-o" v-if="order.status == 1">
        <picker @change="pickerCancel($event, order.id)" :range="cancel" :value="cancelindex">
          取消订单
        </picker>
      </div>
      <div class="btn btn-default btn-default-o" v-if="order.status == 2 && order.status <= 4 && order.detailList[0].deductionIntegral === 0">
        <picker @change="pickerRefund($event, order.id)" :range="reasonArr" :value="refundindex">
          申请退款
        </picker>
      </div>
      <div @click="payOrder" class="btn btn-danger" v-if="order.status == 1">
        支付订单
      </div>
      <navigator class="btn btn-default btn-default-o" :url="'/pages/goods/comment/main?id='+order.id" v-if="order.status == 4">
        评价
      </navigator>
      <navigator class="btn btn-default btn-default-o" :url="'/pages/goods/express/main?id='+order.id" v-if="order.status == 3">
        查看物流
      </navigator>
      <div @click="finish" class="btn btn-default btn-default-o" v-if="order.status == 3">确认收货</div>
    </div>
    <modal title="填写原因" :visible="showResonModal" @event="showReasonEvt" :actions="actions5">
      <div class="view-input"><input class="input" type="text" v-model="reason" /></div>
    </modal>
  </div>
</template>
<script>
  import modal from '../../../components/modal'
  export default {
    data () {
      return {
        code: false,
        consume: false,
        store: false,
        show: false,
        cancel: ['我不想买了', '信息填写错误，重新拍', '同城见面交易', '其他原因'],
        reasonArr: ['不想要了', '卖家缺货', '拍错了/订单信息错误', '其它'],
        refundindex: 0,
        cancelindex: 0,
        order: {},
        showCancelModal: false,
        showResonModal: false,
        reason: '',
        // 1-待付款 2-待发货 3-待收货 4-待评价 5-已完成 6-已取消 7-已关闭 8-申请退款 9-拒绝退款 10-退款中 11-已退款 12-已删除 13-退款失败
        statusJson: {
          1: '待付款',
          2: '待发货',
          3: '待收货',
          4: '待评价',
          5: '已完成',
          6: '已取消',
          7: '已关闭',
          8: '退款中', // 状态是申请退款，展示为退款中
          9: '拒绝退款',
          10: '退款中',
          11: '已退款',
          12: '已删除',
          13: '退款中' // 状态是退款失败，展示为退款中
        },
        actions5: [
          {
            name: '取消'
          },
          {
            name: '删除',
            color: '#ed3f14',
            loading: false
          }
        ]
      }
    },
    onLoad(options) {
      this.options = options
      this.get_list()
    },
    onShow() {
      this.get_list()
    },
    components: {
      modal
    },
    methods: {
      showReasonEvt(index) {
        if (index === 1) {
          if (this.reason.trim() === '') {
            wx.showToast({
              title: '请输入原因',
              icon: 'none'
            })
            return
          }
          this.cancelEvt(this.curId, -1, this.cancelStatusText)
        }
        this.showResonModal = false
        this.reason = ''
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
      },
      payOrder() {
        this.util.orderPay.call(this, this.order.id, function () {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/goods/order/main'
            })
          }, 1500)
        }, function (res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        })
      },
      pickerCancel (t, id) {
        let index = t.mp.detail.value
        this.curId = id
        this.cancelStatusText = 'cancel'
        if (Number(index) === this.cancel.length - 1) {
          this.showResonModal = true
          return
        }
        this.cancelEvt(id, index, 'cancel')
      },
      cancelEvt(id, index, type) {
        let that = this
        let status = ''
        let tips = ''
        let reason = this.reason ? this.reason : this.cancel[index]
        if (type === 'cancel') {
          status = 1
          tips = '取消成功'
        } else if (type === 'refund') {
          status = 2
          tips = '申请退款成功'
        }
        this.util.cancelOrder.call(this, {
          id,
          status: status,
          refundDesc: reason
        }, function(res) {
          wx.showToast({
            title: tips,
            icon: 'success'
          })
          setTimeout(() => {
            that.list = []
            that.page = 1
            that.empty = false
            that.get_list()
          }, 1500)
        })
      },
      pickerRefund (t, id) {
        let index = t.mp.detail.value
        this.curId = id
        this.cancelStatusText = 'refund'
        if (Number(index) === this.cancel.length - 1) {
          this.showResonModal = true
          return
        }
        this.cancelEvt(id, index, 'refund')
      },
      finish() {
        let that = this
        wx.showModal({
          title: '提示',
          content: '确认已收到货了吗?',
          success(res) {
            if (res.confirm) {
              that.util.cancelOrder.call(that, {
                id: that.order.id,
                status: 3
              }, function(res) {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success'
                })
                setTimeout(() => {
                  that.list = []
                  that.page = 1
                  that.empty = false
                  that.get_list()
                }, 1500)
              })
            } else {
            }
          },
          fail() {

          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
    padding: 20rpx 12px;
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
  .view-input {
    padding: 0 20px;
    .input {
      padding: 5px 10px;
      border: 1px solid #dadada;
      border-radius: 5px;
    }
  }
  .fui-cell-label {
    font-size: 14px;
    margin: 5px 0;
    span{
      display: inline-block;
      min-width: 40rpx;
    }
  }
</style>
