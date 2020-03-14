<template>
    <div class="page">
      <ul class="ul-list" v-if="showType === 1">
        <!-- <li>
          <span>姓名：</span>
          <div>
          {{darenDetail.nickName}}
          </div>
        </li> -->
        <!-- <li> -->
          <!-- <span>介绍：</span> -->
          <!-- <div>{{darenDetail.remark}}</div> -->
          <rich-text :nodes="darenDetail.story"></rich-text>
        <!-- </li> -->
      </ul>
      <ul class="ul-list" v-if="showType === 2">
        <!-- <li>
          <span>姓名：</span>
          <div>
          {{customerDetail.nickName}}
          </div>
        </li> -->
        <!-- <li>
          <span>介绍：</span>
          <div>{{customerDetail.story}}</div>
        </li> -->
        <rich-text :nodes="customerDetail.story"></rich-text>
      </ul>
    </div>
</template>
<script>
export default {
  data () {
    return {
      id: '',
      darenDetail: '',
      customerDetail: '',
      showType: '' // 1:达人 2：普通用户
    }
  },
  onLoad(options) {
    this.id = parseInt(options.id)
    this.showType = parseInt(options.showType)
    if (this.showType === 1) { // 达人
      this.getDarenDetail()
      wx.setNavigationBarTitle({
        title: '向导的故事'
      })
    } else { // 普通用户
      this.getCustomer()
      wx.setNavigationBarTitle({
        title: '故事'
      })
    }
  },
  onShow () {},
  methods: {
    getDarenDetail (id) {
      this.$http.post(this.API.traPersonDetail, {
        data: {
          id: parseInt(this.id)
        }
      }).then(res => {
        if (res.code === 0) {
          this.darenDetail = res.result
          this.darenDetail.story = this.darenDetail.story.replace(/<img/gi, '<img style="width:100%;height:auto"')
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    getCustomer () {
      this.$http.post(this.API.customer, {
        data: {
          id: this.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          this.customerDetail = res.result
          this.customerDetail.story = this.customerDetail.story.replace(/<img/gi, '<img style="width:100%;height:auto"')
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  background: #fff;
  height: 100vh;
  padding: 40rpx 30rpx;
}
.ul-list{
  li{
    span{
      color: #333333;
      font-size: 32rpx;
    }
    div{
      display: inline-block;
      width: 80%;
      color: #333333;
      font-size: 32rpx;
      vertical-align: top;
    }
  }
}
</style>
