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

function orderPay (orderId, successFn, failFn) {
  this.$http.post(this.API.wxPay, { // 微信支付下单
    data: {
      orderId,
      openId: wx.getStorageSync('openId'),
      type: 1
    }
  }).then(res => {
    // 调微信支付
    let obj = res.result
    requestPayment(obj, successFn, failFn)
  })
}

function cancelOrder (data, fun) {
  this.$http.post(this.API.cancelShopOrder, {
    data,
    showLoading: false
  }).then(res => {
    if (res.code === 0) {
      fun && fun(res.result)
    } else {
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }
  })
}

function requestPayment (obj, sucFn, failFn) {
  wx.requestPayment({
    'timeStamp': obj.timeStamp,
    'nonceStr': obj.nonceStr,
    'package': obj.package,
    'paySign': obj.paySign,
    'signType': obj.signType,
    'success': (res) => {
      sucFn && sucFn(res)
    },
    'fail': (res) => {
      failFn && failFn(res)
    }
  })
}

function timestampFormat (timestamp) {
  timestamp = typeof timestamp === 'string' ? (new Date(timestamp).getTime() / 1000) : timestamp
  function zeroize(num) {
    return (String(num).length === 1 ? '0' : '') + num
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000) // 当前时间戳
  var timestampDiff = curTimestamp - timestamp // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象

  // eslint-disable-next-line one-var
  let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate()
  // eslint-disable-next-line one-var
  let H = tmDate.getHours(), i = tmDate.getMinutes()

  if (timestampDiff < 60) { // 一分钟以内
    return '刚刚'
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + '分钟前'
  } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
    return '今天' + zeroize(H) + ':' + zeroize(i)
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000) // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i)
    } else if (curDate.getFullYear() === Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i)
    } else {
      return Y + '-' + zeroize(m) + '-' + zeroize(d) + '- ' + zeroize(H) + ':' + zeroize(i)
    }
  }
}

export default {
  formatTime,
  isArray,
  orderPay,
  cancelOrder,
  timestampFormat
}
