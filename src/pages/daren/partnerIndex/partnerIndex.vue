<template>
  <div>
    <div class="header-sort">
      <div class="select-main" v-if="curListType === 2">
        <ul class="tab tab-me">
          <li @click="toogleTab(2)" :class="{'active': tabActive === 2}">我发布的</li>
          <li @click="toogleTab(3)" :class="{'active': tabActive === 3}">我报名的</li>
        </ul>
      </div>
      <div class="select-main">
        <ul class="tab">
          <li @click="openSelect('type')"   :class="{'active': mode === 'type'}" >{{typeValue || '类型'}}<i class="icon2 bot-icon"></i></li>
          <li @click="openSelect('date')"  :class="{'active': mode === 'date'}">{{selData.startTime || '出发日期'}}<i class="icon2 bot-icon"></i></li>
          <li @click="openSelect('space')"   :class="{'active': mode === 'space'}">{{selData.destination || '目的地'}}<i class="icon2 bot-icon"></i></li>
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
                  <span>{{selData.startTime || '开始日期'}}</span>
                </picker>
              </div>
              <!-- <i>——</i>
              <div>
                <picker mode="date"
                        :value="selData.endTime"
                        end="2217-09-01" @change="bindDateChangeEnd($event)">
                  <span>{{selData.endTime || '结束日期'}}</span>
                </picker>
              </div> -->
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'type'">
          <div class="select-item">
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.typeIndex}"
                   v-for="(item, index) in sortRange" :key="index"
                   @click="getAllSelect(item.id , index, 'type', 'typeIndex')">
                {{item.typeName}}
              </div>
            </div>
          </div>
        </div>
        <div class="select-frame" v-if="mode === 'space'">
          <div class="select-item">
            <div class="dis-flex">
              <div :class="{'active': index == selIndex.hotDestinationIndex}"
                   v-for="(item, index) in hotDestinationList" :key="index"
                   @click="getAllSelect(item , index, 'destination', 'hotDestinationIndex')">
                {{item}}
              </div>
              <input class="input" type="text" placeholder="输入目的地" v-model="selData.destination" @focus="destinationFocus">
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span @click="reset">重置</span>
          <span @click="confirm">确认</span>
        </div>
      </div>
    </div>
    <div :class="'content-wrap ' + (curListType === 1 ? '':'top')">
      <div class="partner-box" @click="goPartnerDetail(item)" v-for="(item, index) in dataList" :key = index>
        <div class="title">
          <img :src="item.photo ? (item.urlPrefix + item.photo) : userLogo" alt="" class="header-img" mode='aspectFill' @click.stop="goPersonIndex(item)">
          <div class="name-box"  @click.stop="goPersonIndex(item)">
            <p class="name">{{item.nickName}}<img class="sex-icon" v-if="item.sex !== 0" :src="sexJson[item.sex]" alt=""></p>
            <p class="data" v-if="item.createTime">{{item.createTime}}</p>
          </div>
        </div>
        <div class="right'">
          <span class="follow-btn" style="margin-right: 20rpx" @click.stop="deletePartner(item)" v-if="item.customerId == customerId">删除</span>
          <span v-if="customerId !== item.customerId" :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt(item)">{{item.isFollow === 0 ? '关注+':'已关注'}}</span>
        </div>
        <div class="main-box">
          <image mode="aspectFill" :src="item.urlPrefix + item.typeImgUrl" alt="" class="bg-img"></image>
          <div class="main-info">
            <p class="title">{{item.title}}</p>
            <p class="main">{{item.content}}</p>
            <p class="date">{{item.departureTime}}<span>{{item.destination}}</span></p>
            <p class="time"> {{item.day}}天</p>
            <p class="travels-btn">{{item.typeName}}</p>
          </div>
        </div>
        <div class="msg-info">
          <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}<span class="newNum" v-if="item.newLikeNum > 0">+{{item.newLikeNum}}</span></span>
          <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}<span class="newNum" v-if="item.newCommentNum > 0">+{{item.newCommentNum}}</span></span>
          <div class="img-modules" @click.stop="showApplyListEvt(item)">
            <div class="img-box">
              <img :src="img.photo ? (item.urlPrefix + img.photo) : userLogo" v-if="iIndex <= 9" alt="" v-for="(img, iIndex) in item.applyPhotoList" :key="iIndex">
              <span class="newNum" style="margin-left: 0" v-if="item.newApplyNum > 0">+{{item.newApplyNum}}</span>
            </div>
            <span class="newNum" v-if="item.newApplyNum > 0">+{{item.newApplyNum}}</span>
            <span class="dots" v-if="item.applyPhotoList.length > 10">...</span>
            <span class="num">{{item.applyPhotoList.length}}人已报名</span>
          </div>
        </div>
      </div>
      <empty :list="dataList"></empty>
    </div>
    <applyListModal v-if="showApplyList" :list="applyList" @closed="closeApplyModal" @loadMore="loadMore" :loadEnd="applyLoadEnd"></applyListModal>
  </div>
</template>
<script>
  import applyListModal from '@/components/telent/applyListModal'
  import empty from '@/components/common/empty'
  export default {
    data () {
      return {
        page: 1,
        customerId: '', // 当前登录人的id
        applyListPage: 1, // 报名列表分页当前页
        mode: '',
        maskTop: 0,
        curListType: 1, // curListType => 1: 首页进入列表 2: 个人中心进入列表
        tabActive: 2, // 个人中心进来才有用
        isShowSelect: false, // 是否展示筛选框
        sortRange: [],
        hotDestinationList: [], // 热门目的地
        typeJson: {}, // 类型对象
        typeValue: '',
        selIndex: { // 筛选下标
          typeIndex: -1,
          hotDestinationIndex: -1
        },
        selData: { // 接口入参
          type: '', // 排序方式
          startTime: '', // 最早出发日期输入框
          endTime: '',
          destination: ''
        },
        dataList: [],
        applyList: [], // 参与人列表
        applyLoadEnd: false, // 是否加载完了
        showApplyList: false, // 展示报名列表标志
        userLogo: require('../../../../static/images/common/userlogo.png'),
        sexJson: {1: require('../../../../static/images/common/man_icon.png'), 2: require('../../../../static/images/common/woman.png')},
        themeImg: require('../../../../static/images/common/themeBg.jpg'),
        miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
      }
    },
    onLoad(options) {
      this.customerId = parseInt(wx.getStorageSync('customerId'))
      this.curListType = parseInt(options.type)
      this.getTypeList()
      this.getHotDestination()
    },
    onUnload() {
      Object.assign(this, this.$options.data())
    },
    onShow () {
      this.page = 1
      this.applyListPage = 1
      this.dataList = []
      this.showApplyList = false
      this.applyList = []
      this.applyLoadEnd = false
      this.getList()
    },
    onReachBottom () {
      this.getList()
    },
    components: {
      applyListModal,
      empty
    },
    methods: {
      getTypeList() {
        this.$http.post(this.API.partnerTypeList, {
          data: {}
        }).then(res => {
          if (res.code === 0) {
            this.sortRange = res.result.data
            res.result.data.forEach(item => {
              this.typeJson[item.id] = item
            })
          }
        })
      },
      randomNum (minNum, maxNum) {
        switch (arguments.length) {
          case 1:
            return parseInt(Math.random() * minNum + 1, 10)
            // eslint-disable-next-line no-unreachable
            break
          case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
            // eslint-disable-next-line no-unreachable
            break
          default:
            return 0
            // eslint-disable-next-line no-unreachable
            break
        }
      },
      getList() {
        let type
        // curListType = 1 值传1  curListType = 2 传tabActive值
        if (this.curListType === 1) {
          type = 1
        } else if (this.curListType === 2) {
          type = this.tabActive
        }
        let url = this.API.partnerList
        if (type === 2) {
          url = this.API.myPartnerList
        }
        this.$http.post(url, {
          data: {
            currentPage: this.page,
            pageSize: 10,
            type: type,
            typeId: this.selData.type,
            startTime: this.selData.startTime,
            endTime: this.selData.endTime,
            destination: this.selData.destination
          },
          showLoading: true
        }).then(res => {
          if (res.code === 0) {
            if (res.result.data.length > 0) {
              // 背景图片随机获取
              res.result.data.forEach(item => {
                item.typeImgUrl = item.typeImgUrl.split(',')
                let index = item.typeImgUrl.length > 0 ? this.randomNum(0, item.typeImgUrl.length - 1) : 0
                item.typeImgUrl = item.typeImgUrl[index]
                item.typeImgUrlIndex = index
              })
              this.dataList = this.dataList.concat(res.result.data)
              this.page++
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      getHotDestination() {
        this.$http.post(this.API.hotDestination, {
          data: {},
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.hotDestinationList = res.result
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      showApplyListEvt(item) {
        // 不是自己发布的，无法查看
        if (item.customerId !== this.customerId) {
          return
        }
        this.curApplyId = item.id
        this.getApplyList(() => {
          this.showApplyList = true
        })
      },
      loadMore() {
        this.getApplyList()
      },
      closeApplyModal() {
        this.showApplyList = false
        this.applyLoadEnd = false
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
      reset () {
        this.mode = ''
        this.typeValue = ''
        this.selIndex.typeIndex = -1
        this.selData.startTime = ''
        this.selData.endTime = ''
        this.selData.type = ''
        this.selData.destination = ''
        this.isShowSelect = false
        this.confirm()
      },
      confirm () {
        this.mode = ''
        this.isShowSelect = false
        this.page = 1
        this.dataList = []
        this.getList()
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
        if (value === 'type') {
          this.typeValue = this.sortRange[index].typeName
        }
      },
      openSelect (mode) {
        this.isShowSelect = true
        this.mode = mode
        // if (mode === 'sort') {
        //   this.maskTop = 535
        // }
        this.maskTop = 420
      },
      goPartnerDetail(item) {
        let type
        // curListType = 1 值传1  curListType = 2 传tabActive值
        if (this.curListType === 1) {
          type = 1
        } else if (this.curListType === 2) {
          type = this.tabActive
        }
        wx.navigateTo({
          url: `/pages/daren/partnerDetail/main?id=${item.id}&type=${type}&urlIndex=${item.typeImgUrlIndex}`
        })
      },
      likeEvt(item) {
        let type = item.isLike === 0 ? 1 : 2
        this.$http.post(this.API.partnerLike, {
          data: {
            type: type,
            likeId: item.id
          }
        }).then(res => {
          if (res.code === 0) {
            let like = item.isLike === 0 ? 1 : 0
            item.isLike = like
            if (like === 1) {
              item.likeNum++
            } else {
              item.likeNum--
            }
            this.dataList.splice(0, 0)
          }
        })
      },
      followEvt (item) {
        let type = item.isFollow === 0 ? 1 : 2
        this.$http.post(this.API.partnerFollow, {
          data: {
            type: type,
            followId: item.id
          }
        }).then(res => {
          if (res.code === 0) {
            let text = ''
            let like = item.isFollow === 0 ? 1 : 0
            item.isFollow = like
            if (like === 1) {
              text = '关注成功'
            } else {
              text = '取消成功'
            }
            wx.showToast({title: text})
            this.dataList.splice(0, 0)
          } else {
            wx.showToast({title: res.message, icon: 'none'})
          }
        })
      },
      toogleTab(index) {
        this.page = 1
        this.tabActive = index
        this.dataList = []
        this.getList()
      },
      destinationFocus() {
        this.selData.destination = ''
        this.selIndex.hotDestinationIndex = -1
      },
      deletePartner (item) {
        let self = this
        wx.showModal({
          title: '提示',
          content: '确定要删除吗？',
          success: function (sm) {
            if (sm.confirm) {
              self.$http.post(self.API.partnerEditStatus, {
                data: {
                  ids: item.id,
                  status: 3
                }
              }).then(res => {
                if (res.code === 0) {
                  wx.showToast({title: '删除成功'})
                  setTimeout(() => {
                    self.page = 1
                    self.dataList = []
                    self.dateList = {}
                    self.getList()
                  }, 1000)
                }
              })
            }
          }
        })
      },
      getApplyList(fn) {
        this.$http.post(this.API.partnerApplyList, {
          data: {
            currentPage: this.applyListPage,
            pageSize: 10,
            partnerId: this.curApplyId
          },
          showLoading: true
        }).then(res => {
          if (res.code === 0) {
            if (res.result.data.length > 0) {
              this.applyList = this.applyList.concat(res.result.data)
              this.applyListPage++
            } else {
              this.applyLoadEnd = true
            }
            fn && fn()
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      goPersonIndex(item) {
        if (item.talentStatus === 2) {
          wx.navigateTo({
            url: `/pages/daren/darenIndex/main?id=${item.customerId}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/meInfo/meIndex/main?id=${item.customerId}`
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-main{
    // padding: 0 30rpx 0 30rpx;
    background: #fff;
    font-size: 28rpx;
    position: relative;
    .icon2{
      background: url('../../../../static/images/travelSort.png');
      background-size: 200rpx 200rpx;
      background-position: -57rpx -10rpx;
      width: 20rpx;
      height: 12rpx;
      display: inline-block;
      vertical-align: middle;
    }
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
      li{
        min-width: 33%;
        text-align: center;
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
  .partner-box{
    background: #fff;
    padding: 30rpx;
    margin-top: 20rpx;
    position: relative;
    .title{
      color: #333333;
      font-size: 30rpx;
      .header-img{
        width: 90rpx;
        height: 90rpx;
        border-radius:50%;
        display: inline-block;
        vertical-align: middle;
      }
      .name-box{
        display: inline-block;
        margin-left: 24rpx;
        font-size: 32rpx;
        vertical-align: middle;
        .data{
          color: #999999;
          font-size: 22rpx;
        }
      }
    }
    .right{
      position: absolute;
      right: 30rpx;
      top: 50rpx;
      color: #388ef8;
      font-size: 30rpx;
    }
    .follow-icon, .msg-icon, .see-icon{
      width: 32rpx;
      height: 32rpx;
      background-position: 0 -62rpx;
      margin-right: 8rpx;
      margin-top: -8rpx;
    }
    .follow-icon{
      background-position: -19rpx -55rpx;
      &.active {
        width: 32rpx;
        height: 32rpx;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
        background-size: 100%;
      }
    }
    .msg-icon{
      background-position: -50rpx -55rpx;
    }
    .follow-btn{
      border: 1rpx solid #ff9913;
      border-radius: 30rpx;
      color: #ff9913;
      width: 100rpx;
      height: 40rpx;
      display: inline-block;
      text-align: center;
      line-height: 40rpx;
      font-size: 24rpx;
      &.gray {
        border-color: #999;
        color: #999;
      }
    }
    .main-box{
      margin-top: 20rpx;
      position: relative;
      .bg-img{
        width: 690rpx;
        height: 300rpx;
        display: block;
      }
      .main-info{
        color: #ffffff;
        font-size: 24rpx;
        position: absolute;
        top: 0;
        width: 690rpx;
        height: 300rpx;
        background: rgba(0,0,0,0.2);
        .title{
          overflow: hidden;
          text-overflow: ellipsis; //超出部分以省略号显示
          white-space: nowrap;
          width: 543rpx;
          text-align: center;
          margin: 0 auto;
          margin-top:10rpx;
          color: #ffffff;
          font-size: 32rpx;
        }
        .main{
          width: 622rpx;
          margin: 0 auto;
          overflow : hidden;
          text-align: center;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
          -webkit-box-orient: vertical;
        }
        .date{
          width: 520rpx;
          margin: 0 auto;
          margin-top:10rpx;
          span{
            float: right;
          }
        }
        .time{
          text-align: center;
          margin-top:10rpx;
          font-size: 30rpx;
        }
        .travels-btn{
          width: 190rpx;
          height: 40rpx;
          background-color: #fbb03b;
          border-radius: 20rpx;
          font-size: 24rpx;
          line-height: 40rpx;
          color: #ffffff;
          text-align:center;
          margin: 0 auto;
          margin-top: 10rpx;
        }
      }
    }
    .msg-info{
      font-size: 22rpx;
      color: #666;
      margin-top: 15rpx;
      .img-modules{
        float: right;
        margin-top: -5rpx;
        .img-box{
          display: inline-block;
          max-width: 250rpx;
          vertical-align: middle;
          margin-left: 100rpx;
          margin-right: 20rpx;
          img{
            width: 40rpx;
            height: 40rpx;
            display: inline-block;
            margin-left: -7rpx;
            border-radius: 50%;
            border: 1px solid #fff;
          }
        }
        .dots{
          color: #666666;
          font-size: 30rpx;
          margin:0 10rpx;
          line-height: 35rpx;
          vertical-align: top;
        }
        .num{
          color: #666666;
          font-size: 20rpx;
          vertical-align: middle;
        }
      }
    }
    .msg{
      margin-right: 20rpx;
      margin-left: 100rpx;
    }
  }
  .icon{
    background: url('../../../../static/images/travelPerson.png');
    background-size: 200rpx 100rpx;
    width: 50rpx;
    height: 50rpx;
    display: inline-block;
    vertical-align: middle;
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
          .input {
            width: 200rpx;
            margin: 20rpx;
            line-height: 60rpx;
            height: 60rpx;
            text-align: center;
            border-radius: 10rpx;
            background-color: #ddd;
          }
          div{
            height: 60rpx;
            line-height: 60rpx;
            background: #f4f4f4;
            text-align: center;
            border-radius: 5rpx;
            margin-top: 15rpx;
            margin-right: 2%;
            min-width: 20%;
            padding: 0 20rpx;

          }
          // div:nth-child(4){
          //   margin-right: 0;
          // }
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
  .tab-me {
    li {
      width: 50%;
      text-align: center;
      &.active {
        border-bottom: 2px solid;
      }
    }
  }
  .newNum {
    position: absolute;
    margin-top: -12rpx;
    margin-left: -24rpx;
    font-size: 20rpx;
    color: #fb3305;
  }
  .msg-info {
    .newNum {
      margin-left: 0;
    }
  }
  .sex-icon {
    width: 22rpx;
    height: 22rpx;
    margin-left: 5rpx;
    vertical-align: top;
    margin-top: 16rpx;
  }
  .header-sort {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .content-wrap {
    padding-top: 89rpx;
    &.top {
      padding-top: 178rpx;
    }
  }
</style>
