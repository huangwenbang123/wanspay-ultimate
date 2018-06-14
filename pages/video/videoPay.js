import hexMD5 from '../../utils/util.js';
import { String } from '../../utils/util.js';
Page({
  data: {
    cardlist:[],
    bizContent: [],
    amount: "",
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput:true,
    countries: [],
    countryIndex: 0,
    isfingerPrint: false,    //可否使用指纹识别  默认false
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
    console.log("=============onload===============")
    wx.setStorageSync("countryIndex",0);
    var bizContent= JSON.parse(options.bizContent);
      wx.setStorageSync('payinfo', bizContent);
    console.log(options.bizContent)
    var that = this;
    that.setData({
      bizContent: bizContent
    })
    that.setData({
      amount: (bizContent.totalAmount / 100).toFixed(2)
    });

/*******************检查手机是否有指纹识别***********/
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

/*******************获取卡片信息***********/
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: 'https://account.sanppay.com/account/list',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "acctType": "CARD",
          "custId": wx.getStorageSync("custId")
        }

      },
      success: function (data) {

        if (data.data.body != undefined) {
          var cardlist = [];
          var cardinfo=[];
          for (var index in data.data.body) {
            console.log("卡号信息", data.data.body)
            var card = data.data.body[index];
            if (card.acctState == "VALID") {
              cardlist.push(card.acctId);
              cardinfo.push({ card: card.acctId, amount: card.acctBal})
            }
          }
          wx.setStorageSync("cardinfo", cardinfo);

          that.setData({
            countries: cardlist
          })
        }else{
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
                wx.redirectTo({ url: '/pages/index/index' })
              }
            }
          });
        }
      }
    })

/***************预下单************* */
    wx.request({
      url: 'https://pay.sanppay.com/order/precreate',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": bizContent
      },
      success: function (data) {

        console.log("预下单成功",data)
        

        if (data.data.code== "200") {

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
          wx.navigateBack({ changed: true });
        }

      },
      fail: function () {
        console.log('系统错误')
      }
    })

  },
  //有卡支付
  checkIsFingerPrint: function () {
    var that=this;
    var boole = that.data.isfingerPrint
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
               
                let countryIndex = that.data.countryIndex;
              let card=  wx.getStorageSync("cardinfo");
              let amount = that.data.amount;
      
              if (amount * 100 > card[countryIndex].amount){
                showmodel("余额不足,请检查卡片！", 'none');
                return;
              }
              
              wx.setStorageSync("payCardNum", card[countryIndex].card);
                //识别成功 调用指纹支付接口
                console.log("识别指纹成功，调用指纹支付接口")
                wx.request({
                  url: 'https://pay.sanppay.com/order/pay',
                  method: 'put',
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                   "body":{
                     "outTradeNo": that.data.bizContent.outTradeNo
                     , "buyerCardNo": card[countryIndex].card
                     , "payAmount": amount*100
                     
                   }
                  },
                  success: function (data) {
                    console.log("指纹支付",data)
                    if (data.data.code == '200' ){
                      wx.redirectTo({
                        url: '/pages/prepay/msg_success'
                      })
                    } else {
                      wx.redirectTo({
                      
                        url: '/pages/prepay/msg_fail?failInfo='+data.data.msg
                      })
                    }
                  },
                  fail: function () {
                    console.log('系统错误')
                  }
                })

              },
              fail(res) {
                showmodel("识别失败", 'none');
              }
            })

          } else if (res.isEnrolled == 0) {
            showmodel("无指纹", 'none');
          
          }
        },
        fail(res) {
          showmodel("异常", 'none');
        }
      })

    } else {
      showmodel("无指纹功能", 'none');
      //使用密码模态框支付
    }

  },
  usePwd: function () {
    this.setData({
      modalCardput2: false
    })

  },
  //指纹支付模态框关闭按钮
  colsePrintPay: function () {
    wx.navigateBack({ changed: true });

  },
  //密码支付模态框关闭按钮
  colsePwdPay: function () {
    wx.navigateBack({ changed: true });

  },
  bindCountryChange:function(e){
    var value = e.detail.value;
    wx.setStorageSync("countryIndex", value);

   let inputData= this.data.inputData;
   inputData.input_value = '';
    this.setData({
      countryIndex: value,
      inputData: inputData
    })
    
  }


})

function showmodel(title, icon){
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000
  })
}