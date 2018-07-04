//index.js
//获取应用实例
import { String } from '../../utils/util.js';
import hexMD5 from '../../utils/util.js'; 
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: "",
    modalPwdput: true,
    Pwd: "",
    imgUrls: [
      'http://bus.sanppay.com/wanshang-web-protal/RES/newIndex/others/xinbai.jpg',
      'http://bus.sanppay.com/wanshang-web-protal/RES/newIndex/others/maidelong.jpg',
      'http://bus.sanppay.com/wanshang-web-protal/RES/newIndex/others/xinhuashudian.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    storeList:[],
    shouquan:true,
    shouquanButton:false,
    user_code: "",
    iv:"",
    encryptedData:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
  var that = this;
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log("是否有新版本：",res.hasUpdate)
  })

    updateManager.onUpdateReady(function () {
    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    console.log("更新新版本并重启")
    updateManager.applyUpdate()    
    })

  //获取主页推荐商户信息
  getStoreList(that);
    //获取accessToke
    wx.request({
      url: 'https://account.sanppay.com/accessToken',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      success: function (data) {
        console.log(data);
        wx.setStorageSync('accessToke', data.data); 
      },
      fail: function () {
        console.log('系统错误')
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },





  saoyisao: function () {//定义函数名称
    var that = this;
    var show;
 
    if (wx.getStorageSync('userInfo')){
      wx.scanCode({
        success: (res) => {
          console.log(res)
          show = res;
          //扫描成功提示
          wx.showToast({
            title: '跳转中',
            icon: 'loading',
            duration: 2000
          }),
            //成功后请求后台
            wx.request({
            url: 'https://master.merchant.sanppay.com/api/getMerchInfoByQrcode',
              data: {
                merchOutQrcode: show.result,
              },
              header: {
                "Content-Type": "application/json"
              },
              method: "POST",
              success: function (res) {
                //查询二维码的信息
                console.log("以下为查询二维码信息")
                console.log(res);
                if (res.data.code == 200 && res.data.body != null) {
                  wx.setStorageSync('CashierDest', res.data.body[0]);
                  wx.navigateTo({ url: '/pages/preorder/preorder?qrcode=' + show.result })
                } else {
                  wx.showModal({
                    content: '无效商户二维码',
                    showCancel: false,
                  });
                }
              },
              fail: function (err) { },//请求失败
              complete: function () {
                //跳转收营台页面

              }//请求完成后执行的函数
            })
        },
        fail: (res) => {
          wx.showToast({
            title: '不能识别的二维码',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，无法使用此功能。',
        success: function (res) {
          if (res.confirm) {
           
          }
        }
      })
    }

   
  },

  //模态框小程序密码取消按钮  
  payCancel: function () {
    this.setData({
      modalPwdput: true
    });
  },

  
  PwdInput: function (e) {
    this.setData({
      Pwd: e.detail.value
    })
  },

  chargeInfo:function(){
    //跳转到订单页面
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({ url: '/pages/orderInfo/orderInfo' })
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，无法使用此功能。',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
    }
  },
  wsLogin:function(){

  },
  // 商户大全
  toScbh: function () {
    wx.navigateTo({url: '/pages/scbh/scbh',})
  },

  //线上商城
  shangcheng:function(){
    wx.navigateTo({ url: '/pages/shangcheng/shangcheng', })
  },

  detailedMechantInfo: function (event){

    wx.navigateTo({ url: '/pages/detailedMechant/detailedMechant?id=' + event.currentTarget.id, })
  },

  index:function(){
    wx.navigateTo({ url: '/pages/index/index' })
  },
  /**
   * 商户页面
   */
  find :function(){
    wx.switchTab({
     url: '/pages/find/find'})
  },
  
  //便民服务
  bmfw:function(){
    wx.navigateTo({ url: '/pages/bmfw/bmfw' })
  },
  /**
   * 客服电话
   */
  kfdh :function(){
    wx.makePhoneCall({
      phoneNumber: '4000255788' 
    })
  },
  /**
   * 卡片充值
   */
  charge:function(){
      wx.navigateToMiniProgram({ 
        appId: 'wxd2efee8cf3cbd5f2',
        envVersion: 'develop',
        success(res) {
            console.log(res)
        }
      })  
  },
  /**
   * 签到抽奖
   */
  integral:function(){
    wx.navigateTo({ url: '/pages/integral/integral' })
  },
  /**
   * 商务合作
   */
  businessCooperation:function(){
    wx.navigateTo({ url: '/pages/business/business' }) 
  },
  /**
   * 授权按钮事件
   */

  changeLoading: function (res) {
    var that  = this;
    var code = this.data.user_code;
  },
  /**
   * 影音游戏
   */
  yyyx: function () {
    wx.navigateTo({ url: '/pages/videogame/videogame' })
  },


})



// 以下********************************************************** 方法区

function getUnionId(that){
  //获取用户信息
  //1、调用微信登录接口，获取code
  wx.login({
    success: function (r) {
      console.log("用户信息：" + JSON.stringify(r));
      var code = r.code;//登录凭证
      if (code) {
        //2、调用获取用户信息接口
        console.log("2、调用获取用户信息接口")
        wx.getUserInfo({
          withCredentials: false,
          success: function (res) {
            console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
            //3.解密用户信息 获取unionId
            wx.request({
              url: 'https://cashiertest.sanppay.com/wxsp/decodeUserInfo',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
              success: function (data) {
                console.log("获取自己服务器返回的结果:" + JSON.stringify(data))
                //4.解密成功后 获取自己服务器返回的结果
                if (data.data.status == 1) {
                  var userInfo_ = data.data.userInfo;
                  console.log(userInfo_)
                  wx.setStorageSync('userInfo', data.data);
                  that.setData({
                    userInfo: data.data.userInfo,
                  })
                  //绑定用户
                  wx.request({
                    url: 'https://cashiertest.sanppay.com/wxsp/card/bindUser',
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      userId: wx.getStorageSync('userInfo').userInfo.openId,
                      unionId: wx.getStorageSync('userInfo').userInfo.unionId,
                    },
                    success: function (data) {

                      //判断用户是否是第一次登陆有没有设置过支付密码
                      // wx.request({
                      //   url: 'https://cashiertest.sanppay.com/wxsp/user/query',
                      //   method: 'post',
                      //   header: {
                      //     'content-type': 'application/x-www-form-urlencoded'
                      //   },
                      //   data: {
                      //     unionId: wx.getStorageSync('userInfo').userInfo.unionId,
                      //   },
                      //   success: function (data) {
                      //     console.log("以下为用户查询接口的值")
                      //     console.log(data)
                      //     if (!data.data.success) {
                      //       wx.showModal({
                      //         content: '请设置支付密码以便支付',
                      //         showCancel: false,
                      //         success: function (res) {
                      //           if (res.confirm) {
                      //             console.log('用户点击确定')
                      //             wx.navigateTo({ url: '/pages/setPassword/setPassword' })
                      //           }
                      //         }
                      //       });
                      //     }
                      //   }
                      // })

                    },
                    fail: function () {
                      console.log('系统错误')
                    }
                  })

                } else {
                  console.log('解密失败')
                }

              },
              fail: function () {
                console.log('系统错误')
              }
            })

          },
          fail: function (res) {
            console.log('获取用户信息失败')
            console.log(res)
            that.setData({
                     shouquan: false
              })
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，将无法正常使用扫码功能.请同意使用我的信息，以便我们为您服务',
              success: function (res) {
                if (res.confirm) {
                    // wx.getSetting({
                    //   success(res){
                    //     if(!res.authSetting['scope.userInfo']){
                    //       wx.authorize({
                    //         scope: 'scope.userInfo',
                    //         success(){},
                    //         fail(){
                    //           wx.openSetting({
                    //             success: res => {
                    //                 res.authSetting ={
                    //                   'scope.userInfo':true,
                    //                   'scope.userLocation':true
                    //                 }
                    //                 wx.navigateTo({ url: '/pages/index/index' })
                    //             }
                    //           })
                    //         }
                    //       })
                    //     }
                    //   }
                    // })

                  that.setData({
                    shouquan: true
                  })

                }else{
                  wx.getSetting({
                    success(res) {
                      if (!res.authSetting['scope.userInfo']) {
                        wx.authorize({
                          scope: 'scope.userInfo',
                          success() { },
                          fail() {
                            wx.openSetting({
                              success: res => {
                                res.authSetting = {
                                  'scope.userInfo': true,
                                  'scope.userLocation': true
                                }
                                wx.navigateTo({ url: '/pages/index/index' })
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            })

          }
        })

      } else {
        console.log('获取用户登录态失败！' + r.errMsg)
      }
    },
    fail: function () {
      callback(false)
    }
  })
}

// 获取主页推荐商户
function getStoreList(that){
  wx.request({
    url: 'https://cashiertest.sanppay.com/merchant/info',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
     
    },
    success: function (data) {
      console.log("以下为主页推荐商户信息")
      console.log(data);
      if(data.data.subCode=="SUCCESS"){
        that.setData({
          storeList:data.data.data.data
        })
      }
    }
  })
}

/**
 * 获取微信用户信息
 */
function getUnionIdNew(that) {
  wx.login({
    success: function (r) {
      console.log("用户信息：" + JSON.stringify(r));
      var code = r.code;//登录凭证
      if (code) {
        //2、调用获取用户信息接口
        console.log("2、调用获取用户信息接口")

        if (wx.getStorageSync('userInfo').userInfo == null){
          that.setData({
            shouquan: false
          })

        }
        that.setData({
          user_code: code
        })
      
      }
    }
  })
}