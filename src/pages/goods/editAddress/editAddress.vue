<template>
  <div class="page" v-if="show">
    <div class="fui-cell-group">
      <div class="fui-cell">
        <div class="fui-cell-label">收件人</div>
        <div class="fui-cell-info">
          <input class="fui-input" data-type="receiver" @change="onChange" placeholder="收件人" v-model="detail.receiver" />
        </div>
      </div>
      <div class="fui-cell">
        <div class="fui-cell-label">联系电话</div>
        <div class="fui-cell-info">
          <input class="fui-input" data-type="mobile" type="number" @change="onChange" placeholder="联系电话" v-model="detail.mobile"/>
        </div>
      </div>
      <div class="fui-cell">
        <div class="fui-cell-label">所在地区</div>
        <picker class="weui-btn" mode="region" :value="region" @change="onCityChange">
          <div class="fui-cell-info">{{!region[0] || !region[1] ? '请选择所在地区' : region[0] + '-' + region[1] + '-' + region[2]}}</div>
        </picker>
      </div>
      <div class="fui-cell">
        <div class="fui-cell-label">详细地址</div>
        <div class="fui-cell-info">
          <input class="fui-input" @change="onChange" data-type="address" placeholder="街道，楼牌号等" v-model="detail.address"/>
        </div>
      </div>
      <div class="fui-cell">
        <div class="fui-cell-label">邮编</div>
        <div class="fui-cell-info">
          <input class="fui-input" @change="onChange" data-type="zipCode" placeholder="请填写邮编" v-model="detail.zipCode"/>
        </div>
      </div>
    </div>
    <i-button @click="submit" type="success" shape="circle">{{subtext}}</i-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        id: null,
        posting: false,
        subtext: '保存地址',
        detail: {
          receiver: '',
          mobile: '',
          address: '',
          zipCode: ''
        },
        region: [], // 显示地区
        showPicker: false,
        pvalOld: [0, 0, 0],
        pval: [0, 0, 0],
        areas: [],
        street: [],
        streetIndex: 0,
        noArea: false,
        show: true
      }
    },
    onLoad(e) {
      this.id = e.id
      this.loadType = e.type
      if (this.id) {
        this.getDetail()
      }
      if (e.id) {
        wx.setNavigationBarTitle({
          title: '编辑收货地址'
        })
      }
    },
    onUnload() {
      Object.assign(this, this.$options.data())
    },
    components: {
    },
    methods: {
      getDetail () {
        this.$http.post(this.API.getReceiveById, {
          data: {
            id: this.id
          }
        }).then(e => {
          if (e.code === 0) {
            this.region = e.result.area.split('-')
            for (let key in e.result) this.detail[key] = e.result[key]
          }
        })
      },
      isEmptyObject (n) {
        for (let r in n) {
          return false
        }
        return true
      },
      submit: function () {
        let t = this
        let i = t.detail
        if (i.receiver === '' || !i.receiver) {
          return void wx.showToast({
            title: '请填写收件人',
            icon: 'none'
          })
        }
        if (i.mobile === '' || !i.mobile) {
          return void wx.showToast({
            title: '请填写联系电话',
            icon: 'none'
          })
        }
        if (t.region[0] === '' || !t.region[0]) {
          return void wx.showToast({
            title: '请选择所在地区',
            icon: 'none'
          })
        }
        if (i.address === '' || !i.address) {
          return void wx.showToast({
            title: '请填写详细地址',
            icon: 'none'
          })
        }
        this.posting = true
        let subParams = this.detail
        subParams.area = this.region.join('-')
        this.$http.post(this.API.saveReceive, {
          data: subParams
        }).then(i => {
          if (i.code !== 0) {
            this.posting = false
            wx.showToast({
              title: i.message,
              icon: 'none'
            })
            return
          }
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })
          setTimeout(function () {
            t.loadType === 'member' ? wx.navigateBack() : wx.redirectTo({
              url: '/pages/goods/editAddress/main'
            })
          }, 1e3)
        })
      },
      onChange: function (t) {
        let e = this
        let a = e.detail
        let r = t.currentTarget.dataset.type
        let s = t.mp.detail.value
        a[r] = s
      },
      onCityChange(t) {
        let value = t.mp.detail.value
        this.region = []
        value.forEach((item, index) => {
          this.region.push(item)
        })
        console.log(this.region)
      },
      getStreet: function (t, a) {
      },
      selectArea (t) {
        let e = t.currentTarget.dataset.area
        let a = this.getIndex(e, this.areas)
        this.pval = a
        this.pvalOld = a
        this.showPicker = true
      },
      bindChange (t) {},
      onCancel (t) {
        this.showPicker = false
      },
      onConfirm (t) {
        // eslint-disable-next-line one-var
        var e = this.data.pval,
          a = this.data.areas,
          i = this.data.detail
        i.province = a[e[0]].name
        i.city = a[e[0]].city[e[1]].name
        i.datavalue = a[e[0]].code + ' ' + a[e[0]].city[e[1]].code
        if (a[e[0]].city[e[1]].area && a[e[0]].city[e[1]].area.length > 0) {
          i.area = a[e[0]].city[e[1]].area[e[2]].name
          i.datavalue += ' ' + a[e[0]].city[e[1]].area[e[2]].code
          this.getStreet(a, e)
        } else {
          i.area = ''
        }
        i.street = ''
        this.detail = i
        this.streetIndex = 0
        this.showPicker = false
      },
      getIndex (t, e) {
        if (t.trim() === '' || !typeof e === 'array') {
          return [0, 0, 0]
        }
        let a = t.split(' ')
        let r = [0, 0, 0]
        for (let s in e) {
          if (e[s].name === a[0]) {
            r[0] = Number(s)
            for (let d in e[s].city) {
              if (e[s].city[d].name === a[1]) {
                r[1] = Number(d)
                for (var n in e[s].city[d].area) {
                  if (e[s].city[d].area[n].name === a[2]) {
                    r[2] = Number(n)
                    break
                  }
                }
                break
              }
            }
            break
          }
        }
        return r
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

</style>
