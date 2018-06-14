// pages/videogame/videogame.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    gamelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    wx.request({
      url: 'https://cashiertest.sanppay.com/game/gamelist',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      success: function (data) {
        console.log(data);
        wx.setStorageSync('jusutongOrderId', data.data.biz_content.ourOrderId);
        console.log(data)
        that.setData({
          gamelist: data.data.biz_content.gameList
        })
      }
    })


    wx.request({
      url: 'https://cashiertest.sanppay.com/video/videolist',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      success: function (data) {
        console.log(data)
        that.setData({
          videoList: data.data.biz_content
        })
      }
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
  detailedVideInfo: function (event) {
    console.log("1111111111," + event.currentTarget.id)
    wx.navigateTo({ url: '/pages/video/detailVideo?id=' + event.currentTarget.id })
  },
  detailedGameInfo: function (event) {
    var prc = this.data.gamelist[event.currentTarget.dataset.num]
    var str = JSON.stringify(prc);
    wx.navigateTo({ url: '/pages/game/detailGame?prc=' + str })
  }
})