<template>
  <div class="page"  :class="{'stop-scolle':isShowSelect}">
    <div class="select-box">
      <div class="select-input">
        <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span>
        <div class="po-re">
          <i class="icon sel-icon"></i>
          <!-- <p class="txt">搜索目的地/关键词</p> -->
          <input type="text" placeholder="搜索目的地/关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch">
        </div>
      </div>
    </div>
    <div class="select-main">
      <ul class="tab">
        <li @click="openSelect('sort')"   :class="{'active': mode === 'sort'}" >综合排序<i class="icon bot-icon"></i></li>
        <li @click="openSelect('theme')"  :class="{'active': mode === 'theme'}">主题类型<i class="icon bot-icon"></i></li>
        <li @click="openSelect('date')"   :class="{'active': mode === 'date'}">日期天数<i class="icon bot-icon"></i></li>
        <li @click="openSelect('allSel')" :class="{'active': mode === 'allSel'}">筛选<i class="icon select-icon"></i></li>
      </ul>
      <div class="select" v-if="isShowSelect">
        <div class="select-frame sort"  v-if="mode === 'sort'">
          <ul class="sort-list" >
            <li :class="{'active': index === selIndex.sortIndex}"  v-for="(item, index) in sortRange" :key="index" @click="getSort(item.value, index)">{{item.title}}</li>
          </ul>
        </div>
        <div class="select-frame" v-if="mode === 'theme'">
          <div class="select-item">
            <p class="title">旅游类型</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.typeIndex}"
                    v-for="(item, index) in typeList" :key="index" 
                    @click="getAllSelect(item.value , index, 'productTypeId', 'typeIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="select-item">
            <p class="title">旅游主题</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.themeIndex}" 
                    v-for="(item, index) in themeList" :key="index" 
                   @click="getAllSelect(item.value , index, 'productThemeId', 'themeIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'date'">
          <div class="select-item">
            <p class="title">游玩天数</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.daysIndex}"
                    v-for="(item, index) in daysRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'days', 'daysIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="select-item">
            <p class="title">出游月份</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.monthsIndex}" 
                    v-for="(item, index) in monthRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'beginDate', 'monthsIndex')">
                {{item.title}}
              </div>
            </div>
            <div class="price-sel">
              <div class="index_section">
                <picker mode="date"
                  :value="beginDateInput"
                  end="2217-09-01" @change="bindDateChangeStart($event)" style="position:reletive">
                    <span>{{beginDateInput || '最早出发日期'}}</span>
                  </picker>
              </div>
              <i>——</i>
              <div class="index_section">
                <picker mode="date"
                  :value="endDateInput"
                  end="2217-09-01" @change="bindDateChangeEnd($event)">
                    <!-- <span>最晚出发日期</span> -->
                    <span>{{endDateInput || '最晚出发日期'}}</span>
                  </picker>
              </div> 
              <!-- <input type="text" placeholder="选择最早出发日期"> <i>——</i> 
              <input type="text" placeholder="选择最晚出发日期"> -->
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'allSel'">
          <div class="select-item">
            <p class="title">交通工具</p>
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.trafIndex}"
                    v-for="(item, index) in trafficRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'vehicle', 'trafIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="select-item">
            <p class="title">价格范围</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.priceIndex}" 
                    v-for="(item, index) in priceRange" :key="index" 
                    @click="priceSelect(item, index, 'priceRange', 'priceIndex')">
                {{item.title}}
              </div>
            </div>
            <p class="price-sel">
              <input type="text" placeholder="最低价" v-model="minPriceInput" @blur="checkMin"> <i>——</i> 
              <input type="text" placeholder="最高价" v-model="maxPriceInput" @blur="checkMax">
            </p>
          </div>
          <div class="select-item">
            <p class="title">优惠</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.discIndex}" 
                    v-for="(item, index) in discount" :key="index" 
                    @click="getAllSelect(item , index, 'discount', 'discIndex')">
                {{item}}
              </div>
            </div>
          </div>
        </div>
        <div class="btn-box" v-if="mode != 'sort'">
          <span @click="reset">重置</span>
          <span @click="confirm">确认</span>
        </div>
      </div>
      <div class="dialog-mask" v-if="isShowSelect" @click="closeMask" :style="'top:' + maskTop + 'rpx'"></div>
      <div>
        <div class="coupon-box" v-if="flag === 5">
          <p class="coupon-txt">限时促销：以下商品可使用{{couponParam.useAmount}}减{{couponParam.amount}}的优惠券</p>
          <p class="count-down" v-if="false">
            <span class="txt">距离结束时间</span>
            <span class="time ml20">10</span>
            <span class="symbol">:</span>
            <span class="time">20</span>
            <span class="symbol">:</span>
            <span class="time">56</span>
          </p>
        </div>
        <ul class="sel-tab">
          <li v-for="(item, index) in travelList" :key = index @click="goTravelDetail(item)">
            <div class="po-re">
              <img :src="coin2" alt="" class="coinImg">
              <img :src="item.imgUrl" alt="" class="mainImg">
              <span class="tra-type">{{item.typeName}}</span>
              <span class="place">{{item.departure}}出发</span>
            </div>
            <div class="tab-right">
                <p class="title">{{item.productName}}</p>
                <!-- <p class="sign">
                  <span>产品特色</span>
                  <span>产品特色</span>
                </p> -->
                <!-- <p class="date">团期:8/10,9/01,9/02,9/30,10/06,/10/15,/10/15,/10/15,/10/15</p> -->
                <p class="date" v-if="item.teamDateList.length > 0">团期：
                  <span v-for="(ite, ind) in item.teamDateList" :key = ind>
                    {{ite}},
                  </span>
                </p>
                <p class="info">
                  <span class="price"><span class="symbol">￥</span> <span class="num">{{item.price}}</span> <span>起</span></span>
                  <span class="sell">已售<span>{{item.sellNum}}</span>人</span>
                  <span class="grade">{{item.score}}分</span>
                </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <empty :list = travelList></empty>
  </div>
</template>

<script>
import { SORT_RANGE_MAP, DAY_RANGE_MAP, TRAFFIC_RANGE_MAP, PRICE_RANGE_MAP } from '../../utils/screen.js'
import dayjs from 'dayjs'
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      options: '',
      flag: '', // 页面标识 // 1:一级搜索页 2：二级页面搜索页 3:三级产品列表页 5：优惠券进入
      couponParam: {}, // 优惠券进入数据
      parentId: '', // 父级Id
      currentCity: '北京市',
      searchList: [], // 搜索列表
      travelList: [], // 旅游产品列表
      isShowSelect: false, // 是否展示筛选框
      mode: '', // 搜索类别
      searchTxt: '', // 搜索关键字
      sortRange: SORT_RANGE_MAP, // 综合排序
      daysRange: DAY_RANGE_MAP, // 游玩天数
      trafficRange: TRAFFIC_RANGE_MAP, // 交通工具
      priceRange: PRICE_RANGE_MAP, // 价格范围
      typeList: [{'value': '', 'title': '不限'}], // 旅游类型
      themeList: [{'value': '', 'title': '不限'}], // 旅游主题
      selIndex: { // 筛选下标
        sortIndex: 0,
        trafIndex: 0,
        priceIndex: 0,
        discIndex: 0,
        daysIndex: 0,
        monthsIndex: 0,
        typeIndex: 0,
        themeIndex: 0
      },
      selData: { // 接口入参
        keyword: '',
        scope: '', // 优惠券必须入参
        relationIds: '', // 优惠券必须入参
        sortType: '', // 排序方式
        productTypeId: '', // 旅游类型id
        productThemeId: '', // 旅游主题id
        vehicle: '', // 交通
        minPrice: '', // 最低价
        maxPrice: '', // 最高价
        days: '', // 游玩天数
        departure: '', // 出发地
        destination: '', // 目的地
        beginDate: '', // 最早出发日期
        endDate: '', // 最晚出发日期
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      },
      currentCount: '', // 总页数
      beginDateInput: '', // 最早出发日期输入框
      endDateInput: '', // 最晚出发日期输入框
      minPriceInput: '', // 输入最低价
      maxPriceInput: '', // 输入最高价
      discount: ['不限', '优惠立减', '限时特卖'],
      themeImg: require('../../../static/images/common/themeBg.jpg'),
      monthRange: [{
        'title': '不限',
        'value': ''
      }],
      hotDestination: ['北京', '云南', '上海', '三亚'],
      maskTop: 0,
      coin2: require('../../../static/images/common/coin2.png')
    }
  },
  onLoad (options) {
    this.options = options
    console.log('options', options)
  },
  onShow () {
    this.resetData()
    if (!wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('userCity')
    } else {
      this.currentCity = wx.getStorageSync('selectCity')
    }
    this.flag = this.options.flag
    // 1:一级搜索页
    if (this.flag === '1') {
      wx.setNavigationBarTitle({
        title: '搜索'
      })
      this.parentId = -1
      this.selData = {
        appMenuId: this.parentId,
        departure: this.currentCity,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
    }
    // 2：二级页面搜索页
    if (this.flag === '2') {
      wx.setNavigationBarTitle({
        title: '搜索'
      })
      this.selData = {
        departure: this.options.myLocation,
        destination: this.options.destination,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
    }
    // 3:三级产品列表页 (旅游度假下一级)
    if (this.flag === '3') {
      wx.setNavigationBarTitle({
        title: this.options.title
      })
      this.parentId = this.options.parentId
      if (this.options.title.indexOf('周边') > -1) {
        this.selData = {
          appMenuId: this.parentId,
          departure: this.currentCity,
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页展示
        }
      } else {
        this.selData = {
          appMenuId: this.parentId,
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页展示
        }
      }
    }
    // 4:关键字搜索进入
    if (this.flag === '4') {
      this.selData.keyword = this.options.keyword
    }
    // 5：优惠券使用进入
    if (this.flag === '5') {
      this.couponParam = JSON.parse(this.options.couponParam)
      this.selData.relationIds = this.couponParam.relationIds
      this.selData.scope = this.couponParam.scope
    }
    this.getsecondTraList(this.selData)
    this.getTypeList() // 获取旅游类型
    this.getThemeList() // 获取旅游主题
    this.getMonthRange() // 生成游玩月份
  },
  onReachBottom () {
    // let that = this
    this.selData.currentPage = this.selData.currentPage + 1
    if (this.selData.currentPage > this.currentCount) {
      console.log('已经到顶啦。。。。。')
    } else {
      this.getsecondTraList(this.selData)
    }
  },
  methods: {
    // 重置数据
    resetData () {
      this.searchList = []
      this.selData.currentPage = 1
      this.currentPage = ''
      this.travelList = []
      this.isShowSelect = false
      this.themeList = [{'value': '', 'title': '不限'}]
      this.typeList = [{'value': '', 'title': '不限'}]
      this.monthRange = [{'title': '不限', 'value': ''}]
      this.searchTxt = ''
      this.mode = ''
    },
    // 获取旅游产品列表页
    getsecondTraList(data) {
      if (this.flag === '5') { // 优惠券进入必带参数
        data.relationIds = this.couponParam.relationIds
        data.scope = this.couponParam.scope
      }
      this.$http.post(this.API.getProList, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.otherParam = res.result.otherParam
          this.travelList = this.travelList.concat(res.result.data)
          this.currentCount = res.result.currentCount
          let otherParam = res.result.otherParam
          if (otherParam !== '1') { // 1:已登录
            // 未登录要把搜索记录缓存到本地
            if (!this.options.keyword) {
              return
            }
            let txt = ''
            if (this.searchTxt) {
              txt = this.searchTxt
            } else {
              txt = this.options.keyword
            }
            let searchListStorage = wx.getStorageSync('searchList')
            this.searchList.push({'searchKey': txt, 'searchType': 1})
            if (searchListStorage && searchListStorage.length > 0) {
              wx.setStorageSync('searchList', searchListStorage.concat(this.searchList))
            } else {
              wx.setStorageSync('searchList', this.searchList)
            }
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 获取筛选条件中的旅游类型
    getTypeList() {
      this.$http.post(this.API.typeList, {
        data: {
          appMenuId: this.parentId
        }
      }).then(res => {
        if (res.code === 0) {
          res.result.forEach((item) => {
            this.typeList.push({'value': item.id, 'title': item.typeName})
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 获取筛选条件中的旅游主题
    getThemeList() {
      this.$http.post(this.API.themeList, {
        data: {
          appMenuId: this.parentId
        }
      }).then(res => {
        if (res.code === 0) {
          res.result.forEach((item) => {
            this.themeList.push({'value': item.id, 'title': item.themeName})
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 跳转旅游产品详情页
    goTravelDetail (item) {
      let url = ''
      if (item.typeName === '自由行') {
        url = `/pages/travel/independTra/main?parentId=${item.id}`
      } else {
        url = `/pages/travel/travelDetail/main?parentId=${item.id}`
      }
      wx.navigateTo({
        url: url
      })
    },
    openSelect (mode) {
      this.isShowSelect = true
      this.mode = mode
      if (mode === 'sort') {
        // this.maskTop = rect.top + 240
        this.maskTop = 430
      } else {
        this.maskTop = 626
      }
    },
    closeMask () {
      this.isShowSelect = false
      this.mode = ''
    },
    // 切换每个筛选条件的下标和对应值
    getAllSelect (item, index, value, cIndex) {
      // value: 当前选中值(传给后端的值) cIndex：当前选中下标
      this.selData[value] = item
      this.selIndex[cIndex] = index
      console.log(this.selData.beginDate)
    },
    priceSelect (item, index, value, cIndex) {
      this.selIndex[cIndex] = index
      if (this.minPriceInput === '') {
        this.selData.minPrice = item.min
      }
      if (this.maxPriceInput === '') {
        this.selData.maxPrice = item.max
      }
      console.log(this.selData.minPrice)
      console.log(this.selData.maxPrice)
    },
    getSort (value, index) {
      this.selIndex.sortIndex = index
      this.selData.sortType = value
      this.confirm()
    },
    reset () { // 重置筛选
      this.isShowSelect = false
      this.selIndex.trafIndex = 0
      this.selIndex.priceIndex = 0
      this.selIndex.discIndex = 0
      this.selIndex.daysIndex = 0
      this.selIndex.monthsIndex = 0
      this.selIndex.typeIndex = 0
      this.selIndex.themeIndex = 0
      this.selIndex.sortIndex = 0
      this.selData.sortType = ''
      this.selData.productTypeId = ''
      this.selData.productThemeId = ''
      this.selData.vehicle = ''
      this.selData.minPrice = ''
      this.selData.maxPrice = ''
      this.selData.days = ''
      this.selData.destination = ''
      this.selData.beginDate = ''
      this.selData.endDate = ''
      this.selData.keyword = ''
    },
    confirm () {
      this.mode = ''
      this.isShowSelect = false
      // 判断出游日期是选择的还是手输的
      if (this.beginDateInput !== '') {
        this.selData.beginDate = this.beginDateInput
      }
      if (this.endDateInput !== '') {
        this.selData.endDate = this.endDateInput
      }
      this.selData.currentPage = 1
      this.currentPage = ''
      this.travelList = []
      this.getsecondTraList(this.selData)
      // this.reset()
    },
    // 按热门目的地搜索
    searchHot (item) {
      this.selData.destination = item
      let data = {
        destination: item,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
      this.travelList = []
      this.getsecondTraList(data)
    },
    // 按关键字搜索
    keyWordSearch () {
      this.selData.keyword = this.searchTxt
      let data = {
        keyword: this.searchTxt,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
      this.travelList = []
      this.getsecondTraList(data)
    },
    // 日历选择器
    getToday () {
      let myDate = new Date()
      let myMonth = myDate.getMonth() + 1
      if (myMonth < 10) {
        myMonth = '0' + myMonth // 补齐
      }
      let mydate = myDate.getDate()
      if (myDate.getDate() < 10) {
        mydate = '0' + myDate.getDate() // 补齐
      }
      let today = myDate.getFullYear() + '-' + myMonth + '-' + mydate
      return today
    },
    bindDateChangeStart (res) {
      this.beginDateInput = res.mp.detail.value
      this.compareDay(this.beginDateInput, this.endDateInput)
    },
    bindDateChangeEnd (res) {
      this.endDateInput = res.mp.detail.value
      this.compareDay(this.beginDateInput, this.endDateInput)
    },
    // 比较日期大小
    compareDay(date1, date2) {
      var oDate1 = new Date(date1)
      var oDate2 = new Date(date2)
      if (oDate1.getTime() > oDate2.getTime()) {
        wx.showToast({
          title: '开始日期大于结束日期，请重新选择',
          icon: 'none'
        })
        let today = this.getToday()
        this.beginDateInput = today
        this.endDateInput = today
      } else {
        console.log('第二个大')
      }
    },
    // 生成游玩月份
    getMonthRange () {
      for (let i = 0; i < 7; i++) {
        this.monthRange.push({'title': dayjs().add(i, 'month').format('YYYY年MM月'), 'value': dayjs().add(i, 'month').format('YYYY-MM-01')})
      }
    },
    // 比较价格大小
    comparePrice () {
      if (!!this.selData.minPrice && !!this.selData.maxPrice && (this.selData.maxPrice < this.selData.minPrice)) {
        wx.showToast({
          title: '最低价不能高于最高价',
          icon: 'none'
        })
        this.minPriceInput = ''
        this.maxPriceInput = ''
        this.selData.minPrice = ''
        this.selData.maxPrice = ''
      }
    },
    checkMin () {
      this.selData.minPrice = this.minPriceInput
      this.comparePrice()
    },
    checkMax () {
      this.selData.maxPrice = this.maxPriceInput
      this.comparePrice()
    },
    goCity () {
      wx.navigateTo({
        url: `/pages/city/main`
      })
    }
  },
  components: {
    empty
  }
}
</script>

<style lang="scss" scoped>
.page{
  min-height: 100vh;
  // background: #f4f4f4;
}
.stop-scolle{
  overflow-y: hidden;
  height: 100vh;
}
.select-box{
  background: #fff;
  padding: 24rpx 30rpx 30rpx 30rpx;
  .select-input{
    width: 100%;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #353535;
    background: #f4f4f4;
    border-radius: 30rpx;
    display: flex;
    span{
      flex-grow: 1;
      // width: 130rpx;
      margin: 18rpx 0;
      line-height: 30rpx;
      text-align: center;
      border-right: 1rpx solid #dcdcdc;
      // margin: 18rpx 0;
      padding: 0 20rpx 0 40rpx;
      .icon{
        // margin-left: 10rpx;
        float: right;
        margin-top: 13rpx;
      }
    }
    .po-re{
      flex-grow: 5;
      position: relative;
      display: inline-block;
      .txt{
        display: inline-block;
        vertical-align: middle;
        // padding-right: 100rpx;
        color: #353535;
      }
    }
  }
}
.select-main{
  padding: 0 30rpx 0 30rpx;
  background: #fff;
  font-size: 28rpx;
  position: relative;
  border-top: 20rpx solid #f4f4f4;
  .tab{
    display: flex;
    height: 89rpx;
    line-height: 89rpx;
    border-bottom: 1rpx solid #dcdcdc;
    justify-content: space-between;
    .bot-icon{
      background-position: -146rpx -6rpx;
      margin-left: 10rpx; 
    }
    .select-icon {
      background-position: -166rpx -5rpx;
      margin-left: 10rpx; 
      width: 22rpx;
      height: 25rpx;
    }
    li.active{
      color: #ff9913;
      .bot-icon{
        background-position: -146rpx -17rpx;
      }
      .select-icon {
        background-position: -38rpx -35rpx;
      }
    }
  }
}
.select{
  position: absolute;
  display: inline-block;
  z-index: 999;
  animation: mymove .3s forwards;
  padding: 0 30rpx;
  left: 0rpx;
  background: #fff;
  .select-frame{
    position: relative;
    overflow-y: auto;
    background: #fff;
    z-index: 10;
    width: 690rpx;
    height: 458rpx;
    font-size: 24rpx;
    color: #353535;
    .select-item{
      border-bottom: 1rpx solid #dcdcdc;
      margin-top: 15rpx;
      .title{
        margin-bottom: 7rpx;
      }
      .dis-flex{
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 24rpx;
        div{
          height: 60rpx;
          line-height: 60rpx;
          width: 23%;
          background: #f4f4f4;
          text-align: center;
          border-radius: 5rpx;
          margin-top: 15rpx;
          margin-right: 2%;
        }
        div:nth-child(4){
          margin-right: 0;
        }
        div.active{
          background: #ff9913;
          color: #fff;
        }
      }
      .price-sel{
        display: flex;
        margin-bottom: 24rpx;
        width: 100%;
        input{
          width: 302rpx;
          height: 58rpx;
          text-align: center;
          border: 1rpx solid #dcdcdc;
          display: inline-block;
          border-radius: 8rpx;
        }
        span{
          width: 302rpx;
          height: 58rpx;
          line-height: 58rpx;
          color: #353535;
          text-align: center;
          border: 1rpx solid #dcdcdc;
          display: inline-block;
          border-radius: 8rpx;
        }
        i{
          vertical-align: top;
          display: inline-block;
          color: #dcdcdc;
          margin: 10rpx 10rpx;
        }
      }
    }
    .select-item:last-child{
      border-bottom: none;
    }
    .sort-list{
      li {
        height: 66rpx;
        line-height: 66rpx;
        color: #353535;
        font-size: 28rpx;
        border-bottom: 1rpx solid #dcdcdc;
      }
      li.active{
        color: #ff9913;
      }
      li:last-child{
        border-bottom:none;
      }
    }
  }
  .select-frame.sort{
    height: 342rpx;
  }
  .btn-box{
    span{
      display: inline-block;
      border-top: 1rpx solid #dcdcdc;
      width: 50%;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      background: #fff;
    }
    span:nth-child(2){
      background: #ff9913;
      color: #fff;
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
.dialog-mask{
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
  animation: mymove .3s forwards;
}
.sel-tab {
  li {
    margin-top: 30rpx;
    font-size: 20rpx;
    border-bottom: 1rpx solid #dcdcdc;
    padding-bottom: 30rpx; 
    .po-re{
      position: relative;
      display: inline-block;
      span{
        position: absolute;
        color: #fff;
        display: block;
        font-size: 22rpx;
        background: rgba(0,0,0,0.5);
        text-align: center;
      }
      .tra-type{
        top: 0;
        border-radius:5rpx 0 5rpx 0 ;
        padding: 0 10rpx;
      }
      .place{
        bottom: 0;
        width: 100%;
        height: 36rpx;
        border-radius:0 0 5rpx 5rpx ;
      }
      .mainImg {
        width: 220rpx;
        height: 220rpx;
        border-radius: 5rpx;
        display: block;
      }
      .coinImg{
        position: absolute;
        right: 5rpx;
        top: 5rpx;
        width: 30rpx;
        height: 30rpx;
      }
    }
    .tab-right{
      float: right;
      width: 66%;
      .title {
        font-size: 30rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        // line-height: 40rpx;
        padding-right: 10rpx;
        height: 95rpx;
      }
      .sign {
        span {
          display: inline-block;
          color: #ff9913;
          border: 1rpx solid #ff9913;
          width: 102rpx;
          height: 34rpx;
          text-align: center;
          margin: 10rpx 15rpx 0 0 ;
          border-radius: 5rpx;
          font-size: 23rpx;
        }
      }
      .date{
        font-size: 24rpx;
        color: #666;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin: 10rpx 0 0rpx 0;
        padding-right: 10rpx;
      }
      .info {
        color: #888888;
        margin-top: 30rpx;
        .price {
          .num{
            color: #fb3305;
            font-size: 30rpx;
            margin-right: 5rpx;
          }
          .symbol{
            color: #fb3305;
          }
        }
        .sell {
          float: right;
          margin: 10rpx 10rpx 0 0 ;
        }
        .grade{
          color: #ff9913;
          float: right;
          margin: 10rpx 10rpx 0 0 ;
        }

      }
    }
  }
  li:last-child{
    border-bottom: none;
    padding-bottom: 0 ;
  }
}
.icon{
  background: url('../../../static/images/travelSort.png');
  background-size: 200rpx 200rpx; 
  background-position: -57rpx -10rpx;
  width: 20rpx;
  height: 12rpx;
  display: inline-block;
  vertical-align: middle;
}
.sel-icon{
  background-position: -80rpx -1rpx;
  width: 28rpx;
  height: 28rpx;
  margin: 0 10rpx 0 20rpx;
}
.coupon-box{
  .coupon-txt{
    font-size: 24rpx;
    margin-top: 25rpx;
  }
  .count-down{
    margin-top: 5rpx;
    .txt{
      color: #333333;
      font-size: 20rpx;
    }
    .time{
      display: inline-block;
      width: 28rpx;
      height: 28rpx;
      background-color: #fbb03b;
      border-radius: 4rpx;
      color: #ffffff;
      font-size: 20rpx;
      text-align: center;
      vertical-align: middle;
      padding: 0 4rpx 5rpx 3rpx;
    }
    .ml20{
      margin-left: 20rpx;
    }
    .symbol{
      display: inline-block;
      color: #999999;
      font-size: 20rpx;
      margin: 0 10rpx;
    }
  }
}

</style>
