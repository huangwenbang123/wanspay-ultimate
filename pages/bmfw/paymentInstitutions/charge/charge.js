// pages/bmfw/paymentInstitutions/waterCharge/waterCharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentInstitutions :"",
    billKey: "",
    flag :true,
    hiddenFlag: false,
    projectName : "",
    balance : "",
    payAmount : "",
    modalCardput :true,
    modalCardput2 :true,
    modalNoCardput :true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'paymentInstitutions',
      success: function(res) {
        that.setData({
          paymentInstitutions:res.data
        })
      },
    })
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
  /**
   * 返回上一层
   */
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 查询缴费
   */
  next:function(){
      //查询缴费 
    let that = this;
    let billKey = this.data.billKey;
    let projectNo = this.data.paymentInstitutions.projectNo;
    let projectName = this.data.paymentInstitutions.projectName;
    wx.request({
      url: 'https://master.order.sanppay.com/utilities/dueamount', 
      method: "POST",
      data: {
        billKey: billKey,
        projectNo: projectNo,
        projectName: projectName,
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res.data)
        //查询到用户欠费信息
        if (res.data.code == 200){
          that.setData({
            hiddenFlag: true,
            name: res.data.body.data[0].customerName,
            num: res.data.body.data[0].contractNo,
            projectName: that.data.paymentInstitutions.projectName,
            balance: res.data.body.data[0].balance,
            payAmount: res.data.body.data[0].dueAmount,
            contractNo : res.data.body.data[0].contractNo,
            billKey: res.data.body.data[0].billKey
          })
        }
      
      }
    })
  },
  /**
   * 缴费编号
   */
  inputValue:function(e){
    this.setData({
      billKey:e.detail.value
    })
    if (this.data.billKey.length > 0) {
      this.setData({
        flag: false
      })
    }
  },

  toCharge:function(){
    let goodsDetail = {};
    goodsDetail.goodsId = this.data.paymentInstitutions.projectNo;
    goodsDetail.goodsName = this.data.paymentInstitutions.projectName;
    goodsDetail.goodsCategory = 'OTHER';
    goodsDetail.quantity = 1;
    goodsDetail.price = this.data.payAmount;
    goodsDetail.ext1 = this.data.contractNo;
    wx.request({
      url: 'https://master.order.sanppay.com/utilities/dueamount', 
      data: {
        outTradeNo:'88888888888888',
        goodsDetail: goodsDetail,
        sellerId: "123456",
        sellerName: this.data.paymentInstitutions.billKey,

      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res.data)
      }
    })


      wx.navigateTo({
        url: '../../../pay/pay',
      })
  }
  
})