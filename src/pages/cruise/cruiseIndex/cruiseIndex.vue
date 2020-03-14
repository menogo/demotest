<template>
  <div class="page"  :class="{'stop-scolle':isShowSelect}">
    <div class="select-box">
      <div class="select-input">
        <!-- <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span> -->
        <div class="po-re">
          <i class="icon sel-icon"></i>
          <input type="text" placeholder="搜索目的地/关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch">
        </div>
      </div>
    </div>
    <div class="area-box">
      <div v-for="(item, index) in routeList" :key = index @click="getRoutList(item)">
        <img :src="item.imgUrl" alt="">
        <p><span>{{item.routeName}}</span></p>
      </div>
      <!-- <div>
        <img :src="themeImg" alt="">
        <p><span>加勒比海</span></p>
      </div> -->
    </div>
    <div class="select-main">
      <ul class="tab">
        <li @click="openSelect('sort')"   :class="{'active': mode === 'sort'}" >综合排序<i class="icon bot-icon"></i></li>
        <li @click="openSelect('route')"  :class="{'active': mode === 'route'}">邮轮航线<i class="icon bot-icon"></i></li>
        <li @click="openSelect('date')"   :class="{'active': mode === 'date'}">日期天数<i class="icon bot-icon"></i></li>
        <li @click="openSelect('allSel')" :class="{'active': mode === 'allSel'}">筛选<i class="icon select-icon"></i></li>
      </ul>
      <div class="select" v-if="isShowSelect">
        <div class="select-frame sort"  v-if="mode === 'sort'">
          <ul class="sort-list" >
            <li :class="{'active': index === selIndex.sortIndex}"  v-for="(item, index) in sortRange" :key="index" @click="getSort(item.value, index)">{{item.title}}</li>
          </ul>
        </div>
        <div class="select-frame" v-if="mode === 'route'">
          <div class="select-item">
            <ul class="sort-list" >
              <li :class="{'active': index === selIndex.routeIndex}"  v-for="(item, index) in typeList" :key="index" @click="getAllSelect(item.id , index, 'routeId', 'routeIndex')">{{item.title}}</li>
            </ul>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'date'">
          <div class="select-item">
            <p class="title">行程天数</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.daysIndex}"
                    v-for="(item, index) in cruiseDays" :key="index" 
                    @click="dataSelect(item , index, 'cruiseDays', 'daysIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="select-item">
            <p class="title">出行时间</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.monthsIndex}" 
                    v-for="(item, index) in monthRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'monthRange', 'monthsIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'allSel'">
          <div class="select-item">
            <p class="title">出发港口</p>
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.portIndex}"
                    v-for="(item, index) in portRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'port', 'portIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
          <div class="select-item">
            <p class="title">邮轮公司</p>
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.companyIndex}" 
                    v-for="(item, index) in companyRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'company', 'companyIndex')">
                {{item.title}}
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
      <div class="sel-tab" @click="goCruiseDetail(item)" v-for="(item, index) in cruiseList" :key = index>
        <div class="po-re">
          <img :src="item.shareProfitLogo" alt="" class="coinImg">
          <img :src="item.imgUrl" alt="" class="mainImg">
          <p class="left"> 
            <span>{{item.departure}}出发</span>
            <span>{{item.travelTime}}</span>
          </p>
          <p class="right">
            <span>￥</span>
            <span class="price">{{item.price}}</span>
            <span>起</span>
          </p>
        </div>
        <p class="title">{{item.productName}}</p>
        <div class="sec-title">
          <i class="cruise-icon"></i>
          <span>{{item.cruiseName}}</span>
          <div class="right">
            <span class='col'>{{item.score}}分</span>
            <span>已售{{item.sellNum}}人</span>
          </div>
        </div>
      </div>
    </div>
    <empty :list = cruiseList></empty>
  </div>
</template>
<script>
import { SORT_RANGE_MAP, CRUISE_DAY_MAP } from '../../../utils/screen.js'
import dayjs from 'dayjs'
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      // currentCity: '北京市',
      sortRange: SORT_RANGE_MAP, // 综合排序
      cruiseDays: CRUISE_DAY_MAP, // 行程天数
      maskTop: 0,
      mode: '', // 搜索类别
      routeList: [],
      cruiseList: [],
      isShowSelect: false, // 是否展示筛选框
      selIndex: { // 筛选下标
        sortIndex: 0,
        routeIndex: 0,
        daysIndex: 0,
        monthsIndex: 0,
        portIndex: 0,
        companyIndex: 0
      },
      selData: { // 接口入参
        sortType: '', // 排序方式
        routeId: '', // 邮轮航线
        startDays: '', // 行程天数（开始)
        endDays: '', // 行程天数（结束）
        beginDate: '', // 出游月份
        port: '', // 出发港口
        company: '', // 邮轮公司
        monthRange: ''
      },
      // value是传给后台的入参，title是页面展示
      typeList: [], // 邮轮航线
      portRange: [{'value': '', 'title': '不限'}],
      companyRange: [{'value': '', 'title': '不限'}, {'value': '星梦邮轮', 'title': '星梦邮轮'}],
      monthRange: [{
        'title': '不限',
        'value': ''
      }],
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      coin2: require('../../../../static/images/common/coin2.png')
    }
  },
  onShow () {
    this.typeList = []
    this.monthRange = [{'title': '不限', 'value': ''}]
    this.portRange = [{'value': '', 'title': '不限'}]
    this.reset()
    this.queryRouteList()
    this.getcruiseList()
    this.getMonthRange() // 生成游玩月份
    this.getAboardList() // 港口
  },
  methods: {
    reset () {
      this.mode = ''
      this.selIndex.sortIndex = 0
      this.selIndex.routeIndex = 0
      this.selIndex.daysIndex = 0
      this.selIndex.monthsIndex = 0
      this.selIndex.portIndex = 0
      this.selIndex.companyIndex = 0
      this.selData.sortType = ''
      this.selData.routeId = ''
      this.selData.startDays = ''
      this.selData.endDays = ''
      this.selData.beginDate = ''
      this.selData.port = ''
      this.selData.company = ''
      this.selData.monthRange = ''
      this.isShowSelect = false
    },
    queryRouteList () {
      this.$http.post(this.API.queryRouteList).then(res => {
        if (res.code === 0) {
          this.routeList = res.result.data
          this.routeList.forEach((item) => {
            this.typeList.push({'id': `${item.id}`, 'title': `${item.routeName}`})
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getAboardList () {
      this.$http.post(this.API.queryAboardList).then(res => {
        if (res.code === 0) {
          res.result.forEach((item) => {
            this.portRange.push({'value': `${item}`, 'title': `${item}`})
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getcruiseList (data) {
      this.$http.post(this.API.cruiseList, {
        data: data,
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.cruiseList = res.result.data
        }
      })
    },
    openSelect (mode) {
      this.isShowSelect = true
      this.mode = mode
      if (mode === 'sort') {
        this.maskTop = 430
      } else {
        this.maskTop = 626
      }
    },
    // 切换每个筛选条件的下标和对应值
    getAllSelect (item, index, value, cIndex) {
      // value: 当前选中值(传给后端的值) cIndex：当前选中下标
      this.selData[value] = item
      this.selIndex[cIndex] = index
      console.log(item)
    },
    dataSelect (item, index, value, cIndex) {
      this.selIndex[cIndex] = index
      this.selData.startDays = item.startDays
      this.selData.endDays = item.endDays
    },
    closeMask () {
      this.isShowSelect = false
      this.mode = ''
    },
    getRoutList(item) {
      this.selData.routeId = item.id
      this.confirm()
    },
    getSort (value, index) {
      this.selIndex.sortIndex = index
      this.selData.sortType = value
      this.confirm()
    },
    // 生成游玩月份
    getMonthRange () {
      for (let i = 0; i < 7; i++) {
        this.monthRange.push({'title': dayjs().add(i, 'month').format('YYYY年MM月'), 'value': dayjs().add(i, 'month').format('YYYY-MM-01')})
      }
    },
    confirm () {
      this.mode = ''
      this.isShowSelect = false
      this.getcruiseList(this.selData)
      this.reset()
    },
    goCruiseDetail (item) {
      wx.navigateTo({
        url: `/pages/cruise/cruiseDetail/main?productId=${item.id}`
      })
    }
  },
  components: {
    empty
  }
}
</script>
<style lang="scss" scoped>
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
      margin: 18rpx 0;
      line-height: 30rpx;
      text-align: center;
      border-right: 1rpx solid #dcdcdc;
      padding: 0 20rpx 0 40rpx;
      .icon{
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
        color: #353535;
      }
    }
  }
}
.area-box{
  padding: 30rpx;
  background: #fff;
  div {
    display: inline-block;
    position: relative;
    width: 150rpx;
    height: 150rpx;
    margin-right: 30rpx;
    img{
      width: 100%;
      height: 100%;
      border-radius: 15rpx;
    }
    p{
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      text-align: center;
      background: rgba(0,0,0,0.5);
      height: 40rpx;
      line-height: 40rpx;
      font-size: 26rpx;
      width: 100%;
      border-radius:  0 0 15rpx 15rpx;
      color: #fff;
    }
  }
  div:nth-child(4n){
    margin-right: 0;
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
  .sel-tab{
      // margin: 0 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #dcdcdc;
      .po-re{
        position: relative;
        color: #fff;
        font-size: 22rpx;
        margin: 30rpx 0 20rpx 0;
        .mainImg{
          width: 100%;
          height: 388rpx;
          display: block;
          border-radius: 5rpx;
        }
        .coinImg{
          position: absolute;
          right: 5rpx;
          top: 5rpx;
          width: 30rpx;
          height: 30rpx;
        }
        .left{
          position: absolute;
          top: 0;
          left: 0;
          span{
          height: 36rpx;
          text-align: center;
          display: inline-block;
          }
          span:nth-child(1){
          background: #f87350;
          min-width: 110rpx;
          border-radius: 5rpx 0 0 0;
          }
          span:nth-child(2){
          background: rgba(0,0,0,0.5);
          min-width: 85rpx;
          border-radius: 0 0 5rpx 0;
          }
        }
        .right{
          position: absolute;
          bottom: 20rpx;
          right: 0;
          width: 128rpx;
          height: 50rpx;
          background: #ff9913;
          font-size: 20rpx;
          text-align: center;
          .price{
          font-size: 30rpx;
          }
        }
    }
    .title{
      font-size: 28rpx;
      text-align: left;
      color: #353535;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .sec-title{
      font-size: 24rpx;
      color: #888;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      .cruise-icon{
        background: url('../../../../static/images/travelIndex.png');
        background-size: 300rpx 150rpx; 
        background-position: -5rpx -68rpx;
        width: 30rpx;
        height: 25rpx;
        display: inline-block;
        vertical-align: top;
        margin-top: 6rpx;
      } 
      .right{
        float:right;
        .col{
          color: #ff9913;
          margin-right: 20rpx;
        }
      }
    }
  }
  .sel-tab:last-child{
    border-bottom: none;
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
          min-width: 23%;
          background: #f4f4f4;
          text-align: center;
          border-radius: 5rpx;
          margin-top: 15rpx;
          margin-right: 2%;
        }
        div:nth-child(4){
          // margin-right: 0;
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
.icon{
  background: url('../../../../static/images/travelSort.png');
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
</style>