<template>
  <div>
    <div class="page" :class="{'body-fixed' : showMask2 || showMask || reserveShow}">
      <div class="title-box">
        <p class="title">{{orderNeedData.prdName}}</p>
        <p>{{currentDayStock.teamDateFmt}} {{currentDayStock.departure}}出发</p>
        <p>
          <span v-for="(item, index) in currentDayStock.stockPriceList" :key = index>
            <span>{{item.num}}</span><span>{{item.typeName}}</span>&emsp;
          </span>
        </p>
      </div>
      <div class="tips" v-if="orderNeedData.confirmType === 2">
        <span>【此产品需二次确认】</span>由于库存紧缺，提交订单后需商家确认库存后才能付款。商家确认后将短信通知您，您可在旅游订单待付款中进行付款
      </div>
      <ul class="select" v-if="currentDayStock.onlineAgio === 1">
        <li class="title">单房差</li>
        <li class="select-main">
          <span class="title">￥{{currentDayStock.agio}}/人</span>
          <div class="select-box">
            <i class="icon reduce-icon" @click="numReduce"></i>
            <span>{{agioNum}}</span>
            <i class="icon add-icon"  @click="numAdd"></i>
          </div>
        </li>
      </ul>
      <ul class="people-msg">
        <li class="title">
          <span>出行人信息</span>
          <span class="right"  @click="goReserveTips" v-if="isReject">预订限制</span>
        </li>
        <li class="cutomer-list">
          <button class="choose-people" @click="getCustomerListMask">选择出行人</button>
          <div class="cus-lis" v-for="(item, index) in currrntCustomerList" :key = index>
            <span class="name">{{item.visitorName}}</span>
            <span class="num">{{item.idCard}}</span>
            <span class="dele" @click="delCustomer(item)">删除</span>
          </div>
          <p class="prompt">*为了保证您顺利出行，请务必保证所有填写项与出游所持证件一致</p>
        </li>
      </ul>
      <ul class="contacts">
        <li class="title">联系人信息</li>
        <li>
          <span class="lab">联系人&emsp;</span>
          <input type="text" class="input-txt" placeholder="请填写联系人" v-model="contactName">
        </li>
        <li>
          <span class="lab">手机号码</span>
          <input type="text" class="input-txt" placeholder="接收确认信息" v-model="contactMobile">
        </li>
        <li>
          <span class="lab">电子邮箱</span>
          <input type="text" class="input-txt" placeholder="用于接收确认信息" v-model="contactEmail">
        </li>
      </ul>
      <div class="box-item flex" @click="toogleShowTicket" v-if="couponList && couponList.length > 0">
        <div class="label">优惠券</div>
        <div class="right" ><span class="col">-￥{{chooseCouponMoney}}</span><i class="right-icon"></i></div>
      </div>
      <div class="register" @click="toggleReg">
        <i class="icon select-icon" :class="{'active': isActiveReg}"></i>
        <span>已阅读并同意<span class="col" @click.stop="goClause">《预订须知和违约条款》</span>等重要内容</span>
      </div>
      <ul class="detail-mask" v-if="showDetailMask">
        <li class="title">费用明细</li>
        <li  v-for="(item, index) in currentDayStock.stockPriceList" :key=index>
          <span>{{item.typeName}}</span>
          <span class="right">￥{{item.guestPrice}} X {{item.num}}</span>
        </li>
        <li  v-for="(item, index) in currentDayStock.serviceList" :key=index v-if="item.num > 0">
          <span>{{item.name}}</span>
          <span class="right">￥{{item.amount}} X {{item.num}}</span>
        </li>
        <li v-if="agioNum > 0">
          <span>单房差</span>
          <span class="right">￥{{currentDayStock.agio}} X {{agioNum}}</span>
        </li>
        <li v-if="chooseCouponMoney > 0">
          <span>优惠</span>
          <span class="right">-￥{{chooseCouponMoney}}</span>
        </li>
      </ul>
      <div class="cus-box" v-if="showCustomerList">
        <p class="control">
          <span  @click="closeCustomer">取消</span>
          <span class="right" @click="fixCustomer">完成</span>
        </p>
        <p class="addicon" @click="goAddCustomer"><i class="icon add-icon"></i> 新增</p>
        <ul class="support">
          <li v-for="(item, index) in supportList" :key = index>
            <p>{{item.visitorName}}</p>
            <p>{{item.cardTypeStr}} {{item.idCard}}</p>
            <p><span v-if="item.birthday">生日 {{item.birthday}} / </span>性别 {{item.sex}}</p>
            <i class="icon left-icon" :class="{'active' : item.isActive}" @click="customerActive(item)"></i>
            <span class="edit"  @click="editCustomer(item)">编辑</span>
          </li>
        </ul>
        <!-- <p class="cus-tips" v-if="noSupportList.length > 0">暂不支持以下证件类型</p> -->
        <ul class="no-support">
          <li v-for="(item, index) in noSupportList" :key = index @click="goSetPassPort(item.id)">
            <p>{{item.visitorName}}</p>
            <!-- <p>{{item.cardTypeStr}} {{item.idCard}}</p> -->
            <p><span v-if="item.birthday">生日 {{item.birthday}} / </span> 性别 {{item.sex}}</p>
            <p>护照信息不全或有误，点击补充</p>
            <!-- <i class="icon left-icon" :class="{'active' : item.isActive}"></i> -->
          </li>
          <!-- <li>
            <p>张三</p>
            <p>护照 123465789</p>
            <p>生日 20019-08-19/性别 女</p>
            <i class="icon left-icon active"></i>
          </li> -->
        </ul>
      </div>
      <div class="dialog-mask" @click="closeMask"  v-if="showMask"></div>
      <div class="dialog-mask2" @click="closeCustomer"  v-if="showMask2"></div>
      <div class="dialog-mask3" v-if="reserveShow"></div>
      <div class="reserve-box"  v-if="reserveShow && reserveMsg">
        <div class="modu-box">
          <i class="close" @click="closReserve">X</i>
          <p class="title">预定限制</p>
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
                <i class="icon select-icon" :class="{'active': item.isActive}"></i>
              </div>
            </div>
            <p class="nor-tips" v-if="item.choose === 0">此券不可与已勾选券叠加使用</p>
          </div>
        </div>
      </div>

    </div>
    <div class="footer">
      <div>
        <span class="price">总价：￥{{showTotal}}</span>
        <span class="detail" @click="toggleDetailMask"> 明细<i class="icon open-icon"></i></span>
      </div>
      <div class="buy" @click="goPay" v-if = "!giftType">立即支付</div>
      <!-- 赠品旅游不需要支付 -->
      <div class="buy" @click="goPay" v-else>完成</div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      giftType: '',
      goodsOrderPayId: '',
      type: '',
      apiUrl: '',
      orderNeedData: {},
      currentDayStock: '', // 当日选中数据
      currentStock: [], // 出行人列表对象(接口入参)
      total: 0, // 上一个页面总价
      showTotal: 0, // 展示的总价
      // stockId: '', // 当前选中id
      agioNum: 0, // 单房差数量
      contactName: '', // 联系人姓名
      contactMobile: '', // 联系人电话
      contactEmail: '', // 联系人邮箱
      visitors: '',
      isActiveReg: false, // 是否阅读注册信息
      isReject: false, // 是否有预定限制
      reserveMsg: '', // 预定限制
      reserveShow: false, // 预定限制弹框
      currrntCustomerList: [], // 当前选中的出行人
      supportList: [], // 支持的出行人列表
      noSupportList: [], // 不支持的出行人列表
      customerData: '', // 出行人信息
      showCustomerList: false, // 出行人弹框
      showDetailMask: false, // 费用明细弹框
      showMask: false, // 弹框遮罩
      showMask2: false, // 出行人弹框遮罩
      couponList: [], // 优惠券列表
      showTicket: false,
      chooseCouponNum: 0, // 已选优惠券数量
      chooseCouponMoney: 0 // 已选优惠券金额
    }
  },
  onLoad(options) {
    this.total = Number(options.total)
    if (options.type) {
      this.type = options.type
    }
    if (options.giftType) { // 买产品送旅游进入
      this.giftType = options.giftType
      this.goodsOrderPayId = wx.getStorageSync('goodsGiftTravelsInfo').orderId
    }
  },
  onShow () {
    this.reset() // 清除缓存
    this.orderNeedData = wx.getStorageSync('orderNeedData') // 详情页存储的订单页需要的数据
    this.currentDayStock = wx.getStorageSync('currentDayStock') // 当日数据
    if (this.orderNeedData && this.orderNeedData.reserveMsg && this.orderNeedData.reserveMsg.rejectAge) { // 是否有预定限制
      this.reserveMsg = this.orderNeedData.reserveMsg
      this.isReject = true
    } else {
      this.isReject = false
    }
    if (this.currentDayStock.stockPriceList) {
      this.currentDayStock.stockPriceList.forEach((it) => {
        this.currentStock.push({priceTypeId: it.priceTypeId, num: it.num})
      })
    }
    this.getHasCoupon()
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    reset () {
      this.showCustomerList = false
      this.contactName = ''
      this.contactMobile = ''
      this.contactEmail = ''
      this.currrntCustomerList = []
      this.showMask2 = false
      this.agioNum = 0
      this.currentStock = []
    },
    // 减少单房差数量
    numReduce () {
      this.agioNum = this.agioNum - 1
      if (this.agioNum < 0) {
        this.agioNum = 0
        return
      }
      this.showTotal = this.showTotal - this.currentDayStock.agio
      this.total = this.total - this.currentDayStock.agio
    },
    // 增加单房差数量
    numAdd () {
      this.agioNum = this.agioNum + 1
      this.showTotal = this.showTotal + this.currentDayStock.agio
      this.total = this.total + this.currentDayStock.agio
    },
    // 订单支付
    goPay () {
      if (this.giftType && this.visitors.split(',').length > 1) {
        wx.showToast({
          title: '赠送产品只能选择一位出行人',
          icon: 'none'
        })
        return
      }
      if (this.contactName === '') {
        wx.showToast({
          title: '联系人姓名不能为空',
          icon: 'none'
        })
        return
      }
      if (this.contactMobile === '') {
        wx.showToast({
          title: '联系人电话不能为空',
          icon: 'none'
        })
        return
      }
      if (!this.isActiveReg) {
        wx.showToast({
          title: '请选择同意条款再提交',
          icon: 'none'
        })
        return
      }
      if (this.orderNeedData.confirmType === 2) {
        let self = this
        wx.showModal({
          // title: "2222步",
          content: '该订单需供应商二次确认后才能付款，是否继续购买？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#ccc',
          confirmText: '确定',
          confirmColor: '#000',
          success: function (res) {
            if (res.confirm) {
              self.pay()
            } else {
              console.log('取消')
            }
          }
        })
      } else {
        this.pay()
      }
    },
    pay () {
      let couponIds = []
      this.couponList.forEach((item) => { // 选择的优惠券id
        if (item.isActive === true) {
          couponIds.push(item.couponAmountId)
        }
      })
      couponIds = couponIds.toString()

      var data = {
        payType: 1, // 支付类型
        stockId: this.currentDayStock.id, // stockList下的当前选中id
        visitors: this.visitors,
        detailList: this.currentStock,
        agioNum: this.agioNum,
        contactName: this.contactName,
        contactMobile: this.contactMobile,
        contactEmail: this.contactEmail,
        payOrderNo: this.goodsOrderPayId || '',
        couponIds: couponIds // 选择的优惠券id
      }
      let serviceList = wx.getStorageSync('selectserviceList')
      wx.removeStorageSync('selectserviceList')
      if (serviceList && serviceList.length > 0) {
        data.serviceList = serviceList
      }
      if (this.type === 'cruise') {
        this.apiUrl = 'makeCruiseOrder'
      } else {
        this.apiUrl = 'makeOrder'
      }
      this.$http.post(this.API[this.apiUrl], { // 创建旅游订单
        data: {
          makeOrderJson: JSON.stringify(data)
        }
      }).then(res => {
        if (res.code === 0) {
          if (this.orderNeedData.confirmType === 2) { // 需要二次确认订单
            this.goOrderList()
            return
          }
          let orderId = res.result
          if (this.giftType) { // 买产品送旅游的订单不用支付
            wx.redirectTo({
              url: `/pages/travel/traOrderList/main`
            })
            return
          }
          this.$http.post(this.API.wxPay, { // 微信支付下单
            data: {
              orderId: orderId,
              openId: wx.getStorageSync('openId'),
              type: 2
            }
          }).then(res => {
            if (res.code === 0) {
              // 调微信支付
              let obj = res.result
              this.requestPayment(obj)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 申请支付
    requestPayment (obj) {
      wx.requestPayment({
        'timeStamp': obj.timeStamp,
        'nonceStr': obj.nonceStr,
        'package': obj.package,
        'paySign': obj.paySign,
        'signType': obj.signType,
        'success': (res) => {
          this.goOrderList()
        },
        'fail': (res) => {
          this.goOrderList()
        }
      })
    },
    toogleShowTicket() {
      this.showTicket = !this.showTicket
    },
    getHasCoupon () { // 查询可用的优惠券
      let orderType = 1
      if (this.type === 'cruise') {
        orderType = 2
      }
      var data = {
        orderType: orderType, // 1-旅游 2-游轮
        stockId: this.currentDayStock.id, // stockList下的当前选中id
        detailList: this.currentStock
      }
      this.$http.post(this.API.getCouponList, { // 创建旅游订单
        data: {
          makeOrderJson: JSON.stringify(data)
        }
      }).then(res => {
        this.couponList = res.result
        this.couponList.forEach((item) => {
          item.startTime = dayjs(item.startTime).format('YYYY.MM.DD')
          item.endTime = dayjs(item.endTime).format('YYYY.MM.DD')
          if (item.choose === 1) { // 0:未选中 1：选中
            this.$set(item, 'isActive', true) // 能选择的默认选择
          }
        })
        this.chooseCouponData()
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
      this.showTotal = this.total - this.chooseCouponMoney
    },
    goSetPassPort (id) {
      wx.navigateTo({
        url: `/pages/meInfo/addCustomer/main?id=${id}&type=passport`
      })
    },
    goClause () {
      wx.navigateTo({
        url: `/pages/travel/clause/main`
      })
    },
    goOrderList () {
      wx.redirectTo({
        url: `/pages/travel/traOrderList/main`
      })
    },
    goAddCustomer () {
      wx.navigateTo({
        url: `/pages/meInfo/addCustomer/main`
      })
    },
    // 阅读注册信息
    toggleReg () {
      this.isActiveReg = !this.isActiveReg
    },
    toggleDetailMask () {
      this.showDetailMask = !this.showDetailMask
      this.showMask = !this.showMask
    },
    closeMask () {
      this.showDetailMask = false
      this.showMask = false
    },
    closeCustomer () {
      this.showCustomerList = false
      this.showMask2 = false
      this.supportList.forEach((ite) => {
        this.$set(ite, 'isActive', false)
      })
    },
    fixCustomer () {
      this.currrntCustomerList = []
      let arr = []
      this.supportList.forEach((item) => {
        if (item.isActive === true) {
          this.currrntCustomerList.push(item)
          arr.push(item.id)
        }
      })
      arr = arr.join(',')
      this.visitors = arr
      console.log('this.visitors1', this.visitors)
      this.showCustomerList = false
      this.showMask2 = false
    },
    delCustomer (item) { // 删除选中的出行人
      this.currrntCustomerList = []
      item.isActive = false
      this.fixCustomer()
    },
    editCustomer (item) { // 编辑选中的出行人
      wx.navigateTo({
        url: `/pages/meInfo/addCustomer/main?id=${item.id}`
      })
    },
    // 预定限制弹框
    goReserveTips () {
      this.reserveShow = true
    },
    closReserve () {
      this.reserveShow = false
    },
    getCustomerListMask () {
      this.supportList = []
      this.noSupportList = []
      console.log('当前选中出行人')
      this.$http.post(this.API.customerList).then(res => {
        if (res.code === 0) {
          this.showMask2 = true
          this.showCustomerList = true
          if (res.result.data) {
            this.customerData = res.result.data
            this.customerData.forEach((item) => {
              if (item.birthday) {
                item.birthday = item.birthday.substring(0, 10)
              }
              if (item.sex === 1) {
                item.sex = '男'
              } else if (item.sex === 2) {
                item.sex = '女'
              } else {
                item.sex = ''
              }
            })
          }
          // 国内游
          if (this.orderNeedData.parentTypeId === 1) {
            // 国内游默认为身份证其他都可选
            this.customerData.forEach((item) => {
              this.$set(item, 'isActive', false)
              // if (item.cardTypeStr === '身份证') {
              //   // this.$set(item, 'isActive', true)
              // }
              this.supportList.push(item)
              this.currrntCustomerList.forEach((ite) => { // 已选了的默认为勾选
                if (item.id === ite.id) {
                  this.$set(item, 'isActive', true)
                }
              })
            })
          }
          // 国外游
          if (this.orderNeedData.parentTypeId === 2) {
            // 国外游默认护照其他都不可选
            this.customerData.forEach((item) => {
              this.$set(item, 'isActive', false)
              if (item.cardTypeStr === '护照') {
                // this.$set(item, 'isActive', true)
                this.supportList.push(item)
                this.currrntCustomerList.forEach((ite) => {
                  if (item.id === ite.id) {
                    this.$set(item, 'isActive', true)
                  }
                })
              } else {
                this.noSupportList.push(item)
              }
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    customerActive (item) {
      item.isActive = !item.isActive
    }
  }

}
</script>

<style lang="scss" scoped>
  .page{
    min-height: 100vh;
    background: #f4f4f4;
    margin-bottom: 98rpx;
  }
  .body-fixed{
    position:fixed;
    top:0;left:0;right:0;bottom:0;
  }
  .title-box {
    background: #fff;
    font-size: 22rpx;
    color:#353535;
    padding: 30rpx;
    .title {
      font-size: 28rpx;
      color: #000000;
    }
  }
  .tips{
    margin-top: 20rpx;
    background: #fff;
    padding: 25rpx 30rpx;
    font-size: 22rpx;
    color: #888888;
    span{
      color: #ff9913;
    }
  }
  .select, .people-msg , .contacts{
    background: #fff;
    font-size: 30rpx;
    color: #000;
    margin-top: 20rpx;
    li {
      height:88rpx;
      line-height: 88rpx;
      margin:0 30rpx;
      border-bottom: 1rpx solid #dcdcdc;
    }
    li:last-child {
      border-bottom: none;
    }
    .select-main{
      .title{
        color: #f65631;
        font-size: 24rpx;
      }
    }
    .select-box{
      float: right;
      font-size: 32rpx;
      color: #888;
      span{
        margin-left: 20rpx;
        margin-right: 20rpx;
      }
    }
  }
  .people-msg{
    li:last-child{
      height: 140rpx;
      padding-top: 30rpx;
    }
    li.cutomer-list{
      height: auto;
      .cus-lis{
        position: relative;
        border-top: 1rpx solid #dcdcdc;
        font-size: 26rpx;
        color: #333;
        .name{
          margin-right: 30rpx;
          width: 160rpx;
          display: inline-block;
        }
      }
    }
    .right{
      float: right;
      color: #ff9913;
      font-size: 22rpx;
    }
    .choose-people{
      width: 240rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size:26rpx;
      background: #ff9913;
      color: #fff;
      border-radius: 4rpx;
      border: none;
      vertical-align: middle;
      margin-bottom: 30rpx;
    }
    .prompt{
      color: #888888;
      font-size: 22rpx;
      border-top: 1rpx solid #dcdcdc;
    }
  }
  .dele, .edit{
    background: #ff9913;
    width: 65rpx;
    color: #fff;
    height: 45rpx;
    line-height: 45rpx;
    font-size: 26rpx;
    float: right;
    text-align: center;
    border-radius: 5rpx;
    margin-top: 25rpx;
  }
  .edit{
    margin-right: 10rpx;
    position: absolute;
    top: 30rpx;
    right: 10rpx;
  }
  .contacts{
    font-size: 26rpx;
    .lab{
      color: #353535;
    }
    .input-txt{
      display: inline-block;
      vertical-align: middle;
      margin-left: 50rpx;
    }
  }
  .register{
    margin: 0 30rpx;
    font-size: 22rpx;
    color: #353535;
    margin-top: 40rpx;
    padding-bottom: 120rpx;
    .col{
      color: #ff9913;
    }
  }
  .footer{
    display: flex;
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 100%;
    font-size: 26rpx;
    color: #353535;
    height: 98rpx;
    text-align: center;
    z-index: 999999;
    .buy{
      line-height: 98rpx;
      color: #fff;
      font-size: 30rpx;
      flex-grow: 4;
      background: #ff9913;
    }
    .price{
      line-height: 98rpx;
      color: #f65631;
      margin: 0 30rpx;
      font-size: 28rpx;
    }
    .detail{
      margin-right: 30rpx;
    }
  }
  .detail-mask{
    position: fixed;
    width: 100%;
    bottom: 99rpx;
    font-size: 24rpx;
    background: #fff;
    z-index: 999999;
    li{
      height: 81rpx;
      line-height: 81rpx;
      border-bottom: 1rpx solid #dcdcdc;
      padding: 0 30rpx;
      .right{
        float: right;
        color: #f65631;
        margin-right: 30rpx;
      }
    }
    li:last-child{
      border-bottom: none;
    }
    .title{
      font-size: 30rpx;
      text-align: center;
      height: 88rpx;
    }
  }
  .dialog-mask, .dialog-mask2, .dialog-mask3{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
    animation: mymove .3s forwards;
  }
  .dialog-mask2, .dialog-mask3{
    z-index: 9999999;
  }
  .cus-box{
    background: #f4f4f4;
    position: fixed;
    bottom: 98rpx;
    width: 100%;
    z-index: 99999999;
    box-sizing: border-box;
    height: 700rpx;
    overflow: auto;
    animation: mymove .3s forwards;
    .control{
      font-size: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0 30rpx;
      position: fixed;
      background: #f4f4f4;
      width: 100%;
      box-sizing: border-box;
      z-index: 10;
      .right{
        float: right;
      }
    }
    .addicon{
      background: #fff;
      width: 100%;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      color: #ff9913;
      margin-top: 90rpx;
      .add-icon{
        background-position: -115rpx -5rpx;
        width: 20rpx;
        height: 20rpx;
        margin-top: -2rpx;
      }
    }
    .cus-tips{
      text-align: center;
      height: 60rpx;
      line-height: 60rpx;
      color: #666666;
      font-size: 24rpx;
      background: #f4f4f4;
    }
    .support, .no-support{
      font-size: 22rpx;
      margin-top: 20rpx;
      background: #fff;
      li{
        position: relative;
        padding: 15rpx 0;
        border-bottom: 1rpx solid #dcdcdc;
        margin: 0 30rpx;
        padding-left: 150rpx;
      }
      li:last-child{
        border-bottom: none;
      }
      p:nth-child(1){
        font-size: 30rpx;
        color: #000;
      }
      p:nth-child(2){
        color: #333;
      }
      p:nth-child(3){
        color: #999;
      }
      .left-icon{
        position: absolute;
        top: 65rpx;
        left: 30rpx;
        background-position: -151rpx -39rpx;
        width: 39rpx;
        height: 39rpx;
      }
      .left-icon.active{
        background-position: -114rpx -39rpx;
      }
    }
    .no-support{
      margin-top: 20rpx;
      li{
        border-bottom: 1rpx solid #dcdcdc;
        margin: 0 30rpx;
        padding: 15rpx 0;
        border-bottom: 1rpx solid #dcdcdc;
        margin: 0 30rpx;
        li:last-child{
          border-bottom: none;
        }
        p:nth-child(1){
          font-size: 30rpx;
        //  color: #aaa;
        }
        p:nth-child(2){
          // color: #aaa;
        }
        p:nth-child(3){
          // color: #aaa;
        }
        .left-icon{
          right: 40rpx;
        }
      }
      li:last-child{
        border-bottom: none;
      }
    }
  }
  @keyframes mymove
{
  from {opacity: 0 }
  to {opacity:1;}
}
@-webkit-keyframes mymove
{
  from {opacity: 0 }
  to {opacity:1;}
}
  .reserve-box{
    width: 500rpx;
    height: 400rpx;
    top: 50%;
    left: 50%;
    position: absolute;
    margin-left: -250rpx;
    margin-top: -200rpx;
    background: #fff;
    z-index: 999999999;
    border-radius: 10rpx;
    .modu-box{
      overflow: auto;
      position: relative;
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
      }
      .close{
        position: absolute;
        top: 0;
        right: 20rpx;
        color: #888;
      }
    }
  }
  .icon{
    display: inline-block;
    background: url('../../../../static/images/select.png');
    background-size: 200rpx 80rpx;
    background-position: 0 0;
    width: 40rpx;
    height: 40rpx;
    vertical-align: middle;
    margin: 10rpx;
  }
  .reduce-icon.active{
    background-position: -39rpx 0;
  }
  .add-icon{
    background-position: 0 -40rpx;
  }
  .add-icon.active{
    background-position: -39rpx -40rpx;
  }
  .open-icon{
    width: 24rpx;
    height: 15rpx;
    background-position: -80rpx 0;
    margin-left: 10rpx;
  }
.box-item {
  padding: 10px 20px;
  background-color: #fff;
  line-height: 1;
  font-size: 14px;
  position: relative;
  margin-top: 20rpx;
  &.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .right{
    color: #333333;
    font-size: 26rpx;
    .col{
      color: #fb3305;
    }
  }
  .right-icon {
    background: url('../../../../static/images/travelDetail.png');
    background-size: 300rpx 150rpx;
    display: inline-block;
    background-position: -119rpx 0;
    width: 23rpx;
    height: 30rpx;
    margin-top: -2rpx;
    vertical-align: top;
    margin-left: 10rpx;
  }
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
  z-index: 9999999;
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
.select-icon, .select-icon.active{
  width: 28rpx;
  height: 28rpx;
  background-position: -79rpx -15rpx;
  margin-top: -3rpx;
  margin-right: 10rpx;
}
.select-icon.active{
  background-position: -79rpx -41rpx;
}
</style>
