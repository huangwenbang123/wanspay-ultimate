// pages/bmfw/huafei/huafei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  msg:"",
  phoneNum :"",
  flag :false
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
   * 输入框值改变
   */
  inputChange:function(e){
    console.log(e)
    let value = e.detail.value.replace(/\s+/g, "");
    console.log("手机号码 value is :" +value)
    if (value.length == 11){
      //判断手机号码是否合法
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if(myreg.test(value)){
        //合法操作
        this.setData({
          flag: true,
        })
      }else{
        this.setData({
          msg:"手机号格式有误，请重新填写",
          phoneNum :value,
          flag: false,
        })
      }
      //给手机号隔开
      value = value.substring(0, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7, 11);
      this.setData({
        phoneNum: value
      })
    }else{
      this.setData({
        msg: "",
        flag: false,
      })
    }
    
  },
  /**
   * 充值
   */
  toCharge  :function(e){
    let flag = this.data.flag;
    if(flag){
      console.log(e)
      //组装业务进行充值
    }
  }
})


