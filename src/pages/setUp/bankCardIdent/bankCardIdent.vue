<template>
  <div class="page">
    <div>
      <p class="title">请填写身份证和银行卡信息，用于完成认证</p>
      <i-panel>
        <i-input v-model="accountName" @change="inputChange($event, 'accountName')" title="开户姓名" maxlength="5" placeholder="请输入开户姓名"/>
        <!-- <i-input title="证件类型" placeholder="证件类型" disabled/> -->
        <i-input v-model="idCard" @change="inputChange($event, 'idCard')" title="身份证" maxlength="30" placeholder="请输入身份证号"/>
        <i-input v-model="bankName" @change="inputChange($event, 'bankName')" title="开户银行"  maxlength="30" placeholder="请输入开户银行"/>
        <i-input v-model="bankCard" @change="inputChange($event, 'bankCard')" title="银行卡号" maxlength="30" placeholder="请输入银行卡号"/>
        <i-input v-model="mobile" @change="inputChange($event, 'mobile')" title="手机号码" maxlength="30" placeholder="请输入手机号码"/>
      </i-panel>
      <button   class="submit" @click="saveBankCard">保存</button>
      <p class="tips">信息由小鹿网严格保密</p>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      type: '', // 1： 新增  2：修改
      accountName: '',
      idCard: '',
      bankName: '',
      bankCard: '',
      mobile: '',
      bank: {}, // 银行卡信息
      id: '' // 修改时入参要带上id
    }
  },
  onLoad (options) {
    this.type = options.type
    if (this.type === '2') {
      this.getCardDetail()
    }
  },

  methods: {
    inputChange(e, attr) {
      this[attr] = e.mp.detail.detail.value
    },
    getCardDetail () {
      this.$http.post(this.API.customer).then(res => {
        if (res.code === 0) {
          let bank = res.result.bank
          this.accountName = bank.accountName
          this.idCard = bank.idCard
          this.bankName = bank.bankName
          this.bankCard = bank.bankCard
          this.mobile = bank.mobile
          this.id = bank.id
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 新增
    saveBankCard () {
      let data = {
        bankName: this.bankName,
        accountName: this.accountName,
        bankCard: this.bankCard,
        idCard: this.idCard,
        mobile: this.mobile,
        id: this.id
      }
      let check = this.checkEmpty() === false ? false : true
      if (this.type === '2') {
        // 含星号说明没修改 不上传
        if (this.accountName.indexOf('*') > 0) { // 开户名
          delete data.accountName
        }
        if (this.bankCard.indexOf('*') > 0) { // 卡号
          delete data.bankCard
        }
        if (this.mobile.indexOf('*') > 0) { // 手机
          delete data.mobile
        }
      }
      if (check) {
        this.$http.post(this.API.saveBankCard, {
          data: data
          // data: {
          //   bankName: this.bankName,
          //   accountName: this.accountName,
          //   bankCard: this.bankCard,
          //   idCard: this.idCard,
          //   mobile: this.mobile,
          //   id: this.id
          // }
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: '保存成功'
            })
            wx.navigateBack({
              url: '/pages/me/main'
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    },
    checkEmpty () {
      if (this.accountName === '') {
        wx.showToast({
          title: '请填写开户姓名',
          icon: 'none'
        })
        return false
      }
      if (this.idCard === '') {
        wx.showToast({
          title: '请填写身份证号',
          icon: 'none'
        })
        return false
      }
      if (this.bankName === '') {
        wx.showToast({
          title: '请填写开户银行',
          icon: 'none'
        })
        return false
      }
      if (this.bankCard === '') {
        wx.showToast({
          title: '请填写银行卡号',
          icon: 'none'
        })
        return false
      }
      if (this.mobile === '') {
        wx.showToast({
          title: '请填写手机号码',
          icon: 'none'
        })
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    background: #f4f4f4;
  }
  .title{
    margin: 15rpx 30rpx;
    font-size: 26rpx;
    color: #888888;
  }
  .submit{
    background: #fbb03b;
    color: #fff;
    font-size: 28rpx;
    border: none;
    height: 80rpx;
    line-height: 80rpx;
    margin: 0 30rpx;
    margin-top: 125rpx;
  }
  .tips{
    font-size: 22rpx;
    text-align: center;
    color: #888888;
    margin-top: 20rpx; 
  }

</style>
