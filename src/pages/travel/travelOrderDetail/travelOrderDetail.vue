<template>
  <div class='page'>
    <ul class="order-list">
      <li @click="goTravelDetail">
        <p class="title">
          <img :src="detailData.logoImg" class="img" v-if="detailData.logoImg">
          <i-icon type="shop_fill" size="18" class="icon" v-else/>
          <span>{{detailData.merchantName}}</span>
          <!-- <span class="right"></span> -->
        </p>
        <div class="img-main">
          <img  :src="detailData.productImg">
          <div class="txt-right">
            <p>{{detailData.productName}}</p>
          </div>
        </div>
        <div class="txt-main">
          <p>出发时间： {{detailData.serviceTime}}</p>
          <p>行程天数： {{detailData.travelDays}}</p>
          <p>套餐包含：
            <span v-for="(ite, ind) in detailData.detailList" :key="ind">
              <span>{{ite.priceTypeName}}</span>
              <span>{{ite.num}}</span>
            </span>&emsp;
            <!-- <span v-if="detailData.agioNum > 0">
              <span>单房差</span>
              <span>{{detailData.agioNum}}</span>
            </span> -->
          </p>
          <p v-if="detailData.agioNum > 0">单房差：
            <span>{{detailData.agioPrice}} X {{detailData.agioNum}}</span>
          </p>
          <p v-if="detailData && detailData.serviceList && detailData.serviceList.length > 0">附加服务：
            <span v-for="(ite, ind) in detailData.serviceList" :key="ind">
              <span>{{ite.name}}</span>
              <span>{{ite.num}}</span>
            </span>&emsp;
          </p>
          <p class="right">合计：<span class="col">￥{{detailData.orderPrice}}</span></p>
        </div>
      </li>
    </ul>
    <ul class="model-box">
      <li class="title"><i class="line"></i>联系人信息</li>
      <li>
        <label>联系人</label>
        <span>{{detailData.contactName}}</span>
      </li>
      <li>
        <label>手机号</label>
        <span>{{detailData.contactMobile}}</span>
      </li>
    </ul>
    <div class="model-box" v-if="detailData.visitorList != ''">
      <p class="title"><i class="line"></i>出行人信息</p>
      <ul v-for="(item, index) in detailData.visitorList" :key = index>
        <li>
          <label>出行人</label>
          <span>{{item.visitorName}}</span>
        </li>
        <li>
          <label>身份证</label>
          <span>{{item.idCard}}</span>
        </li>
      </ul>
    </div>
    <ul class="model-box">
      <li>
        <label>订单金额</label>
        <span class="right">{{detailData.orderPrice}}</span>
      </li>
      <!-- <li>
        <label>积分</label>
        <span></span>
      </li> -->
    </ul>
    <div class="time">
      <p v-if="detailData.orderNo">订单编号：{{detailData.orderNo}}</p>
      <p v-if="detailData.createTime">创建时间：{{detailData.createTime}}</p>
      <p v-if="detailData.payTime">付款时间：{{detailData.payTime}}</p>
    </div>
    
    <div class="fixed-wrap" v-if="detailData.status === 1 || refundBtnShow || detailData.status === 4 || detailData.status === 5">
      <!-- 待付款状态可以取消订单 -->
      <span class="evaluate-btn" v-if="detailData.status === 1" @click="goPay()">付款</span>
      <span class="evaluate-btn" v-if="detailData.status === 1" @click="toogleCancelOrder">取消订单</span>

      <span class="evaluate-btn" v-if="refundBtnShow" @click="toogleRefund">退款</span>
      <!-- 待评价状态 -->
      <span class="evaluate-btn" v-if="detailData.status === 4" @click="goAddEvaluate">评价</span>
      <!-- 已评价状态 -->
      <span class="evaluate-btn" v-if="detailData.status === 5" @click="goSeeEvaluate">查看评价</span>
    </div>
    <div class="dialog" v-if="showRefund">
      <div class="input-box">
        <p class="title">确定要退款吗？</p>
        <textarea class="input" placeholder="请输入理由" v-model="refundDesc"></textarea>
        <div class="btn-box">
          <span class="close-btn"  @click="toogleRefund">取消</span>
          <span class="submit-btn" @click="cancleOrder(2)">确定</span>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="showCancelOrder">
      <div class="input-box">
        <p class="title">确定要取消订单吗？</p>
        <textarea class="input" placeholder="请输入理由" v-model="cancelDesc"></textarea>
        <div class="btn-box">
          <span class="close-btn"  @click="toogleCancelOrder">取消</span>
          <span class="submit-btn" @click="cancleOrder(1)">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Use Vuex
import dayjs from 'dayjs'
export default {
  data () {
    return {
      id: '', // 订单id
      productId: '', // 产品id
      detailData: '',
      refundBtnShow: false, // 是否展示退款按钮
      visitors: [], // 付款入参
      detailList: [], // 付款入参
      showRefund: false,
      showCancelOrder: false,
      refundDesc: '',
      cancelDesc: ''
    }
  },
  onLoad (options) {
    this.id = options.id
  },
  onShow () {
    this.cancelDesc = ''
    this.refundDesc = ''
    this.showRefund = false
    this.showCancelOrder = false
    this.refundBtnShow = false
    this.getDetail()
  },
  methods: {
    getDetail (id) {
      this.$http.post(this.API.travelDetail, {
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 0) {
          this.detailData = res.result
          this.detailData.serviceTime = this.detailData.serviceTime.substring(0, 10)
          if (this.detailData.status === 3) {
            // 待确认及待评价状态时，出行时间前一天可申请退款
            let serviceTime = dayjs(this.detailData.serviceTime).subtract(1, 'day') // 出行时间的前一天
            let nowtime = dayjs() // 当前时间
            if (serviceTime > nowtime) {
              this.refundBtnShow = true
            } else {
              this.refundBtnShow = false
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
    cancleOrder (status) {
      if (status === 1 && this.cancelDesc === '') {
        wx.showToast({
          title: '请输入取消理由',
          icon: 'none'
        })
        return
      }
      if (status === 2 && this.refundDesc === '') {
        wx.showToast({
          title: '请输入退款理由',
          icon: 'none'
        })
        return
      }
      this.$http.post(this.API.updateTraStatus, {
        data: {
          id: this.id,
          status: status === 1 ? 1 : 2, // 1-取消订单 2-申请退款
          refundDesc: status === 1 ? this.cancelDesc : this.refundDesc
        }
      }).then(res => {
        if (res.code === 0) {
          if (status === 1) {
            wx.showToast({
              title: '取消订单成功',
              icon: 'success'
            })
          }
          if (status === 2) {
            wx.showToast({
              title: '申请退款成功',
              icon: 'success'
            })
          }
          this.goback()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 订单支付
    goPay () {
      this.$http.post(this.API.wxPay, { // 微信支付下单
        data: {
          orderId: this.detailData.id,
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
    // showRefundDialog () {
    //   this.showRefund = true
    // },
    // closeRefund () {
    //   this.showRefund = false
    // },
    // showCancelDialog () {
    //   this.showRefund = true
    // },
    // closeCancel () {
    //   this.showRefund = false
    // },
    toogleRefund () {
      this.showRefund = !this.showRefund
    },
    toogleCancelOrder () {
      this.showCancelOrder = !this.showCancelOrder
    },
    goTravelDetail () {
      wx.navigateTo({
        url: `/pages/travel/travelDetail/main?parentId=${this.detailData.productId}`
      })
    },
    goAddEvaluate () {
      wx.navigateTo({
        url: `/pages/travel/addEvaluate/main?id=${this.id}&logoImg=${this.detailData.logoImg}&productId=${this.detailData.productId}`
      })
    },
    goSeeEvaluate () {
      wx.navigateTo({
        url: `/pages/travel/seeEvaluate/main?id=${this.id}`
      })
    },
    goback () {
      wx.navigateBack({
        url: '/pages/travel/traOrderList/main'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f4f4;
  margin-bottom: 0.8rem;
}
.order-list{
  background: #fff;
  font-size:24rpx;
  color:#353535;
  li{
    border-top: 20rpx solid #f4f4f4;
    padding: 0 30rpx;
    .title{
      height: 60rpx;
      line-height: 60rpx;
      vertical-align: middle;
      .right{
        float:right;
        margin-right: 10rpx;
      }
      .img{
        margin-right: 20rpx;
        display: inline-block;
        color: #888;
        width: 36rpx;
        height: 36rpx;
        vertical-align: middle;
      }
      .icon{
        margin-right: 20rpx;
        vertical-align: top;
        margin-top: -5rpx;
        display: inline-block;
        color: #888;
      }
    }
    .img-main{
      border-bottom: 1rpx solid #ccc;
      padding-bottom: 20rpx;
      img{
        width: 170rpx;
        height: 115rpx;
        display: inline-block;
      }
      .txt-right{
        display: inline-block;
        width: 70%;
        margin-left: 35rpx;
        vertical-align: top;
        p{
          .icon{
            display: inline-block;
            background: #ff9913;
            color: #fff;
            font-size: 20rpx;
            border-radius: 5rpx;
            padding: 0 5rpx;
          }
          display: inline-block;
          font-size:22rpx;
        }
      }
    }
    .txt-main{
      font-size: 22rpx;
      padding: 20rpx 0;
      position: relative;
      .right{
        position: absolute;
        right: 30rpx;
        top: 60rpx;
        .col{
          color: #ff9913;
        }
      }
    }
  }  
}
.model-box{
  background: #fff;
  margin-top: 20rpx;
  li{
    color: #ccc;
    border-bottom: 1rpx solid #ccc;
    height: 80rpx;
    line-height: 80rpx;
    margin: 0 30rpx;
    font-size: 22rpx;
    color: #000;
    label{
      width: 150rpx;
      display: inline-block;
    }
    span {
      color: #888;
    }
    span.right {
      color: #ff9913;
      float: right;
    }
  }
  .title{
    margin: 0;
    padding: 0 30rpx;
    color: #000;
    font-size: 24rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-bottom: 1rpx solid #ccc;
    .line{
      height: 25rpx;
      width: 6rpx;
      background: #ff9913;
      display: inline-block;
      vertical-align: middle;
      margin-top: -6rpx;
      margin-right: 20rpx;
    }
  }
  li:last-child{
    border-bottom: none;
  }
}
.model-box ul li:last-child {
  border-bottom: 1rpx solid #ccc;
}
.model-box ul:last-child li:last-child {
  border-bottom: none;
}
.time{
  margin-top: 20rpx;
  background: #fff;
  padding: 20rpx 30rpx;
  font-size: 22rpx;
  color: #888;
}
.btn-wrap {
  padding: 30rpx 30rpx;
  button{
    margin-bottom: 30rpx;
  }
}
.fixed-wrap{
  position: fixed;
  bottom: 0;
  background: #fff;
  height: 98rpx;
  line-height: 98rpx;
  width: 100%;
  display: flex;
  border-top: 1rpx solid #f4f4f4;
  .evaluate-btn{
    // flex-grow: 1;
    width: 158rpx;
    height: 55rpx;
    line-height: 55rpx;
    text-align: center;
    border-radius: 30rpx;
    display: inline-block;
    border: 1rpx solid #dcdcdc;
    font-size: 27rpx;
    color:#333;
    margin: auto;
  }
}
.dialog{
  position:fixed;
  top :0px;
  background-color: rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
  .input-box{
    width: 600rpx;
    height: 400rpx;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -300rpx;
    margin-left: -300rpx;
    border-radius: 10rpx;
    .title{
      text-align: center;
      font-size: 32rpx;
      margin-top: 35rpx;
    }
    .input{
      margin: 26rpx;
      border: 1rpx solid #aaaaaa;
      padding: 15rpx;
      height: 198rpx;
      font-size: 26rpx;
      box-sizing: border-box;
    }
    .btn-box{
      text-align: center;
      .close-btn, .submit-btn{
        width: 110rpx;
        height: 50rpx;
        line-height: 50rpx;
        color: #fff;
        border-radius: 5rpx;
        background: #fbb03b;
        font-size: 26rpx;
        display: inline-block;
      }
      .close-btn{
        margin-right: 25rpx;
        background: #dcdcdc;
        color: #333333;
      }
    }
  }
}
</style>
