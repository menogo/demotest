<template>
    <div>
      <div class="travels-box" @click="goTravelsNoteDetail(item)" v-for="(item, index) in travelNoteList" :key = index>
        <!-- <div class="title">
          <img :src="item.photo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{item.nickName}}</p>
            <p class="date">{{item.createTime}}</p>
          </div>
        </div> -->
        <div class="title">
          <img :src="item.photo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{item.nickName}}</p>
            <p class="data">{{item.createTime}}</p>
          </div>
        </div>
        <!-- <div class="right" @click.stop="deleteNote(item)">删除</div> -->
        <div class="main-box">
          <div class="left">
            <p class="title">{{item.title}}</p>
            <!-- <p class="main">{{item.content}}</p> -->
            <rich-text :nodes="item.content" class="main"></rich-text>
          </div>
          <img :src="item.img || traNoteImg" alt="" class="right-img">
        </div>
        <div class="msg-info">
          <span class="location"><i class="icon see-icon"></i>{{item.viewNum}}</span>
          <span class="follow"  @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
          <span class="msg-mod"><i class="icon msg-icon"></i>{{item.commentNum}}</span>
        </div>
      </div>
    </div>
</template>
<script>

export default {
  data () {
    return {
      travelNoteList: [],
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg')
    }
  },
  onLoad () {
    this.getTravelsList()
  },
  methods: {
    likeEvt(item) {
      let type = item.isLike === 0 ? 1 : 2
      this.$http.post(this.API.travelNoteLike, {
        data: {
          type: type,
          likeId: item.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let like = item.isLike === 0 ? 1 : 0
          item.isLike = like
          if (like === 1) {
            item.likeNum++
          } else {
            item.likeNum--
          }
          this.travelNoteList.splice(0, 0)
        }
      })
    },
    /* eslint-disable */
    getTravelsList() {
      this.$http.post(this.API.myTravelNoteList, {
        data: {
          type: 2,
          currentPage: 1,
          pageSize: 20
        }
      }).then(res => {
        if (res.code === 0) {
          this.travelNoteList = res.result.data
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          this.travelNoteList.forEach((item) => {
            item.photo = `${item.urlPrefix}${item.photo}`
            // 获取第一张图片作为主图
            let arr = item.content.match(imgReg)
            if (arr && arr[0]) {
              let src = arr[0].match(srcReg)
              this.$set(item, 'img', src[1]) // src[1]为src地址
            }
            item.content = item.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
          })
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    deleteNote(item) {
      this.$http.post(this.API.deleteTravelNote, {
        data: {
          id: item.id
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({title: '删除成功'})
          this.getTravelsList()
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    goTravelsNoteDetail(item) {
      wx.navigateTo({
        url: `/pages/daren/trasDetail/main?id=${item.id}&trasCustomerId=${item.customerId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.travels-box{
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
    border: 1rpx solid #ff9913;
    border-radius: 30rpx;
    color: #ff9913;
    width: 100rpx;
    height: 40rpx;
    display: inline-block;
    text-align: center;
    line-height: 40rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
  }
  .follow-icon, .msg-icon, .see-icon{
    width: 32rpx;
    height: 30rpx;
    margin-right: 8rpx;
  }
  .follow-icon{
    background-position: -19rpx -58rpx;
    &.active {
      width: 32rpx;
      height: 35rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .msg-icon{
    background-position: -50rpx -59rpx;
  }
  .see-icon{
    background-position: -83rpx -57rpx;
    width: 30rpx;
    height: 30rpx;
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .left{
      width: 50%;
      .title{
        height: 95rpx;
        font-size: 30rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .main{
        height: 80rpx;
        font-size: 24rpx;
        color: #666;
        margin-top: 10rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .right-img{
      float: right;
      width: 320rpx;
      height: 200rpx;
      position: absolute;
      top: 10rpx;
      right: 0;
    }
  }
  .msg-info{
    font-size: 22rpx;
    color: #666;
    margin-top: 20rpx;
  }
  .follow{
    margin-left: 60rpx;
  }
  .msg-mod{
    margin-left: 60rpx;
  }
  .follow-btn{
    margin-left: 80rpx;
  }
}
.icon{
  background: url('../../../../static/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 50rpx;
  height: 50rpx;
  display: inline-block;
  vertical-align: top;
}
</style>