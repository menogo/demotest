<template>
    <div>
      <!-- <img :src="trasNote" alt="" class="banner-img"> -->
      <banner :showSelect = "false" :flag = 8 ></banner>
      <div  v-for="(item, index) in travelNoteList" :key = index>
        <div class="travels-box"  @click="goTravelsNoteDetail(item ,1)" v-if="item.noteType === 1">
          <div class="title">
            <img :src="item.photo || userLogo" alt="" class="header-img" mode='aspectFill'  @click.stop="goPersonIndex(item)">
            <div class="name-box" @click.stop="goPersonIndex(item)">
              <p class="name">{{item.nickName}}</p>
              <p class="data">{{item.createTime}}</p>
            </div>
          </div>
          <div class="right" @click.stop="followEvt(item)" v-if="item.oneself === 2">
            <span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')">{{item.isFollow === 0 ? '关注+':'已关注'}}</span>
          </div>
          <div class="right" v-if="item.oneself === 1"><span class='follow-btn gray'>{{item.viewNum}}浏览</span></div>
          <div class="main-box">
            <div class="left">
              <p class="title">{{item.title}}</p>
              <rich-text :nodes="item.content" class="main"></rich-text>
            </div>
            <img :src="item.img || traNoteImg" alt="" class="right-img" >
          </div>
          <div class="msg-info">
            <span class="location" @click.stop="goForward(item, 1)"><i class="icon forward-icon"></i>{{item.forwardNum}}</span>
            <span class="follow"  @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
            <span class="msg-mod"><i class="icon msg-icon"></i>{{item.commentNum}}</span>
          </div>
        </div>
        <div class="travels-box2"  @click="goTravelsNoteDetail(item, 2)" v-if="item.noteType === 2">
          <div class="title2">
            <img :src="item.photo || userLogo" alt="" class="header-img" mode='aspectFill'  @click.stop="goPersonIndex(item)">
            <div class="name-box" @click.stop="goPersonIndex(item)">
              <p class="name">{{item.nickName}}</p>
              <p class="data">{{item.createTime}}</p>
            </div>
          </div>
          <div class="right" @click.stop="followEvt(item)" v-if="item.oneself === 2">
            <span :class="'follow-btn ' + (item.isFollow === 0 ? '' : 'gray')">{{item.isFollow === 0 ? '关注+':'已关注'}}</span>
          </div>
          <div class="right" v-if="item.oneself === 1"><span class='follow-btn gray'>{{item.viewNum}}浏览</span></div>
          <div class="forwardTxt">
            <wxParse :content="item.forwardContent" @navigate="navigate"/>
          </div>
          <div class="main-box">
            <div class="left">
              <p class="title">
                <a class="author" @click="goAuthor(item.forwardTravelNote.customerId)">@{{item.forwardTravelNote.nickName}}:</a>
                {{item.forwardTravelNote.title}}
              </p>
              <rich-text :nodes="item.forwardTravelNote.content" class="main"></rich-text>
            </div>
            <img :src="item.forwardTravelNote.img || traNoteImg" alt="" class="right-img">
            <div class="msg-info">
              <span class="location"><i class="icon forward-icon"></i>{{item.forwardTravelNote.forwardNum}}</span>
              <span class="follow" ><i class='icon follow-icon '></i>{{item.forwardTravelNote.likeNum}}</span>
              <span class="msg-mod"><i class="icon msg-icon"></i>{{item.forwardTravelNote.commentNum}}</span>
            </div>
          </div>
          <div class="msg-info2">
            <span class="location" @click.stop="goForward(item, 2)"><i class="icon forward-icon"></i></span>
            <span class="msg-mod"><i class="icon msg-icon"></i>{{item.commentNum}}</span>
            <span class="follow" ><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')" @click.stop="likeEvt(item)"></i>{{item.likeNum}}</span>
          </div>
        </div>
      </div>
      <empty :list = travelNoteList></empty>
    </div>
</template>
<script>
import banner from '@/components/common/banner'
import empty from '@/components/common/empty'
import wxParse from 'mpvue-wxparse'
export default {
  data () {
    return {
      // article: '<a href="">@baidu</a>',
      article: '<a href="baidu.com">@baidu</a>,<a href="google.com">@google</a>',
      // article: '<div>我是HTML代码</div>',
      customerId: '',
      travelNoteList: [],
      userLogo: require('../../../../static/images/common/userlogo.png'),
      trasNote: require('../../../../static/images/common/travelNote.jpg'),
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onLoad() {
    this.getTravelsList()
  },
  onShow () {
    this.customerId = wx.getStorageSync('customerId')
  },
  methods: {
    navigate(href, e) {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${href}`
      })
    },
    goAuthor (id) {
      wx.navigateTo({
        url: `/pages/daren/darenIndex/main?id=${id}`
      })
    },
    goForward (item, type) {
      if (type === 1) { // 首次转发
        wx.navigateTo({
          url: `/pages/daren/forward/main?id=${item.id}`
        })
      }
      if (type === 2) { // 二次以上转发
        wx.navigateTo({
          url: `/pages/daren/forward/main?id=${item.forwardTravelNote.id}`
        })
      }
    },
    goTravelsNoteDetail(item, type) {
      if (type === 1) { // 首次转发
        wx.navigateTo({
          url: `/pages/daren/trasDetail/main?id=${item.id}&trasCustomerId=${item.customerId}`
        })
      }
      if (type === 2) { // 二次以上转发
        wx.navigateTo({
          url: `/pages/daren/trasDetail/main?id=${item.forwardTravelNote.id}&trasCustomerId=${item.forwardTravelNote.customerId}`
        })
      }
    },
    goPersonIndex (item) {
      if (item.talentStatus === 2) {
        wx.navigateTo({
          url: `/pages/daren/darenIndex/main?id=${item.customerId}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/meInfo/meIndex/main?id=${item.customerId}`
        })
      }
    },
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
      this.$http.post(this.API.travelNoteList, {
        data: {
          type: 1,
          currentPage: 1,
          pageSize: 20
        },
        showLoading: true
      }).then(res => {
        if (res.code === 0) {
          this.travelNoteList = res.result.data
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          this.travelNoteList.forEach((item) => {
            if (item.customerId === this.customerId) {
              this.$set(item, 'oneself', 1) // 浏览本人的游记
            } else {
              this.$set(item, 'oneself', 2) // 浏览他人的游记
            }
            if (item.photo) {
              item.photo = `${item.urlPrefix}${item.photo}`
            }
            // 获取第一张图片作为主图
            let arr = item.content.match(imgReg)
            if (arr && arr[0]) {
              let src = arr[0].match(srcReg)
              this.$set(item, 'img', src[1]) // src[1]为主图地址
            }
            item.content = item.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
            if (item.forwardTravelNote) { // 转发原内容
              let data = item.forwardTravelNote
              let arr = data.content.match(imgReg)
              if (arr && arr[0]) {
                let src = arr[0].match(srcReg)
                this.$set(data, 'img', src[1]) // src[1]为主图地址
              }
              data.content = data.content.replace(/<img.*?(?:>|\/>)/gi, '') // 列表内容不展示图片
            }
          })
        }
      })
    },
    followEvt (item) {
      let type = item.isFollow === 0 ? 1 : 2
      this.$http.post(this.API.followCasualLookList, {
        data: {
          type: type,
          followId: item.customerId
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
    }
  },
  components: {
    banner,
    empty,
    wxParse
  }
}
</script>
<style lang="scss" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.banner-img{
  width: 100%;
  height: 330rpx;
}
.travels-box, .travels-box2{
  background: #fff;
  padding: 50rpx 30rpx;
  margin-top: 20rpx;
  position: relative;
  .title, .title2{
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
  .location-icon, .follow-icon, .msg-icon, .forward-icon{
    width: 32rpx;
    height: 32rpx;
    background-position: 0 -62rpx;
    margin-right: 8rpx;
  }
  .follow-icon{
    background-position: -19rpx -55rpx;
    &.active {
      width: 25rpx;
      height: 25rpx;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
      background-size: 100%;
    }
  }
  .msg-icon{
    background-position: -51rpx -55rpx;
  }
  .forward-icon{
    background-position: -80rpx -54rpx;
  }
  .follow-btn{
    border: 1rpx solid #ff9913;
    border-radius: 30rpx;
    color: #ff9913;
    width: 120rpx;
    height: 50rpx;
    display: inline-block;
    text-align: center;
    line-height: 50rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
    &.gray {
      border-color: #999;
      color: #999;
    }
  }
  .main-box{
    margin-top: 20rpx;
    position: relative;
    .left{
      width: 50%;
      height: 160rpx;
      .title{
        font-size: 30rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        .author{
          display: inline-block;
          color: deepskyblue;
        }
      }
      .main{
        height: 70rpx;
        font-size: 24rpx;
        color: #666;
        margin-top: 30rpx;
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
  .msg-info, .msg-info2{
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
.travels-box2{
  padding:0;
  padding-top: 25rpx;
  .title2{
    padding:0 30rpx;
  }
  .forwardTxt{
    padding: 30rpx;
  }
  .main-box{
    background: #f4f4f4;
    padding: 25rpx 30rpx;
    margin-top: 0;
    .left{
      height: 145rpx;
    }
    .right-img{
      top: 25rpx;
      right: 30rpx;
    }
  }
  .msg-info2{
    padding: 10rpx 30rpx 30rpx 30rpx;
    display: flex;
    .location, .follow, .msg-mod{
      flex-grow: 1;
    }
    .location{
      .forward-icon{
        transform:scale(1.2);
      }
    }
    .follow{
      text-align: right;
      .follow-icon{
        transform:scale(1.2);
      }
    }
    .msg-mod{
      text-align: center;
      .msg-icon{
        transform:scale(1.2);
      }
    }
  }
  .follow-icon{
    &.active {
      width: 35rpx;
      height: 40rpx;
    }
  }
}
.icon{
  background: url('../../../../static/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 50rpx;
  height: 50rpx;
  display: inline-block;
  vertical-align: middle;
  margin-top: -8rpx;
}
.wxParse .a{
  color: #222
}
</style>
