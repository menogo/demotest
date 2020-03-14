<template>
    <div>
      <rich-text :nodes="remark"></rich-text>
      <!-- <img src="https://deer99.com/imgSer/resource/image/drjs.jpg" alt="" class="int-img" mode="widthFix"> -->
    </div>
</template>
<script>
import parse from 'mini-html-parser2'
export default {
  data () {
    return {
      remark: '',
      themeImg: require('../../../../static/images/common/themeBg.jpg'),
      miniIcon2: require('../../../../static/images/common/miniIcon2.jpg')
    }
  },
  onShow () {
    this.getDarenExplain()
  },
  methods: {
    getDarenExplain() {
      this.$http.post(this.API.queryPageContent, {
        data: {
          type: 4
        },
        showLoading: false
      }).then(res => {
        if (res.code === 0) {
          let data = decodeURIComponent(res.result[0].content)
          console.log(data)
          // decodeURIComponent('值')
          let content = data.replace(/<img/gi, '<img style="width:100%;height:auto"')
          parse(content, (err, nodes) => { // 插件转化兼容更多图片
            if (!err) {
              this.remark = nodes
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.int-img{
  width: 100%;
  display: block;
  // height: 100%;
}
</style>