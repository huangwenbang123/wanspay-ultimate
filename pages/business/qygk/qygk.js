// pages/business/qygk/qygk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    num_200 :"",
    num_500: "",
    num_1000: "",
    num_2000: "",
    num_5000: "",
    num_otherAmount: "",
    num_other: "",
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
   * 200元是去焦点事件
   */
  bindblur1Event200 :function(){
    let num_200 = this.data.num_200;
    console.log(num_200);
    if (num_200 != "" && num_200.indexOf("张")<1){
      this.setData({
        num_200: num_200 + "张"
      })
    }
  },
  /**
   * 200元输入事件
   */
  200:function(res){
    if (res.detail.value == 0 && this.data.num_200==""){
      this.setData({
        num_200: ""
      })
    }else{
      this.setData({
        num_200: res.detail.value
      })
    }
    
  },
  

  /**
   * 500元是去焦点事件
   */
  bindblur1Event500: function () {
    let num_500 = this.data.num_500;
    console.log(num_500);
    if (num_500 != "" && num_500.indexOf("张") < 1) {
      this.setData({
        num_500: num_500 + "张"
      })
    }
  },
  /**
   * 500元输入事件
   */
  500: function (res) {
    if (res.detail.value == 0 && this.data.num_500 == "") {
      this.setData({
        num_500: ""
      })
    } else {
      this.setData({
        num_500: res.detail.value
      })
      }
  },

  /**
 * 1000元是去焦点事件
 */
  bindblur1Event1000: function () {
    let num_1000 = this.data.num_1000;
    console.log(num_1000);
    if (num_1000 != "" && num_1000.indexOf("张") < 1) {
      this.setData({
        num_1000: num_1000 + "张"
      })
    }
  },
  /**
   * 1000元输入事件
   */
  1000: function (res) {
    if (res.detail.value == 0 && this.data.num_1000 == "") {
      this.setData({
        num_1000: ""
      })
    } else {
      this.setData({
        num_1000: res.detail.value
      })
    }
  },


  /**
   * 2000元是去焦点事件
   */
  bindblur1Event2000: function () {
    let num_2000 = this.data.num_2000;
    console.log(num_2000);
    if (num_2000 != "" && num_2000.indexOf("张") < 1) {
      this.setData({
        num_2000: num_2000 + "张"
      })
    }
  },
  /**
   * 2000元输入事件
   */
  2000: function (res) {
    if (res.detail.value == 0 && this.data.num_2000 == "") {
      this.setData({
        num_2000: ""
      })
    } else {
      this.setData({
        num_2000: res.detail.value
      })
    }
  },

  /**
 * 5000元是去焦点事件
 */
  bindblur1Event5000: function () {
    let num_5000 = this.data.num_5000;
    console.log(num_5000);
    if (num_5000 != "" && num_5000.indexOf("张") < 1) {
      this.setData({
        num_5000: num_5000 + "张"
      })
    }
  },
  /**
   * 5000元输入事件
   */
  5000: function (res) {
    if (res.detail.value == 0 && this.data.num_5000 == "") {
      this.setData({
        num_5000: ""
      })
    } else {
      this.setData({
        num_5000: res.detail.value
      })
    }
  },

  /**
   * 其它金额输入框 输入事件
   */
  otherAmount:function(e){
    if (e.detail.value != '' && e.detail.value.substr(0, 1) == '.') {
      e.detail.value = "";
    }
    e.detail.value = e.detail.value.replace(/^\./g, ""); //只保留第一个. 清除多余的
    e.detail.value = e.detail.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      if (e.detail.value.substr(0, 1) == '0' && e.detail.value.length == 2) {
        e.detail.value = e.detail.value.substr(1, e.detail.value.length);
      }
    }
    this.setData({
      num_otherAmount: e.detail.value
    })
  },

  /**
   * 其它金额是去焦点事件
   */
  bindblur1EventOther:function(){
    let num_other = this.data.num_other;
    console.log(num_other);
    if (num_other != "" && num_other.indexOf("张") < 1) {
      this.setData({
        num_other: num_other + "张"
      })
    }
  },

   /**
   * 其它金额输入事件
   */
  other: function (res) {
    if (res.detail.value == 0 && this.data.num_other == "") {
      this.setData({
        num_other: ""
      })
    } else {
      this.setData({
        num_other: res.detail.value
      })
    }
  },

  /**
 *  其它金额是去焦点事件
 */
  bindblur1EventOtherAmount: function () {
    let num_otherAmount = this.data.num_otherAmount;
    if (num_otherAmount < 200) {
      this.setData({
        num_otherAmount: 200
      })
    } else if (num_otherAmount > 5000) {
      this.setData({
        num_otherAmount: 5000
      })
    }
  },

  /**
   * 姓名 输入事件
   */
  name :function(e){
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 联系方式 输入事件
   */
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 提交购买信息
   */
  sendMsg:function(){
    //判断姓名是否为空   
    let name = this.data.name;
    let phone = this.data.phone;
    let num_200 = this.data.num_200;
    let num_500 = this.data.num_500;
    let num_1000 = this.data.num_1000;
    let num_2000 = this.data.num_2000;
    let num_5000 = this.data.num_5000;
    let num_other = this.data.num_other; 
    let num_otherAmount = this.data.num_otherAmount;
    if (name == null || name == '' || typeof (name) == "undefined"){
      wx.showModal({
        content: '请输入购卡者姓名',
        showCancel: false,
      });
      return;
    }
    //判断手机号是否正确
    if (phone == null || phone == '' || typeof (phone) == "undefined") {
      wx.showModal({
        content: '请输入手机号',
        showCancel: false,
      });
      return;
    }
    if (!isPhoneNo(phone)) {
      wx.showModal({
        content: '请输入正确手机号',
        showCancel: false,
      });
      return;
    }

    /**
     * 判断有没有购买卡片  （没有一张卡片信息）
     */

    if (num_200 == "" && num_500 == "" && num_1000 == "" && num_2000 == "" && num_5000 == "" && num_other == ""){
      wx.showModal({
        content: '请输入需要购买的张数',
        showCancel: false,
      });
      return;
    }

    var array = [];
    if (num_200!=""){
      var o = {};
      o.balance = 200;
      o.number = num_200;
      array.push(o);
    }  if (num_500 != "") {
      var o = {};
      o.balance = 500;
      o.number = num_500;
      array.push(o);
    }  if (num_1000 != "") {
      var o = {};
      o.balance = 1000;
      o.number = num_1000;
      array.push(o);
    }  if (num_2000 != "") {
      var o = {};
      o.balance = 2000;
      o.number = num_2000;
      array.push(o);
    }  if (num_5000 != "") {
      var o = {};
      o.balance = 5000;
      o.number = num_5000;
      array.push(o);
    }  if (num_other != "") {
      var o = {};
      o.balance = num_otherAmount;
      o.number = num_other;
      array.push(o);
    }
    console.log(array);
    console.log(JSON.stringify(array));
    sendMsg(name, phone, array);
  }

})

//手机号验证
function isPhoneNo(phone) {
  var pattern = /^1[34578]\d{9}$/;
  return pattern.test(phone);
}

//发送购卡消息
function sendMsg(name,phone,json){
  wx.request({
    url: 'https://cashiertest.sanppay.com/buyCardInfo',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      phone: phone,
      buyer: name,
      cardInfo: JSON.stringify(json)
    },
    success: function (data) {
      console.log(data)

      if(data.data == "SUCCESS"){
        wx.showModal({
          icon:'success',
          content: '您的订单已提交成功，我们的售卡专员会尽快与您联系，如有任何疑问，请拨打我们的客服热线：400-025-5788，谢谢',
          showCancel: false,
        });
      }
    },
    fail: function () {
      console.log('系统错误')
    }
  })
}
