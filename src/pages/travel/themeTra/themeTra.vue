<template>
  <div class="page">
    <banner :showSelect = "true" :flag = 6 :currentCity = 'currentCity'></banner>
    <!-- 二级菜单 -->
    <div class="cell-icon-box"  v-if="secThemelList && secThemelList.length > 0">
      <div class="cell-icon-item" v-for="(item, index) in secThemelList" :key = index>
        <img :src="item.imgUrl" alt="">
        <span>{{item.menuName}}</span>
      </div>
      <!-- <div class="cell-icon-item" >
        <img :src="freetimeImg" alt="">
        <span>研学旅行</span>
      </div> -->
    </div>
    <!-- 精选路线 -->
    <selectedTra  :parentId = "parentId" v-if="parentId"></selectedTra> 
    <!-- 热门推荐 -->
    <recommend :parentId = "parentId" v-if="parentId"></recommend>
  </div>
</template>

<script>
import banner from '@/components/common/banner'
import recommend from '@/components/travel/recommend'
import selectedTra from '@/components/travel/selectedTra'
export default {
  data () {
    return {
      currentCity: '深圳市',
      parentId: '', // 父级Id
      secThemelList: '' // 二级菜单
    }
  },

  onLoad (options) {
    this.parentId = options.parentId
    wx.setNavigationBarTitle({
      title: options.title
    })
  },

  mounted () {
    // 获取二级菜单
    this.getSecThemelList()
    if (!wx.getStorageSync('selectCity')) {
      this.myLocation = wx.getStorageSync('userCity')
    } else {
      this.myLocation = wx.getStorageSync('selectCity')
    }
  },
  methods: {
    getSecThemelList() {
      this.$http.post(this.API.getMenu, {
        data: {
          menuIndex: 6, // 1-旅游度假菜单 2-主题旅游菜单 3-机票酒店菜单 4-本地特色菜单 5-旅游产品二级菜单 6-主题二级菜单
          parentId: this.parentId // 一级菜单默认-1
        }
      }).then(res => {
        if (res.code === 0) {
          this.secThemelList = res.result
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  },
  components: {
    banner,
    recommend,
    selectedTra
  }
}
</script>

<style lang="scss" scoped>
.page{
  min-height: 100vh;
  background: #f4f4f4;
}
.cell-icon-box {
  background: #fff;
  display: flex;
  padding-bottom: 50rpx;
  flex-wrap: wrap;
  .cell-icon-item{
    text-align: center;
    font-size: 26rpx;
    width: 20%;
    padding-top: 50rpx;
    img{
      width: 55rpx;
      height: 55rpx;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
