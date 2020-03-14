<template>
  <div class="page">
    <p class="tab"  v-if="visitorFlag === 1">
      <span @click="goback">取消</span>
      <span class="right" @click="addCustomer">保存</span>
    </p>
    <p class="title"><i class="line"></i> 旅客姓名</p>
    <i-panel>
      <i-input v-model="form.visitorName" @change="inputChange($event, 'visitorName')" title="中文姓名" autofocus maxlength="5" placeholder="姓名"/>
    </i-panel>
    <p class="tips">为了顺利出行，请确保出行姓名与证件一致</p>
    <p class="title"><i class="line"></i> 证件</p>
    <i-panel>
      <picker class="weui-btn" @change="pickerChange('cardType', $event)" :value="form.cardType" :range="cardType" >
        <i-input :value="cardType[form.cardType]" title="证件类型" disabled />
      </picker>
      <i-input :value="form.idCard" @change="inputChange($event, 'idCard')" title="证件号码" autofocus maxlength="100" placeholder="证件号码" />
    </i-panel>
    <p class="title"><i class="line"></i> 其他信息</p>
    <i-panel>
      <picker class="weui-btn" mode="date" :value="form.birthday" start="1900-01-01" end="2099-01-01" @change="pickerChange('birthday', $event)">
        <i-input :value="form.birthday" title="生日" placeholder="请选择" disabled />
      </picker>
      <picker class="weui-btn" @change="pickerChange('sex', $event)" :value="form.sex" :range="pickerData.sex" >
        <i-input :value="pickerData.sex[form.sex]" title="性别" placeholder="请选择" disabled />
      </picker>
      <i-input :value="form.phone" @change="inputChange($event, 'phone')" title="手机号码" placeholder="常用手机号" maxlength="100"/>
    </i-panel>

    <div class="btn-wrap" v-if="visitorFlag === 0"><Button type="primary" @click="addCustomer" style="background-color: #fbb03b">保存</Button></div>
    <div class="btn-wrap" v-if="visitorFlag === 1"><Button type="primary" @click="delCustomer" style="background-color: #fbb03b">删除</Button></div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      id: '', // 游客id（查询详情）
      options: '',
      visitorFlag: 0, // 0: 新增 1：编辑or删除
      cardType: [],
      pickerData: {
        cardTime: ['5年', '10年', '20年'],
        sex: ['男', '女']
      },
      form: {
        visitorName: '',
        cardType: 0,
        idCard: '',
        birthday: '',
        sex: 0,
        phone: '',
        id: ''
      }
    }
  },
  onLoad(options) {
    this.options = options
    if (this.options.id) { // 查看出行人详情（编辑/删除）
      this.visitorFlag = 1
      this.id = this.options.id
      this.getCustomerDetail()
      wx.setNavigationBarTitle({
        title: '出行人详情'
      })
    } else { // 新增出行人
      this.visitorFlag = 0
    }
  },
  onShow() {
    this.getCustomerType()
    this.now = dayjs().format('YYYY-MM-DD')
  },
  onUnload() {
    Object.assign(this, this.$options.data())
  },
  methods: {
    // 新增游客
    addCustomer () {
      if (this.visitorFlag === 1) {
        this.form.id = this.options.id // 编辑旅客
      }
      if (this.form.visitorName === '') {
        wx.showToast({
          title: '请填写旅客姓名',
          icon: 'none'
        })
        return
      }
      if (this.form.idCard === '') {
        wx.showToast({
          title: '请填写证件号码',
          icon: 'none'
        })
        return
      }
      if (this.form.phone === '') {
        wx.showToast({
          title: '请填写手机号码',
          icon: 'none'
        })
        return
      }
      let subForm = Object.assign({}, this.form)
      subForm.sex = parseInt(subForm.sex, 0) + 1
      console.log(this.form, subForm)
      this.$http.post(this.API.addCustomer, {
        data: subForm
      }).then(res => {
        if (res.code === 0) {
          wx.showToast('新增成功')
          this.goback()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 查询游客详情
    getCustomerDetail () {
      this.$http.post(this.API.customerDetail, {
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 0) {
          let data = res.result
          if (data.birthday) {
            data.birthday = data.birthday.substring(0, 10)
          }
          this.form = {
            visitorName: data.visitorName,
            cardType: data.cardType,
            idCard: data.idCard,
            birthday: data.birthday,
            sex: data.sex,
            phone: data.phone
          }
          if (this.options.id && this.options.type === 'passport') {
            this.form.cardType = 4
            this.form.idCard = ''
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 删除游客
    delCustomer () {
      this.$http.post(this.API.deleteCustomer, {
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
          this.goback()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 返回列表页
    goback() {
      // wx.redirectTo({
      //   url: '/pages/meInfo/commonInfo/main'
      // })
      wx.navigateBack({
        delta: 1
      })
    },
    // 获取证件类型
    getCustomerType() {
      this.$http.post(this.API.cardType).then(res => {
        res.result.forEach((item) => {
          this.cardType.push(item.name)
        })
      })
    },
    inputChange(e, attr) {
      console.log(e.mp.detail.detail.value)
      this.form[attr] = e.mp.detail.detail.value
      // if (attr === 'visitorName') {
      //   e.replace(/\D/g, '')
      // }
    },
    pickerChange(attr, e) {
      console.log(attr, e)
      this.form[attr] = e.target.value
    }
  }

}
</script>

<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #f4f4f4;
}
.tab{
  background: #fbb03b;
  color: #fff;
  height: 50rpx;
  padding: 10rpx 30rpx;
  .right{
    float: right
  }
}
.title{
  padding-top: 20rpx;
  padding-bottom: 10rpx;
  color: #495060;
  background: #fff;
  padding-left: 20rpx;
  margin-top: 20rpx;
  .line{
    width: 8rpx;
    height: 28rpx;
    background-color: #ff9913;
    display: inline-block;
    margin-right: 5rpx;
  }
}
.tips{
  padding-top: 20rpx;
  color: #495060;
  font-size: 26rpx;
  margin-left: 20rpx;
}
.i-cell {
  padding: 12px 15px;
  display: flex;
  background: #fff;
  align-items: center;
  line-height: 1.4;
  font-size: 14px;
  overflow: hidden;
}
.i-input {
  padding: 7px 15px;
  color: #495060;
}
.i-cell::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border: 0 solid #e9eaec;
  border-bottom-width: 1px;
  left: 15px;
  right: 0;
}
.i-input-title {
  min-width: 65px;
  padding-right: 10px;
}
.i-input-input {
  line-height: 1.6;
  padding: 4px 0;
  min-height: 22px;
  height: auto;
  font-size: 14px;
}
input {
  display: block;
  height: 1.4rem;
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  min-height: 1.4rem;
}
  .btn-wrap {
    padding: 40px 20px;
  }





</style>
