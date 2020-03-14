<template>
    <div>
      <rich-text :nodes="rule"></rich-text>
    </div>
</template>
<script>
import parse from 'mini-html-parser2'
export default {
  data () {
    return {
      rule: ''
    }
  },
  onShow () {
    this.$http.post(this.API.queryPageContent, {
      data: {
        type: 5
      }
    }).then(res => {
      if (res.code === 0) {
        let rule = decodeURIComponent(res.result[0].content)
        // decodeURIComponent('值')
        let content = rule.replace(/<img/gi, '<img style="width:100%;height:auto"')
        parse(content, (err, nodes) => { // 插件转化兼容更多图片
          if (!err) {
            this.rule = nodes
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>

