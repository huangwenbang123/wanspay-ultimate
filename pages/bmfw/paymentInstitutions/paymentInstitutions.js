// pages/bmfw/paymentInstitutions/paymentInstitutions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrBusi4Page : [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //查询缴费机构 通过 busiCode provinceCode cityCode
    let info = [];
    info.busiCode = options.busiCode;
    info.provinceCode = options.provinceCode;
    info.cityCode = options.cityCode;
    getPaymentInstitutions(this, info);
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
   * 跳转到缴费页面
   */
  goCharge :function(e){
    console.log(e);
    //获取用户点击得缴费机构
    let arrBusi4Page = this.data.arrBusi4Page;
    let paymentInstitutions = arrBusi4Page[e.currentTarget.dataset.idx]
    console.log(paymentInstitutions)
    wx.setStorage({
      key: 'paymentInstitutions',
      data: paymentInstitutions,
    })
     wx.navigateTo({ url: './charge/charge',});
  }
})

/**
 * 获取缴费机构
 */
function getPaymentInstitutions(that, info) {
  let arrBusi = wx.getStorageSync("arrBusi");
  let arrBusi4Page = [];
  console.log(arrBusi)
  for (var i = 0; i < arrBusi.length;i++){
    if (info.busiCode == arrBusi[i].busiCode && (info.provinceCode == arrBusi[i].cityCode || info.cityCode == arrBusi[i].cityCode)){
      arrBusi4Page.push(arrBusi[i]);
    }
  }
  // arrBusi.push( busi2,busi4);
  that.setData({
    arrBusi4Page: arrBusi4Page
  })


}