<template>
  <div>
    <div class="comment-list" v-if="showGoodsList">
      <div class="item bgf" v-for="(item, index) in commentList" :key = index>
        <div class="top">
          <img class="head" :src="urlPrefix + item.photo" width="28" height="28" v-if="item.photo">
          <img class="head" :src="userlogo" width="28" height="28" v-else>
          <span class="name">{{item.mobile}}</span>
          <span class="date">{{item.createTime}}<span class="size">{{item.specValues}}</span></span>
          <div class="star-wrap">
            <!-- <span class="icon deer-icon" :class="{active: item.score > starIndex}" v-for="(staritem, starIndex) in 5" :key = starIndex></span> -->
            <span v-if="item.score === 1">好评</span>
            <span v-if="item.score === 2">中评</span>
            <span v-if="item.score === 3">差评</span>
          </div>
        </div>
        <div class="text">{{item.content}}</div>
        <div class="img-box" v-if="item.imgList.length > 0">
          <div class="img-item" v-for="(img, imgIndex) in item.imgList" :key = imgIndex>
            <img :src="urlPrefix + img" alt="" class="img">
          </div>
        </div>
        <div class="reply" v-if="item.merchantReply">
          <span class="reply-name">商家回复：</span>{{item.merchantReply}}
        </div>
      </div>
    </div>

    <div  class="comment-list" v-if="showTravelList && type === 'travel'">
      <div class="item bgf" v-for="(item, index) in commentList" :key = index>
        <div class="top">
          <img class="head" :src="urlPrefix + item.photo" width="28" height="28" v-if="item.photo">
          <img class="head" :src="userlogo" width="28" height="28" v-else>
          <span class="name">{{item.mobile}}</span>
          <span class="date">{{item.createTime}}</span>
          <div class="flex">
            <div class="star-wrap">
              <span>行程</span> <span class="icon deer-icon" :class="{active: item.travelScore > starIndex}" v-for="(staritem, starIndex) in 5"  :key = starIndex></span>
            </div>
            <div class="star-wrap">
              <span>导游</span> <span class="icon deer-icon" :class="{active: item.guideScore > starIndex}" v-for="(staritem, starIndex) in 5"  :key = starIndex></span>
            </div>
            <div class="star-wrap">
              <span>住宿</span><span class="icon deer-icon" :class="{active: item.stayScore > starIndex}" v-for="(staritem, starIndex) in 5"  :key = starIndex></span>
            </div>
            <div class="star-wrap">
              <span>用餐</span><span class="icon deer-icon" :class="{active: item.dinnerScore > starIndex}" v-for="(staritem, starIndex) in 5"  :key = starIndex></span>
            </div>
          </div>
        </div>
        <div class="text">{{item.content}}</div>
        <div class="img-box" v-if="item.imgList.length > 0">
          <div class="img-item" v-for="(img, imgIndex) in item.imgList" :key = imgIndex>
            <img :src="urlPrefix + img" alt="" class="img">
          </div>
        </div>
        <div class="reply" v-if="item.merchantReply">
          <span class="reply-name">商家回复：</span>{{item.merchantReply}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  export default {
    data () {
      return {
        commentList: [],
        urlPrefix: '',
        showGoodsList: false,
        showTravelList: false,
        currentPage: 1,
        total: '',
        type: '', // 默认商品评论列表；  travel：旅游
        userlogo: require('../../../../static/images/common/userlogo.png')
      }
    },
    onLoad(options) {
      this.options = options
      if (this.options.type) {
        this.type = this.options.type
        this.getTravellist()
      } else {
        this.get_list()
      }
    },
    components: {
    },
    onReachBottom: function () {
      if (this.total > this.currentPage) {
        if (this.type === 'travel') {
          // !this.showTravelList || this.commentList.length === this.total || this.getTravellist()
          this.showTravelList && this.getTravellist()
        } else {
          // !this.showGoodsList || this.commentList.length === this.total || this.get_list()
        }
      }
    },
    onUnload() {
      Object.assign(this, this.$options.data())
    },
    methods: {
      get_list () {
        this.showGoodsList = false
        this.$http.post(this.API.getCommentList, {
          data: {
            productId: this.options.id,
            pageSize: 10,
            currentPage: this.currentPage
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.showGoodsList = true
            let data = res.result.pageList.data
            data.forEach(item => {
              if (!item.imgList) {
                item.imgList = []
              } else {
                item.imgList = item.imgList.split(',')
              }
            })
            this.urlPrefix = res.result.urlPrefix
            this.commentList = data.concat(this.commentList)
            this.commentList.forEach((item) => {
              item.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
            })
            this.currentPage = res.result.pageList.currentPage + 1
            this.total = res.result.total
          }
        })
      },
      getTravellist () {
        this.showTravelList = false
        this.$http.post(this.API.getTraCommentList, {
          data: {
            productId: this.options.id,
            pageSize: 10,
            currentPage: this.currentPage
          },
          showLoading: false
        }).then(res => {
          if (res.code === 0) {
            this.showTravelList = true
            let data = res.result.pageList.data
            data.forEach(item => {
              if (!item.imgList) {
                item.imgList = []
              } else {
                item.imgList = item.imgList.split(',')
              }
            })
            this.urlPrefix = res.result.urlPrefix
            this.commentList = data.concat(this.commentList)
            this.commentList.forEach((item) => {
              item.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
            })
            this.currentPage = res.result.pageList.currentPage + 1
            this.total = res.result.total
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .icon{
    background: url('../../../../static/images/travelSort.png');
    background-size: 200rpx 200rpx;
    width: 28rpx;
    height: 28rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .comment-list .item {
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  .comment-list .item .top {
    // display: -webkit-box;
    // display: -ms-flexbox;
    // display: flex;
    // -webkit-box-align: center;
    // -ms-flex-align: center;
    // align-items: center;
  }
  .comment-list .item .top .name {
    margin-left: 10px;
    margin-right: 8px;
    font-size: 24rpx;
    color: #888888
  }
  .comment-list .item .date {
    margin: 10px 0;
    color: #999;
    font-size: 12px;
    float: right;
    margin-top: 5rpx;
  }
  .comment-list .item .date .size {
    margin-left: 10px;
  }
  .comment-list .item .text {
    line-height: 18px;
    font-size: 14px;
  }  
  .comment-list .flex{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20rpx;
    width: 100%;
  }
  .comment-list .star-wrap{
    display: block;
    width: 46%;
    span:first-child{
      font-size:26rpx;
      color: #353535;
      margin-right: 10rpx;
    }
  }
  .comment-list .star-wrap .iconfont {
    color: #ffce00;
  }
  .comment-list .reply-name {
    color: #c71b1c;
  }
  .comment-list .reply {
    margin-top: 10px;
    padding: 10px;
    background-color: #e3e3e3;
    line-height: 18px;
    font-size: 14px;
  }
  .head {
    width: 28px;
    height: 28px;
    vertical-align: middle;
  }
  .bgf {
    background-color: #fff;
  }
  .deer-icon, .deer-icon.active{
    background-position: -92rpx -108rpx;
    width: 33rpx;
    height: 33rpx;
    margin-top: -5rpx;
    margin-right: 10rpx;
  }
  .deer-icon.active{
    background-position: -57rpx -108rpx;
  }
  .img-box{
    margin-top: 20rpx;
    .img-item{
      width: 145rpx;
      height: 145rpx;
      border:1rpx dashed #dcdcdc;
      position: relative;
      display: inline-block;
      margin-right: 34rpx;
      .img{
        position: absolute;
        top: -1rpx;
        left: -1rpx;
        width: 148rpx;
        height: 148rpx;
      }
    }
    .img-item:nth-child(2n+4){
      margin-right: 0;
    }
  }

</style>
