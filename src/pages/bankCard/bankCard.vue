<template>
    <div>
      <i-panel>
        <i-input v-model="accountName" title="开户姓名"  disabled right/>
        <i-input v-model="idCard" title="身份证" disabled right/>
        <i-input v-model="bankName" title="开户银行"  disabled right/>
        <i-input v-model="bankCard" title="银行卡号"  disabled right/>
        <i-input v-model="mobile" title="手机号码"  disabled right/>
      </i-panel>
      <button   class="next-btn" @click="deleteBankCard">删除银行卡</button>
    </div>
</template>
<script>
export default {
  data () {
    return {
      accountName: 'asd',
      idCard: 'asd',
      bankName: 'asd',
      bankCard: 'asd',
      mobile: 'asd'
    }
  },
  onShow () {
    this.getBankCardDetail()
  },
  methods: {
    getBankCardDetail () {
      this.$http.post(this.API.bankCardDetail, {
        data: {
          id: ''
        }
      }).then(res => {
        if (res.code === 0) {
        }
      })
    },
    deleteBankCard () {
      this.$http.post(this.API.deleteBankCard, {
        data: {
          id: ''
        }
      }).then(res => {
        if (res.code === 0) {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>


</style>

