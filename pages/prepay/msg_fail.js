Page({
  data: {
    failInfo: "",
  },
  onLoad: function (options) {
    wx.setStorageSync('jusutongOrderId', 'R'+wx.getStorageSync('jusutongOrderId'))
    this.setData({
      failInfo: options.failInfo
    });
    
  },
  payFailButton: function () {
    console.log('jinliale')
    wx.switchTab({
      url: "../index/index"
    })
  }

});