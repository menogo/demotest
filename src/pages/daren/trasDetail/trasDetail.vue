<template>
    <div class="page">
      <div class="banner">
        <swiper class="swiper"  interval="3000" duration="1000" :indicator-dots= false  autoplay="true">
          <block v-for="(item, index) in imgList"  :key="index" >
              <swiper-item>
                  <image :src="item" class="banner-img" mode='aspectFill'/>
              </swiper-item>
          </block>
        </swiper>
        <div class="po-bot">
          <p class="current-img">
            <i class="icon see-icon"></i>
            <span>{{travelNoteDetail.viewNum}}</span>
          </p>
        </div>
      </div>
      <div class="main-info">
        <p class="title">{{travelNoteDetail.title}}</p>
        <div class="header">
          <img :src="travelNoteDetail.photo || userLogo" alt="" class="header-img">
          <div class="name-box">
            <p class="name">{{travelNoteDetail.nickName}}</p>
            <p class="data">发布于{{travelNoteDetail.createTime}}</p>
          </div>
          <div :class="'follow ' + (travelNoteDetail.isFollow === 0 ? '' : 'gray')" v-if="travelNoteDetail.customerId != customerId" @click="followEvt(travelNoteDetail)">
            {{travelNoteDetail.isFollow === 0 ? '+关注':'已关注'}}
          </div>
          <div class="right'">
            <p class="space">{{travelNoteDetail.destination}}</p>
            <p class="commend"><span>{{commentNum}}</span>评论</p>
          </div>
        </div>
      </div>
      <div class="travel-info">
        <div class="main">
          <span class="tips">我的出行信息</span>
          <div class="left">
            <p>
              <i class="icon icon1"></i>
              出发时间：{{travelNoteDetail.travelTime}}
            </p>
            <p>
              <i class="icon icon2"></i>
              人均消费：{{travelNoteDetail.price}}元
            </p>
          </div>
          <div class="right">
            <p>
              <i class="icon  icon3"></i>
              出行人数：{{travelNoteDetail.travelNum}}人
            </p>
            <p>
              <i class="icon icon4"></i>
              出行天数：{{travelNoteDetail.travelDay}}天
            </p>
          </div>
        </div>
        
      </div>
      <div class="txt-info">
        <div>
          <rich-text :nodes="travelNoteDetail.content"></rich-text>
          <!-- <wxParse :content="travelNoteDetail.content" /> -->
        </div>
      </div>
      <!-- 评论 -->
      <!-- <div class="comment-box">
        <p class="title">
          <span>网友回复</span>
          <span >(1)</span>
          <i class="icon right-icon comment"></i>
          <span class="more" @click="toComment">查看全部</span>
        </p>
        <ul class="comment-list" >
          <li>
            <img :src="themeImg" class="head-img">
            <span class="name">15115455555</span>
            <p class="detail">很好</p>
          </li>
        </ul>
      </div> -->
      <div class="comment-box">
        <p class="title">评论({{travelNoteDetail.commentNum}}条)</p>
        <textarea name="" id="" cols="30" rows="10" class="push-comment" v-model="commentContent"></textarea>
        <button class="comment-btn" @click="pushComment">发表评论</button>
        <div class="com-modules">
          <div class="comment-item" v-for="(comment, cIndex) in commentData" :key="cIndex">
            <div class="first-main">
              <img :src="comment.photo ? (comment.urlPrefix + comment.photo) : userLogo" alt="" class="header-img">
              <div class="name">
                <p>{{comment.nickName}}</p>
                <p>{{comment.createTime}}</p>
              </div>
              <span class="reply" @click="replyOne(comment)" v-if="customerId !== comment.customerId">回复</span>
              <span class="reply" @click="deleteReplyOne(comment)" v-else>删除</span>
              <div class="main">{{comment.content}}</div>
            </div>
            <div class="sec-main" v-for="(commentItem, ciIndex) in comment.commentList" :key="ciIndex">
              <img :src="commentItem.photo ? (comment.urlPrefix + commentItem.photo) : userLogo" alt="" class="header-img">
              <div class="name">
                <p>{{commentItem.nickName}}</p>
                <p>{{commentItem.createTime}}</p>
              </div>
              <div class="main">{{commentItem.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="social-box">
        <div class="social-item" @click="goForward">
          <i class="icon10 zf-icon"></i>
          <span>{{travelNoteDetail.forwardNum}}</span>
        </div>
        <div class="social-item">
          <i class="icon10 pl-icon"></i>
          <span>{{commentNum}}</span>
        </div>
        <div class="social-item">
          <i class="icon10 dz-icon"></i>
          <span>{{travelNoteDetail.likeNum}}</span>
        </div>
      </div>
      <div class="comment-modal"  v-if="showReply">
        <div class="mask" @click="replyBlur"></div>
        <div class="content">
          <input class="input" type="text" :placeholder="replyText" :focus="showReply" v-model="commentModalContent"/>
          <div class="send-btn" @click.stop="replySend">发送</div>
        </div>
      </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import wxParse from 'mpvue-wxparse'
export default {
  data () {
    return {
      id: '',
      page: 1,
      imgList: [],
      travelNoteDetail: '',
      commentNum: 0,
      customerId: '',
      trasCustomerId: '',
      commentId: '', // 回复人id，默认无
      commentContent: '', // 评论内容
      commentModalContent: '', // 弹框评论内容
      commentData: [],
      showReply: false,
      userLogo: require('../../../../static/images/common/userlogo.png'),
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      traNoteImg: require('../../../../static/images/common/traNoteImg.jpg')
    }
  },
  onLoad(options) {
    this.id = options.id
    if (options.trasCustomerId) {
      this.trasCustomerId = parseInt(options.trasCustomerId) // 游记作者id
    }
  },
  onShow () {
    this.customerId = wx.getStorageSync('customerId')
    this.travelNoteDetail = ''
    this.imgList = []
    this.commentData = []
    this.getTrasNoteDetail(this.id)
    this.getCommentList()
  },
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/daren/trasDetail/main?id=${this.id}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  methods: {
    goForward () {
      wx.navigateTo({
        url: `/pages/daren/forward/main?id=${this.travelNoteDetail.id}`
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
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    /* eslint-disable */
    getTrasNoteDetail(id) {
      let type = 1 // 浏览他人游记
      if (this.customerId === this.trasCustomerId){
        type = 2  // 浏览自己游记
      }
      this.$http.post(this.API.travelNoteDetail, {
        data: {
          id: id,
          type: type
        }
      }).then(res => {
        if (res.code === 0) {
          this.travelNoteDetail = res.result
          this.travelNoteDetail.createTime = dayjs(this.travelNoteDetail.createTime).format('YYYY/MM/DD hh:mm')
          if (this.travelNoteDetail.photo) {
            this.travelNoteDetail.photo = `${this.travelNoteDetail.urlPrefix}${this.travelNoteDetail.photo}`
          } else {
            this.travelNoteDetail.photo = ''
          }
          let imgReg = /<img.*?(?:>|\/>)/gi
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
          let imgList = this.travelNoteDetail.content.match(imgReg)
          if (imgList) {
            imgList.forEach((imgList) => {
              let src = imgList.match(srcReg)
              this.imgList.push(src[1])
            })
          } else { // 默认图片
            this.imgList = [require('../../../../static/images/common/traNoteImg.jpg')]
          }
          this.travelNoteDetail.content = this.travelNoteDetail.content.replace(/<img/gi, '<img style="width:100%;height:auto"')
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    deleteReplyOne(comment) {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要删除该评论吗？',
        success: function (sm) {
          if (sm.confirm) {
            self.$http.post(self.API.travelNoteDelComment, {
              data: {
                id: comment.id
              }
            }).then(res => {
              if (res.code === 0) {
                wx.showToast({title: '删除成功'})
                setTimeout(() => {
                  self.commentData = []
                  self.getCommentList()
                }, 1000)
              } else {
                wx.showToast({title: res.message, icon: 'none'})
              }
            })
          }
        }
      })
    },
    replyOne(item) {
      this.showReply = true
      this.commentId = item.id
      this.replyText = `回复：${item.nickName}`
    },
    replySend () {
      this.showReply = false
      // 弹框回复
      this.reply(this.commentModalContent)
    },
    pushComment() {
      this.commentId = ''
      this.reply(this.commentContent)
    },
    replyBlur() {
      this.showReply = false
    },
    reply(content) {
      if (content.trim() === '') {
        wx.showToast({title: '请输入评论内容', icon: 'none'})
        return
      }
      this.$http.post(this.API.travelNotecomment, {
        data: {
          commentId: this.id,
          replyId: this.commentId,
          content: content
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({title: '评论成功'})
          this.commentContent = ''
          this.commentModalContent = ''
          setTimeout(() => {
            this.commentData = []
            this.getCommentList()
          }, 1000)
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    getCommentList() {
      // 获取评论列表
      this.$http.post(this.API.travelNotecommentList, {
        data: {
          commentId: this.id,
          currentPage: this.page,
          pageSize: 999
        }
      }).then(res => {
        if (res.code === 0) {
          this.commentNum = res.result.data.length
          this.commentData = this.commentData.concat(res.result.data)
        }
      })
    }
  },
  components: {
    wxParse
  }
}
</script>
<style lang="scss" scoped>
.page{
  padding-bottom: 98rpx;
}
.banner{
  position: relative;
  .swiper{
    height: 420rpx;
  }
  .banner-img{
    width: 100%;
    height: 420rpx;
  }
  .po-bot{
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 55rpx;
  }
  .current-img {
    position: absolute;
    color: #fff;
    font-size: 20rpx;
    right: 30rpx;
    bottom: 15rpx;
    background-color: rgba(0,0,0,0.8);
    width: 80rpx;
    height: 32rpx;
    line-height: 32rpx;
    vertical-align: top;
    border-radius: 30rpx;
    opacity: 0.4;
    .see-icon{
      background-position: -110rpx -11rpx;
      margin-left: 10rpx;
      margin-right: 5rpx;
      vertical-align: top;
      margin-top: 6rpx;
    }
  }
}
.icon{
  background: url('../../../../static/images/travelPerson/guide.png');
  background-size: 200rpx 200rpx;
  width: 25rpx;
  height: 25rpx;
  display: inline-block;
  vertical-align: middle;
}
.main-info{
  background: #fff;
  padding: 30rpx;
  .title{
    font-size: 32rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .header{
    margin-top: 30rpx;
    color: #333333;
    font-size: 30rpx;
    position: relative;
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
      width: 40%;
      .data{
        color: #999999;
        font-size: 22rpx;
      }
    }
    .follow{
      width: 120rpx;
      border: 1rpx solid #ff9913;
      color: #ff9913;
      height: 50rpx;
      line-height: 50rpx;
      display: inline-block;
      font-size: 26rpx;
      border-radius: 35rpx;
      text-align: center;
    }
    .follow.gray{
      border: 1rpx solid #ccc;
      color: #ccc;
    }
    .right{
      float: right;
      border-left: 1rpx solid #aaaaaa ;
      padding: 0 30rpx;
      .space{
        font-size: 32rpx;
      }
      .commend{
        color: #999999;
        font-size: 22rpx;
        span{
          font-size: 28rpx;
          color: #388ef8;
        }
      }
    }
  }
  
}
.travel-info{
  background: #fff;
  padding: 30rpx;
  .main{
    border: 1rpx solid #dcdcdc;
    border-radius: 10rpx;
    padding: 30rpx 30rpx 10rpx 30rpx;
    color: #666666;
    font-size: 24rpx;
    position: relative;
    .tips{
      position: absolute;
      top: -20rpx;
      left: 20rpx;
      background: #fff;
      width: 160rpx;
      text-align: center;
      font-size: 20rpx;
    }
    .left{
      width: 65%;
      display: inline-block;
      p{
        margin-bottom:20rpx;
      }
    }
    .right{
      display: inline-block;
      p{
        margin-bottom:20rpx;
      }
    }
  }
  .icon1, .icon2, .icon3, .icon4{
    vertical-align: top;
    margin-top: 6rpx;
  }
  .icon1{
    background-position: -1rpx -50rpx; 
  }
  .icon2{
    background-position: -57rpx -50rpx; 
  }
  .icon3{
    background-position: -30rpx -50rpx; 
  }
  .icon4{
    background-position: -86rpx -50rpx; 
  }
}
.txt-info{
  background: #fff;
  padding: 60rpx 30rpx;
}
.comment-box{
  background: #fff;
  padding: 40rpx 30rpx;
  margin-top: 20rpx;
  overflow: hidden;
  .title{
    font-size: 28rpx;
  }
  .push-comment{
    width: 690rpx;
    height: 160rpx;
    border: solid 1rpx #dcdcdc;
    box-sizing: border-box;
    padding: 20rpx;
    margin-top: 30rpx;
    font-size: 28rpx;
  }
  .comment-btn{
    width: 600rpx;
    margin-top: 30rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 32rpx;
    background-color: #fbb03b;
	  border-radius: 35rpx;
    color: #ffffff;
  }
  .com-modules{
    margin-top: 75rpx;
    padding-bottom: 30rpx;
    .comment-item{
      padding-top: 30rpx;
      border-top: 1rpx solid #dcdcdc;
      margin-bottom: 30rpx;
      .first-main, .sec-main{
        position: relative;
        .header-img{
          width: 60rpx;
          height: 60rpx;
          display: inline-block;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        .name{
          font-size: 26rpx;
          color: #333333;
          display: inline-block;
          p:nth-child(2){
            font-size: 20rpx;
            color: #666666;
            margin-top: 10rpx;
          }
        }
        .reply{
          position: absolute;
          color: #ff9913;
          font-size: 28rpx;
          top: 25rpx;
          right: 20rpx;
        }
        .main{
          color: #333333;
          font-size: 26rpx;
          // float: right;
          width: 89%;
          margin-top: 20rpx;
          margin-left: 80rpx;
          span{
            color: #388ef8;
          }
        }
      }
      .sec-main{
        width: 89%;
        // float: right;
        margin-top: 20rpx;
        margin-left: 80rpx;
      }
    }
    .comment-item:nth-child(1){
      margin-top: 0;
      border-top: none
    }
  }

}
.comment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .content {
    display: flex;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 10px 10px;
    background-color: #fff;
    z-index: 100;
    .input {
      flex: 1;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      margin-right: 10px;
      border-bottom: 1px solid #666;
    }
  }
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, .3);
}
.send-btn {
  line-height: 40px;
  text-align: center;
  padding: 0 10px;
  font-size: 14px;
  color: #ff9913;
}
.icon10{
  background: url('../../../../static/images/travelDetail.png');
  background-size: 300rpx 150rpx;
  width: 38rpx;
  height: 38rpx;
  display: inline-block;
  vertical-align: middle;
}
.social-box{
  background: #f4f4f4;
  height: 98rpx;
  line-height: 98rpx;
  position: fixed;
  bottom: 0;
  border-top: 1rpx solid #dcdcdc;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 60rpx;
  .social-item{
    flex-grow: 1;
    display: inline-block;
    font-size: 28rpx;
    color: #666666;
    justify-content:space-between;
    .zf-icon{
      background-position: 0rpx -78rpx;
      margin-right: 15rpx;
    }
    .pl-icon{
      background-position: -40rpx -78rpx;
      margin-right: 15rpx;
      vertical-align: text-top;
    }
    .dz-icon{
      background-position: -80rpx -78rpx;
      margin-right: 15rpx;
    }
  }
  .social-item:nth-child(2){
    text-align: center;
  }
  .social-item:last-child{
    text-align: right;
  }
}
</style>