//app.js

App({

  onLaunch: function() {
    var that = this;
    var QQMapWX = require('qqmap-wx-jssdk.js');
    var qqmapsdk;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //获得用户的当前地址信息
    qqmapsdk = new QQMapWX({
      key: 'YE4BZ-RXGCS-UUAO3-6W5QX-6EVAZ-KOBQ5'
    });
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log("获得地址信息成功  is ", res);
            //将城市信息放入input 
            let addressInfo = [];
            let city = res.result.address_component.city;
            let province = res.result.address_component.province;
            let cityCode = res.result.ad_info.city_code;
            let provinceCode = res.result.ad_info.adcode;


            cityCode = cityCode.substring(3, cityCode.length);
            provinceCode = provinceCode.replace(provinceCode.substring(3, 6), "000");
            addressInfo.push(city);
            addressInfo.push(province);
            addressInfo.push(cityCode);
            addressInfo.push(provinceCode);
            addressInfo.push(province.substring(3, 6));
            that.globalData.addressInfo = addressInfo;
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            console.log(res);
          }
        });

        qqmapsdk.getCityList({
          success: function(res) {
            console.log("城市列表:", res);
          },
        });

        qqmapsdk.getDistrictByCityId({
          success: function(abc) {
            console.log("城市区县:", abc);
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            console.log(res);
          }
        });
      }
    })
  },
  getUserInfo(cb) {
    var that = this;
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      // 查看是否授权
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              withCredentials: true,
              success: function(res) {
                console.log("已授权并且以下为用户信息")
                console.log(res)
                wx.login({
                  success: login_res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    console.log("code is :" + login_res.code)
                    wx.request({
                      url: 'https://account.sanppay.com/decodeUserInfo',
                      method: "POST",
                      data: {
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        code: login_res.code,
                        xcxFlag: "wszf"
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      success: function(res) {
                        console.log("nidaye", res)
                        that.globalData.userInfo = res.data.userInfo
                        typeof cb == "function" && cb(that.globalData.userInfo)
                        //添加一个用户账户
                        customerAdd(that);
                      },
                    })
                  }
                })
              }
            })
          }
        }
      })

    }
  },


  globalData: {
    userInfo: null,
    addressInfo: {}
  }


})

/**
 * 添加账户
 */
function customerAdd(that) {
  console.log("以下为用户信息")
  console.log(that.globalData.userInfo)
  wx.request({
    url: 'https://account.sanppay.com/customer/add',
    method: 'POST',
    data: {
      body: {
        thirdCustId: that.globalData.userInfo.unionId,
        custName: that.globalData.userInfo.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
        custType: 'wxsp'
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      console.log(res.data)
      wx.setStorage({
        key: "custId",
        data: res.data.body.custId
      })
    }
  })
}