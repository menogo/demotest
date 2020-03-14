<template>
  <div class="page">
    <div class="date-box" >
      <p class="title">选择日期和人数</p>
    </div>
    <ul class="tabList">
        <li :class="currentMonth == val ? 'active' : ''" v-for="(val, key) in monthTabListObj" @click="renderCalendar(key)" :key="key">
          <!-- val: 8, key: 2019-8 -->
          <p>{{ val }}月</p>
          <p>￥{{ monthPriceObj[key][0] }}起</p>
        </li>
      </ul>
    <div>
      <Calendar
        :months="months"
        :value="value"
        :begin="begin"
        :events="events"
        clean
        @select="select"
        ref="calendar"
        @selectMonth="selectMonth"
        @selectYear="selectYear"
        :arrowLeft="arrowLeft"
        :tileContent="tileContent"
        :almanacs="almanacs"
        lunar
      />
    </div>
    <div class="stock-date" v-if="selectStockShow">
      <span class="date">{{selectDate}}出发-{{endDate}}返回</span>
      <span class="stock">剩余库存：{{selectStock}}</span>
    </div>
    <ul class="ticker-change" v-if="stockPrice.length > 0">
      <li v-for="(item, index) in stockPrice" :key=index>
        <span class="title">{{item.typeName}}</span>
        <div class="select-box">
          <i class="icon reduce-icon" @click="reduce(item)"></i>
          <span>{{item.num}}</span>
          <i class="icon add-icon"  @click="add (item)"></i>
        </div>
      </li>
    </ul>
    <!-- 附加服务 -->
    <ul class="add-serve" v-if="serviceList.length > 0">
      <li>
        <p class="add-title">附加服务</p>
        <span class="more" @click="toggleMoreAddServe" v-if="serviceList.length > 2">更多({{serviceList.length}})</span>
      </li>
      <li v-for="(item, index) in serviceList" v-if="index < 2" :key="index">
        <span class="title">{{item.name}}</span>
        <i class="careful-icon" @click="toogleReserve(item)"></i>
        <span class="price">￥{{item.amount}}</span>
        <div class="select-box">
          <i class="icon reduce-icon" @click="reduceServe(item)"></i>
          <span>{{item.num}}</span>
          <i class="icon add-icon" @click="addServe(item)"></i>
        </div>
      </li>
    </ul>
    <div class="footer" >
      <div v-if="selected">
        <span class="price">总价：￥{{total}}</span>
        <span class="detail" @click="toggleMask"> 明细<i class="icon open-icon"></i></span>
      </div>
      <div class="buy" @click="checkLogin">下一步</div>
    </div>
    <div class="dialog-mask" @click="closeMask"  v-if="showDetailMask"></div>
    <ul class="detail-mask" v-if="showDetailMask">
      <li class="title">费用明细</li>
      <li  v-for="(item, index) in stockPrice" :key=index>
        <span>{{item.typeName}}</span>
        <span class="right">￥{{item.guestPrice}} X {{item.num}}</span>
      </li>
      <li  v-for="(item, index) in serviceList" :key=index v-if="item.num > 0">
        <span>{{item.name}}</span>
        <span class="right">￥{{item.amount}} X {{item.num}}</span>
      </li>
    </ul>
    <div class="dialog-mask2" @click="toggleMoreAddServe"  v-if="showMoreAdd"></div>
    <div class="detail-mask2" v-if="showMoreAdd">
      <p class="title">附加服务</p>
      <ul class="add-box">
        <li class="add-item" v-for="(item, index) in serviceList" :key = index>
          <span class="title">{{item.name}}</span>
          <i class="careful-icon" @click="toogleReserve(item)"></i>
          <span class="price">￥{{item.amount}}</span>
          <div class="select-box">
            <i class="icon reduce-icon" @click="reduceServe(item)"></i>
            <span>{{item.num}}</span>
            <i class="icon add-icon" @click="addServe(item)"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="dialog-mask3" v-if="showServeDetail"  @click="toogleReserve"></div>
    <div class="reserve-box" v-if="showServeDetail" >
      <div class="modu-box">
        <i class="close" @click="toogleReserve">X</i>
        <p class="title">{{serveRemark.name}}</p>
        <div class="main">
          {{serveRemark.remark}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '../../../components/calendar/calendar.vue'
import '../../../components/calendar/style.css'
import dayjs from 'dayjs'
// const result = require('./config.json')

export default {
  data() {
    return {
      giftType: '',
      selectStockShow: false,
      showServeDetail: false,
      serveRemark: '', // 附加服务说明
      independTras: false,
      travelDays: '', // 游玩天数
      serviceList: [],
      selectDate: '',
      endDate: '',
      selectStock: 0,
      monthTabListObj: {}, // 后端返回数据统计月份 obj
      monthPriceObj: {}, // 月份价格对象
      currentMonth: 0, // 当前选中月份
      stockList: [],
      stockId: '', // 当前选中日期的id
      stockPrice: [], // 当前选中日期的出行人类型
      total: 0, // // 全部出行人类型总价
      selected: false, // 是否有选中明细弹框
      months: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      disabledArray: ['2018-6-27', '2018-6-25'],
      value: [2019, 12, 3], // 默认选中日期
      begin: [], // 禁用该日之前的所有日期
      almanacs: {},
      events: { '2019-8-7': '今日备注', '2019-8-8': '一条很长的明日备注' },
      tileContent: [
        { date: '2018-9-22', className: 'holiday ', content: '休' },
        { date: '2018-9-23', className: 'holiday ', content: '休' }
      ],
      showDetailMask: false, // 费用明细弹框
      showMoreAdd: false
    }
  },
  onLoad(options) {
    if (options.giftType) { // 通过买产品送旅游方式进入
      this.giftType = options.giftType
    }
    if (options.travType === '2') { // 自由行进入
      this.independTras = true
    }
  },
  mounted() {
    this.handleMonthSwtich()
    wx.setStorageSync('currentDayStock', '') // 清空缓存
    this.travelDays = wx.getStorageSync('orderNeedData').travelDays
    if (wx.getStorageSync('orderNeedData').serviceList) { // 自由行的附加服务
      this.serviceList = wx.getStorageSync('orderNeedData').serviceList // 附加服务
      this.serviceList.forEach((item) => {
        this.$set(item, 'num', 0)
      })
    }
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    checkLogin() {
      this.$http.post(this.API.checkLogin).then(res => { // 判断是否登录
        if (res.code === 0 && res.result) {
          this.goTraBuy()
        } else {
          wx.navigateTo({
            url: `/pages/login/main`
          })
        }
      })
    },
    toggleMoreAddServe() {
      this.showMoreAdd = !this.showMoreAdd
    },
    toogleReserve(remark) {
      this.showServeDetail = !this.showServeDetail
      if (remark) {
        this.serveRemark = remark
      }
    },
    handleMonthSwtich(str = '') {
      // this.stockList = result.result.stockList // 挡板数据
      this.stockList = wx.getStorageSync('stockList')
      // let monthTabList = []
      let monthTabListObj = {}
      let monthPriceObj = {}
      this.stockList.forEach(item => {
        let arr = item.teamDateFmt.split('-')
        let m = arr[1] * 1
        let key = `${arr[0]}-${m}`

        // 过滤月份
        // monthTabListObj = { 2019-8: 8, 2019-9: 9 }
        monthTabListObj[key] = m

        // 处理当月最小价格
        // monthPriceObj = { 2019-8: [123, 452, 98, 1980], 2019-9: [123, 452, 98, 1980] }
        if (monthPriceObj[key]) {
          monthPriceObj[key].push(+item.guestPrice)
        } else {
          monthPriceObj[key] = []
          monthPriceObj[key].push(+item.guestPrice)
        }
        monthPriceObj[key].sort((a, b) => a - b)

        // 2019-09-16 -> {9-16: ￥2013}
        // almanacs: {'8-7': '￥2065', '8-8': '￥2065'}  格式
        this.almanacs[m + '-' + arr[2] * 1] = '￥' + item.guestPrice
        // this.almanacs[m + '-' + arr[2]] = '￥' + item.stock

        // 把ID当做event放入日历，用来匹配成人、儿童对象
        this.events[arr[0] + '-' + m + '-' + arr[2] * 1] = item.id
      })

      this.monthPriceObj = { ...monthPriceObj }
      this.monthTabListObj = { ...monthTabListObj }

      // 拼装数据完之后，再渲染日历
      if (str) {
        this.renderer(str)
      } else {
        this.renderer()
      }
    },
    genMonth(str) {
      return str.split('-')[1]
    },
    // 减少
    reduce(item) {
      if (this.giftType) {
        wx.showToast({
          title: '该赠送产品不能选择人数',
          icon: 'none'
        })
        return
      }
      item.num = item.num - 1
      if (item.num < 0) {
        item.num = 0
      }
      this.countTotal()
    },
    // 增加
    add(item) {
      if (this.giftType) {
        wx.showToast({
          title: '该赠送产品不能选择人数',
          icon: 'none'
        })
        return
      }
      console.log('item.num前', item.num)
      item.num = item.num + 1
      console.log('item.num后', item.num + 1)
      this.countTotal()
    },
    // 附加服务
    reduceServe(item) {
      item.num = item.num - 1
      if (item.num < 0) {
        item.num = 0
      }
      this.countTotal()
    },
    addServe(item) {
      item.num = item.num + 1
      this.countTotal()
    },
    // 计算总价
    countTotal() {
      let currentTotal = 0
      let total = 0
      if (this.stockPrice) {
        this.stockPrice.forEach(item => {
          currentTotal = item.guestPrice * item.num
          total = total + currentTotal
        })
      }
      if (this.serviceList.length > 0) {
        this.serviceList.forEach(item => {
          currentTotal = item.amount * item.num
          total = total + currentTotal
        })
      }
      this.total = Math.round(total * 100) / 100
    },
    toggleMask() {
      this.showDetailMask = !this.showDetailMask
    },
    closeMask() {
      this.showDetailMask = false
    },
    goTraBuy() {
      if (this.total === 0 && !this.giftType) {
        wx.showToast({
          title: '请选择出行人数',
          icon: 'none'
        })
        return
      }
      console.log('this.currentDayStock', this.currentDayStock)
      this.currentDayStock.serviceList = this.serviceList
      console.log('this.currentDayStock', this.currentDayStock)
      wx.setStorageSync('currentDayStock', this.currentDayStock) // 存储选中日期数据
      if (this.serviceList.length > 0) {
        let selectserviceList = []
        this.serviceList.forEach((item) => {
          if (item.num > 0) {
            selectserviceList.push({
              serviceId: item.id,
              num: item.num
            })
          }
        })
        if (this.serviceList.length > 0) {
          wx.setStorageSync('selectserviceList', selectserviceList) // 存储附加服务
        }
      }
      wx.redirectTo({
        url: `/pages/travel/orderPay/main?&total=${this.total}&giftType=${this.giftType}`
      })
    },
    prev(year, month, weekIndex) {
      // return
    },
    next(year, month, weekIndex) {
      console.log(year, month, weekIndex)
    },
    selectYear(year) {
      console.log(year)
    },
    selectMonth(month, year) {
      console.log(year, month)
    },
    setToday() {
      this.$refs.calendar.setToday()
    },
    dateInfo() {
      const info = this.$refs.calendar.dateInfo(2018, 8, 23)
      console.log(info)
    },
    renderer(str) {
      let m = new Date().getMonth() + 1
      let y = new Date().getFullYear()
      let d = new Date().getDate()
      this.begin[0] = y
      this.begin[1] = m
      this.begin[2] = d

      let _str = str || y + '-' + m
      let arr = _str.split('-')
      let year = arr[0]
      let month = arr[1]

      // 用来激活 active class
      this.currentMonth = arr[1]

      // this.$refs.calendar.renderer(2019-9);
      this.$refs.calendar.renderer(year, month)
    },
    renderCalendar(str) {
      this.renderer(str)
      this.handleMonthSwtich(str)
    },
    select(val, dateObj) {
      this.selectStockShow = true
      // 当前选中月份
      this.total = 0
      this.currentMonth = val[1]
      this.currentDayStock = this.filterStockPriceList(dateObj.event)
      this.stockPrice = this.filterStockPriceList(dateObj.event).stockPriceList // 选中日期出行人列表
      // 初始化stockPrice
      if (this.stockPrice) {
        this.stockPrice.forEach((item, i) => {
          this.$set(item, 'num', 0) // 选中数量
          if (item.typeName === '成人') {
            item.num = 2
          }
          if (this.giftType && item.priceTypeId === 1) {
            this.$set(item, 'num', 1) // 买产品赠送旅游只能固定为一个成人出游
          }
        })
      } else {
        this.stockPrice = []
      }
      this.countTotal()
      this.selected = true
      this.stockId = this.filterStockPriceList(dateObj.event).id
      // 日历下方计算日期和库存展示
      this.selectDate = dayjs(dateObj.date).format('MM月DD日')
      this.endDate = dayjs(dateObj.date).add(this.travelDays, 'day').format('MM月DD日')
      this.selectStock = this.currentDayStock.stock || 0
    },
    filterStockPriceList(id) {
      let result = {}
      this.stockList.forEach(item => {
        if (id === item.id) {
          result = item
        }
      })

      return result
    }
  },
  components: {
    Calendar
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
  padding-bottom: 99rpx;
}
.stock-date{
  background: #fff;
  margin-top: -20rpx;
  padding: 25rpx;
  color: #333;
  font-size: 24rpx;
  .stock{
    color:#f65631;
    margin-left: 30rpx;
  }
}
.date-box {
  // margin-bottom: 20rpx;
  .title {
    font-size: 30rpx;
    background: #fff;
    text-align: center;
    height: 85rpx;
    line-height: 85rpx;
    font-weight: bold;
  }
}
.tabList {
  width: 100%;
  height: 80rpx;
  padding: 0 30rpx;
  margin: 20rpx 0;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  li {
    display: inline-block;
    width: 180rpx;
    text-align: center;
    height: 75rpx;
    p:nth-child(1) {
      font-size: 22rpx;
      color: #353535;
    }
    p:nth-child(2) {
      font-size: 20rpx;
      color: #888888;
    }
  }
  li.active {
    border-bottom: 4rpx solid #ff9913;
    p:nth-child(2) {
      color: #ff9913;
    }
  }
}
.ticker-change, .add-serve {
  margin-top: 20rpx;
  background: #fff;
  font-size: 30rpx;
  li {
    height: 85rpx;
    line-height: 85rpx;
    margin-left: 30rpx;
    margin-right: 30rpx;
    overflow: hidden;
    .title {
      display: inline-block;
    }
    .sel-ticker {
      display: inline-block;
    }
  }
  li:first-child {
    border-bottom: 1rpx solid #dcdcdc;
  }
  li:last-child {
    border-bottom: none;
  }
}
.add-serve{
  li{
    position: relative;
    border-bottom: 1rpx solid #dcdcdc;
    .more{
      position: absolute;
      top: 0;
      right: 0;
      color: #fbb03b;
      font-size: 30rpx;
    }
    .price{
      color: #f65631;
      display: inline-block;
      vertical-align: top;
      margin-top: 10rpx;
      position: absolute;
      left: 40%;
    }
    .careful-icon{
      width: 28rpx;
      height: 28rpx;
      background: url(../../../../static/images/careful.png);
      display: inline-block;
      background-size: 28rpx 28rpx;
      background-position:0 0;
      margin-top: 30rpx;
      vertical-align: top;
      margin-left: 15rpx;
    }
  }
  li:first-child {
    border-bottom: none;
  }
}
.select-box {
  float: right;
  font-size: 32rpx;
  color: #888;
  span {
    margin-left: 20rpx;
    margin-right: 20rpx;
    vertical-align: middle;
  }
}
.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  font-size: 26rpx;
  color: #353535;
  border-top: 1rpx solid #dcdcdc;
  height: 98rpx;
  text-align: center;
  // z-index: 999999;
  div{
    width: 50%;
  }
  .buy {
    line-height: 98rpx;
    color: #fff;
    font-size: 30rpx;
    flex-grow: 4;
    background: #fbb03b;
  }
  .price {
    line-height: 98rpx;
    color: #f65631;
    margin: 0 30rpx;
    font-size: 28rpx;
  }
  .detail {
    margin-right: 30rpx;
  }
}
.detail-mask, .detail-mask2 {
  position: fixed;
  width: 100%;
  bottom: 99rpx;
  font-size: 24rpx;
  background: #fff;
  z-index: 999999;
  li {
    height: 81rpx;
    line-height: 81rpx;
    border-bottom: 1rpx solid #dcdcdc;
    padding: 0 30rpx;
    overflow: hidden;
    .right {
      float: right;
      color: #f65631;
      margin-right: 30rpx;
    }
  }
  li:last-child {
    border-bottom: none;
  }
  .title {
    font-size: 30rpx;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
  }
}
.detail-mask2{
  height: 500rpx;
  bottom: 0;
  overflow: auto;
  li{
    height: 88rpx;
    line-height: 88rpx;
  }
  ul.add-box{
    overflow: auto;
    // margin-top: 80rpx;
  }
  .title{
    border-bottom: 1rpx solid #dcdcdc;
  }
  .add-item{
    margin: 0 30rpx;
    padding: 0;
    .title{
      // width: 250rpx;
      text-align:left;
      margin-top: 5rpx;
      display: inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .price{
      color: #f65631;
      display: inline-block;
      vertical-align: top;
      margin-top: 10rpx;
      position: absolute;
      left: 45%;
    }
    .careful-icon{
      width: 28rpx;
      height: 28rpx;
      background: url(../../../../static/images/careful.png);
      display: inline-block;
      background-size: 28rpx 28rpx;
      background-position:0 0;
      margin-top: 35rpx;
      vertical-align: top;
      margin-left: 10rpx;
    }
  }
}
.dialog-mask, .dialog-mask2 {
  position: fixed;
  bottom: 350rpx;
  left: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
}
.dialog-mask2{
  bottom: 500rpx;
}
.dialog-mask3{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
  animation: mymove .3s forwards;
}
.reserve-box{
  width: 500rpx;
  height: 400rpx;
  top: 45%;
  left: 50%;
  position: absolute;
  margin-left: -250rpx;
  margin-top: -200rpx;
  background: #fff;
  z-index: 999999999;
  border-radius: 10rpx;
  max-height: 300rpx;
  .modu-box{
    overflow: auto;
    position: relative;
    background: #fff;
    padding: 20rpx 20rpx;
    margin-top: 20rpx;
    max-height: 220rpx;
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
.icon {
  display: inline-block;
  background: url('../../../../static/images/select.png');
  background-size: 200rpx 80rpx;
  background-position: 0 0;
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin: 10rpx;
  transform: scale(1.2);
}
.reduce-icon.active {
  background-position: -39rpx 0;
}
.add-icon {
  background-position: 0 -40rpx;
}
.add-icon.active {
  background-position: -39rpx -40rpx;
}
.open-icon {
  width: 24rpx;
  height: 15rpx;
  background-position: -80rpx 0;
  margin-left: 10rpx;
}
</style>
