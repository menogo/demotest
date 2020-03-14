<template>
  <div class='page'>
    <div class="comment-top" v-for="(item, index) in goods"  :key = index>
      <div class="header" >
        <img :src="item.productImg" alt="">
        <div v-for="(evalItem, evalIndex) in item.evaluateSelect" :key = evalIndex><i class="icon select-icon" :class="{'active': evalItem.active}" @click="lightEvaluate(item, evalIndex)"></i>{{evalItem.txt}}</div>
      </div>
      <textarea name="" id="" class="textarea" placeholder="商品满意吗？说说您的心得，给其他买家作个参考吧" @change="change($event, item)"></textarea>
      <div class="img-box">
        <div class="img-item" v-for="(imgItem, imgIndex) in item.commentImgs" :key = imgIndex>
          <i class="icon img-icon"></i>
          <span class="txt">添加图片</span>
          <img :src="imgItem.src" alt="" class="img">
          <i class="icon close-icon" @click="removeImg(item, index)"></i>
        </div>
        <div class="img-item" @click="upload(item)">
          <i class="icon img-icon"></i>
          <span class="txt">添加图片</span>
        </div>
      </div>
    </div>
    <div class="comment-main">
      <div class="comment-model">
        <span class='txt'>物流服务</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in logisticsList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'logistics')"></i>
        </div>
      </div>
      <div class="comment-model">
        <span class='txt'>服务态度</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in serviceList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'service')"></i>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <i class="icon click-icon" :class="{'active': isAnonymous}" @click="toogleAnonymous"></i>
        <span>匿名评价</span>
      </div>
      <button @click="submit">确定发布</button>
    </div>
  </div>
</template>
<script>
  import Http from '../../../utils/http'
  import { SERVICE_LIST, LOGISTICS_LIST, EVALUATE_SELECT } from '../../../utils/screen.js'
  export default {
    data () {
      return {
        logisticsList: LOGISTICS_LIST,
        serviceList: SERVICE_LIST,
        evaluateSelect: EVALUATE_SELECT,
        goods: [],
        detailData: {},
        show: false,
        isAnonymous: 0 // 是否匿名 0-否 1-是
      }
    },
    onLoad(options) {
      this.options = options
      this.get_list()
    },
    methods: {
      toogleAnonymous() {
        if (this.isAnonymous === 0) {
          this.isAnonymous = 1
        } else {
          this.isAnonymous = 0
        }
      },
      lightEvaluate (curItem, index) {
        curItem.evaluateSelect.forEach((ite) => {
          ite.active = false
        })
        curItem.evaluateSelect[index].active = true
        curItem.merchantScore = index + 1
      },
      lightIcon (index, type) {
        let typeList = `${type}List`
        let typeScore = `${type}Score`
        this[typeList].forEach((ite) => {
          ite.active = false
        })
        this[typeList].forEach((ite) => {
          if (ite.index <= index) {
            ite.active = true
          }
        })
        this[typeScore] = index + 1
      },
      get_list: function () {
        this.show = false
        this.$http.post(this.API.getShopOrderDetail, {
          data: this.options
        }).then(res => {
          if (res.code === 0) {
            this.show = true
            this.detailData = res.result
            this.goods = res.result.detailList
            this.goods.forEach(item => {
              this.$set(item, 'commentImgs', [])
              this.$set(item, 'content', '')
              this.$set(item, 'merchantScore', -1)
              this.$set(item, 'evaluateSelect', EVALUATE_SELECT)
            })
          }
        })
      },
      change (e, t) {
        t.content = e.mp.detail.value
      },
      removeImg(item, index) {
        item.commentImgs.splice(index, 1)
      },
      upload(item) {
        wx.chooseImage({
          success: function (res) {
            wx.showLoading()
            wx.uploadFile({
              url: Http.baseURL + '/upload',
              filePath: res.tempFilePaths[0],
              name: 'file',
              success: function (r) {
                r.data = JSON.parse(r.data)
                if (r.data.code === 0) {
                  item.commentImgs.push({
                    src: res.tempFilePaths[0],
                    upload: r.data.result
                  })
                } else {
                  wx.showToast({
                    title: res.message
                  })
                }
              },
              complete() {
                wx.hideLoading()
              }
            })
          }
        })
      },
      submit() {
        let params = {
          orderId: this.detailData.id
        }
        let commentList = [] // 要传入的数组
        let flag = true
        let keyFlag = true
        this.goods.forEach(item => {
          // 判断有无填写内容
          if (item.content.trim() === '') {
            flag = false
            return false
          }
          // 判断有无选择评分
          if (item.merchantScore === -1) {
            keyFlag = false
            return false
          }
          let imgList = []
          item.commentImgs.forEach(item => {
            imgList.push(item.upload)
          })
          commentList.push({
            productId: item.productId,
            score: item.merchantScore,
            content: item.content,
            imgList: imgList.join(','),
            isAnonymous: this.isAnonymous
          })
        })
        if (!flag) {
          wx.showToast({
            title: '请输入评论内容',
            icon: 'none'
          })
          return
        }
        if (!keyFlag) {
          wx.showToast({
            title: '请选择评分',
            icon: 'none'
          })
          return
        }
        if (!this.logisticsScore) {
          wx.showToast({
            title: '请选择物流评分',
            icon: 'none'
          })
          return
        }
        if (!this.serviceScore) {
          wx.showToast({
            title: '请选择服务评分',
            icon: 'none'
          })
          return
        }
        params.commentList = commentList // 传入的评论列表对象
        params.merchantScore = { // 商家评论信息
          expressServiceScore: this.logisticsScore, // 快递服务评分
          serviceAttitudeScore: this.serviceScore // 服务评分
        }
        this.$http.post(this.API.comment, {
          data: {
            commentJson: JSON.stringify(params)
          }
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: '评价成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/goods/order/main'
              })
            }, 1500)
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
  .page {
    min-height: 100vh;
    background: #fff;
  }
  .comment-top{
    background: #fff;
    padding: 30rpx 30rpx 58rpx 30rpx;
    .header{
      font-size:34rpx;
      img{
        width: 88rpx;
        height: 88rpx;
        display: inline-block;
        margin-right: 60rpx;
        vertical-align: middle;
      }
      div{
        display: inline-block;
        margin-right: 95rpx;
        height: 88rpx;
        line-height: 88rpx;
      }
      div:last-child{
        margin-right: 35rpx;
      }
    }
  }
  .textarea{
    width: 100%;
    height: 210rpx;
    border: 1rpx solid #dcdcdc;
    margin-top: 30rpx;
    padding: 20rpx 15rpx;
    box-sizing: border-box;
    font-size: 26rpx;
  }
  .img-box{
    margin-top: 55rpx;
    .img-item{
      width: 145rpx;
      height: 145rpx;
      border:1rpx dashed #dcdcdc;
      position: relative;
      display: inline-block;
      margin-right: 34rpx;
      .txt{
        font-size:22rpx;
        color: #bbbbbb;
        margin: 0 auto;
        width: 98rpx;
        display: block;
        margin-top: 15rpx;
      }
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
  .comment-main{
    padding: 30rpx;
    background: #fff;
    border-top: 20rpx solid #f4f4f4;
    .comment-model{
      height: 35rpx;
      line-height: 35rpx;
      margin-bottom:45rpx;
      .txt{
        color: #333333;
        font-size: 30rpx;
        margin-right:40rpx;
      }
      .icon-box{
        height: 35rpx;
        line-height: 35rpx;
        display: inline-block;
      }
    }
  }
  .footer{
    position: fixed;
    height:98rpx;
    bottom: 0;
    border-top: 1rpx solid #f4f4f4;
    width: 100%;
    display: flex;
    .left{
      width: 450rpx;
      color: #333;
      font-size: 32rpx;
      display: inline-block;
      line-height: 98rpx;
      padding-left: 30rpx;
    }
    button{
      width: 300rpx;
      background:#fbb03b;
      height: 98rpx;
      line-height: 98rpx;
      border-radius:0;
      font-size: 34rpx;
      color:#fff;
      box-sizing: border-box;
      display: inline-block;
    }
    button:after{
      border: 0;
    }
  }
  .icon{
    background: url('../../../../static/images/travelSort.png');
    background-size: 200rpx 200rpx;
    width: 28rpx;
    height: 28rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .select-icon{
    background-position: -75rpx -65rpx;
    margin-right: 10rpx;
  }
  .select-icon.active{
    background-position: -106rpx -65rpx;
    margin-right: 10rpx;
  }
  .img-icon{
    background-position: -2rpx -102rpx;
    width: 50rpx;
    height: 45rpx;
    display: block;
    margin: 0 auto;
    margin-top: 33rpx;
  }
  .close-icon{
    background-position: -131rpx -30rpx;
    position: absolute;
    width: 32rpx;
    height: 32rpx;
    top: -12rpx;
    right: -12rpx;
  }
  .deer-icon, .deer-icon.active{
    background-position: -92rpx -108rpx;
    width: 33rpx;
    height: 33rpx;
    margin-top: -5rpx;
    margin-right: 35rpx;
    // position: relative;
  }
  .deer-icon::before, .deer-icon::before.active{
    content: '';
    position: absolute;
    top: -10px; right: -10px;
    bottom: -10px; left: -10px;
  } 
  .deer-icon.active{
    background-position: -57rpx -108rpx;
  }
  .click-icon, .click-icon.active{
    background-position: 0 -63rpx;
    width: 32rpx;
    height: 32rpx;
    margin-right: 18rpx;
    margin-top: -5rpx;
  }
  .click-icon.active{
    background-position: -36rpx -63rpx;
  }
</style>
