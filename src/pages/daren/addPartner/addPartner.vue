<template>
    <div>
      <div class="wrapper">
        <div class="input-wrap">
          <span class="label">标题</span>
          <input class="input" type="text" v-model="title" />
        </div>
        <div class="input-wrap">
          <span class="label">类型</span>
          <picker :value="typeIndex" :range="typeData" class="input sel" @change="bindTypeChange($event)">
            <span class="input sel">{{typeData[typeIndex]}}</span>
          </picker>
        </div>
        <div class="input-wrap">
          <span class="label">出行时间</span>
          <div class="picker-wrap">
            <picker mode="date"
                    :value="startTime"
                    end="2217-09-01" class="picker" @change="bindDateChangeStart($event)">
              <span class="input">{{startTime}}</span>
            </picker>
            <!-- <span class="s">~</span> -->
            <!-- <picker mode="date"
                    :value="endTime"
                    class="picker"
                    end="2217-09-01" @change="bindDateChangeEnd($event)">
              <span class="input">{{endTime}}</span>
            </picker> -->
          </div>
        </div>
        <div class="input-wrap">
          <span class="label">出行天数</span>
          <input class="input" type="number" v-model="day" />
        </div>
        <div class="input-wrap">
          <span class="label">目的地</span>
          <input class="input" type="text" v-model="destination" />
        </div>
        <div class="input-wrap">
          <span class="label">联系方式</span>
          <input class="input" type="text" v-model="contact" />
        </div>
        <div class="input-wrap">
          <span class="label">内容</span>
          <textarea class="textarea" cols="30" rows="10" maxlength="100000" v-model="content"></textarea>
        </div>
        <div class="btn-bg">
          <button class="save-btn" @click="submit">发布</button>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      typeIndex: -1,
      typeData: [],
      typeIdData: [],
      title: '',
      typeId: '',
      startTime: '',
      // endTime: '',
      day: '',
      destination: '',
      contact: '',
      content: ''
    }
  },
  onLoad () {
  },
  onUnload() {
    // Object.assign(this, this.$options.data())
  },
  onShow () {
    this.resetData()
    this.getTypeList()
  },
  methods: {
    resetData() {
      this.typeIndex = -1
      this.typeData = []
      this.typeIdData = []
      this.title = ''
      this.typeId = ''
      this.startTime = ''
      // this.endTime = ''
      this.day = ''
      this.destination = ''
      this.contact = ''
      this.content = ''
    },
    getTypeList() {
      this.$http.post(this.API.partnerTypeList, {
        data: {}
      }).then(res => {
        if (res.code === 0) {
          res.result.data.forEach(item => {
            this.typeData.push(item.typeName)
            this.typeIdData.push(item.id)
          })
        }
      })
    },
    bindDateChangeStart (e) {
      this.startTime = e.mp.detail.value
      // if (this.startTime && this.endTime && this.startTime > this.endTime) {
      //   this.startTime = ''
      //   wx.showToast({title: '开始时间不能大于结束时间', icon: 'none'})
      // }
    },
    bindDateChangeEnd (e) {
      this.endTime = e.mp.detail.value
      if (this.startTime && this.endTime && this.startTime > this.endTime) {
        wx.showToast({title: '开始时间不能大于结束时间', icon: 'none'})
        this.endTime = ''
      }
    },
    bindTypeChange(e) {
      this.typeIndex = e.mp.detail.value
    },
    submit() {
      if (this.title.trim() === '') {
        wx.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return
      }
      if (this.typeIndex === -1) {
        wx.showToast({
          title: '请选择类型',
          icon: 'none'
        })
        return
      }
      if (this.startTime === '') {
        wx.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        return
      }
      // if (this.endTime === '') {
      //   wx.showToast({
      //     title: '请选择结束时间',
      //     icon: 'none'
      //   })
      //   return
      // }
      if (this.day.trim() === '') {
        wx.showToast({
          title: '请输入天数',
          icon: 'none'
        })
        return
      }
      if (this.destination.trim() === '') {
        wx.showToast({
          title: '请输入目的地',
          icon: 'none'
        })
        return
      }
      if (this.contact.trim() === '') {
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none'
        })
        return
      }
      if (this.contact.trim() === '') {
        wx.showToast({
          title: '请输入联系电话',
          icon: 'none'
        })
        return
      }
      if (this.content.trim() === '') {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      this.$http.post(this.API.partnerSave, {
        data: {
          title: this.title,
          typeId: this.typeIdData[this.typeIndex],
          departureTime: this.startTime,
          returnTime: '',
          day: this.day,
          destination: this.destination,
          contact: this.contact,
          content: this.content
        }
      }).then(res => {
        if (res.code === 0) {
          wx.showToast({
            title: '发布成功'
          })
          this.resetData()
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/daren/partnerIndex/main?type=2'
            })
          }, 1500)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-bg {
    background: #fff;
    width: 100%;
    padding: 20rpx 0;
    margin-top: 20rpx;
    .save-btn {
      background: #fbb03b;
      color: #fff;
      font-size: 28rpx;
      border: none;
      height: 80rpx;
      line-height: 80rpx;
      margin: 0 30 rpx;
      border-radius: 50rpx;
      border-radius: 50rpx;
    }
  }
  .wrapper {
    padding: 0 20rpx;
    background-color: #fff;
    min-height: 100vh;
  }
  .input-wrap {
    display: flex;
    line-height: 64rpx;
    margin: 0 20rpx;
    padding: 20rpx 0;
    span{
      color: #666;
    }
    .label {
      width: 150rpx;
      margin-right: 20rpx;
    }
    .input {
      display: block;
      flex: 1;
      height: 64rpx;
      padding: 0 20rpx;
      border-bottom: 1px solid #d8d8d8;
    }
    .s {
      margin: 0 20rpx;
    }
    .textarea {
      padding: 0 20rpx;
      border: 1px solid #d8d8d8;
    }
  }
  .picker-wrap {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .picker {
      flex: 1;
    }
  }
</style>
