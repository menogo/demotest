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
    <div class="fui-loading empty" v-if="list.length < 1 && loaded">
      <div class="text">没有数据</div>
    </div>
    <i-modal title="提示" :visible="showDelModal" :actions="delAction" @click="sureDel">
      <view>删除后无法恢复哦</view>
    </i-modal>
  </div>
</template>
<script>
  import addressList from '@/components/address'
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
    onShow() {
      this.getList()
    },
    components: {
      addressList
    },
    methods: {}
  }
</script>
<style lang="scss" scoped></style>
