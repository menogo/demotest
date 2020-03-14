<template>
  <div>
    <SwitchCity
      :mapKey="mapKey"
      :hotCityList="hotCityList"
      @bindCity="bindCity"
      @bindCounty="bindCounty"
    />
  </div>
</template>

<script>
/* eslint-disable */
import SwitchCity from '../../components/SwitchCity';
import config from '../../utils/mapConfig';
export default {
  data () {
    return {
      flag: '' // destina： 选择目的地
    }
  },
  computed: {
    mapKey() {
      return config.key;
    },
    hotCityList() {
      return [
        [
          {city: '北京市', code: '110000'},
          {city: '上海市', code: '310000'},
          {city: '广州市', code: '440100'}
        ],
        [
          {city: '深圳市', code: '440300'},
          {city: '杭州市', code: '330100'},
          {city: '南京市', code: '320100'}
        ],
        [
          {city: '武汉市', code: '420100'},
          {city: '天津市', code: '120000'},
          {city: '西安市', code: '610100'}
        ]
      ];
    }
  },
  components: {
    SwitchCity: SwitchCity
  },
  onLoad (options) {
    this.flag = options.flag
    console.log(this.flag)
  },
  methods: {
    bindCity(e) {
      // TODO: 选择城市之后的逻辑事件
      // if (wx.getStorageSync('userCity') == e.city) {
      //   return
      // }

      if (this.flag === 'destina' ) { // 选择目的地
        wx.setStorageSync('destinaCity', e.city);
      } else {
        // 选择城市后，存为selectCity 出发地
        wx.setStorageSync('selectCity', e.city);
      }

      // 返回上一页
      wx.navigateBack(-1)
    },
    bindCounty(e) {
      wx.setStorage({
        key: 'CITY_INFO',
        data: e
      });
    }
  }
};
</script>
