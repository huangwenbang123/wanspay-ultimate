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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取缴费业务   假设缴费业务为水缴费
    let payInfo = { sellerName: "南京市水费", amount: "888" }
    let cardInfo = [];
    cardInfo.push("5180****4787余额:213.97")
    cardInfo.push("使用新卡支付")
    that.setData({
      countries: cardInfo,
      sellerName: payInfo.sellerName,
      amount: payInfo.amount
    })
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

    if(cardInfo.length<1){
      //无卡支付模态框
      that.setData({
        modalNoCardput: !that.data.modalNoCardput
      });
    }else{
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

  }
})