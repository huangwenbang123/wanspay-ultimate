const app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 小程序支付测试
   */
  chargeTest: function () {
    wx.request({
      url: 'https://master.order.sanppay.com/wxsp/charge/test',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        let payInfo = JSON.parse(res.data.data.payInfo)
        wx.requestPayment({
          'timeStamp': payInfo.timeStamp,
          'nonceStr': payInfo.nonceStr,
          'package': payInfo.package,
          'signType': payInfo.signType,
          'paySign': payInfo.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
          }
        })

      }
    })
  },

  goToIndex: function (e) {
    let that = this;
    if (that.data.userInfo.unionId != null) {
      wx.switchTab({
        url: '../index/index',
      });
    }
    console.log(e)
    if (e.detail.userInfo) {
      console.log("用户已同意")
      wx.login({
        success: login_res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(login_res.code)
          wx.login({
            success: login_res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log("code is :" + login_res.code)
              wx.request({
                url: 'https://account.sanppay.com/decodeUserInfo',
                method: "POST",
                data: {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  code: login_res.code,
                  xcxFlag: "wszf"
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.msg == "解密成功") {
                    app.globalData.userInfo = res.data.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    wx.setStorage({
                      key: "userInfo",
                      data: res.data.userInfo,
                      
                    })
                    wx.switchTab({
                      url: '../index/index',
                    });
                  }
                },
              })
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
      
    } else {
      console.log("用户未同意")
    }
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "万商支付"
    })
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo
      })
    })


  },
  onReady() {
    setTimeout(() => {
      this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange((res) => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (this.data.angle !== angle) {
        this.setData({
          angle: angle
        });
      }
    });
  },

});