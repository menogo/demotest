<template>
    <div class="order-wrapper">
      <navigator hover-class="none" url="/pages/goods/selectAddress/main" class="address-wrapper flex address-bg" v-if="receiveData.id">
        <div class="content">
          <div class="box-item no-border flex">
            <div class="label">{{receiveData.receiver}}</div>
            <div class="content ml40">
              <span>{{receiveData.mobile}}</span>
            </div>
          </div>
          <div class="address-text">
            <div class="text lh-text c-6">收货地址：{{receiveData.area}}&nbsp;&nbsp;&nbsp;{{receiveData.address}}</div>
          </div>
        </div>
        <i class="icon-arrow-right"></i>
      </navigator>
      <navigator hover-class="none" url="/pages/goods/editAddress/main?type=member" class="address-wrapper address-bg add-address" v-else>
        <div class="content"><icon type="cancel" class="add-icon" size="20"></icon>添加收货地址</div>
        <i class="icon-arrow-right"></i>
      </navigator>
      <!-- <div class="box-item block-box">
        <textarea class="remark-box" cols="30" rows="10" placeholder="留言" v-model="remark"></textarea>
      </div> -->
      <div class="order-item-wrap" v-for="(item, index) in orderList" :key = index>
        <navigator :url="'/pages/goods/shop/main?id='+item.merchantId" class="shop-title-wrap">
          <div class="left"><i class="shop-icon"></i>{{item.merchantName}}</div>
          <div class="icon-arrow-right"></div>
        </navigator>
        <div v-for="(val, key) in item.items" :key = key>
          <div class="order-item" >
            <div class="img-wrap">
              <img class="img" :src="val.sku.imgUrl" alt="" width="80" height="80" />
            </div>
            <div class="order-content">
              <div class="title">{{val.sku.productName}}</div>
              <div class="sub-title">{{val.sku.specName}}</div>
              <div class="text-wrap">
                <span class="primary-text" v-if="val.sku.vipDiscount > 0 && val.freightPrice != -1">￥{{val.itemPrice}}<span class="oriPrice">￥{{val.sku.price}}</span></span>
                <span class="primary-text" v-else>￥{{val.sku.price}}</span>
                <span class="c-6">x{{val.num}}</span>
              </div>
            </div>
          </div>
          <div class="box-item flex" v-if="val.sku.freightTemplateId">
            <div class="label">配送方式</div>
            <picker @change="pickerChange($event, val, item)" :value="val.selTransportType" :range="val.selTransportTypeJson" >
              <div class="content">
                <span>{{selTransportTypeJson[val.selTransportType]}}
                  <span>{{val.freightPrice > 0 ? '￥'+val.freightPrice : (val.freightPrice === -1 ? '不支持配送区域':'免运费')}}</span>
                  <i class="icon icon-arrow-right"></i>
                </span>
              </div>
            </picker>
          </div>
          <div class="box-item flex" v-if="!val.sku.freightTemplateId">
            <div class="label">运费</div>
            <div :class="{'primary-text': val.freightPrice > 0}">{{val.freightPrice > 0 ? '￥'+val.freightPrice : (val.freightPrice === -1 ? '不支持配送区域':'免运费')}}</div>
          </div>
          <div class="remark-box" v-if="val && val.isRemark">
            <div class="label">订单备注</div>
            <input type="text" placeholder="选填" v-model="val.remark">
          </div>
        </div>
       <!-- <div class="box-item flex">
          <div class="label">是否开票</div>
          <div class="content">
            <i-switch :value="switch1" @change="onSwitchChange($event, 'switch1')"></i-switch>
          </div>
        </div> -->
        <!-- <div class="box-item flex block-box">
          <div class="label">使用积分<span class="primary-text fz-12">(账户可用积分10000)</span></div>
          <div class="content">
            <i-switch :value="switch2" @change="onSwitchChange($event, 'switch2')"></i-switch>
          </div>
        </div> -->
        <div class="box-item size-small flex no-border">
          <div class="label"></div>
          <div>总运费：<span :class="{'primary-text': item.subFreightPrice > 0}">{{item.subFreightPriceText}}</span></div>
        </div>
        <div class="box-item size-small flex no-border">
          <div class="label"></div>
          <div>
            小计<span class="primary-text">￥{{item.subtotal + item.subFreightPrice}}</span>
            <span class="primary-text" v-if="item.subIntegral > 0">+{{item.subIntegral}}积分</span>
          </div>
        </div>
      </div>
      <div class="box-item flex mt20" @click="toogleShowTicket"  v-if="couponList.length > 0">
        <div class="label">优惠券</div>
        <div class="right" ><span class="col">-￥{{chooseCouponMoney}}</span><i class="icon icon-arrow-right"></i></div>
      </div>
      <!-- <div class="box-item flex start" >
        <div class="label">积分抵扣</div>
        <span class="jf-center">共1000分可用，本单可抵 ¥99.50</span>
        <i class="select-icon" :class="{'active': inteActive}"></i>
      </div> -->
      <div class="box-footer">
        <div class="text">
          <div><span>共</span><span class="primary-text">{{confirmData.totalNum}}</span>件商品</div>
          <div>
            <span>应付金额：</span>
            <span class="primary-text">￥{{confirmData.totalPrice}}</span>
            <span class="primary-text" v-if="confirmData.totalIntegral > 0">+{{confirmData.totalIntegral}}积分</span>
          </div>
        </div>
        <div class="button" :class="{'disabled': noSupport}" @click="pay">付款</div>
      </div>
      <!-- 优惠券弹框 -->
      <div class="mask2 show" v-if="showTicket"  @click="toogleShowTicket"></div>
      <div class="ticket-box"  v-if="showTicket">
        <p class="title">可用优惠券</p>
        <p class="sec-title">已选中推荐优惠，使用优惠券{{chooseCouponNum}}张，共抵扣¥{{chooseCouponMoney}}</p>
        <div class="ticket-scroll">
          <div class="ticket-item" v-for="(item, index) in couponList" :key = index :class="{'gray': item.choose === 0}" @click="chooseCoupon(index)">
            <div class="top">
              <div class="left">
                <p><span class="symbol">￥</span>{{item.amount}}</p>
                <p>满{{item.useAmount}}可用</p>
              </div>
              <div class="center">
                <p><span class="ticket-type">{{item.couponType === 5 ? '平台优惠券' : '店铺优惠券'}}</span> <span class="store-name">{{item.couponName}}</span> </p>
                <p>{{item.startTime}}~{{item.endTime}}</p>
              </div>
              <div class="right">
                <i class="select-icon" :class="{'active': item.isActive}"></i>
              </div>
            </div>
            <p class="nor-tips" v-if="item.choose === 0">此券不可与已勾选券叠加使用</p>
          </div>
        </div>

      </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      options: '',
      traActive: false, // 是否有送旅游的活动
      switch1: false,
      switch2: false,
      receiveData: {},
      orderList: [],
      confirmData: {},
      goodsId: '',
      subtotal: '', // 支付价格
      orderType: '',
      orderId: '',
      giftId: '',
      selTransportTypeJson: { 1: 'EMS', 2: '快递', 3: '平邮' },
      noSupport: false,
      couponList: [], // 优惠券列表
      showTicket: false,
      chooseCouponNum: 0, // 已选优惠券数量
      chooseCouponMoney: 0 // 已选优惠券金额
    }
  },
  onLoad(options) {
    this.options = options
    console.log(this.options)
    this.orderType = options.type
    this.goodsId = options.goodsId
    this.traActive = options.traActive
    this.itemJson = options.itemJson
    this.initItemJson()
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  onShow() {
    this.noSupport = false
    this.getReceiveList()
  },
  components: {
  },
  methods: {
    getFreight(parentItem, item) {
      this.$http.post(this.API.getFreight, {
        data: {
          transportType: item.selTransportType,
          stockId: item.sku.stockId,
          num: item.num,
          receiverId: this.receiveData.id,
          merchantId: parentItem.merchantId
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          /* item.freightPrice = res.result.freightPrice
          parentItem.subtotal = res.result.subtotal
          this.confirmData.totalPrice = res.result.totalPrice */
          this.getConfirmOrder(this.itemJson)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    toogleShowTicket() {
      this.showTicket = !this.showTicket
    },
    goUseCoupon (item) { // 使用优惠券
      this.showTicket = false
    },
    getConfirmOrder(itemJson) {
      if (!this.receiveData) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }
      this.$http.post(this.API.getConfirmOrder, {
        data: {
          itemJson: JSON.stringify(itemJson),
          receiverId: this.receiveData.id
        }
      }).then(res => {
        if (res.code === 0) {
          this.orderList = res.result.merchants
          this.subtotal = this.orderList[0].subtotal
          this.getGiftTravel(this.goodsId)
          this.orderList.forEach(item => {
            this.$set(item, 'freightPrice', item.freightPrice)
            let freightPrice = []
            item.items.forEach(item => {
              freightPrice.push(item.freightPrice)
              if (item.sku.transportTypes) {
                let types = item.sku.transportTypes.split(',')
                this.$set(item, 'selTransportTypeJson', [])
                types.forEach(val => {
                  item.selTransportTypeJson.push(this.selTransportTypeJson[val])
                })
                this.$set(item, 'selTransportType', (item.sku.transportType) || 0)
              }
            })
            this.$set(item, 'subFreightPriceText', '')
            if (item.subFreightPrice > 0) {
              item.subFreightPriceText = `￥${item.subFreightPrice}`
            } else if (item.subFreightPrice === 0) {
              item.subFreightPriceText = '免运费'
            }
            if (freightPrice.indexOf(-1) !== -1) {
              item.subFreightPriceText = '不支持配送区域'
              this.noSupport = true
            }
          })
          this.orderList.forEach((item) => { // 每个店铺都增加一个订单留言
            item.items.forEach((ite, ind) => {
              let lastIndex = item.items.length - 1
              if (ind === lastIndex) {
                this.$set(ite, 'isRemark', true)
                this.$set(ite, 'remark', '')
              } else {
                this.$set(ite, 'isRemark', false)
              }
            })
          })
          this.confirmData = res.result

          // 可用优惠券列表
          this.couponList = res.result.couponList
          this.couponList.forEach((item) => {
            item.startTime = dayjs(item.startTime).format('YYYY.MM.DD')
            item.endTime = dayjs(item.endTime).format('YYYY.MM.DD')
            if (item.choose === 1) { // 0:未选中 1：选中
              this.$set(item, 'isActive', true) // 能选择的默认选择
            }
          })
          this.chooseCouponData()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    chooseCoupon (index) {
      if (this.couponList[index].choose === 0) { // 置灰的不能选择
        return
      }
      this.couponList[index].isActive = !this.couponList[index].isActive
      if (this.couponList[index].superpose === 1) { // 不可叠加
        this.couponList.forEach((ite, ind) => { // 其他所有置灰不可点击
          if (index !== ind) {
            ite.isActive = false
            ite.choose = 0
          }
        })
      } else { // 可叠加
        this.couponList.forEach((ite, ind) => { // 不可叠加的要置灰、其他都能点
          if (ite.superpose === 1) {
            ite.choose = 0
          } else {
            ite.choose = 1
          }
        })
      }
      let hasActive = false // 如果没有勾选的则全部点亮
      this.couponList.forEach((item) => {
        if (item.isActive === true) {
          hasActive = true
        }
      })
      if (hasActive === false) {
        this.couponList.forEach(item => {
          item.choose = 1
        })
      }
      this.chooseCouponData()
    },
    chooseCouponData () {
      this.chooseCouponNum = 0
      this.chooseCouponMoney = 0
      this.couponList.forEach(item => {
        if (item.isActive === true) {
          this.chooseCouponNum = this.chooseCouponNum + 1
          this.chooseCouponMoney = this.chooseCouponMoney + item.amount
        }
      })
    },
    pickerChange(e, item, pItem) {
      item.selTransportType = parseInt(e.mp.detail.value)
      this.initItemJson()
      this.getConfirmOrder(this.itemJson)
      // this.getFreight(pItem, item)
    },
    onSwitchChange(e, rigion) {
      this[rigion] = e.mp.detail.value
    },
    getReceiveList(e) {
      this.$http.post(this.API.getReceiveList, {
        data: {
          pageNo: 1,
          pageSize: 10
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let address = wx.getStorageSync('orderAddress')
          if (address) {
            this.receiveData = address
            wx.removeStorageSync('orderAddress')
          } else {
            this.receiveData = res.result.data[0]
          }
          this.getConfirmOrder(this.itemJson)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    pay() {
      if (this.noSupport) {
        return
      }
      if (!this.receiveData.id) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }
      // 创建订单
      let params = {}
      this.initItemJson()

      let couponIds = []
      this.couponList.forEach((item) => { // 选择的优惠券id
        if (item.isActive === true) {
          couponIds.push(item.couponAmountId)
        }
      })
      couponIds = couponIds.toString()

      let payType = 1
      if (this.orderList[0].items[0].sku.integralDeductType === 2) { // 全额积分抵扣
        payType = 5
      }
      params = JSON.stringify({
        receiverId: this.receiveData.id,
        // invoiceId: 暂时未做发票
        type: this.orderType,
        payType: payType,
        buyerList: this.itemJson,
        giftId: this.giftId,
        couponIds: couponIds // 选择的优惠券id
      })
      this.$http.post(this.API.makeShopOrder, {
        data: {
          makeOrderJson: params
        }
      }).then(res => {
        if (res.code === 0) {
          // 下单成功
          let self = this
          this.orderId = res.result
          if (this.orderList[0].items[0].sku.integralDeductType === 2) { // 全额积分抵扣不用掉起支付，直接跳转订单列表页
            wx.navigateTo({
              url: '/pages/goods/order/main'
            })
            return
          }
          this.util.orderPay.call(this, this.orderId, function () {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            setTimeout(() => {
              let goodsGiftTravelsInfo = {
                orderId: self.orderId
              }
              // 买商品送旅游下单需要用到的字段
              wx.setStorageSync('goodsGiftTravelsInfo', goodsGiftTravelsInfo)
              if (self.traActive === 'true') { // 有旅游活动跳支付成功页，没有跳订单页
                wx.navigateTo({
                  url: `/pages/goods/goodsPay/main?goodsId=${self.goodsId}&subtotal=${self.subtotal + self.orderList[0].subFreightPrice}`
                })
              } else {
                wx.navigateTo({
                  url: '/pages/goods/order/main'
                })
              }
            }, 1500)
          }, function (res) {
            wx.showToast({
              title: '已取消支付',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: `/pages/goods/order/main?goodsId=${self.goodsId}&subtotal=${self.subtotal + self.orderList[0].subFreightPrice}`
              })
            }, 1000)
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    initItemJson() {
      if (typeof this.itemJson === 'string') {
        this.itemJson = JSON.parse(this.itemJson)
      }
      this.itemJson.forEach(item => {
        item.transportType = this.getTransportType(item)
        item.remark = this.getRemark(item) // 订单留言
      })
    },
    getTransportType(sitem) {
      // 默认快递
      let type
      this.orderList.forEach(pitem => {
        pitem.items.forEach(item => {
          let typeKey = item.sku.transportTypes.split(',')[0]
          //  1: 'EMS', 2: '快递', 3: '平邮'
          if (sitem.stockId === item.sku.stockId && pitem.merchantId === sitem.merchantId) {
            if (item.selTransportTypeJson && item.selTransportTypeJson[item.selTransportType] === 'EMS') {
              typeKey = 1
            } else if (item.selTransportTypeJson && item.selTransportTypeJson[item.selTransportType] === '快递') {
              typeKey = 2
            } else if (item.selTransportTypeJson && item.selTransportTypeJson[item.selTransportType] === '平邮') {
              typeKey = 3
            }
            type = typeKey
            return false
          }
        })
      })
      return parseInt(type)
    },
    getRemark(sitem) {
      let remark = ''
      this.orderList.forEach(pitem => {
        pitem.items.forEach(item => {
          let remarkKey = ''
          if (pitem.merchantId === sitem.merchantId) {
            remarkKey = item.remark
            remark = remarkKey
            return false
          }
        })
      })
      return remark
    },
    getGiftTravel(id) { // 得到买商品赠送旅游产品符合区间的id
      if (this.options.noActive === '1') { // 购物车进入下单页不用查
        return
      }
      this.$http.post(this.API.queryGiftActivityList, {
        data: {
          shopId: id
        }
      }).then(res => {
        if (res.code === 0) {
          let allTravalesGift = res.result
          // 只展示小于支付价格的第一个旅游活动区间
          // step1 找出所有低于支付价格的旅游活动区间
          let selectGiftTraLis = []
          allTravalesGift.filter((item) => {
            if (this.subtotal >= item.price) {
              selectGiftTraLis.push(item)
            }
          })
          // step2 将区间价格大到小排序
          let selectTrasPrice = []
          selectGiftTraLis.forEach((item) => {
            selectTrasPrice.push(item.price)
          })
          selectTrasPrice = selectTrasPrice.sort().reverse()
          // step3 取区间中第一个价格的活动
          let showpriceId = selectTrasPrice[0]
          selectGiftTraLis.forEach((item) => {
            if (showpriceId === item.price) {
              this.giftId = item.id
            }
          })
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
  .order-wrapper {
    padding-bottom: 100px;
    background-color: #f4f4f4;
  }
  .box-item {
    padding: 10px 20px;
    background-color: #fff;
    line-height: 1;
    font-size: 14px;
    position: relative;
    &.no-border {
      border-bottom: none;
    }
    &.flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &.flex.start {
      justify-content: flex-start;
    }
    &.block-box {
      margin-bottom: 10px;
    }
    &.size-small {
      font-size: 12px;
    }
    .jf-center{
      margin-left: 40rpx;
    }
    .total-goods{
      color: #999999;
      font-size: 26rpx;
      margin-right: 20rpx;
    }
    .right{
      color: #333333;
      font-size: 26rpx;
      .col{
        color: #fb3305;
      }
    }
  }
  .select-icon, .select-icon.active{
      display: inline-block;
      background: url('../../../../static/images/select.png');
      background-size: 200rpx 80rpx;
      vertical-align: middle;
      width: 28rpx;
      height: 28rpx;
      background-position: -79rpx -15rpx;
      position: absolute;
      right: 45rpx;
      transform: scale(1.2);
    }
    .select-icon.active{
      background-position: -79rpx -41rpx;
    }
  .mt20{
    margin-top: 20rpx;
  }
  .remark-box {
    background: #fff;
    padding: 30rpx 40rpx;
    font-size: 28rpx;
    border-bottom: 1px solid #eee;
    .label{
      font-size: 28rpx;
      display: inline-block;
    }
    input{
      display: inline-block;
      width: 70%;
      vertical-align: middle;
      margin-left: 25rpx;
      margin-top: -2rpx;
    }
  }
  .box-footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    justify-content: space-between;
    line-height: 60px;
    background-color: #fff;
    padding-left: 20px;
    border-top: 1px solid #eee;
    .text {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 10px;
      flex: 1;
      line-height: 1;
    }
    .button {
      width: 80px;
      background-color: #ff9913;
      color: #fff;
      text-align: center;
      &.disabled {
        background-color: #ddd;
      }
    }
  }
  .fz-12 {
    font-size: 12px;
  }
  .primary-text {
    color: #fb3305;
    .oriPrice{
      font-size: 20rpx;
      text-decoration: line-through;
      margin-left: 20rpx;
      display: inline-block;
      color: #888;
    }
  }
  .link-btn {
    display: inline-block;
    padding: 10px 20px;
  }
  .lh-text {
    line-height: 18px;
  }
  .icon-arrow-right {
    background: url('../../../../static/images/travelSort.png');
    background-size: 200rpx 200rpx;
    width: 25rpx;
    height: 30rpx;
    display:inline-block;
    vertical-align: top;
    margin-left: 10px;
    background-position: -32rpx 0;
  }
  .link-btn {
    padding: 5px 10px;
    color: #fff;
    background-color: #fb3305;
    border-radius: 5px;
    font-size: 12px;
  }
  .address-text {
    padding: 10rpx 20px 20px;
    background-color: #fff;
    font-size: 14px;
  }
  .address-wrapper {
    position: relative;
    background-color: #fff;
    &.flex {
      display: flex;
    }
    .content {
      flex: 1;
    }
    .ml40{
      margin-left: 40rpx;
    }
    .icon-arrow-right {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -5px;
    }
    .add-icon {
      vertical-align: top;
      line-height: 1;
      margin-top: 40px;
      margin-right: 10px;
      transform: rotateZ(90deg);
    }
    &.add-address {
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
  }
  .c-6 {
    color: #666;
  }
  .order-item-wrap {
    margin: 10px 0;
    .order-item {
      display: flex;
      padding: 10px 20px;
      background-color: #fff;
      // border-bottom: 1px solid #eee;
      .img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
      }
      .order-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        padding: 10px 0;
        flex: 1;
        .text-wrap {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
      }
    }
  }
  .shop-title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40px;
    height: 40px;
    padding: 0 20px;
    background: #fff;
    border-bottom: 1px solid #eee;
    .left{width: 100%;}
  }
  .shop-icon {
    background: url('../../../../static/images/goodsDetail.png');
    background-position: -2rpx -67rpx;
    width: 39rpx;
    height: 20px;
    line-height: 0;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    margin-top: 10px;
    background-size: 500rpx 120rpx;
  }
  .icon-arrow-right::before {
    display: none;
  }
  .mask2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: all .3s linear;
   background-color: rgba(0, 0, 0, .6);
  &.show {
    opacity: 1;
  }
}
.ticket-box{
  width: 100%;
  height: 940rpx;
  background: #fff;
  position: fixed;
  bottom: 0;
  border-radius: 15rpx 15rpx 0 0 ;
  animation: mymove .3s forwards;
  z-index: 999;
  .title{
    font-size: 36rpx;
    text-align: center;
    margin: 40rpx 0;
  }
  .sec-title{
    font-size: 24rpx;
    margin-left: 30rpx;
  }
  .ticket-scroll{
    overflow: auto;
    height: 740rpx;
    overflow-y: auto;
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #f4f4f4;
  }
  .ticket-item{
    width: 690rpx;
    background-color: #ffffff;
    margin: 20rpx auto;
    .top{
      position: relative;
      height: 180rpx;
    }
    .left{
      width: 210rpx;
      text-align: center;
      color: #fff;
      background-color: #fbb03b;
      height: 180rpx;
      float: left;
      p:nth-child(1){
        font-size: 40rpx;
        margin-top: 30rpx;
        .symbol{
          font-size: 30rpx;
        }
      }
      p:nth-child(2){
        margin-top: 13rpx;
        font-size: 24rpx;
      }
    }
    .center{
      width: 45%;
      display: inline-block;
      padding-left: 30rpx;
      p:nth-child(1){
        color: #999999;
        font-size: 24rpx;
        margin-top: 20rpx;
        .ticket-type{
          display: inline-block;
          width: 120rpx;
          height: 36rpx;
          line-height: 36rpx;
          font-size: 20rpx;
          background: #fbb03b;
          color:#fff;
          margin-right: 10rpx;
          text-align: center;
          border-radius: 20rpx;
        }
        .store-name{
          font-size: 26rpx;
        }
      }
      p:nth-child(2){
        font-size: 20rpx;
	      color: #999;
        margin-top: 40rpx;
      }
    }
    .right{
      width: 20%;
      text-align: center;
      float: right;
      height: 100%;
      padding: 75rpx 0;
      box-sizing: border-box;
      position: relative;
    }
    .right:before{
      content: '';
      display: block;
      width: 18rpx;
      height: 100%;
      background-size: 18rpx 18rpx; /* 一个repeat的大小 */
      background-repeat: repeat-y;
      background-image: radial-gradient(#fff 7rpx, transparent 7rpx);
      position: absolute;
      top: 0;
    }
    .right:before {
      left: -10rpx; /* 半圆，只显示一个repeat的一半 */
      top: -1rpx;
    }
  }
  .ticket-item.gray{
    .left{
      background-color: #bfbfbf;
    }
    .center{
      p:nth-child(1){
        .ticket-type{
          background: #bfbfbf;
        }
        .store-name{
          color: #bfbfbf;
        }
      }
    }
    .nor-tips{
      background:#fff;
      padding:10rpx 20rpx;
      font-size:24rpx;
      border-top: 1rpx solid #f4f4f4;
    }
  }
}
</style>
