// pages/bmfw/sinopec/sinopec.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    hiddenFlag:false,
    name :"",
    num : "",
    active : "2"
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
  /**
 * 返回上一层
 */
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
  * 缴费编号
  */
  inputValue: function (e) {
    this.setData({
      chargeNum: e.detail.value
    })
    if (this.data.chargeNum.length == 19) {
      this.setData({
        flag: false
      })
    }
  },
  /**
   * 获取缴费信息
   */
  next:function(){
    //已经收到成功的通知
    this.setData({
      hiddenFlag: true,
      name: "*文邦",
      num : "8888888888888888888"
    })
  },
  /**
   * 点击样式
   */
    active: function (res) {
    if (this.data.active != '') {
      if (res.currentTarget.dataset.num != this.data.active) {
        this.setData({
          active: res.currentTarget.dataset.num,
        })
      } else {
        this.setData({
          active: '',
        })
      }
    } else {
      this.setData({
        active: res.currentTarget.dataset.num,
      })
    }
  },
})