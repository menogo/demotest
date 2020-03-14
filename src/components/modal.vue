<template>
  <div>
    <div :class="{'i-modal-mask-show': visible}" class="i-modal-mask i-class-mask"></div>
    <div :class="{'i-modal-show': visible}" class="i-class i-modal">
      <div class="i-modal-main">
        <div class="i-modal-content">
          <div class="i-modal-title" v-if="title">{{ title }}</div>
          <div class="i-modal-body"><slot></slot></div>
<!--          <div class="i-modal-actions" v-if="actions.length">
            <block v-if="actionMode === 'horizontal'">
              <button v-for="item in actions" :key="index" class="i-btn i-btn-long i-btn- i-btn-ghost i-btn-square">{{cancelText}}</button>
            </block>
            <block v-else>
              <div class="i-modal-action-vertical" v-for="(item, i) in actions" :key="i">
                <button v-for="item in actions" :key="index" class="i-btn i-btn-long i-btn- i-btn-ghost i-btn-square">{{okText}}</button>
              </div>
            </block>
          </div>-->
          <div class="i-modal-actions">
            <div class="i-modal-grid">
              <div class="modal-item i-modal-grid-item" v-if="showCancel">
                <button :key="index" class="i-btn i-btn-long i-btn- i-btn-ghost i-btn-square i-modal-btn-cancel" @click="handleClickCancel">{{cancelText}}</button>
              </div>
              <div class="modal-item i-modal-grid-item-last" v-if="showOk">
                <button :key="index" class="i-btn i-btn-long i-btn- i-btn-ghost i-btn-square i-modal-btn-ok" @click="handleClickOk">{{okText}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default() {
          return false
        }
      },
      title: {
        type: String,
        default() {
          return ''
        }
      },
      showOk: {
        type: Boolean,
        default() {
          return true
        }
      },
      showCancel: {
        type: Boolean,
        default() {
          return true
        }
      },
      okText: {
        type: String,
        default() {
          return '确定'
        }
      },
      cancelText: {
        type: String,
        default() {
          return '取消'
        }
      },
      // 按钮组，有此值时，不显示 ok 和 cancel 按钮
      actions: {
        type: Array,
        default() {
          return []
        }
      },
      // horizontal || vertical
      actionMode: {
        type: String,
        value: 'horizontal'
      }
    },
    data () {
      return {}
    },
    onLoad(options) {
    },
    created() {
    },
    onShow() {
    },
    components: {
    },
    methods: {
      handleClickCancel() {
        this.$emit('event', 0)
      },
      handleClickOk() {
        this.$emit('event', 1)
      }
    }
  }
</script>
<style lang="scss">.i-modal-grid {display: flex;.modal-item{flex: 1}}.i-btn{text-align:center;vertical-align:middle;touch-action:manipulation;cursor:pointer;background-image:none;white-space:nowrap;user-select:none;font-size:14px;border-radius:2px;border:0!important;position:relative;text-decoration:none;height:44px;line-height:44px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);color:#fff!important;background:#f7f7f7!important;color:#495060!important;margin:10px}.i-btn-hover{opacity:.9}.i-btn-long{border-radius:0;margin:0;box-shadow:none}.i-btn-large{height:48px;line-height:48px}.i-btn-small{height:40px;line-height:40px}.i-btn-primary{color:#fff!important;background:#2d8cf0!important}.i-btn-ghost{color:#fff!important;background:#fff!important;color:#495060!important}.i-btn-success{color:#fff!important;background:#ff9913!important}.i-btn-warning{color:#fff!important;background:#f90!important}.i-btn-error{color:#fff!important;background:#ed3f14!important}.i-btn-info{color:#fff!important;background:#2db7f5!important}.i-btn-circle{border-radius:44px}.i-btn-large.i-btn-circle{border-radius:48px}.i-btn-small.i-btn-circle{border-radius:40px}.i-btn-loading{opacity:.6}.i-btn-loading-inner{display:inline-block;margin-right:12px;vertical-align:middle;width:14px;height:14px;background:0 0;border-radius:50%;border:2px solid #fff;border-color:#fff #fff #fff transparent;animation:btn-spin .6s linear;animation-iteration-count:infinite}.i-btn-disabled{color:#bbbec4!important;background:#f7f7f7!important}.i-btn-inline{display:inline-block}@keyframes btn-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.i-modal{position:fixed;overflow:auto;top:0;right:0;bottom:0;left:0;height:100%;z-index:1000;display:flex;outline:0;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;transform:translateZ(1px);opacity:0;visibility:hidden}.i-modal-show{visibility:visible;opacity:1}.i-modal-mask{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:1000;transition:all .2s ease-in-out;opacity:0;visibility:hidden}.i-modal-mask-show{opacity:1;visibility:visible}.i-modal-main{width:270px;position:relative}.i-modal-content{border-radius:7px;padding-top:15px;position:relative;background-color:#fff;border:0;background-clip:padding-box;text-align:center;height:100%;overflow:hidden}.i-modal-body{max-height:100px;margin-bottom:15px;font-size:14px;color:#80848f;height:100%;line-height:1.5;overflow:auto}.i-modal-title{padding:6px 15px 15px;margin:0;font-size:18px;line-height:1;color:#1c2438;text-align:center}.i-modal-actions{margin:0 1px}.i-modal-action-vertical{position:relative}.i-modal-action-vertical:after{content:'';position:absolute;top:0;left:0;width:200%;height:200%;transform:scale(.5);transform-origin:0 0;pointer-events:none;box-sizing:border-box;border:0 solid #e9eaec;border-top-width:1px}.i-modal-grid{border-radius:0 0 7px 7px;border-left:none}.i-modal-grid-item,.i-modal-grid-item-last{padding:0;border-bottom:none}.i-modal-grid-item-last{border-right:none}.i-modal-btn-ok{color:#2d8cf0!important}.i-modal-btn-loading{display:inline-block;vertical-align:middle;margin-right:10px;width:12px;height:12px;background:0 0;border-radius:50%;border:2px solid #e5e5e5;border-color:#666 #e5e5e5 #e5e5e5 #e5e5e5;animation:btn-spin .6s linear;animation-iteration-count:infinite}.i-modal-btn-text{display:inline-block;vertical-align:middle}.i-modal-btn-icon{font-size:14px!important;margin-right:4px}@keyframes btn-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>
