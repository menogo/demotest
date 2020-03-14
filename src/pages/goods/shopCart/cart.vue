<template>
  <div class="page 1footer-navbar">
    <block v-for="(item, index) in merch_list" :key = index>
      <div class="fui-cell-group fui-cell-click">
        <navigator class="fui-cell" hover-class="none" :url="'/pages/goods/shop/main?id='+item.merchantId">
          <div class="shop-icon"></div>
          <div class="fui-cell-text">{{item.merchantName}}</div>
          <div class="fui-cell-remark"></div>
        </navigator>
      </div>
      <block v-for="(val, key) in item.items" :key = key>
        <div class="fui-list-group cartlist">
          <div class="fui-list noclick">
            <radio @click="selected(val)" :checked="val.selected" class="zoom-90" color="#ff9913" :data-id="val.sku.stockId" :data-select="val.selected"/>
            <navigator class="fui-list-media" :url="'/pages/goods/goodsDetail/main?id='+val.sku.productId">
              <image class="round" :src="val.sku.imgUrl || val.sku.thumbnailImg"></image>
            </navigator>
            <navigator class="fui-list-inner" :url="'/pages/goods/goodsDetail/main?id='+val.sku.productId">
              <div class="car_subtitle">{{val.sku.productName}}</div>
              <div class="text cart-option" v-if="val.sku.stockId != 0">
                <div class="choose-option">{{val.sku.specName}}</div>
              </div>
            </navigator>
            <div class="fui-list-angle">
              <text class="price">￥{{val.sku.price}}</text>
              <div class="fui-number small" :data-min="1">
                <div @click="number('minus', item.merchantId, val.sku.stockId, val)" data-action="minus" class="action-btn minus" :class="{disabled: val.num <= 1}">-</div>
                <input disabled="true" name="" type="tel" :value="val.num" class="num shownum">
                </input>
                <div @click="number('add', item.merchantId, val.sku.stockId, val)" data-action="plus" class="action-btn plus" :class="{disabled: val.num >= val.sku.stock}">+</div>
              </div>
            </div>
          </div>
        </div>
      </block>
    </block>
    <empty :list="merch_list" text="暂无数据!"></empty>
    <div class="fui-footer" v-if="!empty">
      <div class="tool">
        <div class="check">
          <label @click="checkall">
            <radio class="zoom-70" color="#ff9913" :checked="ischeckall"/>全选
          </label>
        </div>
        <div class="text">
          <div class="title" v-if="!edit">合计：
            <text class="text-danger">{{totalprice}}元</text>
          </div>
         <!-- <div class="subtitle">不含运费</div> -->
        </div>
        <div class="btns">
          <text :class="{disabled: selectList.length<=0}" class="btn btn-default-o" data-action="move" @click="editEvt('move')" v-if="edit">移动到关注</text>
          <text :class="{disabled: selectList.length<=0}" class="btn btn-danger-o" data-action="delete" @click="editEvt('delete')" v-if="edit">删除</text>
          <text class="btn btn-default-o" data-action="complete" v-if="edit" @click="editEvt('complete')">完成</text>
          <text class="btn btn-default-o" data-action="edit" v-if="!edit" @click="editEvt('edit')">编辑</text>
          <text :class="{disabled: selectList.length<=0}" class="btn btn-danger-o" data-action="pay" @click="editEvt('pay')" v-if="!edit">结算({{selectList.length}})</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from '@/components/common/empty'
export default {
  data () {
    return {
      merch_list: !1,
      list: !1,
      edit_list: [],
      totalprice: 0, // 合计
      edit: false,
      empty: false,
      total: 0,
      ischeckall: false,
      selectList: [],
      editcheckall: false
    }
  },
  onLoad(options) {
  },
  onShow() {
    this.empty = false
    this.edit = false
    this.ischeckall = false
    this.editcheckall = false
    this.selectList = []
    this.totalprice = 0
    this.get_cart()
  },
  components: {
    empty
  },
  methods: {
    get_cart() {
      this.edit_list = []
      this.$http.post(this.API.getCartList, {
        data: {}
      }).then(res => {
        if (res.code === 0) {
          this.merch_list = res.result.merchants
          this.resetSelected()
          if (this.merch_list.length <= 0) {
            this.empty = true
          }
        }
      })
    },
    resetSelected() {
      this.merch_list.forEach(item => {
        item.items.forEach(item => {
          this.$set(item, 'selected', false)
          this.edit_list.push(item)
        })
      })
    },
    selected(val) {
      val.selected = !val.selected
      this.setSelected()
    },
    setSelected() {
      this.selectList = []
      // this.resetSelected()
      this.merch_list.forEach(pitem => {
        pitem.items.forEach(item => {
          if (item.selected) {
            item.merchantId = pitem.merchantId
            this.selectList.push(item)
          }
        })
      })
      if (this.selectList.length === this.edit_list.length) {
        this.ischeckall = true
      } else {
        this.ischeckall = false
      }
      this.setCountPrice()
    },
    setCountPrice() {
      let params = []
      this.selectList.forEach(item => {
        params.push({
          merchantId: item.merchantId,
          stockId: item.sku.stockId,
          num: item.num
        })
      })
      this.itemJson = JSON.stringify(params)
      this.$http.post(this.API.calcCountPrice, {
        data: {
          itemJson: this.itemJson
        }
      }).then(res => {
        this.totalprice = res.result
      })
    },
    number(type, merchantId, stockId, item) {
      if (item.num <= 1 && type === 'minus') {
        return
      }
      if (item.num >= item.sku.stock && type === 'add') {
        wx.showToast({
          title: '不能大于最大库存',
          icon: 'none'
        })
        return
      }
      let url
      if (type === 'add') {
        url = this.API.addCartCount
      } else if (type === 'minus') {
        url = this.API.minusCartCount
      }
      this.$http.post(url, {
        data: {
          merchantId,
          stockId
        }
      }).then((res) => {
        if (res.code === 0) {
          if (type === 'add') {
            item.num++
          } else {
            item.num--
          }
          this.setCountPrice()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    editEvt: function (t) {
      switch (t) {
        case 'edit':
          this.edit = !0
          break
        case 'complete':
          this.edit = !1
          break
        case 'move':
          this.move()
          break
        case 'delete':
          this.delete()
          break
        case 'pay':
          if (this.selectList.length > 0) {
            wx.navigateTo({
              url: `/pages/goods/confirmOrder/main?type=1&noActive=1&itemJson=${this.itemJson}`
            })
          }
      }
    },
    checkall() {
      this.ischeckall = !this.ischeckall
      this.merch_list.forEach(item => {
        item.items.forEach(item => {
          item.selected = this.ischeckall
        })
      })
      this.setSelected()
    },
    move() {
      if (this.selectList.length <= 0) {
        return
      }
      wx.showModal({
        title: '提示',
        content: '功能暂未开发！',
        success(res) {},
        fail() {

        }
      })
    },
    delete() {
      if (this.selectList.length <= 0) {
        return
      }
      let that = this
      let params = []
      this.selectList.forEach(item => {
        params.push({
          merchantId: item.merchantId,
          stockId: item.sku.stockId
        })
      })
      wx.showModal({
        title: '提示',
        content: '你确定要删除吗？',
        success(res) {
          if (res.confirm) {
            that.$http.post(that.API.delCart, {
              data: {
                removeJson: JSON.stringify(params)
              }
            }).then(res => {
              if (res.code === 0) {
                wx.setStorageSync('buyer_cart', res.result)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                that.get_cart()
                this.selectList = []
                this.setSelected()
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
  @import "../../../scss/fui.scss";
  .page{
    padding-bottom: 100rpx;
    .fui-cell-group:nth-child(1){
      margin-top: 0;
    }
  }
  .fui-number {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    box-sizing: border-box;
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    font-size: 26rpx;
    margin: 0;
    height: 60rpx;
    width: 200rpx;
    border: 1px solid #d9d9d9;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    overflow: hidden;
  }

  .minus, .plus {
    width: 60rpx;
    height: 60rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #999;
    position: relative;
    text-align: center;
    background: #f7f7f7;
    line-height: 60rpx;
    z-index: 1;
  }

  .plus {
    border-left: 1px solid #d9d9d9;
  }

  .minus {
    border-right: 1px solid #d9d9d9;
  }

  .fui-number .num {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 40rpx;
    color: #666;
    text-align: center;
    border: 0;
  }

  .disabled {
    background: #fff;
  }

  .adress {
    font-size: 27rpx;
    color: #666;
  }

  .shop {
    margin: 8rpx 0 0 10rpx;
  }

  .edtion {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 20rpx 0;
  }

  .consume, .store {
    margin-left: 10rpx;
  }

  .goods-info .num {
    font-size: 28rpx;
    color: #999;
    width: 260rpx;
    margin-right: 10rpx;
  }

  .list-padding {
    padding: 16rpx 30rpx;
  }

  .totle {
    font-size: 28rpx;
  }

  .order-status {
    color: #888;
    text-align: right;
    font-size: 30rpx;
    margin-right: 8rpx;
  }

  .fui-modal {
    position: fixed;
    background: rgba(0, 0, 0, 0.7) none repeat scroll 0 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1000;
  }

  .fui-modal-info {
    position: fixed;
    width: 100%;
    z-index: 1001;
    text-align: center;
    top: 50rpx;
  }

  .fui-modal-info .code {
    width: 450rpx;
    height: 450rpx;
    margin: 50rpx 0;
  }

  .tap {
    text-align: center;
    color: #f90;
    font-size: 40rpx;
    line-height: 50rpx;
  }

  .close {
    text-align: right;
    padding: 30rpx;
  }

  .close image {
    width: 80rpx;
    height: 80rpx;
  }

  .send-code {
    display: none;
  }

  .fui-cell-group.toggleSend-group .send-code {
    display: block;
    font-size: 26rpx;
  }

  .fui-cell-group.toggleSend-group .fui-cell .fui-cell-remark::after {
    -webkit-transform: rotate(135deg);
    -ms-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  .cart-option {
    margin-top: 8rpx;
  }

  .fui-cell-group {
    // margin-top: 40rpx;
    border: none;
  }

  .cartlist {
    margin-top: -2rpx;
  }

  .price {
    text-align: right;
    display: inline-block;
    width: 100%;
    color: #999;
    font-size: 26rpx;
  }

  .left {
    left: -100rpx;
  }

  checkbox {
    padding-right: 20rpx;
  }

  .empty {
    padding: 260rpx 150rpx;
  }

  .light {
    height: 260rpx;
    width: 240rpx;
  }

  .text-cancel {
    padding-top: 60rpx;
    font-size: 34rpx;
  }

  .fui-list-inner .car_subtitle {
    position: relative;
    font-size: 26rpx;
    color: #444;
  }

  .fui-number {
    height: 40rpx;
    width: 130rpx;
  }

  .minus, .plus {
    display: inline-block;
    width: 40rpx;
    height: 40rpx;
    font-size: 40rpx;
    line-height: 40rpx;
    text-align: center;
  }

  .fui-list-angle {
    margin-right: 0;
  }
  .price {
    color: #fb3305;
  }

  .shop-icon {
    background: url('../../../../static/images/goodsDetail.png');
    background-position: -2rpx -67rpx;
    width: 39rpx;
    height: 20px;
    line-height: 0;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    margin-top: 5px;
    background-size: 500rpx 120rpx;
  }

</style>
