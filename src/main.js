import Vue from 'vue'
import App from './App'

import http from './utils/http'
import API from './utils/api'
import util from './utils/util'
import 'mpvue-weui/src/style/weui.css'

Vue.prototype.$http = http
Vue.prototype.API = API
Vue.prototype.util = util

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
