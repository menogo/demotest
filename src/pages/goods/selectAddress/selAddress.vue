<template>
  <div class="page">
    <block v-if="list.length > 0">
      <block v-for="(item, index) in list" :key = index>
        <div class="fui-list-group">
          <div class="fui-list address-item">
            <div class="fui-list-media" :data-index="index" @click="select(index)">
              <radio color="#ff9913" :checked="item.isDefault > 0" class="zoom-70" name="default" />
            </div>
            <div class="fui-list-inner" :data-index="index" @click="select(index)">
              <div class="title">{{item.receiver}} {{item.mobile}}</div>
              <div class="text">{{item.area}} {{item.address}}</div>
            </div>
            <navigator hover-class="none" open-type="redirect" class="fui-list-angle" :url="'/pages/goods/editAddress/main?id='+item.id+'&type=member'">
              <image src="/static/images/icon/edit.png" class="image-48"></image>
            </navigator>
          </div>
        </div>
      </block>
    </block>
    <div class="fui-loading empty" v-if="list.length < 1 && loaded">
      <div class="text">没有数据</div>
    </div>
    <div class="fui-navbar">
      <navigator hover-class="none" class="nav-item btn btn-danger" url="/pages/goods/editAddress/main?type=member">
        <image class="image-48" src="/static/images/icon-white/add.png"></image>
        <text>添加收货地址</text>
      </navigator>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        currentPage: 1,
        loaded: !1,
        list: [],
        show: true // 默认false，到时修改
      }
    },
    onShow() {
      this.getList()
    },
    components: {
    },
    methods: {
      getList(e) {
        this.$http.post(this.API.getReceiveList, {
          data: {
            pageNo: this.currentPage,
            pageSize: 10
          }
        }).then(res => {
          if (res.code === 0) {
            this.loaded = !0
            this.list = res.result.data
            this.show = !0
          }
        })
      },
      select(i) {
        wx.setStorageSync('orderAddress', this.list[i])
        wx.navigateBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../scss/fui.scss";
.address-item {
  padding-bottom: 20rpx;
}

.address-item radio {
  vertical-align: top;
  margin-top: -2rpx;
}

.address-item image {
  margin-right: 5rpx;
  margin-top: -8rpx;
}

.fui-list-inner .bar {
  font-size: 28rpx;
}

.btn-del {
  margin-left: 10rpx;
}

.btn-del text, .btn-edit text {
  display: inline-block;
  font-size: 26rpx;
  line-height: 26rpx;
}
  .btn-danger {
    background-color: #fbb03b !important;
    border-color: #fbb03b !important;
  }

</style>
