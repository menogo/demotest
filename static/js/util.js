function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isArray(n) {
  if (Array.isArray) return Array.isArray
  // eslint-disable-next-line valid-typeof
  return typeof n === 'array'
}
function orderPay (orderId) {
  this.$http.post(this.API.wxPay, { // 微信支付下单
    data: {
      orderId,
      openId: wx.getStorageSync('openId'),
      type: 1
    }
  }).then(res => {
    // 调微信支付
    let obj = res.result
    requestPayment(obj)
  })
}
function requestPayment (obj) {
  wx.requestPayment({
    'timeStamp': obj.timeStamp,
    'nonceStr': obj.nonceStr,
    'package': obj.package,
    'paySign': obj.paySign,
    'signType': obj.signType,
    'success': (res) => {
      this.goOrderList()
    },
    'fail': (res) => {
      this.goOrderList()
    }
  })
}
export default {
  formatTime,
  isArray,
  orderPay
}
