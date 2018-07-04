// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerName: "",
    amount: "",
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput: true,
    countries: [],
    countryIndex: 0,
    checkboxItems: [
      { name: '是否绑定卡片', value: '0', checked: false },
    ],
    cardNo: "",
    password: "",
    payPwd: "",
    orderId: "",
    //可否使用指纹识别  默认false
    isfingerPrint: false,
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "70rpx",//输入框高度
      width: "550rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    },
    outTradeNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({ sellerName: options.sellerName, amount: options.amount, outTradeNo: options.outTradeNo})
    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    isZHIWEN(that)
    getUserCards(that);
    console.log("外部订单编号",options)
    wx.setStorageSync('countryIndex', 0);
    let payinfo = {};
    let goodsDetail = {};
    payinfo.totalAmount = accMul(that.data.amount, 100) ;
    payinfo.outTradeNo = that.data.outTradeNo ;
    payinfo.goodsDetail = wx.getStorageSync("goodsDetail");
    payinfo.accountNo = wx.getStorageSync("goodsDetail").accountNo.trim();
    wx.setStorageSync('payinfo', payinfo)
    // let that = this;
    // //获取缴费业务   假设缴费业务为水缴费
    // let payInfo = { sellerName: "南京市水费", amount: "888" }
    // let cardInfo = [];
    // cardInfo.push("5180****4787余额:213.97")
    // cardInfo.push("使用新卡支付")
    // that.setData({
    //   countries: cardInfo,
    //   sellerName: payInfo.sellerName,
    //   amount: payInfo.amount
    // })
    // //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    // wx.checkIsSupportSoterAuthentication({
    //   success(res) {
    //     for (var i in res.supportMode) {
    //       if (res.supportMode[i] == 'fingerPrint') {
    //         console.log("支持指纹识别", res.supportMode[i]); +
    //           that.setData({
    //             isfingerPrint: true
    //           })
    //       }
    //     }
    //   }
    // })

    // if(cardInfo.length<1){
    //   //无卡支付模态框
    //   that.setData({
    //     modalNoCardput: !that.data.modalNoCardput
    //   });
    // }else{
    //   //判断指纹支付还是密码支付
    //   var boole = that.data.isfingerPrint
    //   if (boole) {
    //     console.log("使用指纹支付")
    //     that.setData({
    //       modalCardput: !that.data.modalCardput
    //     });
    //   } else {
    //     console.log("使用密码框支付")
    //     that.setData({
    //       modalCardput2: !that.data.modalCardput2
    //     });
    //   }
    // }

},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //无卡支付模态框关闭按钮
  closeNoCardModal: function () {
    // this.setData({
    //   modalNoCardput: true,
    // })
    wx.navigateBack(1)
  },

  choose: function () {
    this.setData({
      modalCardput: true,
    })
    this.setData({
      chooseCardModel: false,
    })
  },

  //万商卡密码校验
  cardPwdInput: function (e) {
    if (e.detail.value.length == '6') {
      this.setData({
        cardPwdInputCss: 0,
        password: e.detail.value
      })
    }
  },

  //支付密码
  payPwdInput: function (e) {
    if (e.detail.value.length == '6') {
      this.setData({
        payPwd: e.detail.value
      })
    }
  },



  //是否绑定卡片
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },



  //有卡支付
  checkIsFingerPrint: function () {
    var boole = this.data.isfingerPrint
    let that = this;
    if (boole) {
      //查看是否有指纹
      wx.checkIsSoterEnrolledInDevice({
        checkAuthMode: 'fingerPrint',
        success(res) {
          if (res.isEnrolled == 1) {
            wx.startSoterAuthentication({
              requestAuthModes: ['fingerPrint'],
              challenge: '123456',
              authContent: '请验证已有的指纹，用于支付',
              success(res) {
                console.log(res)
                //识别成功 调用指纹支付接口
                console.log("识别指纹成功，调用指纹支付接口")
                wx.request({
                  url: 'https://pay.sanppay.com/order/pay',
                  method: 'put',
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                    body: {
                      outTradeNo: that.data.outTradeNo,
                      buyerCardNo: that.data.countries[that.data.countryIndex],
                      payAmount: accMul(that.data.amount,100)  
                    }
                  },
                  success: function (data) {
                    console.log("指纹支付", data)
                    console.log('下单信息', data)
                    if (data.data.code + "" == '200') {
                       wx.setStorageSync("payCardNum", that.data.countries[that.data.countryIndex]);
                      wx.redirectTo({
                          url: '/pages/prepay/msg_success?merch_name=' + '万商支付'
                      })
                    } else {
                      wx.redirectTo({
                        url: '/pages/prepay/msg_fail?failInfo=' + data.data.msg
                      })
                    }
                  },
                  fail: function () {
                    console.log('系统错误')
                  }
                })
                // wx.setStorageSync("payCardNum", that.data.countries[that.data.countryIndex]);
                // wx.redirectTo({
                //   url: '/pages/prepay/msg_success?merch_name=' + '万商支付'
                // })
              },
              fail(res) {
                console.log("识别失败", res)
                wx.showToast({
                  title: '识别失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })

          } else if (res.isEnrolled == 0) {
            wx.showToast({
              title: '无指纹',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(res) {
          wx.showToast({
            title: '异常',
            icon: 'none',
            duration: 2000
          })
        }
      })

    } else {
      wx.showToast({
        title: '无指纹功能，使用密码支付',
        icon: 'none',
        duration: 2000
      })
      //使用密码模态框支付
    }

  },

  //change值改变
  bindCountryChange: function (e) {
    var that = this;
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
      //改为原值
      that.setData({
        countryIndex: e.detail.value
      })
      wx.setStorageSync('countryIndex', e.detail.value);
  },

  // 指纹支付 使用密码按钮
  usePwd: function () {
    this.setData({
      modalCardput2: false
    })

  },

  //指纹支付模态框关闭按钮
  colsePrintPay: function () {
    // this.setData({
    //   modalCardput: true
    // })
    wx.navigateBack(1)
  },
  //密码支付模态框关闭按钮
  colsePwdPay: function () {
    this.setData({
      modalCardput2: true
    })

  },


})

function getUserCards(that){
  wx.request({
    url: 'https://account.sanppay.com/account/list',
    method: 'POST',
    data: {
      body: {
        acctType: "CARD",
        custId: wx.getStorageSync('custId')
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (data) {
      console.log(data);
      if (data.data.body != undefined) {
        wx.setStorageSync('cardInfo', data.data.body);
        var arrayList = [];
        for (var i = 0; i < data.data.body.length; i++) {
          arrayList.push(data.data.body[i].acctId)
        }
        console.log(arrayList)
        that.setData({
          countries: arrayList
        });
        //判断指纹支付还是密码支付
        var boole = that.data.isfingerPrint
        if (boole) {
          console.log("使用指纹支付")
          that.setData({
            modalCardput: !that.data.modalCardput
          });
        } else {
          console.log("使用密码框支付")
          that.setData({
            modalCardput2: !that.data.modalCardput2
          });
        }
      } else {
       //添加卡片
        wx.showModal({
          title: '提示',
          content: '亲爱的，您还没有卡片，请先添加卡片！',
          confirmText: "添加卡片",
          cancelText: "返回首页",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.redirectTo({ url: '/pages/addCard/addCard' })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        });
      }
    },
    fail: function () {
      console.log("添加卡片")
      console.log('系统错误')
    }
  })
}

function isZHIWEN(that){
  wx.checkIsSupportSoterAuthentication({
    success(res) {
      for (var i in res.supportMode) {
        if (res.supportMode[i] == 'fingerPrint') {
          console.log("支持指纹识别", res.supportMode[i]); +
            that.setData({
              isfingerPrint: true
            })
        }
      }
    }
  })
}

function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}