
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store:"",
    imgSrc:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载商户信息
    wx.request({
      url: 'https://cashiertest.sanppay.com/merchant/storeDetail/info',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeId: +options.id
      },
      success: function (data) {
        console.log("以下为主页推荐商户信息")
        console.log(data);
      
        that.setData({
          store: data.data.data,
          imgSrc: "http://bus.sanppay.com/image/"+data.data.data.data.photoImgPath,
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
  /**
   * 拨打商户电话
   */
  makePhone:function(event){
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   *  地图导航
   * map
   */
  map:function(){
    var gps = this.data.store.data.gps;
    var latitude = parseFloat(gps.split(",")[1]);
    var longitude = parseFloat(gps.split(",")[0]);
    var name = this.data.store.data.storeName;
    var address = this.data.store.data.locationDesc;
    var speed = "";
    var accuracy = "";
    console.log("...." + latitude + "," + longitude + "," + name + "," + address + ",")
    if (gps ==""){
      console.log("111111111")
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
           latitude = res.latitude
           longitude = res.longitude
           speed = res.speed
           accuracy = res.accuracy
           wx.openLocation({
             latitude: latitude,
             longitude: longitude,
             scale: 18,
             speed: speed,
             accuracy: accuracy
           })
        }
      })

    }else{
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 18,
        name: name,
        address: address
      })
    }
    }
  
})