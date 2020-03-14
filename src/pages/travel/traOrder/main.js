import Vue from 'vue'
import App from './traOrder'

// add this to handle exception
Vue.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err)
  }
}

console.log(App)
const app = new Vue(App)
app.$mount()
