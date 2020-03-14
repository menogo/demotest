<template>
  <div class="page">
    <div class="card-box" @click="toogleCardList">
      <label for="">提现至</label>
<!--      <img :src="traNoteImg" alt="" class="bank-img">-->
      <input type="text" :placeholder="selectBank ? selectBank.bankName+'('+selectBank.bankCard+')' : '请选择银行卡'" disabled>
      <i class="icon right-icon"></i>
    </div>
    <div class="cash-box">
      <p class="title">最高可提现¥50000.00，每笔100元以上5元</p>
      <div class="cash-price">
        <span class="symbol">￥</span><input type="number" placeholder="请输入提现金额" v-model="amount" />
      </div>
      <p class="tips">
        <span>可提现金额 ¥{{withDrawalAmount}}</span>
        <span @click="fitAmount">全部提现</span>
      </p>
    </div>
    <button class="btn" @click="withDrawalEvt">确认提现</button>
    <div class="dialog-mask" v-if="showCardList" @click="toogleCardList"></div>
    <div class="cus-box"  v-if="showCardList" >
      <p class="title">选择到账银行卡<i class="icon close-icon"  @click="toogleCardList"></i></p>
      <ul class="card-list">
        <li v-for="(bank, index) in bankList" :key="index" @click="selectBankEvt(bank)">
<!--          <img :src="traNoteImg" alt="">-->
          <span>{{bank.bankName}}({{bank.bankCard}})</span>
        </li>
        <li @click="addBank" class="add-card">添加银行卡</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectBank: null,
      bankList: [],
      withDrawalAmount: 0,
      amount: '',
      showCardList: false,
      traNoteImg: require('../../../static/images/common/wechat.png')
    }
  },
  onShow() {
    this.getBankList()
  },
  onLoad() {
    this.getCustomer()
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    getCustomer () {
      this.$http.post(this.API.customer, {
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.withDrawalAmount = res.result.withdrawAmount
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getBankList() {
      this.$http.post(this.API.bankList, {
        data: {
          currentPage: 1,
          pageSize: 999
        }
      }).then(res => {
        res.result.data.forEach(item => {
          // 截取银行卡后4位
          item.bankCard = item.bankCard.substring(item.bankCard.length - 4)
        })
        this.bankList = res.result.data
      })
    },
    fitAmount() {
      if (this.withDrawalAmount <= 0) {
        wx.showToast({
          title: '暂无提现金额',
          icon: 'none'
        })
        return
      }
      this.amount = this.withDrawalAmount
    },
    toogleCardList() {
      this.showCardList = !this.showCardList
    },
    withDrawalEvt() {
      if (this.withDrawalAmount === 0) {
        wx.showToast({
          title: '暂无提现金额',
          icon: 'none'
        })
        return
      }
      if (!this.amount) {
        wx.showToast({
          title: '请输入金额',
          icon: 'none'
        })
        return
      }
      if (!this.selectBank) {
        wx.showToast({
          title: '请选择银行卡号',
          icon: 'none'
        })
        return
      }
      // 提现
      this.$http.post(this.API.withDrawal, {
        data: {
          amount: this.amount,
          bankCardId: this.selectBank.id
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '申请提现成功'
          })
          this.selectBank = null
          this.amount = ''
          this.getCustomer()
        } else {
          wx.showToast({
            title: res.message
          })
        }
      })
    },
    selectBankEvt(bank) {
      this.selectBank = bank
      this.toogleCardList()
    },
    addBank () {
      wx.navigateTo({
        url: '/pages/setUp/bankCardIdent/main?type=1'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  height: 100vh;
  background: #fff;
}
.card-box{
  height: 140rpx;
  line-height: 140rpx;
  background: #fff;
  padding: 0 30rpx;
  font-size: 32rpx;
  label{
    margin-right: 130rpx;
  }
  input{
    display: inline-block;
    vertical-align: text-top;
  }
  .right-icon{
    background-position: 0 0;
    float: right;
    margin-top: 50rpx;
  }
  .bank-img{
    width: 32rpx;
    height: 32rpx;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10rpx;
  }
}
.cash-box{
  border-top: 20rpx solid #f4f4f4;
  padding: 30rpx 45rpx;
  .title{
    color: #666;
    font-size: 28rpx;
  }
  .cash-price{
    border-bottom: 1rpx solid #dcdcdc;
    margin-top:50rpx;
    padding: 10rpx 0 ;
    .symbol{
      font-size: 50rpx;
    }
    input{
      display: inline-block;
      font-size: 36rpx;
      margin-left: 30rpx;
    }
  }
  .tips{
    color: #666666;
    font-size: 30rpx;
    margin-top: 50rpx;
    span:nth-child(2){
      color: #fbb03b;
      float: right;
    }
  }
}
.btn{
  margin: 100rpx 30rpx;
  background: #fbb03b;
  color: #fff;
  border-radius: 50rpx;
  font-size: 34rpx;
}
.icon{
  background: url('../../../static/images/cash.png');
  background-size: 200rpx 50rpx;
  display: inline-block;
  width: 22rpx;
  height: 35rpx;
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
    position: fixed;
    width: 100%;
  }
  .card-list{
    border-top: 1rpx solid #dcdcdc;
    margin-top: 90rpx;
    li{
      height: 100rpx;
      line-height: 100rpx;
      margin: 0 30rpx;
      border-bottom: 1rpx solid #dcdcdc;
      img{
        width: 22rpx;
        height: 22rpx;
        display: inline-block;
        margin-right: 10rpx;
      }
    }
    li.add-card{
      border: none;
      color: #fbb03b;
    }
  }
  .close-icon{
    background-position: -28rpx -2rpx;
    width: 32rpx;
    height: 32rpx;
    float: right;
    margin-top: 30rpx;
    margin-right: 20rpx;
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
</style>

