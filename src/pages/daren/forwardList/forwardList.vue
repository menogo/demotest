<template>
  <div class="page">
    <div class="right_Letter">
      <div class="Letter_list" v-for="(item,index) in LetterCity" :key="index" @click="addClassName(index,item.letter)" :class="{active:index == thatnum}">{{item.letter}}</div>
    </div>

    <scroll-view class="longinPage_scroll"  :scroll-y="true" @scrolltolower="scrolltolower" @scroll="scroll" :scroll-into-view="toView" :scroll-with-animation="true" :style="{'height': windowHeight}">
      <div class="Letter_city" v-for="(item,index) in LetterCity" :key="index" :id="item.letter">
        <div class="Letter_title">{{item.letter}}</div>
        <div class="hot_city">
          <div class="city_list" v-for="(ite,ind) in item.childArr" :key="ind" @click="getFollow(ite)">
            <img :src="ite.src" alt="">
            <span>{{ite.name}}</span>
          </div>
          <div class="placeholder"></div>
        </div>
      </div>
      <div class="box"></div>
    </scroll-view>
  </div>
</template>

<script>
// import { aaa } from './city.js'
import Pinyin from '../../../utils/Convert_Pinyin'
let pinyin = new Pinyin()
export default {
  /* eslint-disable */
  data () {
    return {
      LetterCity: [],
      thatnum: 0,
      scrollTop:0,
      toView:'',
      windowHeight: 0
    }
  },
  onShow() {
    this.getFollowList()
    wx.getSystemInfo({
      success: res => {
        this.windowHeight = `${res.windowHeight}px`
      }
    })
  },
  onLoad() {
    // {"letter":"A",
    //   "childArr":[
    //   {"name":"萌萌", "src": "http://pic4.zhimg.com/50/v2-848b1a190d937e270e8d062d00865493_hd.jpg", "id": 1242},
    // ]
    // },
    // 生成A~Z
    this.LetterCity = []
    for (let i = 65; i < 91; i++) {
      this.LetterCity.push({
        letter: String.fromCharCode(i),
        childArr: []
      })
    }
  },
  methods: {
    getFollow (item) {
      console.log('item', item)
      let arr = []
      let forwardPerson = wx.getStorageSync('forwardPerson')
      console.log('forwardPerson', forwardPerson)
      if (forwardPerson) {
        console.log(11)
        arr = forwardPerson
        arr.push(item)
      } else {
        console.log(22)
        arr.push(item)
      }
      wx.setStorageSync('forwardPerson', arr)
      wx.navigateBack()
      // wx.redirectTo({
      //   url: `/pages/daren/forwardList/main`
      // })
    },
    getFollowList () {
      this.$http.post(this.API.queryFollowList, {
        data: {
          type: 1
        }
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach(item => {
            // {"name":"萌萌", "src": "http://pic4.zhimg.com/50/v2-848b1a190d937e270e8d062d00865493_hd.jpg", "id": 1242}
            let o = {
              name: item.nickName,
              src: item.photo,
              id: item.id
            }
            let letter = pinyin.getCamelChars(item.nickName.charAt(0))
            this.LetterCity.forEach((char, cIndex) => {
              if (char.letter === letter) {
                this.LetterCity[cIndex].childArr.push(o)
              }
            })
            // 删除没有数据的字母序号
            this.LetterCity.forEach((char, cIndex) => {
              if (char.childArr.length <= 0) {
                this.LetterCity.splice(cIndex, 1)
              }
            })
          })
          console.log(JSON.stringify(this.LetterCity))
        }
      })
    },
    scroll(e) {
      console.log(e.mp.detail.scrollTop)
    },
    //to首页
    toHome(name,numID){
      console.log(name, numID)
    },
    //选择字母
    addClassName: function(index,id) {
      this.Tips(id)
      this.thatnum = index;
      var that=this;
      for (let i = 0; i < that.LetterCity.length; ++i) {
        if (that.LetterCity[i].letter == id) {
          that.toView= that.LetterCity[i].letter
          console.log('that.toView', that.toView)
          break
        }
      }
    },
    //提示
    Tips(text){
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 500
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  background: #Fff;
  min-height: 100vh;
}
.longinPage{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 100%;
  background: #Fff;
  padding: 0 9% 0 3%;
  box-sizing: border-box;
  overflow: hidden;
}
.longinPage_scroll{
  width: 100%;
  height: 100%;
  padding-top: 10px;
}
.bottom_text{
  font-size: 20px;
  color: #B5B5B5;
  text-align: center;
}
.right_Letter{
  position: fixed;
  right: 10px;
  top: 80px;
  z-index: 100;
  width: 25px;
  overflow: hidden;
}
.Letter_list{
  width: 25px;
  height: 25px;
  font-size: 14px;
  color: #aaa;
  text-align: center;
  line-height: 25px;
  margin-bottom: 5px;
}
.head_gps{
  margin-top: 10px;
}
.title{
  font-size: 14px;
  color: #333333;
  margin-bottom: 10px;
}
.city_list{
  width: 100%;
  padding-left: 66px;
  height: 100rpx;
  line-height: 100rpx;
  border-bottom: 1rpx solid #ccc;
  position: relative;
  img{
    width:80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    left: 25rpx;
    top: 10rpx;
  }
}
.hot_city{
  display: flex;
  justify-content:space-between;
  flex-wrap: wrap;
}
.Letter_city{
  .hot_city:last-child{
    .city_list{
      border-bottom: none;
    }
  }
}
.Letter_title{
  width: 100%;
  height: 44rpx;
  background: #f4f4f4;
  font-size: 28rpx;
  color: #666;
  text-align: left;
  line-height: 44rpx;
  padding: 0 30rpx;
}
.Letter_province{
  font-size: 20px;
}
.placeholder {
  width: 30%;
  height: 0px;
}
// .active{
//   background: #fbb03b;
//   border-radius: 5px;
//   color: #fff;
//   font-size: 16px;
// }
.box{
  width: 100%;
  height: 30px;
}

/*隐藏滚动条*/
.longinPage_scroll ::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
