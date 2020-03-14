/* eslint-disable*/
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// function getImageInfo () {
//   return new Promise((resolve,reject) => {
//     wx.getImageInfo({
//       src: 'http://47.107.108.203:81/resource/image/share1.jpg',
//       success: res => {
//         const ctx = wx.createCanvasContext('shareCanvas')
//         ctx.drawImage(res.path, 0, 0, 375, 600)
//         // 小程序码
//         const qrImgSize = 80
//         ctx.drawImage('/static/images/common/lab3.png', (375 - qrImgSize) / 2, 490, 80, 80)
//         ctx.stroke()
//         ctx.draw()
//         resolve(res)
//       },
//       fail: res => {
//         console.log(res)
//         reject(error)
//       }
//     })
//   })
// }

function getLocation(successFn) {
  const mapKey = '2J7BZ-UQNCU-KTHVZ-2ECMY-5AVYH-EQFX2'
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${mapKey}`,
          success: res => {
            successFn && successFn(res.data.result)
            wx.setStorageSync('userCity', res.data.result.ad_info.city)
            resolve(res)
          }
        })
      },
      fail: function(error) {
        wx.setStorageSync('userCity', '北京市')
        reject(error)
      }
    })
  })
}

export default {
  formatNumber,
  formatTime,
  // getImageInfo,
  getLocation

}
