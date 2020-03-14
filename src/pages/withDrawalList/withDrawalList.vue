<template>
    <div>
      <div class="amount-list">
        <div class="item" v-for="item in list">
          <div class="left">
            <div class="name">{{item.bankName}}</div>
            <div class="date">{{item.createTime}}</div>
          </div>
          <div class="right">
            <div class="name">提现金额：{{item.amount}}</div>
            <div class="date" >提现状态：<span style="color: #f9625b;">{{item.statusText}}</span><div v-if="item.status === 2" class="primary-text" @click="showReson(item.remark)">查看原因</div></div>
          </div>
        </div>
      </div>
      <empty :list = list></empty>
    </div>
</template>
<script>
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      page: 1,
      list: [],
      statusJson: { 0: '待审核', 1: '审核通过', 2: '审核驳回', 3: '提款成功', 4: '提款失败' }
    }
  },
  components: {
    empty
  },
  onShow () {
    this.page = 1
    this.list = []
    this.getList()
  },
  onReachBottom() {
    this.list.length === this.total || this.getList()
  },
  methods: {
    getList() {
      this.$http.post(this.API.withDrawalList, {
        data: {
          currentPage: this.page,
          pageSize: 10
        }
      }).then(res => {
        if (res.result.data.length > 0) {
          this.total = res.total
          this.page++
          res.result.data.forEach(item => {
            item.statusText = this.statusJson[item.status]
          })
          this.list = this.list.concat(res.result.data)
        }
      })
    },
    showReson(content) {
      wx.showModal({
        title: '原因',
        content,
        showCancel: false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .amount-list .item {
    display: flex;
    padding: 20rpx 30rpx;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    .right {
      width: 40%;
    }
    .left {
      flex: 1;
    }
    .right {
      text-align: right;
    }
    .date {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
    }
  }
  .primary-text {
    display: inline-block;
    color: #4eabf0;
    margin-left: 20rpx;
  }
</style>

