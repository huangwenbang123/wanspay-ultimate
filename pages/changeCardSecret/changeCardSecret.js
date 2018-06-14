// pages/addCard/addCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acctSecretold: '',
    acctSecretnew1: '',
    acctSecretnew2: '',
    acctId: "",
    photonum:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    let acctId= options.acctId;
    let  substrvalue=acctId.substr(0,10);
    if (substrvalue == '5180025170' || substrvalue == '5180025060' || substrvalue == '5180025180') {
      that.setData({
        photonum: substrvalue,
        acctId: acctId
      })
    } else {
      that.setData({
        photonum: 'qita',
        acctId: acctId
      })
    }
   
    


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
  mobileInput: function (e) {
    this.setData({
      acctSecretold: e.detail.value
    })
  },
  mobile1Input: function (e) {
    this.setData({
      acctSecretnew1: e.detail.value
    })
  },
  mobile2Input: function (e) {
    this.setData({
      acctSecretnew2: e.detail.value
    })
  },
  saveCar: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var acctSecretold = this.data.acctSecretold;
    var acctSecretnew1 = this.data.acctSecretnew1;
    var acctSecretnew2 = this.data.acctSecretnew2;
    console.log("旧", acctSecretold);
    console.log("新", acctSecretnew1);
    var acctId = this.data.acctId;
    if (acctSecretold.length != 6) {
      wx.showToast({
        title: '请检查原支付密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (acctSecretnew1.length != 6 || acctSecretnew2.length != 6 || acctSecretnew1!=acctSecretnew2) {
      wx.showToast({
        title: '请检查新支付密码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo.userInfo.unionId)
    wx.request({
      url: 'https://account.sanppay.com/account/secret/rest',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "custId": '1000000',
          "acctId": this.data.acctId,
          "orgAcctSecret": acctSecretold,
          "acctSecret": acctSecretnew1
        }

      },
      success: function (data) {
        console.log(data);
        if (data.data.code == 200) {
          wx.showToast({
            title: '密码修改成功',
            icon: 'success',
            duration: 2000 
          })
          setTimeout(function () {
            console.log("----Countdown----");
            wx.redirectTo({ url: '/pages/card/card' });
          }, 2000);
        } else {
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