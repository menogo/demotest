<template>
  <div>
    <div class="page" :class="{'body-fixed' : showMask2 || showMask || reserveShow}">
      <div class="title-box">
        <p class="title">{{orderNeedData.productName}}</p>
        <p>{{orderNeedData.destination}}出发</p>
      </div>
      <div class="date-modules">
        <p class="title">选择日期</p>
        <Calendar
          :months="months"
          :value="value"
          :begin="begin"
          @select="select"
          ref="calendar"
          :almanacs="almanacs"
          :events="events"
        />
      </div>
      <ul class="contacts">
        <li class="title">出游信息</li>
        <li>
          <span class="lab">出游人数&emsp;</span>
          <input type="text" class="input-txt" placeholder="请填写出游人数" v-model="travelsNum" @blur="getTotal">
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
      <ul class="detail-mask" v-if="showDetailMask">
        <li class="title">费用明细</li>
        <li>
          <span>人数</span>
          <span class="right">￥{{money}} X {{travelsNum}}</span>
        </li>
      </ul>
      <div class="dialog-mask" @click="closeMask"  v-if="showMask"></div>
      <div class="dialog-mask2" @click="closeCustomer"  v-if="showMask2"></div>
      <div class="dialog-mask3" v-if="reserveShow"></div>
    </div>
    <div class="footer">
      <div>
        <span class="price">总价：￥{{total}}</span>
        <span class="detail" @click="toggleDetailMask"> 明细<i class="icon open-icon"></i></span>
      </div>
      <div class="buy" @click="goPay">立即支付</div>
    </div>
  </div>
</template>

<script>
import Calendar from '../../../components/calendar/calendarv.vue'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      stockId: '',
      initSelect: '',
      money: '',
      travelsNum: 1,
      total: '',
      contactName: '',
      contactMobile: '',
      showMask: false,
      contactEmail: '',
      orderNeedData: {}, // 订单数据
      showDetailMask: false, // 费用明细弹框
      currentPrice: '', // 某日价格
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      value: [],
      begin: [],
      // almanacs: {'10-3': '2033', '10-17': '12000'}, // 存放id
      // events: {'2019-10-7': '2033', '2019-10-8': '12000'}, // 自定义备注
      almanacs: {}, // 存放id
      events: {} // 价格备注
    }
  },
  onLoad() {
  },
  mounted () {
    this.orderNeedData = wx.getStorageSync('orderNeedData') // 详情页存储的订单页需要的数据
    this.orderNeedData.stockList.forEach((item) => {
      item.teamDate = dayjs(item.teamDate).format('YYYY,MM,DD').split(',')
      let y = item.teamDate[0]
      let m = item.teamDate[1]
      let d = item.teamDate[2]
      this.events[`${y}-${parseInt(m)}-${parseInt(d)}`] = item.price
      this.almanacs[`${parseInt(m)}-${parseInt(d)}`] = item.id
    })
    if (this.orderNeedData.initSelect) { // 有选择日期进来，渲染选中的日期
      this.initSelect = this.orderNeedData.initSelect
      let initSelectDayArr = (this.initSelect.teamDate || '').split('-')
      initSelectDayArr.forEach((item) => {
        item = parseInt(item)
        this.value.push(item)
      })
    } else { // 普通预定进来选第一个
      this.initSelect = this.orderNeedData.stockList[0]
      this.initSelect.teamDate.forEach((item) => {
        item = parseInt(item)
        this.value.push(item)
      })
    }
    this.stockId = this.initSelect.id // 库存id
    this.money = this.initSelect.price
    this.getTotal()
    this.renderer()
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    renderer() {
      let m = new Date().getMonth() + 1
      let y = new Date().getFullYear()
      let d = new Date().getDate()
      this.begin[0] = y
      this.begin[1] = m
      this.begin[2] = d

      let nowDay = dayjs()
      this.$refs.calendar.renderer(nowDay.$y, nowDay.$M + 1) // 渲染2018年8月份
    },
    select(val, val2) {
      console.log(val2)
      this.stockId = val2.almanac // 库存id
      this.money = val2.event
      this.getTotal()
      console.log(this.stockId)
    },
    getTotal() {
      this.total = this.money * this.travelsNum
    },
    toggleDetailMask () {
      this.showDetailMask = !this.showDetailMask
      this.showMask = !this.showMask
    },
    closeMask () {
      this.showDetailMask = false
      this.showMask = false
    },
    goPay () {
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
      var data = {
        payType: 1, // 支付类型
        stockId: this.stockId,
        touristNum: this.travelsNum,
        contactName: this.contactName,
        contactMobile: this.contactMobile,
        contactEmail: this.contactEmail
      }
      this.$http.post(this.API.guideOrder, { // 创建订单
        data: data
      }).then(res => {
        if (res.code === 0) {
          let orderId = res.result
          this.$http.post(this.API.wxPay, { // 微信支付下单
            data: {
              orderId: orderId,
              openId: wx.getStorageSync('openId'),
              type: 4
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
    goOrderList () {
      wx.redirectTo({
        url: `/pages/daren/darenOrder/main`
      })
    }
  },
  components: {
    Calendar
  }

}
</script>

<style lang="scss" scoped>
  .page{
    min-height: 100vh;
    background: #f4f4f4;
    padding-bottom: 100rpx;
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
.date-modules {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-top: 20rpx;
  .title {
    font-size: 30rpx;
    margin-bottom: 25rpx;
  }
}
</style>
