<template>
    <div class="page">
      <div class="first-box">
        <input type="text" placeholder="产品标题" class="title-input">
        <div class="img-modules">
          <p class="title">产品图片</p>
          <div class="img-box">
            <div class="img-item">
              <i class="icon img-icon"></i>
            </div>
            <div class="img-item">
              <i class="icon img-icon"></i>
            </div>
            <div class="img-item">
              <i class="icon img-icon"></i>
            </div>
          </div>
          <p class="tips">图片建议尺寸为600*450等比例</p>
        </div>
      </div>
      <div class="norms-box">
        <div class="input-box">
          <input type="text" class="norms-input" placeholder="规格">
          <span class="right">添加规格+</span>
        </div>
        <div class="norms-modules">
          <span class="norms-item">规格一</span>
          <span class="norms-item">规格二</span>
        </div>
        <div class="add-price">
          <input type="text" placeholder="价格" class="price-input">
          <input type="text" placeholder="库存" class="price-input">
          <span class="save-btn">保存价格</span>
          <ul class="price-list">
            <li>
              <span>规格名称</span>
              <span>￥1999</span>
              <span>库存50</span>
            </li>
            <li>
              <span>规格名称</span>
              <span>￥1999</span>
              <span>库存50</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn-bg">
        <button class="save-btn" @click="goNext">保存到下一步</button>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onShow () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.page{
  height: 100vh;
}
.first-box{
  padding: 40rpx 30rpx;
  background: #fff;
  .title-input{
    border-bottom: 1rpx solid #666666;
    font-size: 30rpx;
    padding: 10rpx 0;
  }
  .img-modules{
    background: #fff;
    margin-top: 50rpx;
    .title{
      font-size: 30rpx;
      margin-bottom: 25rpx;
    }
    .img-box{
      .img-item{
        width: 210rpx;
        height: 158rpx;
        border: dashed 1rpx #aaaaaa;
        display: inline-block;
        margin-right:28rpx;
        position: relative;
        .img-icon{
          background-position: 0 -81rpx;
          width: 80rpx;
          height: 63rpx;
          margin-top: 50rpx;
          margin-left: 65rpx;
        }
      }
      .img-item:last-child{
        margin-right:0;
      }
    }
    .tips{
      font-size: 20rpx;
      color: #666666;
      margin-top: 20rpx;
    }
  }
}
.norms-box{
  margin-bottom: 108rpx;
  margin-top: 20rpx;
  background: #fff;
  padding: 40rpx 30rpx;
  .input-box{
    position: relative;
    .norms-input{
      border-bottom: 1rpx solid #666666;
      font-size: 30rpx;
      padding: 10rpx 0;
    }
    .right{
      font-size: 30rpx;
      color: #388ef8;
      position: absolute;
      right: 0;
      top: 10rpx;
    }
  }
  .norms-modules{
    padding: 10rpx 0 30rpx 0;
    .norms-item{
      display: inline-block;
      margin-top: 30rpx;
      margin-right: 30rpx;
      text-align: center;
      width: 150rpx;
      height: 50rpx;
      line-height: 50rpx;
      background-color: #eeeeee;
      border-radius: 8rpx;
      color: #333333;
      font-size: 28rpx;
    }
    .norms-item:nth-child(4n){
      margin-right: 0;
    }
  }
  .add-price{
    .price-input{
      width: 180rpx;
	    border-bottom: solid 1rpx #666666;
      text-align:center;
      font-size: 30rpx;
      margin-right: 80rpx;
      display:inline-block;
      padding: 10rpx 0;
    }
    .save-btn{
      width: 150rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 8rpx;
      font-size: 30rpx;
      color: #ff9913;
      border: solid 1rpx #ff9913;
      text-align:center;
      vertical-align: top;
      margin-top: 10rpx;
      float:right;
    }
    .price-list{
      li{
        color: #666666;
        font-size: 30rpx;
        display: flex;
        justify-content:space-between;
        margin-top: 23rpx;
        span{
          flex-flow: 1;
          display:block;
          text-align:center;
        }
      }
    }
  }
}
.btn-bg{
  position: fixed;
  bottom: 0;
  width: 92%;
  padding: 20rpx 30rpx;
  background: #f4f4f4;
  .save-btn{
    background: #fbb03b;
    color: #fff;
    font-size: 28rpx;
    border: none;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 50rpx;
    border-radius: 50rpx;
  }
}
.icon{
  background: url('../../../../static/images/travelPerson/guide.png');
  background-size: 200rpx 200rpx; 
  display: inline-block;
  vertical-align: middle;
}
</style>