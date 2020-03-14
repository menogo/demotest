<template>
  <div>
    <ul class="tab">
      <li class="active">深圳市出发</li>
      <li>深圳市出发</li>
      <li>深圳市出发</li>
      <li>深圳市出发</li>
      <li>深圳市出发</li>
      <li>深圳市出发</li>
    </ul>
    <div class="flight-info">
      <div class="flight-item">
        <div></div>
        <div>
          <span></span>
          <span>3840</span>
          <span>起/人</span>
        </div>
        <div>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.tab{
  background: #fff;
  display: flex;
  overflow: scroll;
  border-bottom: 1rpx solid #f4f4f4;
  li{
    display: block;
    min-width: 140rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-right: 40rpx;
    color: #353535;
    font-size: 26rpx;
    text-align: center;
    padding: 10rpx 0;
  }
  li.active{
    color: #fbb03b;
    border-bottom:5rpx solid #fbb03b;
  }
  li:first-child{
    margin-left: 40rpx;
  }
  li:last-child{
    margin-right: 0;
  }
}
.flight-info{
  background: #fff;
  .flight-item{

  }
}

</style>

