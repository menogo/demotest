<template>
    <div>
      <div class="travels-box">
        <div class="main-box">
          <image mode="aspectFill" :src="detailData.urlPrefix + detailData.typeImgUrl" alt="" class="bg-img"></image>
          <div class="main-info">
            <p class="travels-btn">{{detailData.typeName}}</p>
            <p class="title">{{detailData.title}}</p>
            <div class="header">
              <img :src="detailData.photo ? (detailData.urlPrefix + detailData.photo):userLogo" alt="" class="header-img">
              <div class="name-box">
                <p class="name">{{detailData.nickName}}
                  <img class="sex-icon" v-if="detailData.sex !== 0" :src="sexJson[detailData.sex]" alt="" />
                  <span class="cer-item" v-if="detailData.isCertified === 1"><i class="cer-icon"></i>已实名</span>
                </p>
                <p class="date">{{detailData.createTime}}</p>
              </div>
              <div class="right">
                <span :class="'follow-btn ' + (detailData.isFollow === 0 ? '' : 'gray')" @click.stop="followEvt">{{detailData.isFollow === 0 ? '关注+':'已关注'}}</span>
                <!-- <p>已关注 {{detailData.followNum}}</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="msg-box">
        <div class="msg-item">
          <div>
            <i class="icon cxsj-icon"></i>
            <span>出行时间</span>
            <span class="time">{{detailData.departureTime}}</span>
          </div>
          <div class="w39">
            <i class="icon cxts-icon"></i>
            <span>出行天数</span>
            <span class="time">{{detailData.day}}天</span>
          </div>
          <div>
            <i class="icon lxfs-icon"></i>
            <span>联系方式</span>
            <span class="time" v-if="detailData.isApply === 0">报名后可见</span>
            <span class="time" v-else>{{detailData.contact}}</span>
          </div>
          <div class="w39">
            <i class="icon mdd-icon{"></i>
            <span>目的地</span>
            <span class="time">{{detailData.destination}}</span>
          </div>
        </div>
        <!-- <div style="float: right; padding-right: 20rpx"><span class="follow" @click.stop="likeEvt"><i :class="'person-icon follow-icon ' + (detailData.isLike === 1 ? 'active':'')"></i>{{detailData.likeNum}}</span></div> -->
        <div class="signup-box">
          <!-- <p class="title" v-if="detailData.applyPhotoList">{{detailData.applyPhotoList.length}}人已报名</p> -->
          <span class="signup-btn" @click="applyEvt" v-if="detailData.isApply === 0">立即报名</span>
         <!-- 暂时隐藏 -->
         <!-- <span class="signup-btn" style="background-color: #ddd" @click="cancelApplyEvt" v-if="detailData.isApply === 1">取消报名</span> -->
          <div class="header-img-box" v-if="detailData.applyPhotoList" @click="showApplyListEvt">
            <img :src="detailData.urlPrefix + item.photo" alt="" v-if="pIndex <= 4" v-for="(item, pIndex) in detailData.applyPhotoList" :key = pIndex>
            <span class="dots" v-if="detailData.applyPhotoList.length > 4">...</span>
            <span class="title" v-if="detailData.applyPhotoList">{{detailData.applyPhotoList.length}}人已报名</span>
          </div>
        </div>
        <div class="main-msg">{{detailData.content}}</div>
      </div>
      <div class="comment-box">
        <p class="title">留言 ({{detailData.commentNum}}条)</p>
        <textarea name="" id="" cols="30" rows="10" class="push-comment" v-model="commentContent" v-if="showTextarea"></textarea>
        <div class="push-comment" v-else>{{commentContent}}</div>
        <button class="comment-btn" @click="pushComment">提交留言</button>
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
              <!-- <span class="reply" @click="replyOne(commentItem)">回复</span> -->
              <!-- <div class="main">回复<span> 你在干嘛 </span>:留言内容留言内容留言内容留言内容留言内容留言内留言内容留言内容留言内容留言内容留言内容留言内</div> -->
              <div class="main">{{commentItem.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-modal" v-show="showReply">
        <div class="mask"></div>
        <div class="content">
          <input class="input" type="text" :placeholder="replyText" :focus="showReply" v-model="commentModalContent" @blur="replyBlur"/>
          <div class="send-btn" @click="replySend">发送</div>
        </div>
      </div>
      <!-- 报名弹框 -->
        <div class="apply-modal" style="z-index: 999" v-if="showApply">
          <div class="mask"></div>
          <div class="apply-content">
            <div class="apply-close" @click="closeApply"></div>
            <div class="input-wrap">
              <span class="label">联系方式</span>
              <input class="input" type="text" placeholder="手机号码/微信号/QQ" v-model="apply.mobile" />
            </div>
            <div class="input-wrap">
              <span class="label">性别</span>
              <div class="flex: 1">
                <span @click="sexEvt(1)" class="select-item"><i class="guide-icon single-select" :class="{'active': 1 === apply.sex}"></i> 男</span>
                <span @click="sexEvt(2)" class="select-item"><i class="guide-icon single-select"  :class="{'active': 2 === apply.sex}"></i> 女</span>
              </div>
            </div>
            <!-- <div class="input-wrap">
              <span class="label">电话</span>
              <input class="input" type="text" placeholder="请输入电话" v-model="apply.mobile" />
            </div> -->
            <div class="input-wrap">
              <span class="label">留言</span>
              <input class="input" type="text" placeholder="请输入" v-model="apply.remark">
              <!-- <textarea cols="30" rows="10" class="textarea" placeholder="留言" v-model="apply.remark"></textarea> -->
            </div>
            <button class="comment-btn bm-btn" @click="submitApply">报名</button>
          </div>
        </div>
      <applyListModal v-if="showApplyList" :list="applyList" @closed="closeApplyListModal" @loadMore="loadMore" :loadEnd="applyLoadEnd"></applyListModal>
    </div>
</template>
<script>
import applyListModal from '@/components/telent/applyListModal'
export default {
  data () {
    return {
      applyListPage: 1, // 报名列表分页当前页
      replyText: '评论', // 输入框提示文字
      commentId: '', // 回复人id，默认无
      showReply: false, // 展示评论输入框
      showApply: false, // 展示报名弹框
      detailData: {},
      commentData: [],
      customerId: '', // 当前登录人的id
      commentContent: '', // 评论内容
      commentModalContent: '', // 弹框评论内容
      page: 1,
      apply: {
        partnerId: '',
        sex: 1,
        mobile: '',
        remark: ''
      }, // 报名参数
      applyList: [], // 参与人列表
      applyLoadEnd: false, // 是否加载完了
      showApplyList: false, // 展示报名列表标志
      showTextarea: true, // 展示留言框 （解决真机兼容性问题）
      sexJson: {1: require('../../../../static/images/common/man_icon.png'), 2: require('../../../../static/images/common/woman.png')},
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
  },
  onShow () {
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
  onShareAppMessage () {
    let shareCode = wx.getStorageSync('customerCode') // 本人分享id
    return {
      title: '小鹿畅游',
      desc: '',
      path: `/pages/daren/partnerDetail/main?options=${JSON.stringify(this.options)}&shareCode=${shareCode}` // 路径，带上本人分享id给别人。
    }
  },
  components: {
    applyListModal
  },
  methods: {
    deleteReplyOne(comment) {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要删除该评论吗？',
        success: function (sm) {
          if (sm.confirm) {
            self.$http.post(self.API.partnerDelComment, {
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
    sexChange(e) {
      this.apply.sex = parseInt(e.mp.detail.value)
    },
    replyOne(item) {
      this.showReply = true
      this.showTextarea = false
      this.commentId = item.id
      this.replyText = `回复：${item.nickName}`
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
    sexEvt(index) {
      this.apply.sex = index
    },
    reply(content) {
      if (content.trim() === '') {
        wx.showToast({title: '请输入评论内容', icon: 'none'})
        return
      }
      this.$http.post(this.API.partnerComment, {
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
    applyEvt() {
      this.showApply = true
      this.showTextarea = false
    },
    likeEvt() {
      let item = this.detailData
      let type = item.isLike === 0 ? 1 : 2
      this.$http.post(this.API.partnerLike, {
        data: {
          type: type,
          likeId: item.id
        }
      }).then(res => {
        if (res.code === 0) {
          this.getDetail()
        }
      })
    },
    followEvt () {
      let item = this.detailData
      let type = item.isFollow === 0 ? 1 : 2
      this.$http.post(this.API.partnerFollow, {
        data: {
          type: type,
          followId: item.id
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
    showApplyListEvt() {
      // 不是自己发布的，无法查看
      if (this.detailData.customerId !== this.customerId) {
        return
      }
      this.curApplyId = this.detailData.id
      this.getApplyList(() => {
        this.showApplyList = true
      })
    },
    getApplyList(fn) {
      this.$http.post(this.API.partnerApplyList, {
        data: {
          currentPage: this.applyListPage,
          pageSize: 10,
          partnerId: this.curApplyId
        },
        showLoading: true
      }).then(res => {
        if (res.code === 0) {
          if (res.result.data.length > 0) {
            this.applyList = this.applyList.concat(res.result.data)
            this.applyListPage++
          } else {
            this.applyLoadEnd = true
          }
          fn && fn()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    loadMore() {
      this.getApplyList()
    },
    closeApplyListModal() {
      this.showApplyList = false
      this.applyLoadEnd = false
    },
    getDetail () {
      // type => 1: 查看别人， 2: 查看自己
      let curType = parseInt(this.options.type)
      let params = {
        id: this.options.id,
        type: curType
      }
      this.$http.post(this.API.partnerDetail, {
        data: params
      }).then(res => {
        if (res.code === 0) {
          res.result.typeImgUrl = res.result.typeImgUrl.split(',')
          res.result.typeImgUrl = res.result.typeImgUrl[this.options.urlIndex]
          console.log(res.result.typeImgUrl, this.options.urlIndex)
          this.detailData = res.result
        }
      })
    },
    previewImg(url) {
      let urls = []
      this.detailData.imgUrl.forEach(item => {
        urls.push(this.detailData.urlPrefix + item)
      })
      wx.previewImage({
        urls,
        current: this.detailData.urlPrefix + url
      })
    },
    cancelApplyEvt() {
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要取消报名吗？',
        success: function (sm) {
          if (sm.confirm) {
            self.$http.post(self.API.partnerCancelApply, {
              data: {
                partnerId: self.detailData.id
              }
            }).then(res => {
              if (res.code === 0) {
                wx.showToast({title: '取消成功'})
                setTimeout(() => {
                  self.getDetail()
                }, 1000)
              } else {
                wx.showToast({title: res.message, icon: 'none'})
              }
            })
          }
        }
      })
    },
    submitApply() {
      if (this.apply.mobile.trim() === '') {
        wx.showToast({title: '请输入联系方式', icon: 'none'})
        return
      }
      this.apply.partnerId = this.detailData.id
      this.$http.post(this.API.partnerApply, {
        data: this.apply
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({title: '报名成功'})
          this.closeApplyModal()
          setTimeout(() => {
            this.getDetail()
          }, 1000)
        } else {
          wx.showToast({title: res.message, icon: 'none'})
        }
      })
    },
    getCommentList() {
      // 获取评论列表
      this.$http.post(this.API.partnerCommentList, {
        data: {
          commentId: this.options.id,
          currentPage: this.page,
          pageSize: 999
        }
      }).then(res => {
        if (res.code === 0) {
          this.commentData = this.commentData.concat(res.result.data)
        }
      })
    },
    closeApplyModal() {
      this.showApply = false
      this.showTextarea = true
      this.apply.partnerId = ''
      this.apply.sex = 1
      this.apply.mobile = ''
      this.apply.remark = ''
    },
    closeApply() {
      this.closeApplyModal()
    }
  }
}
</script>
<style lang="scss" scoped>
.travels-box{
  background: #fff;
  position: relative;
  .header{
    color: #333333;
    font-size: 30rpx;
    margin-left: 30rpx;
    display:inline-block;
    margin-top: 30rpx;
    .header-img{
      width: 90rpx;
      height: 90rpx;
      border-radius:50%;
      display: inline-block;
      vertical-align: middle;
    }
    .name-box{
      display: inline-block;
      margin-left: 20rpx;
      font-size: 28rpx;
      vertical-align: middle;
      color: #fff;
      .date{
        font-size: 20rpx;
      }
    }
    .cer-item{
      display: inline-block;
      width: 98rpx;
      height: 32rpx;
      line-height: 32rpx;
      font-size: 20rpx;
      border: 1rpx solid #fff;
      border-radius: 5rpx;
      color: #fff;
      margin-left: 10rpx;
      .cer-icon{
        background: url('../../../../static/images/cash.png');
        background-size: 200rpx 50rpx;
        display: inline-block;
        vertical-align: top;
        margin: 6rpx;
        width: 22rpx;
        height: 22rpx;
        background-position: -65rpx 0;
      }
    }
  }
  .right{
    position: absolute;
    right: 30rpx;
    color: #fff;
    font-size: 22rpx;
    bottom: 35rpx;
    text-align: center;
  }
  .follow-btn{
    border: 1rpx solid #fff;
    border-radius: 30rpx;
    color: #ffffff;
    width: 100rpx;
    height: 40rpx;
    display: inline-block;
    text-align: center;
    line-height: 40rpx;
    font-size: 26rpx;
    margin-top: 150rpx;
  }
  .main-box{
    position: relative;
    .bg-img{
      width: 100%;
      height: 300rpx;
      display: block;
    }
    .main-info{
      color: #ffffff;
      font-size: 24rpx;
      position: absolute;
      top: 0;
      width: 100%;
      height: 300rpx;
      background: rgba(0,0,0,0.2);
      .title{
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        width: 678rpx;
        text-align: center;
        margin: 0 auto;
        margin-top:30rpx;
        color: #ffffff;
        font-size: 32rpx;
        // text-shadow:5px 1px 6px #000
      }
      .travels-btn{
        width: 190rpx;
        height: 50rpx;
        background-color: #fff;
        border-radius: 30rpx;
        font-size: 24rpx;
        line-height: 50rpx;
        color: #ff9913;
        text-align:center;
        margin: 0 auto;
        margin-top: 35rpx;
      }
    }
  }
}
.msg-box{
  padding: 40rpx 30rpx;
  background: #fff;
  .msg-item{
    border-bottom: 1rpx solid #dcdcdc;
    padding-bottom: 30rpx;
    div{
      color: #666666;
      font-size: 24rpx;
      display: inline-block;
      width: 65%;
      .time{
        margin-left: 15rpx;
        color: #000000;
      }
    }
    .w39{
      width: 35%;
    }
    .cxsj-icon, .cxts-icon, .lxfs-icon, .mdd-icon{
      width: 25rpx;
      height: 25rpx;
      background-position: -91rpx -81rpx;
      vertical-align: top;
      margin-top: 6rpx;
      margin-right: 7rpx;
    }
    .cxts-icon{
      background-position: -117rpx -81rpx;
    }
    .lxfs-icon{
      background-position: -144rpx -81rpx;
    }
    .mdd-icon{
      background-position: -170rpx -81rpx;
    }
  }
  .main-msg{
    color: #333333;
    font-size: 28rpx;
    padding: 40rpx 0;
    border-bottom: 1rpx solid #dcdcdc;
    white-space: pre-line;
  }
  .signup-box{
    position: relative;
    padding-top: 40rpx;
    .title{
      font-size: 28rpx;
      font-size: 28rpx;
      vertical-align: text-top;
      margin-top: -20rpx;
      display: inline-block;
      margin-left: 20rpx;
    }
    .signup-btn{
      width: 180rpx;
      height: 70rpx;
      line-height: 70rpx;
      background-color: #fbb03b;
      border-radius: 5rpx;
      font-size: 26rpx;
      color: #ffffff;
      position: absolute;
      right: 30rpx;
      top: 40rpx;
      text-align: center;
    }
    .header-img-box{
      width: 60%;
      .dots{
        margin-left: 20rpx;
        display: inline-block;
        vertical-align: top;
        margin-top: 10rpx;
      }
      img{
        width: 66rpx;
	      height: 66rpx;
        border-radius: 50%;
        margin-left: -25rpx;
      }
      img:first-child{
        margin-left: 0
      }
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
  background: url('../../../../static/images/travelPerson/guide.png');
  background-size: 200rpx 200rpx;
  display: inline-block;
  vertical-align: middle;
}
.person-icon {
  background: url('../../../../static/images/travelPerson.png');
  background-size: 200rpx 100rpx;
  width: 20rpx;
  height: 35rpx;
  display: inline-block;
  vertical-align: middle;
}
.location-icon, .follow-icon, .msg-icon, .see-icon{
  width: 25rpx;
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
.comment-btn.bm-btn{
  width: 540rpx;
	height: 80rpx;
  line-height: 80rpx;
	background-color: #fbb03b;
	border-radius: 40rpx;
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

.apply-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .apply-content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: 100;
    border-radius: 10rpx;
    width: 640rpx;
    box-sizing: border-box;
    height: 600rpx;
    padding: 110rpx 50rpx 60rpx 50rpx;
  }
}

.input-wrap {
  display: flex;
  line-height: 64rpx;
  margin: 0 20rpx;
  padding: 20rpx 0;
  font-size: 30rpx;
  .label {
    width: 130rpx;
    margin-right: 20rpx;
  }
  .input {
    display: block;
    flex: 1;
    height: 64rpx;
    font-size: 30rpx;
    // border-bottom: 1px solid #666;
  }
  .s {
    margin: 0 20rpx;
  }
  .textarea {
    padding: 20rpx;
    margin-left: 40rpx;
    border: 1px solid #666;
  }
}
.guide-icon {
  background: url('../../../../static/images/travelPerson/guide.png');
  background-size: 200rpx 200rpx;
  display: inline-block;
  vertical-align: middle;
}
.single-select,
.single-select.active {
  background-position: -142rpx -48rpx;
  width: 26rpx;
  height: 26rpx;
  vertical-align: top;
  margin-top: 24rpx;
}
.single-select.active {
  background-position: -113rpx -48rpx;
}
.select-item {
  margin-right: 60rpx;
}
  .apply-close {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    width: 35rpx;
    height: 32rpx;
    background: url('../../../../static/images/cash.png');
    background-position: -27rpx 0;
    background-size: 200rpx 50rpx;
  }
.travels-box .follow-btn.gray {
  border-color: #fff;
  color: #fff;
}

.sex-icon {
  width: 22rpx;
  height: 22rpx;
  margin-left: 5rpx;
  vertical-align: top;
  margin-top: 12rpx;

}
</style>
