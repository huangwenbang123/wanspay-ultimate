import hexMD5 from '../../utils/util.js';
import { String } from '../../utils/util.js';

Page({
  data: {
    Pwd:"",
    againPwd:"",
    pwdFlag: false,
    againPwdFlag: false,
  },

  onLoad: function () {
    //页面加载时 查询用户订单信息
    var that = this;
  },

  PwdInput: function (e) {
    if (e.detail.value.length == '6') {
      this.setData({
        pwdFlag: true
      })
    }else{
      this.setData({
        pwdFlag: false
      })
    }
    this.setData({
      Pwd: e.detail.value
    })
  },

  againPwdInput: function (e) {
    if (e.detail.value.length == '6') {
      this.setData({
        againPwdFlag: true
      })
    } else {
      this.setData({
        againPwdFlag: false
      })
    }
    this.setData({
      againPwd: e.detail.value
    })
  },
  
  setPwd:function(e){
    var that = this;
    if (!that.data.pwdFlag || !that.data.againPwdFlag){
      wx.showModal({
        content: '密码必须是六位数字，请重新输入',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
        
          }
        }
      });
    } else if (!(that.data.Pwd===that.data.againPwd)){
      wx.showModal({
        content: '密码输入不一致，请重新输入',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          }
        }
      });
    }else{
      var pin = hexMD5.hexMD5(this.data.Pwd);
      console.log("pin:" + pin)
      //设置支付密码
      wx.request({
        url: 'https://cashiertest.sanppay.com/wxsp/user/setPin',//自己的服务接口地址
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          pin: pin,
          unionId: wx.getStorageSync('userInfo').userInfo.unionId,
        },
        success: function (data) {
          console.log(data);
          wx.showModal({
            content: '密码设置成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({ url: '/pages/index/index' })
              }
            }
          });
         
        },
        fail: function () {
          wx.showToast({
            title: '设置失败',
            duration: 3000
          });
        }
      })
    }
  }

})

