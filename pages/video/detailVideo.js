// pages/video/videolist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:"请输入账号",
    productList:[],
    active:"",
    mobile:""
  },
  mobileInput:function(e){
this.setData({
  mobile:e.detail.value
})
  },
  saveCar:function(e){
   console.log("===========save================")
    wx.setStorageSync('form_id', e.detail.formId)
    var that = this;
    var mobile = this.data.mobile;
    var active = this.data.active;
    console.log(mobile);
    
    if (mobile == '' || mobile==null) {
      wx.showToast({
        title:"请输入充值账号",
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (active=='') {
      wx.showToast({
        title: '请选择充值项目',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    var num = this.data.active - 1;
    var productInfo = this.data.productList[num];

    var goodsDetail = {
      "goodsId": productInfo.itemId,
      "goodsName": productInfo.itemName,
      "goodsCategory": "VIDEO",
      "quantity": "1",
      "price": (productInfo.itemSalesPrice * 100).toFixed(0),
      "ext1": productInfo.ext1,
      "ext2": productInfo.ext2
    }

    var bizContent = {
      "totalAmount": (productInfo.itemSalesPrice * 100).toFixed(0),
      "accountNo": mobile,
      "sellerId": productInfo.merchantId,
      "operatorId": wx.getStorageSync('userInfo').unionId,
      "outTradeNo": wx.getStorageSync('jusutongOrderId'),
      "buziType":"VIDEO",
      "totalAmount": (productInfo.itemSalesPrice * 100).toFixed(0),
      "goodsDetail": goodsDetail
    }

    var bizContent= JSON.stringify(bizContent);


    wx.navigateTo({
      url: '/pages/video/videoPay?bizContent='+bizContent})
  },


  active: function (res){
    if(this.data.active!=''){
      if (res.currentTarget.dataset.num != this.data.active){
        this.setData({
          active: res.currentTarget.dataset.num
        })
      }else{
      console.log(this.data.active)
      this.setData({
        active:''
      })
      } }else{
      console.log(this.data.active)
    this.setData({
      
      active: res.currentTarget.dataset.num
    })
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var  firmId=options.id;
    var that = this;
    //加载 全部 视频充值列表
    wx.request({
      url: 'https://cashiertest.sanppay.com/video/productDetail',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { firmId: firmId},
      success: function (data) {
        wx.setStorageSync('jusutongOrderId', data.data.biz_content.ourOrderId);
        console.log("视频购买",data)
        var placeholder='';
        if (firmId=='12'){
          placeholder='请输入QQ账号'
        }else{
          placeholder = '请输入账号'
        }

        that.setData({
          placeholder:placeholder,
          productList: data.data.biz_content.productDetail
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

  }
})