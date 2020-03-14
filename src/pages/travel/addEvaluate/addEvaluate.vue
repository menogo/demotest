<template>
  <div class='page'>
    <div class="comment-top">
      <div class="header">
        <img :src="logoImg" alt="">
        <div v-for="(item, index) in evaluateSelect" :key = index><i class="icon select-icon" :class="{'active': item.active}" @click="lightEvaluate(index)"></i>{{item.txt}}</div>
      </div>
      <textarea name="" id="" class="textarea" placeholder="商品满意吗？说说您的心得，给其他买家作个参考吧" v-model = "txtContent"></textarea>
      <div class="img-box" >
        <div class="img-item" v-for="(imgItem, imgIndex) in commentImgs" :key="imgIndex">
          <!-- <img :src="themeImg" alt="" class="img"> -->
          <i class="icon close-icon"  @click="removeImg(imgIndex)"></i>
          <img class="img" :src="imgItem.src" alt="" />
        </div>
        <div class="img-item"  @click="upload">
          <i class="icon img-icon"></i>
          <span class="txt">添加图片</span>
        </div>
      </div>
    </div>
    <div class="comment-main">
      <div class="comment-model">
        <span class='txt'>行程</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in xcList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'xc')"></i>
        </div>
      </div>
      <div class="comment-model">
        <span class='txt'>导游</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in dyList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'dy')"></i>
        </div>
      </div>
      <div class="comment-model">
        <span class='txt'>住宿</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in zsList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'zs')"></i>
        </div>
      </div>
      <div class="comment-model">
        <span class='txt'>用餐</span>
        <div class="icon-box">
          <i class="icon deer-icon" v-for = "(item, index) in ycList" :key = index :class="{'active': item.active}" @click="lightIcon(index, 'yc')"></i>
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
// Use Vuex
import Http from '../../../utils/http'
import { XC_LIST, DY_LIST, ZS_LIST, YC_LIST, EVALUATE_SELECT } from '../../../utils/screen.js'
export default {
  data () {
    return {
      orderId: '', // 订单id
      logoImg: '', // 商家头像
      xcList: XC_LIST,
      dyList: DY_LIST,
      zsList: ZS_LIST,
      ycList: YC_LIST,
      evaluateSelect: EVALUATE_SELECT,
      xcScore: '',
      dyScore: '',
      zsScore: '',
      ycScore: '',
      merchantScore: '',
      txtContent: '',
      commentImgs: [], // 图片列表
      isAnonymous: 0, // 是否匿名 0-否 1-是
      themeImg: require('../../../../static/images/common/themeBg.jpg')
    }
  },
  onLoad (options) {
    this.orderId = options.id
    this.logoImg = options.logoImg
    this.productId = options.productId
    console.log(this.orderId)
  },
  onShow () {
    // this.reserData()
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    // reserData () {
    //   this.xcScore = ''
    //   this.dyScore = ''
    //   this.zsScore = ''
    //   this.ycScore = ''
    //   this.merchantScore = ''
    //   this.txtContent = ''
    //   this.commentImgs = []
    //   this.evaluateSelect = EVALUATE_SELECT
    // },
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
    // 商家评分
    lightEvaluate (index) {
      this.evaluateSelect.forEach((ite) => {
        ite.active = false
      })
      this.evaluateSelect[index].active = true
      this.merchantScore = index + 1
    },
    toogleAnonymous() {
      if (this.isAnonymous === 0) {
        this.isAnonymous = 1
      } else {
        this.isAnonymous = 0
      }
    },
    removeImg(index) {
      this.commentImgs.splice(index, 1)
    },
    upload() {
      let self = this
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
                self.commentImgs.push({
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
    submit () {
      let check = this.checkEmpty() === false ? false : true
      if (check) {
        let params = {} // 要传入的数组
        let imgList = []
        this.commentImgs.forEach(item => {
          imgList.push(item.upload)
        })
        params = {
          productId: this.productId,
          orderId: this.orderId,
          merchantScore: this.merchantScore,
          travelScore: this.xcScore,
          guideScore: this.dyScore,
          stayScore: this.zsScore,
          dinnerScore: this.ycScore,
          isAnonymous: this.isAnonymous,
          content: this.txtContent,
          imgList: imgList.join(',')
        }
        this.$http.post(this.API.travelComment, {
          data: params
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
            wx.navigateTo({
              url: `/pages/travel/traOrderList/main`
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    },
    // 检查页面
    checkEmpty () {
      if (this.merchantScore === '') {
        wx.showToast({
          title: '请对商家进行评价',
          icon: 'none'
        })
        return false
      }
      if (this.txtContent === '') {
        wx.showToast({
          title: '请填写评价',
          icon: 'none'
        })
        return false
      }
      if (this.xcScore === '') {
        wx.showToast({
          title: '请对行程进行评价',
          icon: 'none'
        })
        return false
      }
      if (this.dyScore === '') {
        wx.showToast({
          title: '请对导游进行评价',
          icon: 'none'
        })
        return false
      }
      if (this.zsScore === '') {
        wx.showToast({
          title: '请对住宿进行评价',
          icon: 'none'
        })
        return false
      }
      if (this.ycScore === '') {
        wx.showToast({
          title: '请对用餐进行评价',
          icon: 'none'
        })
        return false
      }
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
  margin-top: 25rpx;
  .img-item{
    width: 145rpx;
    height: 145rpx;
    border:1rpx dashed #dcdcdc;
    position: relative;
    display: inline-block;
    margin-right: 34rpx;
    vertical-align: top;
    margin-top: 30rpx;
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
  width: 35rpx;
  height: 35rpx;
  top: -12rpx;
  right: -12rpx; 
  z-index: 999;
}
.deer-icon, .deer-icon.active{
  background-position: -92rpx -108rpx;
  width: 33rpx;
  height: 33rpx;
  margin-top: -5rpx;
  margin-right: 35rpx;
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
