// pages/bmfw/liuliang/liuliang.js
const app = getApp();
var util = require('../../../utils/util.js');
import { String } from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    flag: false,
    testInfo: {},
    active: "",
    inputFlag: false,
    modalCardput: true,
    modalCardput2: true,
    modalNoCardput: true,
    //可否使用指纹识别  默认false
    isfingerPrint: false,
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "70rpx",//输入框高度
      width: "550rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看支持的生物认证   比如ios的指纹识别   安卓部分机器是不能用指纹识别的
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        for (var i in res.supportMode) {
          if (res.supportMode[i] == 'fingerPrint') {
            console.log("支持指纹识别", res.supportMode[i]); +
              that.setData({
                isfingerPrint: true
              })
          }
        }
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
 * 手机号信息录入
 */
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  charge: function () {
    let phone = this.data.phone;
    //检查手机号是否为空
    if (String.isBlank(phone)) {
      wx.showModal({
        content: '手机号码不能为空，请输入',
        showCancel: false,
      });
      return false;
    }
    //检查手机号码是否合法
    if (util.checkPhone(phone)) {
      wx.showModal({
        content: '手机号码不正确，请重新输入',
        showCancel: false,
      });
      return false;
    }
    let testInfo = [];
    let a = { code: "50", amount: "800", name: null, payAmount: null, customerName: null };
    let b = { code: "200", amount: "2000", name: null, payAmount: null, customerName: null };
    testInfo.push(a);
    testInfo.push(b);
    console.log(testInfo)
    this.setData({
      flag: true,
      testInfo: testInfo,
      inputFlag: true
    })
  },

  active: function (res) {
    if (this.data.active != '') {
      if (res.currentTarget.dataset.num != this.data.active) {
        this.setData({
          active: res.currentTarget.dataset.num,
        })
      } else {
        console.log(this.data.gameInfo)
        this.setData({
          active: '',
        })
      }
    } else {
      console.log(this.data.gameInfo)
      this.setData({
        active: res.currentTarget.dataset.num,
      })
    }
  },

  pay: function () {
    let active = this.data.active;
    if (active == '') {
      wx.showModal({
        content: '请选择一个需要购买的套餐',
        showCancel: false,
      });
      return false;
    }
    
  }

})