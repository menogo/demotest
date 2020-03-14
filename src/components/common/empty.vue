<template>
  <div class="empty-box" v-if="list && list.length < 1">
    <img src="../../../static/images/common/empty.png" alt="">
    <p>{{dataText}}</p>
  </div>
</template>

<script>
export default {
  props: [
    'list',
    'text'
  ],
  data () {
    return {
      dataText: this.text || '暂时没有相关内容',
      emptyImg: require('../../../static/images/common/empty.png')
    }
  },
  created () {
    // console.log('list', this.list)
  }
}
</script>

<style lang="scss" scoped>
.empty-box{
  margin-top: 245rpx;
  img{
    width: 181rpx;
    height: 181rpx;
    margin: 0 auto;
    display: block;
  }
  p{
    color:#999999;
    font-size: 30rpx;
    margin-top: 30rpx;
    text-align: center;
  }
}
</style>
