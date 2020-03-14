<template>
    <div>
      <div class="select-box">
        <div class="select-input">
          <!-- <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span> -->
          <div class="po-re">
            <i class="icon sel-icon"></i>
            <input type="text" placeholder="搜索关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch">
          </div>
        </div>
      </div>
      <div class="select-main">
        <ul class="tab">
          <li @click="openSelect('type')"   :class="{'active': mode === 'type'}" >服务类型<i class="icon bot-icon"></i></li>
          <li @click="openSelect('region')"  :class="{'active': mode === 'region'}">服务地<i class="icon bot-icon"></i></li>
          <li @click="openSelect('sort')"   :class="{'active': mode === 'sort'}">综合排序<i class="icon bot-icon"></i></li>
          <li @click="openSelect('allSel')" :class="{'active': mode === 'allSel'}">筛选<i class="icon select-icon"></i></li>
        </ul>
      </div>
      <div class="dialog-mask" v-if="isShowSelect" @click="closeMask" :style="'top:' + maskTop + 'rpx'"></div>
      <div class="select" v-if="isShowSelect">
        <div class="select-frame" v-if="mode === 'type'">
          <div class="select-item">
            <!-- <p class="title">服务类型</p> -->
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.serviceIndex}"
                    v-for="(item, index) in serviceType" :key="index" 
                    @click="getAllSelect(item.value , index, 'serviceType', 'serviceIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'region'">
          <div class="select-item">
            <!-- <p class="title">服务地区</p> -->
            <div class="dis-flex">
              <div :class="{'active': index === selIndex.serviceCityIndex}"
                    v-for="(item, index) in serviceCityList" :key="index" 
                    @click="getAllSelect(item.value , index, 'serviceCity', 'serviceCityIndex')">
                {{item.title}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame sort"  v-if="mode === 'sort'">
          <ul class="sort-list" >
            <li :class="{'active': index === selIndex.searchIndex}"  v-for="(item, index) in sortType" :key="index" @click="getSort(item.value, index)">{{item.title}}</li>
          </ul>
        </div>
        <div class="select-frame" v-if="mode === 'allSel'">
          <div class="select-item">
            <p class="title">性别</p>
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.sexIndex}"
                    v-for="(item, index) in sexList" :key="index" 
                    @click="getAllSelect(item.value , index, 'sex', 'sexIndex')">
                {{item.title}}
              </div>
            </div>
          </div><div class="select-item">
            <p class="title">从业时间</p>
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.workTimeIndex}"
                    v-for="(item, index) in workTimeList" :key="index" 
                    @click="getAllSelect(item.value , index, 'workTime', 'workTimeIndex')">
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
      <div class="guide-box">
        <div class="goods-card">
          <div class="goods-card-item" @click="goDarenDetail(item)" v-for="(item, index) in darenList" :key = index>
            <img :src="item.photo" alt="" mode='aspectFill'>
            <div class="right">
              <p class="title">{{item.realName}}</p>
              <p class="main">{{item.remark}}</p>
              <p class="type">{{item.serviceCity}}</p>
              <p class="type">从业：{{workTimeData[item.workTime + 1]}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { DAREN_SORT_RANGE_MAP, DAREN_TYPE_SELECT, DAREN_WORK_TIME, DAREN_SEX_RANGE_MAP } from '../../../utils/screen.js'
export default {
  data () {
    return {
      isShowSelect: false,
      maskTop: 0,
      mode: '',
      darenList: [],
      serviceType: DAREN_TYPE_SELECT, // 服务类型
      sortType: DAREN_SORT_RANGE_MAP, // 综合排序
      sexList: DAREN_SEX_RANGE_MAP,
      workTimeList: DAREN_WORK_TIME,
      serviceCityList: [{'value': '', 'title': '不限'}], // 服务地区
      workTimeData: ['1年', '2年', '3年', '3~5年', '5年以上'],
      searchTxt: '', // 搜索关键字
      currentCount: '', // 总页数
      selIndex: { // 筛选下标
        serviceIndex: 0,
        searchIndex: 0,
        serviceCityIndex: 0,
        sexIndex: 0,
        workTimeIndex: 0
      },
      selData: { // 接口入参
        status: 2,
        keyword: '',
        serviceType: 0,
        searchType: 1,
        serviceCity: '',
        sex: '',
        workTime: '',
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
    }
  },
  onShow () {
    this.darenList = []
    this.getServiceCityList()
    this.travelTalentTop(this.selData)
  },
  onReachBottom () {
    this.selData.currentPage = this.selData.currentPage + 1
    if (this.selData.currentPage >= this.currentCount) {
      console.log('已经到顶啦。。。。。')
    } else {
      this.travelTalentTop(this.selData)
    }
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    reset () {
      this.mode = ''
      this.selIndex.serviceIndex = 0
      this.selIndex.searchIndex = 0
      this.selIndex.serviceCityIndex = 0
      this.selIndex.sexIndex = 0
      this.selIndex.workTimeIndex = 0
      this.selIndex.workTimeIndex = 0
      this.selData.serviceType = 0
      this.selData.searchType = 1
      this.selData.serviceCity = ''
      this.selData.sex = ''
      this.selData.workTime = ''
      // this.serviceCityList = [{'value': '', 'title': '不限'}]
      this.isShowSelect = false
    },
    openSelect (mode) {
      this.isShowSelect = true
      this.mode = mode
      if (this.mode === 'sort') {
        this.maskTop = 500
      } else {
        this.maskTop = 583
      }
    },
    // 切换每个筛选条件的下标和对应值
    getAllSelect (item, index, value, cIndex) {
      // value: 当前选中值(传给后端的值) cIndex：当前选中下标
      this.selData[value] = item
      this.selIndex[cIndex] = index
    },
    travelTalentTop (data) {
      this.$http.post(this.API.travelTalentTop, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.darenList = this.darenList.concat(res.result.data)
          this.currentCount = res.result.currentCount
          this.darenList.forEach((item) => {
            item.photo = `${item.urlPrefix}${item.photo}`
            item.workTime = parseInt(item.workTime)
            item.serviceCity = item.serviceCity.split(',')[1]
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 按关键字搜索
    keyWordSearch () {
      this.selData.keyword = this.searchTxt
      let data = {
        keyword: this.searchTxt,
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页展示
      }
      this.darenList = []
      this.travelTalentTop(data)
    },
    getSort (value, index) {
      this.selIndex.searchIndex = index
      this.selData.searchType = value
      this.confirm()
    },
    // 获取筛选条件中的服务地区
    getServiceCityList() {
      this.$http.post(this.API.queryHotServiceCity).then(res => {
        if (res.code === 0) {
          res.result.forEach((item) => {
            item = item.split(',')[1]
            this.serviceCityList.push({'value': item, 'title': item})
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    confirm () {
      this.mode = ''
      this.isShowSelect = false
      this.darenList = []
      this.selData.currentPage = 1
      this.currentPage = ''
      this.travelTalentTop(this.selData)
    },
    goDarenDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${item.customerId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.select-main{
  padding: 0 30rpx 0 30rpx;
  background: #fff;
  font-size: 28rpx;
  position: relative;
  // border-bottom: 1rpx solid #dcdcdc;
  .tab{
    display: flex;
    height: 89rpx;
    line-height: 89rpx;
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
.guide-box{
  background: #fff;
  padding: 0 20rpx;
  margin-top: 20rpx;
  .goods-card{
    .goods-card-item{
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #dcdcdc;
      padding-top: 30rpx;
      img{
        width: 270rpx;
        height: 193rpx;
        display: inline-block;
      }
      .right{
        display: inline-block;
        width: 58%;
        vertical-align: top;
        margin-left: 20rpx;
        .title{
          font-size: 30rpx;
          color: #000000;
          height: 50rpx;
        }
        .main{
          height: 44rpx;
          margin-top: 10rpx;
          color:#666666;
          font-size: 26rpx;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .type{
          height: 44rpx;
          margin-top: 10rpx;
          color:#333;
          font-size: 26rpx;
        }
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
    height: 300rpx;
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
        text-align: center;
      }
      li.active{
        color: #ff9913;
      }
      li:last-child{
        border-bottom:none;
      }
    }
  }
  // .select-frame.sort{
  //   height: 290rpx;
  // }
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

</style>