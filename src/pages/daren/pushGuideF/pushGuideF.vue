<template>
    <div class="page">
      <div class="prd-modules">
        <!-- <div class="sel-box">
          <span class="left-lab">产品类型</span>
          <p class="right-lab">
            <span @click="tooglePrdCode(1)" class="select-item"><i class="icon single-select" :class="{'active': 1 === productType}"></i> 达人陪游</span>
            <span @click="tooglePrdCode(2)" class="select-item"><i class="icon single-select"  :class="{'active': 2 === productType}"></i> 私人陪游</span>
          </p>
        </div> -->
        <input type="text" placeholder="产品标题" class="txt-input" v-model="productName">
        <input type="text" placeholder="目的地" class="txt-input"  v-model="destination">
        <div class="sel-box mt40">
          <span class="left-lab">服务亮点</span>
          <div class="right-lab">
            <div class="pos-rel">
              <span type="text" class="item-label"
                    :class="{'active': item.isActive === true}"
                    v-for="(item, index) in labelList" :key = index 
                    @click="selectLabel(item)">
                {{item.name}}
              </span>
              <span class="item-label" @click="showMask"><i class="icon add-icon"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div class="img-modules">
        <p class="title">产品图片</p>
        <div class="img-box">
          <div class="img-item" @click="upload('prdPhoto1')">
            <img :src="prdPhoto1.src" alt="" v-if="prdPhoto1.src">
            <i class="icon img-icon" v-else></i>
          </div>
          <div class="img-item" @click="upload('prdPhoto2')">
            <img :src="prdPhoto2.src" alt="" v-if="prdPhoto2.src">
            <i class="icon img-icon" v-else></i>
          </div>
          <div class="img-item" @click="upload('prdPhoto3')">
            <img :src="prdPhoto3.src" alt="" v-if="prdPhoto3.src">
            <i class="icon img-icon" v-else></i>
          </div>
        </div>
      </div>
      <div class="date-modules">
        <p class="title">选择日期</p>
        <Calendar
          :months="months"
          :value="value"
          :begin="begin"
          @select="select"
          ref="calendar"
          multi="true"
          :almanacs="almanacs"
          :events="events"
        />
        <p class="price-box">
          <span>价格</span>
          <input type="text" v-model = "currentPrice">
          <span  class='save' @click="savePrice">保存</span>
        </p>
      </div>
      <div class="dialog-mask" v-if="isShowMask"></div>
      <div class="cus-box"   v-if="isShowMask">
        <p class="title">服务亮点</p>
        <p class="control">
          <span @click.stop="showCloseLab">删除</span>
          <span class="right"  @click.stop="hideMask">完成</span>
        </p>
        <div class="label-main">
          <div v-for="(item, index) in labelList" :key = index>
            <input type="text" :value="item.name" @blur="saveLabel(item)"  disabled="true">
            <i class="close-icon" v-if="isshowCloseLab" @click="delLabel(item)"></i>
          </div>
          <div v-if="isShowAddTxt">
            <input type="text" v-model="prdlabel" @blur="saveLabel">
          </div>
          <div  @click="showAddTxt">
            <span class="add">+</span>
          </div>
        </div>
      </div>
      <div class="btn-bg">
        <button class="save-btn" @click="goNext">保存到下一步</button>
      </div>
    </div>
</template>
<script>
import Calendar from '../../../components/calendar/calendarv.vue'
import '../../../components/calendar/style.css'
import Http from '../../../utils/http'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      status: '', // add 新增 edit 编辑
      guideId: '',
      // productType: 1, // 1：向导陪游 2：私人导游 2019/12/13已弃用
      productName: '',
      destination: '',
      productUrl: '',
      productLabel: '',
      prdlabel: '', // 服务亮点
      isShowAddTxt: false,
      isshowCloseLab: false,
      labelList: [],
      stockList: [], // 日期价格
      prdPhoto1: '',
      prdPhoto2: '',
      prdPhoto3: '',
      isShowMask: false,
      currentPrice: '', // 某日价格
      selectAllDate: [], // 所有选择日期
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      value: [],
      begin: [],
      // almanacs: {'10-3': '2033', '10-17': '12000'}, // 存放id
      // events: {'2019-10-7': '2033', '2019-10-8': '12000'}, // 自定义备注
      almanacs: {}, // 存放编辑的id
      events: {} // 价格备注
    }
  },
  onShow() {},
  mounted() {
    this.reset()
    this.guideId = this.$root.$mp.query.id
    if (!this.guideId) { // 新增
      this.status = 'add'
      this.selectAllDate = []
      this.getLabelList()
      this.renderer()
    } else { // 编辑
      this.status = 'edit'
      this.selectAllDate = []
      this.editLabelList()
    }
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
      console.log('val', val) // 当前选中日期
      console.log('val2', val2) // 所有选中日期
      this.selectAllDate = val2
    },
    savePrice () {
      if (this.selectAllDate.length > 0) {
        this.selectAllDate.forEach((item) => {
          item.events = this.currentPrice
          this.events[item.date] = this.currentPrice
        })
        console.log('this.selectAllDate', this.selectAllDate)
      }
      this.renderer()
    },
    reset () {
      // this.productType = 1
      this.productName = ''
      this.destination = ''
      this.labelList = ''
      this.prdPhoto1 = ''
      this.prdPhoto2 = ''
      this.prdPhoto3 = ''
      this.productUrl = ''
      this.productLabel = ''
      this.selectAllDate = []
      this.stockList = []
    },
    showAddTxt() {
      this.isShowAddTxt = true
    },
    showMask() {
      this.isShowMask = true
    },
    hideMask() {
      this.getLabelList()
      this.isShowMask = false
    },
    showCloseLab () {
      this.isshowCloseLab = !this.isshowCloseLab
    },
    selectLabel (item) {
      if (item.isActive === false) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    },
    saveLabel (item) {
      let data = {}
      data = {
        name: this.prdlabel
      }
      this.$http.post(this.API.saveLabel, {
        data: data
      }).then(res => {
        if (res.code === 0) {
          this.getLabelList()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
      this.prdlabel = ''
      this.isShowAddTxt = false
    },
    delLabel(item) {
      this.$http.post(this.API.delLabel, {
        data: {
          id: item.id
        }
      }).then(res => {
        if (res.code === 0) {
          this.getLabelList()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getLabelList(str) {
      this.$http.post(this.API.labelList, {
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.labelList = res.result.reverse()
          this.labelList.forEach((item) => { // 新建
            this.$set(item, 'isActive', false)
          })
          if (str !== '') { // 编辑
            let labArr = []
            labArr = str.split(',')
            this.labelList.forEach((item) => {
              labArr.forEach((ite) => {
                if (item.name === ite) {
                  item.isActive = true
                }
              })
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
    editLabelList () {
      this.$http.post(this.API.guideDetail, {
        data: {
          id: this.guideId
        }
      }).then(res => {
        if (res.code === 0) {
          let data = res.result
          let urlPrefix = res.result.urlPrefix
          wx.setStorageSync('nextFormData', res.result) // 编辑下一个页面用
          this.productName = data.productName
          // this.productType = data.productType
          this.destination = data.destination
          // 亮点
          this.getLabelList(data.productLabel)
          // 图片
          let productUrl = data.productUrl
          let photoArr = productUrl.split(',')
          this.prdPhoto1 = {
            src: `${urlPrefix}${photoArr[0]}`,
            upload: `${photoArr[0]}`
          }
          this.prdPhoto2 = {
            src: `${urlPrefix}${photoArr[1]}`,
            upload: `${photoArr[1]}`
          }
          this.prdPhoto3 = {
            src: `${urlPrefix}${photoArr[2]}`,
            upload: `${photoArr[2]}`
          }
          // 初始化日历展示
          data.stockList.forEach((item) => {
            // 日历入参数据
            this.stockList.push({'teamDate': item.teamDate, 'price': item.price, 'id': item.id})
            // this.value = [[2020, 1, 21], [2020, 1, 28]] // 默认选中日期
            // this.events = {'2019-10-7': '2033', '2019-10-8': '12000'} // 初始化价格
            // this.almanacs: {'10-3': '2033', '10-17': '12000'} // 编辑的id
            item.teamDate = dayjs(item.teamDate).format('YYYY,MM,DD').split(',')
            let y = item.teamDate[0]
            let m = item.teamDate[1]
            let d = item.teamDate[2]
            this.selectAllDate = []
            this.value.push([parseInt(y), parseInt(m), parseInt(d)]) // 编辑页点亮日期
            this.events[`${y}-${parseInt(m)}-${parseInt(d)}`] = item.price
            this.almanacs[`${parseInt(m)}-${parseInt(d)}`] = item.id
          })
          this.renderer()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // tooglePrdCode(index) {
    //   this.productType = index
    // },
    upload(str) {
      let self = this
      wx.chooseImage({
        success: function (res) {
          wx.showLoading()
          wx.uploadFile({
            url: Http.baseURL + '/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function (r) {
              r.data = JSON.parse(r.data)
              if (r.data.code === 0) {
                if (str === 'prdPhoto1') { // 产品图片1
                  self.prdPhoto1 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'prdPhoto2') { // 产品图片2
                  self.prdPhoto2 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
                if (str === 'prdPhoto3') { // 产品图片3
                  self.prdPhoto3 = {
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  }
                }
              } else {
                wx.showToast({
                  title: '上传失败',
                  icon: 'none'
                })
              }
            },
            complete() {
              wx.hideLoading()
            }
          })
        }
      })
    },
    goNext() {
      // 日期价格
      if (this.selectAllDate.length > 0) {
        this.stockList = []
        this.selectAllDate.forEach((item) => {
          item.date = dayjs(item.date).format('YYYY-MM-DD')
          if (item.almanac) { // 编辑页面有id
            this.stockList.push({'teamDate': item.date, 'price': item.events, 'id': item.almanac})
          } else { // 新增
            this.stockList.push({'teamDate': item.date, 'price': item.events})
          }
        })
        console.log('this.stockList', this.stockList)
      }
      if (!(this.stockList && this.stockList[0] && this.stockList[0].price)) { // 必须填写一天以上价格
        wx.showToast({
          title: '请添加日期价格',
          icon: 'none'
        })
        return
      }
      if (this.productName === '') {
        wx.showToast({
          title: '产品标题不能为空',
          icon: 'none'
        })
        return
      }
      if (this.destination === '') {
        wx.showToast({
          title: '目的地不能为空',
          icon: 'none'
        })
        return
      }
      let productLabel = []
      this.labelList.forEach((item) => {
        if (item.isActive === true) {
          productLabel.push(item.name)
        }
      })
      this.productLabel = productLabel.join(',')
      if (this.labelList.length < 1) {
        wx.showToast({
          title: '请添加服务亮点',
          icon: 'none'
        })
        return
      }
      if (this.productLabel === '') {
        wx.showToast({
          title: '请选择服务亮点',
          icon: 'none'
        })
        return
      }
      let productUrl = []
      if (this.prdPhoto1 !== '') {
        productUrl.push(this.prdPhoto1.upload)
      }
      if (this.prdPhoto2 !== '') {
        productUrl.push(this.prdPhoto2.upload)
      }
      if (this.prdPhoto3 !== '') {
        productUrl.push(this.prdPhoto3.upload)
      }
      this.productUrl = productUrl.join(',')
      if (this.productUrl === '') {
        wx.showToast({
          title: '请添加产品图片',
          icon: 'none'
        })
        return
      }
      let formData = {
        id: this.guideId,
        // productType: this.productType,
        productLabel: this.productLabel,
        productName: this.productName,
        destination: this.destination,
        productUrl: this.productUrl,
        stockList: this.stockList
      }
      wx.setStorageSync('formData', formData) // 入参
      wx.navigateTo({
        url: `/pages/daren/pushGuideS/main?id=${this.guideId}`
      })
    }
  },
  components: {
    Calendar
  }
}
</script>
<style lang="scss" scoped>
.prd-modules {
  background: #fff;
  padding: 40rpx 30rpx;
  .mt40 {
    margin-top: 40rpx;
  }
  .sel-box {
    .single-select,
    .single-select.active {
      background-position: -142rpx -48rpx;
      width: 26rpx;
      height: 26rpx;
      vertical-align: top;
      margin-top: 12rpx;
    }
    .single-select.active {
      background-position: -113rpx -48rpx;
    }
    .left-lab {
      font-size: 30rpx;
      margin-right: 15rpx;
      vertical-align: top;
    }
    .right-lab {
      font-size: 30rpx;
      color: #666666;
      display: inline-block;
      vertical-align: middle;
      max-width: 80%;
      .pos-rel{
        position: relative;
        display: inline-block;
        .item-label{
          width: 170rpx;
          height: 55rpx;
          text-align: center;
          border: solid 1rpx #aaaaaa;
          display: inline-block;
          margin-right: 20rpx;
          box-sizing: border-box;
          padding: 10rpx;
          font-size: 24rpx;
          margin-top: 10rpx;
        }
        .item-label.active{
          background: #fbb03b;
          color: #fff;
          border: solid 1rpx #fbb03b;
        }
        .item-label:nth-child(3n){
          margin-right: 0;
        }
        .add-icon {
          background-position: -165rpx -4rpx;
          width: 30rpx;
          height: 28rpx;
          margin-left: 5rpx;
        }
      }
      .select-item {
        margin-right: 100rpx;
      }
    }
  }
  .txt-input {
    border-bottom: 1rpx solid #aaa;
    font-size: 28rpx;
    margin-top: 40rpx;
    padding: 10rpx 10rpx;
  }
}
.img-modules {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-top: 20rpx;
  .title {
    font-size: 30rpx;
    margin-bottom: 25rpx;
  }
  .img-box {
    .img-item {
      width: 210rpx;
      height: 158rpx;
      border: dashed 1rpx #aaaaaa;
      display: inline-block;
      margin-right: 28rpx;
      position: relative;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
      .img-icon {
        background-position: 0 -81rpx;
        width: 80rpx;
        height: 63rpx;
        margin-top: 50rpx;
        margin-left: 65rpx;
      }
    }
    .img-item:last-child {
      margin-right: 0;
    }
  }
}
.date-modules {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-top: 20rpx;
  .title {
    font-size: 30rpx;
    margin-bottom: 25rpx;
  }
  .price-box {
    span {
      font-size: 30rpx;
    }
    input {
      display: inline-block;
      border-bottom: 1rpx solid #000;
      width: 200rpx;
      vertical-align: top;
      margin-left: 10rpx;
      text-align: center;
    }
    .save{
      width: 90rpx;
      height: 44rpx;
      line-height: 44rpx;
      color: #ff9913;
      font-size: 30rpx;
      border-radius: 5rpx;
      border: solid 1rpx #fbb03b;
      display: inline-block;
      margin-left:  20rpx;
      text-align: center;
      border-radius: 5rpx;
    }
  }
}
.dialog-mask{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 99999;
  animation: mymove .3s forwards;
}
.cus-box{
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99999999;
  box-sizing: border-box;
  height: 750rpx;
  overflow: auto;
  animation: mymove .3s forwards;
  .title{
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    background: #fff;
  }
  .label-main{
    background: #fff;
    padding: 0 40rpx;
    div{
      position: relative;
      display: inline-block;
      margin-right: 34rpx;
      width: 200rpx;
      input, span{
        display: inline-block;
        width: 200rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 5rpx;
        border:1rpx solid #aaaaaa;
        margin-top: 25rpx;
        text-align: center;
        font-size: 26rpx;
        vertical-align: middle;
      }
      span{
        margin-right: 0;
      }
      .add{
        font-size: 40rpx;
      }
      .close-icon{
        background: url('../../../../static/images/travelSort.png');
        background-size: 200rpx 200rpx;
        width: 32rpx;
        height: 35rpx;
        display: inline-block;
        vertical-align: middle;
        background-position: -133rpx -30rpx;
        position: absolute;
        top: 5rpx;
        right: -10rpx;
      }
    }
    div:nth-child(3n){
      margin-right: 0;
    }
  }
  .control{
    font-size: 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 40rpx;
    background: #fff;
    box-sizing: border-box;
    span{
      color: #388ef8;
    }
    .right{
      float: right;
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
.btn-bg {
  background: #fff;
  width: 100%;
  padding: 20rpx 0;
  .save-btn {
    background: #fbb03b;
    color: #fff;
    font-size: 28rpx;
    border: none;
    height: 80rpx;
    line-height: 80rpx;
    margin: 0 30rpx;
    border-radius: 50rpx;
    border-radius: 50rpx;
  }
}
.icon {
  background: url('../../../../static/images/travelPerson/guide.png');
  background-size: 200rpx 200rpx;
  display: inline-block;
  vertical-align: middle;
}
</style>
