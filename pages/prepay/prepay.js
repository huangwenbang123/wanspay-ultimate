import { String } from '../../utils/util.js';

Page({
  data: {
    modalCardput:true,
    cardNumIconCss:false,
    cardPwdIconCss: false,
    countries:[],
    countryIndex:0,
    cardPwdInputCss:1,
    cardNumInputCss:1,
    cardNo:"",
    password:"",
    orderId:"",
  },
  
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'CashierDest',
      success: function (res) {
        that.setData({
          sellerName: res.data.sellerName,
          outOrderId: res.data.orderId,
          amount: options.amount,
          orderId:options.orderId,
        })
      }
    })

    //获取用户卡片信息
    wx.request({
      url: 'https://cashiertest.sanppay.com/wxsp/card/query',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        unionId: wx.getStorageSync('CashierDest').buyerId,
        tradeAmount: options.amount*100
      },
      success: function (data) {
       console.log(data);
       wx.setStorageSync('cardInfo', data.data.biz_content);
       if (!String.isBlank(data.data.biz_content)){
         var arrayList =[] ;
         for (var i = 0;i < data.data.biz_content.length;i++){
           arrayList.push(data.data.biz_content[i].cardNo + "余额:" + data.data.biz_content[i].cardBal);
         }
        console.log(arrayList)
          that.setData({
            countries: arrayList
          });
       }
      },
      fail: function () {
        console.log('系统错误')
      }
    })

  },

  //模态框支付取消按钮  
  payCancel: function () {
    this.setData({
      modalCardput: true
    });
  },
  //模态框支付确认按钮
  payConfirm: function () {
   //获得卡号和密码
    if (this.data.cardNo.length == '19' && this.data.password.length=='6') {
      //卡片绑定并支付
      wx.request({
        url: 'https://cashiertest.sanppay.com/wxsp/card/pay',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: wx.getStorageSync('userInfo').userInfo.openId,
          unionId: wx.getStorageSync('userInfo').userInfo.unionId,
          orderId: this.data.orderId,
          cardNo: this.data.cardNo,
          password: this.data.password,
          newUser:true
        },
        success: function (data) {
          console.log(data)
          //4.
          if (data.data.biz_content.transStatus =="SUCCESS") {
            console.log("支付成功");
            //将支付信息存入缓存
            wx.setStorageSync('payInfo', data.data);
            wx.navigateTo({
              url: 'msg_success'
            })
          } else {
            console.log('预下单失败')
            wx.setStorageSync('payInfo', data.data);
            wx.navigateTo({
              url: 'msg_fail'
            })
          }
        },
        fail: function () {
          console.log('系统错误')
        }
      })

    }else{
      wx.showModal({
        content: '卡号或密码输入格式不正确，请检查后重新输入！',
        showCancel: false,
      });
    }
  } ,

  //支付按钮
  pay: function(){
    if (String.isBlank(this.data.countries)){
      //弹出模态框
      this.setData({
        modalCardput: !this.data.modalCardput  
      })
    }else{
      console.log("支付操作")
      var cardNo = this.data.countries[this.data.countryIndex];
      //卡片绑定并支付
      wx.request({
        url: 'https://cashiertest.sanppay.com/wxsp/card/pay',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: wx.getStorageSync('userInfo').userInfo.openId,
          unionId: wx.getStorageSync('userInfo').userInfo.unionId,
          cardId: wx.getStorageSync('cardInfo')[this.data.countryIndex].id,
          orderId: this.data.orderId,
          cardNo: cardNo,
          newUser: false
        },
        success: function (data) {
          console.log(data)
          //4.
          if (data.data.success) {
            console.log("支付成功");
            //将支付信息存入缓存
            wx.setStorageSync('payInfo', data.data);
            //发送消息模板
            var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + wx.getStorageSync('accessToke');;
            wx.navigateTo({
              url: 'msg_success'
            })
          } else {
            console.log('预下单失败')
            wx.setStorageSync('payInfo', data.data);
            wx.navigateTo({
              url: 'msg_fail'
            })
          }
        },
        fail: function () {
          console.log('系统错误')
        }
      })


    }
  },

  //卡号校验
  cardNumInput:function(e){
   if(e.detail.value.length=='19'){
     this.setData({
       cardNumInputCss: 0,
       cardNo: e.detail.value
     }),
       this.setData({
       cardNumIconCss: true
       })
    }else{
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
      }),
        this.setData({
        cardPwdIconCss: true
        })
    } else {
      this.setData({
        cardPwdInputCss: 1
      }),
        this.setData({
          cardPwdIconCss: false
        })
    }
  },
    //picker改变
   bindCountryChange: function (e) {
    this.setData({
      countryIndex: e.detail.value
    })
  },

  


})
