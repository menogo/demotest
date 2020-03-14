<template>
  <div class="page">
    <textarea name="" id="" cols="30" rows="10" placeholder="说说分享心得" class="txt" v-model = "txt" cursorSpacing="20" @input="handleKeyup($event)"></textarea>
    <div class="tras-box">
      <p class="author">@{{trasDetail.nickName}}</p>
      <p class="title">{{trasDetail.title}}</p>
      <img :src="trasImg" alt="">
    </div>
    <!-- <span @click="getFollow">@</span> -->
    <span type="button" class="btn" @click="confirm">发送</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      trasId: '',
      trasDetail: {},
      trasImg: '',
      txt: '',
      forwardPerson: []
    }
  },
  onLoad (options) {
    this.trasId = options.id
  },
  onShow () {
    this.getTrasNoteDetail()
    if (wx.getStorageSync('forwardPerson')) {
      this.forwardPerson = wx.getStorageSync('forwardPerson')
      this.txt = this.txt.replace(/[@]$/, `@${this.forwardPerson[this.forwardPerson.length - 1].name}`)
    }
  },
  methods: {
    handleKeyup(e) {
      if (e.target.keyCode === 64) {
        this.getFollow()
      }
    },
    getTrasNoteDetail () {
      this.$http.post(this.API.travelNoteDetail, {
        data: {
          id: this.trasId,
          type: 2
        }
      }).then(res => {
        if (res.code === 0) {
          this.trasDetail = res.result
          // 取主图
          /* eslint-disable */
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          let arr = this.trasDetail.content.match(imgReg)
          if (arr && arr[0]) {
            let src = arr[0].match(srcReg)
            this.trasImg = src[1] // 主图地址
          }
        }
      })
    },
    confirm () {
      console.log('this.txt', this.txt)
      console.log('111this.forwardPerson', this.forwardPerson)
      this.forwardPerson.forEach((item, index) => {
        if (this.txt.indexOf(item.name) > 0){ // 给@的人增加href标签
          this.txt = this.txt.replace(`@${item.name}`, `<a href=${item.id}>@${item.name}</a>`)
        } else {
          this.forwardPerson.splice(index, 1)
        }
      })
      let customerArr = []
      this.forwardPerson.forEach((item) => {
        customerArr.push(item.id)
      })
      console.log('customerArr', customerArr)
      console.log('customerArr.toString()', customerArr.toString())
      this.$http.post(this.API.forwardTras, {
        data: {
          forwardId: this.trasId,
          forwardContent: this.txt,
          notifyCustomer: customerArr.toString()
        }
      }).then(res => {
        if (res.code === 0) {
          this.txt = ''
          wx.redirectTo({
            url: `/pages/daren/travels/main`
          })
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
      wx.removeStorageSync('forwardPerson')
    },
    getFollow () {
      wx.navigateTo({
        url: `/pages/daren/forwardList/main`
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.page{
  height: 100vh;
  background: #fff;
}
.txt{
  padding: 30rpx;
  width: 100%;
  box-sizing: border-box;
}
.tras-box{
  background-color: #f4f4f4;
  padding: 0 30rpx;
  height: 200rpx;
  position: relative;
  .author{
    color: #333333;
    font-size: 32rpx;
    padding-top: 30rpx;
  }
  .title{
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #666666;
    width: 70%;
    overflow: hidden;   //隐藏
    white-space: nowrap;  //不换行
    text-overflow: ellipsis; //超出部分省略号
  }
  img{
    width: 200rpx;
    height: 200rpx;
    position: absolute;
    top: 0;
    right: 30rpx;
  }
}
.btn{
  width: 280rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 10rpx;
  margin: 0 auto;
  margin-top: 140rpx;
  background: #fbb03b;
  color: #fff;
  display: block;
  text-align: center;
  font-size: 36rpx;
}
.editor-box{
  position: relative;
  .ql-container {
    border: 1rpx solid #eee;
    padding: 80rpx 20rpx 20rpx 20rpx;
    box-sizing: border-box;
    width: 100%;
    height: 220rpx;
    font-size: 28rpx;
    line-height: 1.5;
  }
  .ql-active {
    color: #06c;
  }
}
</style>