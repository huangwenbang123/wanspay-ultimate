// pages/bmfw/liuliang/liuliang.js
const app = getApp();
var util = require('../../../utils/util.js');
import {
  String
} from '../../../utils/util.js';
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    phone: "",
    flag: false,
    testInfo: {},
    payInfo: {},
    active: "",
    inputFlag: false,
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput: true,
    //可否使用指纹识别  默认false
    isfingerPrint: false,
    // 输入框参数设置
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: true, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "70rpx", //输入框高度
      width: "550rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    },
    projectNo: '',
    projectName: "流量充值",
    buttonFlag: true,
    payFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 手机号信息录入
   */
  phone: function(e) {
    console.log(e)
    let value = e.detail.value.replace(/\s+/g, "");
    console.log("手机号码 value is :" + value)
    if (value.length == 11) {
      //判断手机号码是否合法
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (myreg.test(value)) {
        //合法操作
        isChinaMobilePhoneNum(value, this)
        this.setData({})
      } else {
        this.setData({
          phone: value,
        })
      }
      //给手机号隔开
      value = value.substring(0, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7, 11);
      this.setData({
        phone: value,
        buttonFlag: false
      })
    } else {
      this.setData({
        phone: value
      })
    }
  },

  charge: function() {
    wx.showLoading({
      title: '疯狂加载中',
      mask: true
    })
    let that = this;
    let phone = this.data.phone.replace(/\s+/g, "");
    isChinaMobilePhoneNum(phone, that);
    wx.request({
      url: 'https://charge.sanppay.com/utilities/dueamount',
      method: "POST",
      data: {
        billKey: phone,
        projectNo: that.data.projectNo,
        projectName: that.data.projectName,
        queryNum: 1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res.data)
        //查询到用户欠费信息
        if (res.data.code == 200) {
          // 光大成功返回 进行充值操作
          let testInfo = res.data.body.data;
          that.setData({
            flag: true,
            testInfo: testInfo,
            inputFlag: true
          })
        } else {
          wx.showToast({
            title: '业务繁忙，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  active: function(res) {
    let testInfo = this.data.testInfo
    if (this.data.active != '') {
      if (res.currentTarget.dataset.num != this.data.active) {
        this.setData({
          active: res.currentTarget.dataset.num,
          payFlag: false,
          payInfo: testInfo[res.currentTarget.dataset.num - 1]
        })
      } else {
        this.setData({
          payFlag: true,
          active: ""
        })
      }
    } else {
      this.setData({
        active: res.currentTarget.dataset.num,
        payFlag: false,
        payInfo: testInfo[res.currentTarget.dataset.num - 1]
      })
    }
  },

  pay: function() {
    wx.showLoading({
      title: '疯狂加载中',
      mask: true
    })
    let that = this;
    let buziType = "TRAFFIC"
    let sellerId = "301320120010105"
    let sellerName = that.data.projectName
    let outTradeNo = dataHms();
    let goodsName = that.data.projectName;
    let operatorId = wx.getStorageSync('userInfo').unionId;
    let accountNo = that.data.phone.replace(/\s+/g, "")
    let accountName = RemoveChinese(that.data.payInfo.customerName)
    let ext1 = that.data.payInfo.contractNo
    let ext2 = RemoveChinese(that.data.payInfo.customerName)
    let ext3 = that.data.payInfo.dueAmount
    let totalAmount = that.data.payInfo.dueAmount;
    let goodsDetail = {}

    goodsDetail.goodsId = that.data.projectNo
    goodsDetail.goodsName = sellerName;
    goodsDetail.goodsCategory = "TRAFFIC";
    goodsDetail.quantity = 1;
    goodsDetail.accountNo = accountNo;
    goodsDetail.price = totalAmount;
    goodsDetail.ext1 = ext1;
    goodsDetail.ext2 = ext2;
    goodsDetail.ext3 = ext3;
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
          totalAmount: totalAmount,
          accountName: accountName,
          goodsDetail: goodsDetail
        }
      },
      success: function(data) {
        console.log(data)
        wx.navigateTo({
          url: '/pages/pay/pay?outTradeNo=' + data.data.body.outTradeNo + "&sellerName=" + sellerName + "&amount=" + totalAmount / 100,
        })
      },
      fail: function() {
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

function isChinaMobilePhoneNum(phone, that) {
  var CMCC = /(^((13[4-9]{1})|(147)|(15[0-2]{1})|(15[7-9]{1})|(178)|(18[2-4]{1})|(18[7-8]{1}))\d{8}$)|(^((1703)|(1705)|(1706))\d{7}$)/; //中国移动  
  var CUCC = /(^((13[0-2]{1})|(145)|(155)|(156)|(171)|(175)|(176)|(185)|(186))\d{8}$)|(^(170[7-9]{1})\d{7}$)/; //中国联通  
  var CTCC = /(^((133)|(149)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$)|(^(170[0-2]{1})\d{7}&)/; //中国电信  

  var projectNo = "";
  if (CMCC.test(phone, that)) {
    projectNo = "755060401";
    console.log('中国移动');
  } else if (CUCC.test(phone)) {
    projectNo = "755060402";
    console.log('中国联通');
  } else if (CTCC.test(phone)) {
    projectNo = "755060403";
    console.log('中国电信');
  }
  that.setData({
    projectNo: projectNo
  })
}



function isChinaMobilePhoneNum(phone, that) {
  var CMCC = /(^((13[4-9]{1})|(147)|(15[0-2]{1})|(15[7-9]{1})|(178)|(18[2-4]{1})|(18[7-8]{1}))\d{8}$)|(^((1703)|(1705)|(1706))\d{7}$)/; //中国移动  
  var CUCC = /(^((13[0-2]{1})|(145)|(155)|(156)|(171)|(175)|(176)|(185)|(186))\d{8}$)|(^(170[7-9]{1})\d{7}$)/; //中国联通  
  var CTCC = /(^((133)|(149)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$)|(^(170[0-2]{1})\d{7}&)/; //中国电信  

  var projectNo = "";
  let phoneName = ''
  if (CMCC.test(phone, that)) {
    projectNo = "755060401";
    phoneName = "中国移动"

  } else if (CUCC.test(phone)) {
    projectNo = "755060402";
    phoneName = "中国联通"

  } else if (CTCC.test(phone)) {
    projectNo = "755060403";
    phoneName = "中国电信"

  }
  that.setData({
    projectNo: projectNo,
    phoneName: phoneName
  })
}

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


//去掉汉字  
function RemoveChinese(strValue) {
  if (strValue != null && strValue != "") {
    var reg = /-?[0-9]\d*/;
    var a = strValue.replace(reg, "");
    return strValue.replace(a,"");
  }
  else
    return "";
}  