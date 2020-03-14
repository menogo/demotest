<template>
  <div class="page footer" v-if="show">
    <block>
      <block v-for="(item, index) in list" :key = index>
        <div class="fui-list-group">
          <div class="fui-list address-item noclick">
            <div class="fui-list-inner">
              <div class="title">{{item.receiver}} {{item.mobile}}</div>
              <div class="text">{{item.area}}  {{item.address}}</div>
              <div class="bar">
                <div @click="deleteItem(item.id)" class="pull-right btn-del">
                  <image class="image-32" src="/static/images/icon/delete.png"></image>
                  <text>删除</text>
                </div>
                <navigator hover-class="none" class="pull-right btn-edit" :url="'/pages/goods/editAddress/main?id='+item.id+'&type=member'">
                  <img class="image-32" src="/static/images/icon/edit.png" />
                  <text>编辑</text>
                </navigator>
                <label @click="setDefault(item.id)">
                  <radio color="#fbb03b" :checked="item.isDefault > 0 ? true : false" class="zoom-70" name="default" />设为默认地址
                </label>
              </div>
            </div>
          </div>
        </div>
      </block>
    </block>
    <div class="fui-navbar">
      <navigator hover-class="none" class="nav-item btn btn-danger" url="/pages/goods/editAddress/main?type=member">
        <image class="image-48" src="/static/images/icon-white/add.png"></image>
        <text>添加收货地址</text>
      </navigator>
    </div>
    <empty :list="list"></empty>
  </div>
</template>
<script>
  import empty from '@/components/common/empty'
  export default {
    data: function () {
      return {
        currentPage: 1,
        loaded: !1,
        list: [],
        delAction: [
          {
            name: '取消',
            index: 0
          },
          {
            name: '删除',
            color: '#ed3f14',
            loading: false,
            index: 1
          }
        ],
        showDelModal: false,
        show: true // 默认false，到时修改
      }
    },
    created() {
      this.getList()
    },
    onShow() {
      this.getList()
    },
    components: {
      empty
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
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      setDefault (id) {
        this.$http.post(this.API.setAddressDefault, {
          data: {
            id
          }
        }).then(res => {
          if (res.code === 0) {
            wx.showToast({
              title: '设置成功',
              icon: 'success'
            })
            this.getList()
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      },
      deleteItem (id) {
        let that = this
        wx.showModal({
          title: '提示',
          content: '你确定要删除吗？',
          success(res) {
            if (res.confirm) {
              that.$http.post(that.API.delReceiver, {
                data: {
                  id
                }
              }).then(res => {
                if (res.code === 0) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
                  setTimeout(() => {
                    that.getList()
                  }, 1500)
                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
              })
            } else {
            }
          },
          fail() {

          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../scss/fui.scss";
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

</style>
