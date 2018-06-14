import hexMD5 from '../../utils/util.js';
import { String } from '../../utils/util.js';
Page({
  data: {
    images: {},
    merchName: '',
    amount: "",
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput: true,
    countries: [],
    countryIndex: 0,
    chooseCardModel: true,
    cardPwdInputCss: 1,
    cardNumInputCss: 1,
    payPwdInputCss: 1,
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
    }
  },

  onLoad: function (options) {
    var that = this;
    that.setData({ merchName: wx.getStorageSync("CashierDest").merchName })

    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
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
    wx.setStorageSync('countryIndex', 0);
  },


  prepay: function (e) {
    var that = this;
    var amount = that.data.amount;
    //判断小数点后面有没有数据 如果没有则去小数点前面的数据
    if (amount.indexOf(".") > 0) {
      console.log("有点有点")
      var arrAmount = new Array();
      arrAmount = amount.split(".");
      if (arrAmount[1] == "") {
        amount = arrAmount[0];
        that.setData({
          amount: amount
        });

      }
    }
    console.log("付款金额为：" + amount);
    wx.setStorageSync('amount', amount);
    if (amount == 0 || amount == null || amount == '' || typeof (amount) == "undefined") {
      wx.showToast({
        title: '请输入支付金额',
        icon: 'loading',
        duration: 2000
      })
      return;
    }

    //预下单
    wx.request({
      url: 'https://pay.sanppay.com/order/precreate',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        body: {
          outTradeNo: wx.getStorageSync('userInfo').unionId + dataHms(),
          sellerId: wx.getStorageSync('CashierDest').merchId + "",
          sellerName: wx.getStorageSync('CashierDest').sellerId,
          operatorId: wx.getStorageSync('userInfo').unionId,
          buziType: "SCANPAY",
          totalAmount: (amount * 100).toFixed(0),
          currency: "CNY",
          subject: "扫码支付",

        }
      },
      success: function (data) {
        console.log(data)
        wx.setStorageSync('outTradeNo', data.data.body.outTradeNo);
        //获取用户卡片信息
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
            if ( data.data.body != undefined) {
              wx.setStorageSync('cardInfo', data.data.body);
              var arrayList = [];
              for (var i = 0; i < data.data.body.length; i++) {
                arrayList.push(data.data.body[i].acctId)
              }
              arrayList.push("使用新卡支付")
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
              console.log("无卡支付模态框")
              //无卡支付模态框
              that.setData({
                modalNoCardput: !that.data.modalNoCardput
              });
            }

          },
          fail: function () {
            console.log('系统错误')
          }
        })


      },
      fail: function () {
        console.log('系统错误')
      }
    })



  },
  //金額輸入矫正并获取正确的金额
  amountInput: function (e) {
    if (e.detail.value != '' && e.detail.value.substr(0, 1) == '.') {
      e.detail.value = "";
    }
    e.detail.value = e.detail.value.replace(/^\./g, ""); //只保留第一个. 清除多余的
    e.detail.value = e.detail.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (e.detail.value.substr(0, 1) == '0' && e.detail.value.length == 2) {
        e.detail.value = e.detail.value.substr(1, e.detail.value.length);
      }

    }
    this.setData({
      amount: e.detail.value
    })
  },

  //获取formId
  submitInfo: function (e) {
    console.log('以下是formId')
    console.log(e.detail.formId);
    wx.setStorageSync('form_id', e.detail.formId);
  },

  PwdInput: function (e) {
    this.setData({
      Pwd: e.detail.value
    })
  },


  //无卡支付模态框关闭按钮
  closeNoCardModal: function () {
    this.setData({
      modalNoCardput: true,
    })
  },

  choose: function () {
    this.setData({
      modalCardput: true,
    })
    this.setData({
      chooseCardModel: false,
    })
  },

  //卡号校验
  cardNumInput: function (e) {
    if (e.detail.value.length == '19') {
      this.setData({
        cardNumInputCss: 0,
        cardNo: e.detail.value
      }),
        this.setData({
          cardNumIconCss: true
        })
    } else {
      this.setData({
        cardNumInputCss: 1,
      }),
        this.setData({
          cardNumIconCss: false
        })

    }
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


  //支付按钮
  noCardPay: function () {
    let that = this;
    console.log("无卡支付操作")
    var cardNo = that.data.cardNo;
    var password = this.data.password;
    if (cardNo == "" || password == "") {
      wx.showModal({
        content: '请输入正确的数据',
        showCancel: false,
      });
      return;
    }
    console.log("===========>" + cardNo + "," + password);
    // 校验卡片
    wx.request({
      url: 'https://account.sanppay.com/account/check',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'body': {
          'custId': wx.getStorageSync('custId'),
          'acctId': that.data.cardNo,
          'acctSecret': password
        }
      },
      success: function (data) {
        //支付
        wx.request({
          url: 'https://pay.sanppay.com/order/pay',
          method: 'put',
          header: {
            'content-type': 'application/json'
          },
          data: {
            body: {
              outTradeNo: wx.getStorageSync('outTradeNo'),
              buyerCardNo: that.data.cardNo,  
              payAmount: that.data.amount * 100
            }
          },
          success: function (res) {
            //判断是否要绑定卡片
            console.log("===============", that.data.checkboxItems[0].checked )
            if (that.data.checkboxItems[0].checked&&(res.data.code+"" == '200')) {
              console.log("===============绑定卡片===============")
              
              wx.request({
                url: 'https://account.sanppay.com/account/add',
                method: 'post',
                header: {
                  'content-type': 'application/json'
                },
                'data': {
                  "body": {
                    "acctType": "CARD",
                    "custId": wx.getStorageSync('custId'),
                    "acctId": that.data.cardNo,
                    "acctSecret": password
                  }

                },
              })
            }
            console.log('下单信息', res)
            if (res.data.code+"" == '200') {
              wx.setStorageSync("payinfo", res.data.body)
              wx.redirectTo({
                url: '/pages/prepay/msg_success'
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


      }
    })
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
                      outTradeNo: wx.getStorageSync('outTradeNo'),
                      buyerCardNo: that.data.countries[that.data.countryIndex],
                      payAmount: that.data.amount * 100
                    }
                  },
                  success: function (data) {
                    console.log("指纹支付", data)
                    console.log('下单信息', data)
                    if (data.data.code+"" == '200') {
                      wx.setStorageSync("payinfo", data.data.body)
                      wx.redirectTo({
                        url: '/pages/prepay/msg_success'
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
    if (that.data.countries[e.detail.value] == "使用新卡支付") {
      //新卡支付
      console.log("跳转使用新卡支付模态框~~~~")
      //关闭原模态框并打开新的模态框
      that.setData({
        modalNoCardput: !that.data.modalNoCardput
      });

    } else {
      //改为原值
      that.setData({
        countryIndex: e.detail.value
      })
      wx.setStorageSync('countryIndex', e.detail.value);
    }

  },

  // 指纹支付 使用密码按钮
  usePwd: function () {
    this.setData({
      modalCardput2: false
    })

  },

  //指纹支付模态框关闭按钮
  colsePrintPay: function () {
    this.setData({
      modalCardput: true
    })

  },
  //密码支付模态框关闭按钮
  colsePwdPay: function () {
    this.setData({
      modalCardput2: true
    })

  },


})



function dataHms() {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  var n = timestamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();
  console.log("当前时间：" + h + ":" + m + ":" + s);
  let time = "" + Y + "" + M + "" + D + "" + h + "" + m + "" + s;
  return time;
}