<template>
  <div class="page navbar order" >
    <scroll-view class="fui-tab-scroll fixed" scroll-x="true">
      <div @click="selected('')" :class="{active: status == ''}" class="item">全部</div>
      <div @click="selected(1)" :class="{active: status == 1}" class="item">待付款</div>
      <div @click="selected(2)" :class="{active: status == 2}" class="item">待发货</div>
      <div @click="selected(3)" :class="{active: status == 3}" class="item">待收货</div>
      <div @click="selected(4)" :class="{active: status == 4}" class="item">待评价</div>
      <div @click="selected(20)" :class="{active: status == 20}" class="item">售后/退款</div>
    </scroll-view>
    <div class="contain" v-if="list.length != 0">
      <block v-for="(item, index) in list" :key = index>
        <div class="fui-list-group noclick">
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
            <div class="fui-list list-padding">
              <!-- status: 2 待发货 3 待收货 4 待评价 才展示赠品按钮-->
              <!-- giftId ： 0 此商品没活动 -->
              <!-- recFlag ： 0 没领取 1已领取 -->
              <div v-if="(item.status === 2 || item.status === 3 || item.status === 4) && item.giftId != 0 && item.recFlag === 0">
                <span class="gift-btn" @click.stop="getGiftList(item)">选择赠品</span>
              </div>
              <div class="fui-list-inner text-right totle">
                <text>共</text>
                <text class="text-danger">{{item.detailList.length}}</text>
                <text>个商品 实付</text>
                <template v-if="item.detailList[0]">
                  <!-- 普通商品 -->
                  <text class="text-danger" v-if="item.detailList[0].deductionIntegral === 0">
                    <text>￥</text>
                    <text>{{item.orderPrice}}</text>
                  </text>
                  <!-- 积分抵扣商品 -->
                  <text class="text-danger" v-if="item.detailList[0].deductionIntegral > 0">
                    <text>￥</text>
                    <text>{{item.orderPrice}}+{{item.detailList[0].deductionIntegral}}积分</text>
                  </text>
                </template>
              </div>
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
                <div class="btn btn-default btn-default-o" v-if="item.status == 2 && item.status <= 4 && item.detailList[0].deductionIntegral === 0">
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
        </div>
      </block>
    </div>
    <v-empty :list="list" ></v-empty>
    <!--<div class="center" v-if="list.length == 0 && empty">
      <div class="empty">
        &lt;!&ndash; <image class="light" src="/static/images/icon/lights-128.png"></image> &ndash;&gt;
        <div class="text-cancel">暂时没有任何订单</div>
        &lt;!&ndash; <navigator open-type="switchTab" url="/pages/travelIndex/main" class="btn btn-default-o">
          到处逛逛
        </navigator> &ndash;&gt;
      </div>
    </div>-->
    <navigator hover-class="none" open-type="switchTab" url="/pages/me/main" class="fui-dot">
      <image src="/static/images/icon-white/people.png"></image>
    </navigator>
    <modal title="填写原因" :visible="showResonModal" @event="showReasonEvt" :actions="actions5">
      <div class="view-input"><input class="input" type="text" @change="reasonInput" /></div>
    </modal>
    <div class="dialog-mask" v-if="showTraGift"  @click.stop="closeGiftShow"></div>
    <div class="tra-gift-box" v-if="showTraGift">
      <div class="tra-gift-item" v-for="(item, index) in giftList" :key = index>
        <img :src="item.productImg || userlogo" alt="">
        <div class="right">
          <p class="tra-title">{{item.productName}}</p>
          <p class="tra-price">
            <span>￥{{item.productPrice}}</span>
            <span>￥0</span>
          </p>
          <span class="buy-btn" @click="goTravelsGiftDetail(item)">立即预订</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import modal from '@/components/modal'
  import vEmpty from '@/components/common/empty'
  export default {
    data () {
      return {
        status: '',
        list: [],
        page: 1,
        show: false,
        code: false,
        empty: false,
        curStatus: '',
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
        cancel: ['我不想买了', '信息填写错误，重新拍', '同城见面交易', '其他原因'],
        reasonArr: ['不想要了', '卖家缺货', '拍错了/订单信息错误', '其它'],
        cancelindex: 0,
        refundindex: 0,
        showResonModal: false,
        reason: '',
        actions5: [
          {
            name: '取消'
          },
          {
            name: '删除',
            color: '#ed3f14',
            loading: false
          }
        ],
        giftList: [],
        showTraGift: false,
        userlogo: require('../../../../static/images/common/userlogo.png')
      }
    },
    components: {
      modal,
      'v-empty': vEmpty
    },
    onLoad(options) {
      this.options = options
      this.status = options.status || ''
    },
    onUnload() {
      Object.assign(this, this.$options.data())
    },
    onShow() {
      this.page = 1
      this.list = []
      this.showTraGift = false
      this.get_list()
    },
    onReachBottom: function () {
      this.loaded || this.list.length === this.total || this.get_list()
    },
    methods: {
      getGiftList (item) {
        let goodsGiftTravelsInfo = {
          orderId: item.payOrderNo
        }
        // 买商品送旅游下单需要用到的字段
        wx.setStorageSync('goodsGiftTravelsInfo', goodsGiftTravelsInfo)
        this.showTraGift = true
        this.$http.post(this.API.queryGiftActivityById, {
          data: {
            id: item.giftId
          }
        }).then(res => {
          if (res.code === 0) {
            this.giftList = res.result.productList
            let urlPrefix = res.result.urlPrefix
            this.giftList.forEach((item) => {
              if (item.productImg) {
                item.productImg = `${urlPrefix}${item.productImg}`
              }
              console.log(item.productImg)
            })
          }
        })
      },
      goTravelsGiftDetail(item) {
        let url = ''
        if (item.type === 1) {
          url = `/pages/travel/travelDetail/main?parentId=${item.productId}&giftType=true`
        } else if (item.type === 2) {
          url = `/pages/travel/independTra/main?parentId=${item.productId}&giftType=true`
        } else if (item.type === 3) {
          url = `/pages/cruise/cruiseDetail/main?productId=${item.productId}&giftType=true`
        }
        wx.navigateTo({
          url: url
        })
      },
      closeGiftShow() {
        this.showTraGift = false
      },
      reasonInput(e) {
        this.reason = e.mp.detail.value
      },
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
        this.$http.post(this.API.getShopOrderList, {
          data: {
            currentPage: this.page,
            pageSize: 10,
            status: this.status
          }
        }).then(res => {
          if (res.code === 0) {
            this.loading = false
            this.total = res.total
            this.empty = true
            this.show = true
            if (res.result.data.length > 0) {
              this.page++
              this.list = this.list.concat(res.result.data)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      selected (t) {
        this.list = []
        this.page = 1
        this.status = t
        this.empty = false
        this.get_list()
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
      finish(id) {
        let that = this
        wx.showModal({
          title: '提示',
          content: '确认已收到货了吗?',
          success(res) {
            if (res.confirm) {
              that.util.cancelOrder.call(that, {
                id,
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
    padding: 200rpx 150rpx;
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
    font-size: 28rpx
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

  .gift-btn{
    font-size: 26rpx;
    width: 130rpx;
    display: inline-block;
    text-align: center;
    background: #fbb03b;
    color: #fff;
    border-radius: 7rpx;
  }

  .dialog-mask{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    animation: mymove .3s forwards;
  }
  .tra-gift-box{
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -222rpx;
    margin-left: -345rpx;
    z-index: 99999;
    width: 690rpx;
    height: 445rpx;
    background: #fff;
    border-radius: 10rpx;
    padding: 0 30rpx 30rpx 30rpx;
    box-sizing: border-box;
    overflow: auto;
    .tra-gift-item{
      padding-top: 30rpx;
      img{
        width: 130rpx;
        height: 98rpx;
        border-radius: 10rpx;
        display: inline-block;
        margin-top: -50rpx;
      }
      .right{
        width: 75%;
        position: relative;
        display: inline-block;
        margin-left: 15rpx;
        .tra-title{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: 28rpx;
          color: #333333;
        }
        .tra-price{
          margin-top: 15rpx;
          font-size: 30rpx;
          span:nth-child(1){
            color: #f42c2b;
            text-decoration: line-through;
          }
          span:nth-child(2){
            color: #999999;
            margin-left: 20rpx;
          }
        }
        .buy-btn{
          position: absolute;
          right: 0;
          bottom: 0;
          background: #fbb03b;
          color: #fff;
          width: 150rpx;
          height: 44rpx;
          line-height: 44rpx;
          font-size: 24rpx;
          text-align: center;
          border-radius: 20rpx;
        }
      }
    }
  }
</style>
