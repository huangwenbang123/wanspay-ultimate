// pages/addCard/addCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acctSecret:'',
    acctId:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  mobileInput:function(e){
    var acct= e.detail.value;

    this.setData({
      acctId: acct
    })
  },
  mobile1Input: function (e) {
    var acct = e.detail.value;

    this.setData({
      acctSecret: acct
    })
  },
  saveCar: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var acctSecret = this.data.acctSecret;
    console.log("acctSecret" + acctSecret);
    var acctId = this.data.acctId;
    if (acctId.length!=19){
      wx.showToast({
        title: '请检查卡片账号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (acctSecret.length != 6) {
      wx.showToast({
        title: '请检查输入密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
   
    wx.request({
      url: 'https://account.sanppay.com/account/add',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "acctType": "CARD",
          "custId": wx.getStorageSync('custId'),
          "acctId": this.data.acctId,
          "acctSecret": this.data.acctSecret  
        }

      },
      success: function (data) {
        console.log(data);
        if(data.data.code==200){
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          
          setTimeout(function () {
            wx.redirectTo({ url: '/pages/card/card?custId=' + that.data.custId });
          }, 2000);
                 
        }else{
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })

  }
})