<template>
  <div class="page">
    <div class="look-around-box">
      <div class="title">
        <img :src="detailData.photo ? (detailData.urlPrefix + detailData.photo) : userLogo" alt="" class="header-img">
        <div class="name-box">
          <p class="name">{{detailData.nickName}}</p>
          <p class="data">{{detailData.createTimeStr}}</p>
        </div>
      </div>
      <div class="right'"><span :class="'follow-btn ' + (detailData.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt">{{detailData.isFollow === 0 ? '关注+':'已关注'}}</span></div>
      <div class="main forwardContent-text">
        <wxParse v-if="detailData.forwardCasualLook" :content="detailData.forwardContent" @navigate="navigate"/>
      </div>
      <div class="look-around-box forwardCasualLook-wrap" v-if="detailData.forwardCasualLook">
        <div class="img-box">
          <div class="img-pic-flex">
            <swiper @animationfinish="swiperChange">
              <swiper-item v-for="(url, uIndex) in  detailData.forwardCasualLook.imgUrl" :key="uIndex">
                <image mode="aspectFill" class="img" :src="detailData.urlPrefix + url" @click="previewImg(url)"></image>
              </swiper-item>
            </swiper>
            <div class="indicator-wrap" v-if="detailData.forwardCasualLook.imgUrl">{{detailData.curIndex}} / {{detailData.forwardCasualLook.imgUrl.length}}</div>
          </div>
        </div>
        <div class="main">
          <wxParse :content="detailData.forwardCasualLook.content" @navigate="navigate"/>
        </div>
        <div class="msg-info">
          <span class="location"><i class="icon location-icon"></i>{{detailData.forwardCasualLook.address}}</span>
          <span class="space">相距{{detailData.distance}}km</span>
          <!-- <div class="fr" style="float: right">
            <span class="msg" ><i class="icon msg-icon"></i>{{item.commentNum}}</span>
            <span class="follow" @click.stop="likeEvt(item)"><i :class="'icon follow-icon ' + (item.isLike === 1 ? 'active':'')"></i>{{item.likeNum}}</span>
          </div> -->
        </div>
        <div class="social-box" style="position: static;width: auto;">
          <div class="social-item">
            <i class="icon10 zf-icon"></i>
            <span>{{detailData.forwardCasualLook.forwardNum}}</span>
          </div>
          <div class="social-item" >
            <i class="icon10 pl-icon"></i>
            <span>{{detailData.commentNum}}</span>
          </div>
          <div class="social-item">
            <i :class="'icon10 dz-icon ' + (detailData.isLike === 1 ? 'active':'')"></i>
            <span>{{detailData.likeNum}}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="img-box">
          <div class="img-pic-flex">
            <swiper @animationfinish="swiperChange">
              <swiper-item v-for="(url, uIndex) in  detailData.imgUrl" :key="uIndex">
                <image mode="aspectFill" class="img" :src="detailData.urlPrefix + url" @click="previewImg(url)"></image>
              </swiper-item>
            </swiper>
            <div class="indicator-wrap" v-if="detailData.imgUrl">{{detailData.curIndex}} / {{detailData.imgUrl.length}}</div>
          </div>
        </div>
      </div>
      <div class="main">
        <wxParse v-if="detailData.content" :content="detailData.content" @navigate="navigate"/>
      </div>
      <div class="msg-info">
        <span class="location"><i class="icon location-icon"></i>{{detailData.address}}</span>
        <span class="space">相距{{detailData.distance}}km</span>
        <!-- <span class="follow" style="margin-left: 160rpx;" @click.stop="likeEvt"><i :class="'icon follow-icon ' + (detailData.isLike === 1 ? 'active':'')"></i>{{detailData.likeNum}}</span>
        <span class="msg"><i class="icon msg-icon"></i>{{detailData.commentNum}}</span> -->
      </div>
      <div class="like">
        <div class="img-flex">
          <img :src="img.photo ? (detailData.urlPrefix + img.photo) : userLogo" alt="" v-for="(img, iIndex) in detailData.photoList" v-if="iIndex <= 9" :key="iIndex">
        </div>
        <span class="omit" v-if="detailData.photoList && detailData.photoList.length > 10">...</span>
        <span class="like-txt">{{detailData.likeNum}}人喜欢</span>
      </div>
    </div>
    <div class="comment-box">
      <p class="title">评论({{detailData.commentNum}}条)</p>
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
            <!-- 暂时隐藏 -->
            <!-- <span class="reply" @click="deleteReplyOne(comment)" v-else>删除</span> -->
            <div class="main">{{comment.content}}</div>
          </div>
          <div class="sec-main" v-for="(commentItem, ciIndex) in comment.commentList" :key="ciIndex">
            <img :src="commentItem.photo ? (comment.urlPrefix + commentItem.photo) : userLogo" alt="" class="header-img">
            <div class="name">
              <p>{{commentItem.nickName}}</p>
              <p>{{commentItem.createTime}}</p>
            </div>
            <!-- <span class="reply" @click="replyOne(commentItem)">回复</span>-->
            <!-- <div class="main">回复<span> 你在干嘛 </span>:留言内容留言内容留言内容留言内容留言内容留言内留言内容留言内容留言内容留言内容留言内容留言内</div> -->
            <div class="main">{{commentItem.content}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="social-box">
      <div class="social-item" @click.stop="goForward">
        <i class="icon10 zf-icon"></i>
        <span>{{detailData.forwardNum}}</span>
      </div>
      <div class="social-item" @click.stop="replyOne(null)">
        <i class="icon10 pl-icon"></i>
        <span>{{commentNum}}</span>
      </div>
      <div class="social-item" @click.stop="likeEvt">
        <i :class="'icon10 dz-icon ' + (detailData.isLike === 1 ? 'active':'')"></i>
        <span>{{detailData.likeNum}}</span>
      </div>
    </div>
    <div class="comment-modal" v-show="showReply">
      <div class="mask"></div>
      <div class="content">
        <input class="input" type="text" :placeholder="replyText" :focus="showReply" v-model="commentModalContent" @blur="replyBlur"/>
        <div class="send-btn" @click="replySend">发送</div>
      </div>
    </div>
  </div>
</template>
<script>
  // import Utils from '../../../utils/util'
  import wxParse from 'mpvue-wxparse'
  export default {
    data () {
      return {
        commentNum: 0,
        replyText: '评论', // 输入框提示文字
        commentId: '', // 回复人id，默认无
        customerId: '',
        showReply: false,
        detailData: {},
        commentData: [],
        commentContent: '', // 评论内容
        commentModalContent: '', // 弹框评论内容
        page: 1,
        userLogo: require('../../../../static/images/common/userlogo.png'),
        themeImg: require('../../../../static/images/common/themeBg.jpg'),
        miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
      }
    },
    onLoad(options) {
      if (options.options) { // 从分享页面进入
        this.options = JSON.parse(options.options)
      } else {
        this.options = options
      }
      this.commentId = ''
      this.commentContent = ''
      this.commentModalContent = ''
      this.page = 1
      this.detailData = {}
      this.commentData = []
      this.customerId = wx.getStorageSync('customerId')
      this.getDetail()
      this.getCommentList()
    },
    onShow () {
    },
    components: {
      wxParse
    },
    onShareAppMessage (res) {
      let shareCode = wx.getStorageSync('customerCode') // 本人分享id
      return {
        title: '小鹿畅游',
        desc: '',
        path: `/pages/daren/lookAroundDetail/main?options=${JSON.stringify(this.options)}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
      }
    },
    methods: {
      navigate(href, e) {
        wx.navigateTo({
          url: `/pages/daren/darenIndex/main?id=${href}`
        })
      },
      swiperChange(e) {
        this.detailData.curIndex = e.mp.detail.current + 1
      },
      goForward () {
        let id = this.detailData.id
        if (this.detailData.forwardCasualLook) {
          id = this.detailData.forwardCasualLook.id
        }
        wx.navigateTo({
          url: `/pages/daren/lookForward/main?id=${id}`
        })
      },
      deleteReplyOne(comment) {
        let self = this
        wx.showModal({
          title: '提示',
          content: '确定要删除该评论吗？',
          success: function (sm) {
            if (sm.confirm) {
              self.$http.post(self.API.delCasualLookComment, {
                data: {
                  id: comment.id
                }
              }).then(res => {
                if (res.code === 0) {
                  wx.showToast({title: '删除成功'})
                  setTimeout(() => {
                    self.commentData = []
                    self.getDetail()
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
        item = item || {}
        this.showReply = true
        this.showTextarea = false
        this.commentId = item.id || ''
        let text = item.nickName ? `回复：${item.nickName}` : '请输入评论'
        this.replyText = text
        if (item) {
        }
      },
      replySend () {
        // 弹框回复
        this.reply(this.commentModalContent)
      },
      pushComment() {
        this.commentId = ''
        this.reply(this.commentContent)
      },
      replyBlur() {
        this.showReply = false
        this.showTextarea = true
      },
      reply(content) {
        if (content.trim() === '') {
          wx.showToast({title: '请输入评论内容', icon: 'none'})
          return
        }
        this.$http.post(this.API.commentCasualLook, {
          data: {
            commentId: this.options.id,
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
              this.getDetail()
              this.getCommentList()
            }, 1000)
          } else {
            wx.showToast({title: res.message, icon: 'none'})
          }
        })
      },
      likeEvt() {
        let item = this.detailData
        let type = item.isLike === 0 ? 1 : 2
        this.$http.post(this.API.likeCasualLookList, {
          data: {
            type: type,
            likeId: item.id
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.getDetail()
          }
        })
      },
      followEvt () {
        let item = this.detailData
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
            if (like === 1) {
              text = '关注成功'
            } else {
              text = '取消成功'
            }
            setTimeout(() => {
              this.getDetail()
            }, 1000)
            wx.showToast({title: text})
          } else {
            wx.showToast({title: res.message, icon: 'none'})
          }
        })
      },
      getDetail () {
        let curType = parseInt(this.options.type)
        let params = {
          id: this.options.id,
          type: curType
        }
        params.longitude = this.options.longitude || ''
        params.latitude = this.options.latitude || ''
        this.$http.post(this.API.casualLookDetail, {
          data: params
        }).then(res => {
          if (res.code === 0) {
            if (res.result.imgUrl) {
              res.result.imgUrl = res.result.imgUrl.split(',')
            }
            // 过滤时间
            // res.result.createTime = Utils.timestampFormat(res.result.createTime)
            if (res.result.forwardCasualLook) {
              // 处理转发图片地址
              res.result.forwardCasualLook.imgUrl = res.result.forwardCasualLook.imgUrl.split(',')
            }
            this.detailData = res.result
            this.$set(this.detailData, 'curIndex', 1)
          }
        })
      },
      previewImg(url) {
        let urls = []
        let imgs = []
        if (this.detailData.forwardCasualLook) {
          imgs = this.detailData.forwardCasualLook.imgUrl
        } else {
          imgs = this.detailData.imgUrl
        }
        imgs.forEach(item => {
          urls.push(this.detailData.urlPrefix + item)
        })
        wx.previewImage({
          urls,
          current: this.detailData.urlPrefix + url
        })
      },
      getCommentList() {
        // 获取评论列表
        this.$http.post(this.API.commentCasualLookList, {
          data: {
            commentId: this.options.id,
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
    }
  }
</script>
<style lang="scss" scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
  .page{
    padding-bottom: 100rpx;
  }
  .look-around-box:nth-child(1){
    margin-top: 0;
  }
  .look-around-box{
    background: #fff;
    padding: 50rpx 30rpx;
    margin-top: 20rpx;
    position: relative;
    .img-box{
      display: flex;
      padding: 20rpx 0;
      position: relative;
      margin: 20rpx -5px 0;
      .img1{
        flex: 1;
        margin-right: 15rpx;
        height: 312rpx;
      }
      .right-img{
        float: right;
        top:20rpx;
        left: 10rpx;
        image {
          width: 230rpx;
          height: 150rpx;
          display: block;
        }
        .img3{
          margin-top: 15rpx;
        }
      }
    }
    .main{
      font-size: 30rpx;
      margin-top: 10rpx;
    }
    .msg-info{
      font-size: 22rpx;
      color: #666;
      margin-top: 10rpx;
      .location{
        width: 300rpx;
        display: inline-block;
        vertical-align: top;
      }
      .space{
        margin-left: 20rpx;
      }
      // .follow{
      //   margin-left: 60rpx;
      // }
      .msg{
        float: right;
        margin-right: 5rpx;
      }
    }
    .like{
      margin-top: 20rpx;
      .img-flex{
        display: inline-block;
        max-width: 600rpx;
        img{
          width: 60rpx;
          height: 60rpx;
          display: inline-block;
          border-radius: 50%;
          margin-left: -7rpx;
        }
      }
      .omit{
        font-size: 30rpx;
        vertical-align: top;
        margin-left: 10rpx;
      }
      .like-txt{
        color: #333333;
        font-size: 22rpx;
        float: right;
        margin-top: 19rpx;
      }
    }
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
      color: #388ef8;
      font-size: 30rpx;
    }
    .location-icon, .follow-icon, .msg-icon, .see-icon{
      width: 20rpx;
      height: 20rpx;
      background-position: 0 -62rpx;
      margin-right: 8rpx;
      margin-top: -6rpx;
    }
    .follow-icon{
      background-position: -23rpx -63rpx;
      &.active {
        width: 25rpx;
        height: 25rpx;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
        background-size: 100%;
      }
    }
    .msg-icon{
      background-position: -51rpx -63rpx;
    }
    .see-icon{
      background-position: -75rpx -63rpx;
      width: 25rpx;
    }
    .follow-btn{
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
      &.gray {
        border-color: #999;
        color: #999;
      }
    }
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
  .icon{
    background: url('../../../../static/images/travelPerson.png');
    background-size: 200rpx 100rpx;
    width: 20rpx;
    height: 35rpx;
    display: inline-block;
    vertical-align: middle;
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
  swiper {
    height: 460rpx;
  }
  .indicator-wrap {
    position: absolute;
    right: 20rpx;
    bottom: 40rpx;
    color: #fff;
    background-color: rgba(0, 0, 0, .4);
    -webkit-border-radius: 30rpx;
    -moz-border-radius: 30rpx;
    border-radius: 30rpx;
    line-height: 1;
    padding: 10rpx 20rpx;
  }
  .img-pic-flex {
    position: relative;
    width: 100%;
    flex-wrap: wrap;
    padding: 0 10rpx;
    .img {
      width: 100%;
      height: 460rpx;
    }
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
    justify-content:space-between;
    .social-item{
      width: 33.333%;
      font-size: 28rpx;
      color: #666666;
      background: transparent;
      padding: 0;
      line-height: 98rpx;
      text-align: center;
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
        &.active {
          width: 40rpx;
          height: 40rpx;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACnklEQVRYR+2WS2gTURSG/5O5U1QKIpYiIlgUxZhJiwS66cpFlyrSzlR8lG4URHAjuBFfGBeCuBIX6kZEQietC8WdYJGqSH1AM6kIPuhCECpFkJLWeRyZQGPTPO7c2cSF2QX+77t/DvfeXEKLP9Ti9fG/wL87Ac82jgHoZ6CHgG4GpolRYOCT6OzI0t4Jb+X+4fHuLZ4fnAYjRcS7CdQRMmDMIMGvhVm8W2+/1UyAn3Wt8efabwA42WSDvgJwVVjOkzDj5dMmcZBl0M6GDGFCa3P304GPv1ZmqgqUHqS36Tp/jnoymHE5zBLhYlRGg95J1vu55XxVAdc2ZghIRpXFzD0VltNfU8C1jXMEZGNKlTAiPqWZxVvl6S2Tvp1+x+A9SqaY4XBz6pbTUynAjzPr/NLSQkxfLOzHYqJ90/D0QnkCv+10JgF+E8sUEwoC7m07VJwqFyjldnXpmvga0xUL0xK0nQYLXyp7wBs15kHYEMumDv0UllNeq1LAtY1JAvrUXeoEAy91yymv9XcCdmoQoLy6Lg7BprCKY1UFwi9ePn0bzMfjKCMzRHeEWThR9yYsjSe36n5iAqCuyEK14FtX8wfWDnyYrVtgxaX0jcGb1dzS9LywnI2rUw3fA55tPAKwT6qNEGDGlD7k9NaLNn2QuKPGJZV/urpdiHLCLBxu1FP6IvJs4yCAhxF+aE2EiK5oZuFCM1ZaIITd0VQfEU0qlWAeEUPFezImUoFQwmPJHX6g5QBkJNJZTeMjNFB8IVu85h6QAWxn1vu8dBOEow2yzxcRDLVbM99lrqbHUAb7eeM6M86syt0XljMsYyMfQ5nIz6fOMtO18hiJsppZOC9jlI+hTOjZ6RFQIBo9uWW88h6IIlTNRD4FquKo+ZYX+AP1jMghngiQ8wAAAABJRU5ErkJggg==") no-repeat;
          background-size: 100%;
        }
      }
      &:last-child {
        text-align: right;
      }
      &:first-child {
        text-align: left;
      }
    }
    button.social-item {
      text-align: left;
    }
    button.social-item::after {
      display: none;
    }
  }
  .icon10{
    background: url('../../../../static/images/travelDetail.png');
    background-size: 300rpx 150rpx;
    width: 38rpx;
    height: 40rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .forwardCasualLook-wrap.look-around-box {
    margin: 0 -30rpx;
    background-color: #f4f4f4;
    padding: 10rpx 30rpx 0 30rpx;
    overflow: hidden;
    .social-box {
      display: flex;
      text-align: right;
      justify-content: right;
      padding: 0;
      float: right;
      height: auto;
      border-top: 0;
      .social-item {
        width: 160rpx;
        text-align: right;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 1;
        padding: 20rpx;
      }
    }
  }
  .forwardContent-text {
    padding: 30rpx 0;
  }
</style>
