<template>
  <!--transition标签 按钮出现附带动画-->
  <transition name="el-fade-in">
    <i class="icon gotop-icon" ref="toTop" @click="scrollToTop" v-show="toTopShow"></i>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        toTopShow: false,
      }
    },
    methods: {
      handleScroll() {
        // id scroller-box是自己在组件上添加的，为了方便获取dom
        this.scrollTop = document.getElementById("scroller-box").children[0].scrollTop
        if (this.scrollTop > 300) {
          this.toTopShow = true
        }else {
          this.toTopShow = false
        }
      },
      scrollToTop() {
        let timer = null, _that = this
        // 动画，使用requestAnimationFrame代替setInterval
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(function fn() {
          if (_that.scrollTop > 0) {
            _that.scrollTop -= 50
            document.getElementById("scroller-box").children[0].scrollTop = _that.scrollTop
            timer = requestAnimationFrame(fn)
          } else {
            cancelAnimationFrame(timer)
            _that.toTopShow = false
          }
        })
      }
    },
    mounted() {
      // $nextTick 避免dom未加载
      this.$nextTick(function () {
        let targetScroll = document.getElementById("scroller-box").children[0]
        targetScroll.addEventListener('scroll', this.handleScroll)
      });
    },
    destroyed() {
      let targetScroll = document.getElementById("scroller-box").children[0]
      targetScroll.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>
<style scoped lang="scss">
  .icon {
    background: url('../../static/images/goodsDetail.png');
    width: 62rpx;
    height: 60rpx;
    display: inline-block;
    background-size: 500rpx 120rpx;
    background-position: 0 -1rpx;
  }
  .icon{
    width: 40rpx;
    height: 40rpx;
  }
  .gotop-icon{
    // background:#fff;
    background-position: -143rpx -38rpx;
    position: fixed;
    bottom: 210rpx;
    right: 10rpx;
    width: 80rpx;
    height: 80rpx;
  }
</style>
