<template>
    <div>
      <div class="select-box">
        <div class="select-input">
          <span v-if="currentCity" @click.stop="goCity">{{currentCity}}<i class="icon bot-icon"></i></span>
          <div class="po-re">
            <i class="icon sel-icon"></i>
            <input type="text" placeholder="搜索目的地/关键词" readonly="readonly" class="txt" v-model="searchTxt" @confirm="keyWordSearch">
          </div>
        </div>
      </div>
      <div class="select-main">
        <ul class="tab">
          <!-- <li @click="openSelect('guide')"   :class="{'active': mode === 'guide'}" >达人陪游<i class="icon bot-icon"></i></li> -->
          <li @click="openSelect('date')"  :class="{'active': mode === 'date'}">出发日期<i class="icon bot-icon"></i></li>
          <li @click="openSelect('sort')"   :class="{'active': mode === 'sort'}">综合排序<i class="icon bot-icon"></i></li>
          <li @click="openSelect('allSel')" :class="{'active': mode === 'allSel'}">筛选<i class="icon select-icon"></i></li>
        </ul>
      </div>
      <div class="dialog-mask" v-if="isShowSelect" @click="closeMask" :style="'top:' + maskTop + 'rpx'"></div>
      <div class="select" v-if="isShowSelect">
        <!-- <div class="select-frame sort"  v-if="mode === 'guide'">
          <ul class="sort-list" >
            <li>达人陪游</li>
          </ul>
        </div> -->
        <div class="select-frame" v-if="mode === 'date'">
          <div class="select-item">
            <p class="title">出行时间</p>
            <div class="price-sel">
              <div>
                <picker mode="date"
                  :value="selData.startTime"
                  end="2217-09-01" @change="bindDateChangeStart($event)" style="position:reletive">
                    <span>{{selData.startTime || '最早出发日期'}}</span>
                  </picker>
              </div>
              <i>——</i>
              <div>
                <picker mode="date"
                  :value="selData.endTime"
                  end="2217-09-01" @change="bindDateChangeEnd($event)">
                    <span>{{selData.endTime || '最晚出发日期'}}</span>
                  </picker>
              </div> 
            </div>
          </div>
        </div>
        <div class="select-frame sort"  v-if="mode === 'sort'">
          <ul class="sort-list" >
            <li :class="{'active': index === selIndex.sortIndex}"  v-for="(item, index) in sortRange" :key="index" @click="getSort(item.value, index)">{{item.title}}</li>
          </ul>
        </div>
        <div class="select-frame" v-if="mode === 'allSel'">
          <div class="select-item">
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.typeIndex}"
                    v-for="(item, index) in typeRange" :key="index" 
                    @click="getAllSelect(item.value , index, 'productType', 'typeIndex')">
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
          <div class="goods-card-item" @click="goGuideDetail(item)" v-for="(item, index) in guideList" :key = index>
            <div class="po-rel">
              <img :src="item.productUrl" alt="">
              <p>{{item.talentName}}</p>
            </div>
            <p class="goods-title">{{item.productName}}</p>
            <div class="price-box">
              <span class="symbol">￥</span>
              <span class="price">{{item.price}}</span>
              <span>起</span>
            </div>
            <span class="score">{{item.score}}分</span>
          </div>
        </div>
      </div>
      <empty :list = guideList></empty>
    </div>
</template>
<script>
import { GUIDE_SORT_RANGE_MAP } from '../../../utils/screen.js'
import utils from '../../../utils'
import empty from '@/components/common/empty'

export default {
  data () {
    return {
      currentCity: '',
      guideList: [],
      sortRange: GUIDE_SORT_RANGE_MAP, // 综合排序
      mode: '',
      maskTop: 0,
      selIndex: { // 筛选下标
        sortIndex: 0,
        typeIndex: 0
      },
      selData: { // 接口入参
        sortType: '', // 排序方式
        startTime: '', // 最早出发日期输入框
        endTime: '',
        productType: ''
      },
      // startTime: '', // 最早出发日期输入框
      // endDateInput: '', // 最晚出发日期输入框
      typeRange: [{'title': '不限', 'value': ''}, {'title': '达人陪游', 'value': '1'}, {'title': '私人导游', 'value': '2'}],
      isShowSelect: false, // 是否展示筛选框
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onShow () {
    if (wx.getStorageSync('selectCity')) {
      this.currentCity = wx.getStorageSync('selectCity')
    } else {
      if (!wx.getStorageSync('userCity')) { // 首次进入页面
        utils.getLocation().then(res => {
          this.currentCity = res.data.result.ad_info.city
        })
      } else {
        this.currentCity = wx.getStorageSync('userCity')
      }
    }
    this.getGuideList()
  },
  methods: {
    reset () {
      this.mode = ''
      this.selIndex.sortIndex = 0
      this.selIndex.typeIndex = 0
      this.selData.sortType = ''
      this.selData.startTime = ''
      this.selData.endTime = ''
      this.selData.productType = ''
      this.isShowSelect = false
    },
    bindDateChangeStart (res) {
      this.selData.startTime = res.mp.detail.value
      this.compareDay(this.selData.startTime, this.selData.endTime)
    },
    bindDateChangeEnd (res) {
      this.selData.endTime = res.mp.detail.value
      this.compareDay(this.selData.startTime, this.selData.endTime)
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
        this.selData.startTime = today
        this.selData.endTime = today
      } else {
        console.log('第二个大')
      }
    },
    openSelect (mode) {
      this.isShowSelect = true
      this.mode = mode
      // if (mode === 'sort') {
      //   this.maskTop = 535
      // }
      this.maskTop = 533
    },
    getSort (value, index) {
      this.selIndex.sortIndex = index
      this.selData.sortType = value
      this.confirm()
    },
    // 切换每个筛选条件的下标和对应值
    getAllSelect (item, index, value, cIndex) {
      // value: 当前选中值(传给后端的值) cIndex：当前选中下标
      this.selData[value] = item
      this.selIndex[cIndex] = index
    },
    closeMask () {
      this.isShowSelect = false
      this.mode = ''
    },
    confirm () {
      this.mode = ''
      this.isShowSelect = false
      this.getGuideList(this.selData)
    },
    getGuideList (data) {
      this.$http.post(this.API.myGuide, {
        data: {
          ...data,
          type: 1
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.guideList = res.result.data
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    goCity () {
      wx.navigateTo({
        url: `/pages/city/main`
      })
    },
    goGuideDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/guideDetail/main?id=${item.id}`
      })
    }
  },
  components: {
    empty
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
  padding:0 30rpx 30rpx 30rpx;
  .title{
    text-align: center;
    font-size: 34rpx;
  }
  .goods-card{
    display: flex;
    flex-wrap: wrap;
    .goods-card-item:nth-child(2n){
      margin-right: 0;
    }
    .goods-card-item{
      background: #fff;
      margin: 30rpx 20rpx 0 0 ;
      width: 335rpx;
      font-size: 24rpx;
      padding-bottom: 20rpx;
      border-radius: 10rpx;
      .po-rel {
        position: relative;
        img{
          width: 100%;
          height: 220rpx;
          margin: 0 auto;
          border-radius: 10rpx 10rpx 0 0;
          display: block;
        }
        p{
          position: absolute;
          bottom:0;
          color: #fff;
          width: 100%;
          text-align: center;
          font-size: 24rpx;
          height: 40rpx;
          line-height: 40rpx;
          background:rgba(0,0,0,0.5);
        }
      }
      .goods-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin:15rpx 0 10rpx 0;
        color: #353535;
        padding: 0 10rpx;
        height: 80rpx;
      }
      .price-box{
        margin-right:20rpx;
        margin-top: 10rpx;
        margin-left: 10rpx;
        font-size: 20rpx;
        color: #888;
        display: inline-block;
        .symbol{
          font-size: 20rpx;
          color: #f65631;
        }
        .price{
          font-size:30rpx;
          color: #f65631;
        }
      }
      .score{
        float: right;
        color: #ff9913;
        font-size: 24rpx;
        margin-top: 20rpx;
        margin-right: 10rpx;
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
    height: 250rpx;
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
    .price-sel{
      display: flex;
      margin-top: 24rpx;

      width: 100%;
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
  .select-frame.sort{
    height: 330rpx;
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
.empty-box{
  margin-top: 245rpx;
  img{
    width: 181rpx;
    height: 181rpx;
    margin: 0 auto;
    display: block;
  }
  p{
    color:#999999;
    font-size: 30rpx;
    margin-top: 30rpx;
    text-align: center;
  }
}
</style>