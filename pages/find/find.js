
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    categoryList:[],
    categoryId:"",
    storeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载 全部 商户信息
    wx.request({
      url: 'https://cashiertest.sanppay.com/merchant/storelist/info',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        brandType: 0
      },
      success: function (data) {
        that.setData({
          storeList: data.data.data.data
        })
      }
    })
    //加载 全部分类信息
    getcategoryList(that)
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  searchBtn:function(e){
    var that = this;
    console.info("*********************************");
    console.info('form发生了submit事件，携带数据为：', e.detail.value)
    wx.request({
      url: 'https://cashiertest.sanppay.com/merchant/storelist/storeName/info',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeName: e.detail.value ,
      },
      success: function (data) {
        that.setData({
          storeList: data.data.data.data
        })
      }
    })

  },
  
  detailedMechantInfo: function (event) {
    console.log("1111111111," + event.currentTarget.id)
    wx.navigateTo({ url: '/pages/detailedMechant/detailedMechant?id=' + event.currentTarget.id, })
  },

  index: function () {
    wx.navigateTo({ url: '/pages/index/index' })
  },

  all: function () {
    //加载 全部 商户信息
    var that = this;

    that.setData({
      categoryId: ""
    });
    wx.request({
      url: 'https://cashiertest.sanppay.com/merchant/storelist/info',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        brandType: 0,
      },
      success: function (data) {
        that.setData({
          storeList: data.data.data.data
        })
      }
    })
  },

  fenlei :function(event){
    console.log(event)
    var that = this;
    that.setData({
      categoryId: event.currentTarget.dataset.fenlei
    })
    //分类商户信息
    wx.request({
      url: 'https://cashiertest.sanppay.com/merchant/storelist/info',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        brandType: 0,
        categoryId: event.currentTarget.dataset.fenlei
      },
      success: function (data) {
        that.setData({
          storeList: data.data.data.data
        })
      }
    })
  }

})

function getcategoryList(that){
  //加载商户分类信息
  wx.request({
    url: 'https://cashiertest.sanppay.com/merchant/categoryList/info',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
  
    },
    success: function (data) {
      console.log("以下为全部分类信息")
      console.log(data);
      that.setData({
        categoryList:data.data.data.data
      })
    }
  })
}