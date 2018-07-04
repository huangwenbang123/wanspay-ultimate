// pages/bmfw/paymentInstitutions/waterCharge/waterCharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentInstitutions: "",
    billKey: "",
    flag: true,
    hiddenFlag: false,
    projectName: "",
    balance: "",
    payAmount: "",
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'paymentInstitutions',
      success: function(res) {
        that.setData({
          paymentInstitutions: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 返回上一层
   */
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 查询缴费
   */
  next: function() {
    wx.showLoading({
      title: '疯狂加载中',
      mask: true
    })
    //查询缴费 
    let that = this;
    let billKey = that.data.billKey;
    let projectName = this.data.paymentInstitutions.projectName;
    let projectNo = this.data.paymentInstitutions.projectNo;
    wx.request({
      url: 'https://charge.sanppay.com/utilities/dueamount',
      method: "POST",
      data: {
        billKey: billKey,
        projectNo: projectNo,
        projectName: projectName,
        queryNum: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res.data)
        //查询到用户欠费信息
        if (res.data.code == 200) {
          that.setData({
            hiddenFlag: true,
            contractNo: res.data.body.data[0].contractNo,
            num: res.data.body.data[0].contractNo,
            name: res.data.body.data[0].customerName,
            balance: res.data.body.data[0].balance,
            payAmount: (res.data.body.data[0].dueAmount) / 100,
            projectName: res.data.body.projectName,
            billKey: res.data.body.billKey
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },
  /**
   * 缴费编号
   */
  inputValue: function(e) {
    this.setData({
      billKey: e.detail.value
    })
    if (this.data.billKey.length > 0) {
      this.setData({
        flag: false
      })
    }
  },

  toCharge: function() {
    let that = this;
    let buziType = ""
    switch (that.data.paymentInstitutions.busiCode + "") {
      case "01":
        buziType = "WATER";
        break;
      case "02":
        buziType = "ELECTR";
        break;
      case "03":
        buziType = "GAS";
        break;
    }

    // let outTradeNo = reverse(wx.getStorageSync('userInfo').unionId) + dataHms();
    // let sellerId = "123456789";
    // let goodsName = that.data.paymentInstitutions.projectName;
    // let operatorId = wx.getStorageSync('userInfo').unionId;
    // let totalAmount = accMul(that.data.payAmount,100) ;
    // let currency = "CNY";
    // let subject = "生活缴费";
    // let goodsId = that.data.paymentInstitutions.projectNo;
    // let ext1 = that.data.contractNo;
    // wx.request({
    //   url: 'https://nidaye.sanppay.com/utilities/chargeTest',
    //   method: "POST",
    //   data: {
    //     goodsCategory: buziType,
    //     tradeNo: '170606101752',
    //     outTradeNo: outTradeNo,
    //     subject: subject,
    //     accountNo: that.data.billKey,
    //     goodsId: goodsId,
    //     goodsName: goodsName,
    //     totalAmount: totalAmount,
    //     ext1: "7417062017100853"
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     wx.hideLoading()
    //     console.log(res.data)
    //     //查询到用户欠费信息
    //     if (res.data.code == 200) {

    //     }

    //   }
    // })
    let outTradeNo = dataHms()
    let sellerId = "301320120010105"
    let sellerName = that.data.paymentInstitutions.projectName
    let operatorId = wx.getStorageSync('userInfo').unionId
    let accountNo = that.data.billKey
    let accountName = that.data.name
    let totalAmount = accMul(that.data.payAmount,100)
    let goodsDetail = {};
    goodsDetail.goodsId = that.data.paymentInstitutions.projectNo;
    goodsDetail.goodsName = that.data.paymentInstitutions.projectName;
    goodsDetail.goodsCategory = buziType;
    goodsDetail.quantity = 1;
    goodsDetail.accountNo = accountNo;
    goodsDetail.price = accMul(that.data.payAmount, 100);
    goodsDetail.ext1 = that.data.contractNo;
    wx.setStorageSync('goodsDetail', goodsDetail)
    //预下单
    wx.request({
      url: 'https://pay.sanppay.com/order/precreate',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        body: {
          outTradeNo: outTradeNo,
          buziType: buziType,
          sellerId: sellerId,
          sellerName: sellerName,
          operatorId: operatorId,
          accountNo: accountNo,
          accountName: accountName,
          totalAmount: totalAmount,
          goodsDetail: goodsDetail
        }
      },
      success: function (data) {
        console.log(data)
        wx.navigateTo({
          url: '../../../pay/pay?outTradeNo=' + data.data.body.outTradeNo + "&sellerName=" + sellerName + "&amount=" + that.data.payAmount,
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })



  },
  //获取formId
  submitInfo: function (e) {
    console.log('以下是formId')
    console.log(e.detail.formId);
    wx.setStorageSync('form_id', e.detail.formId);
  },

})

function reverse(str) {
  if (str.length == 0) return null;
  var i = str.length;
  var dstr = "";
  while (--i >= 0) {
    dstr += str.charAt(i);
  }
  return dstr;
}

function dataHms() {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  var n = timestamp * 1000;
  var date = new Date(n);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时  
  var h = date.getHours();
  //分  
  var m = date.getMinutes();
  //秒  
  var s = date.getSeconds();
  //毫秒
  var Milliseconds = date.getMilliseconds();
  //随机串
  var x = Math.random().toString(36).substr(2, 15);
  console.log("当前时间：" + h + ":" + m + ":" + s);
  let time = "" + Y + "" + M + "" + D + "" + h + "" + m + "" + s + "" + Milliseconds + x;
  return time;
}

function accMul(arg1, arg2)  {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}