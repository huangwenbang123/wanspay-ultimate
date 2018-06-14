// pages/business/merchantsIn/merchantsIn.js
const app = getApp();
var util = require('../../../utils/util.js');
import { String } from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    note: "",
    phone: "",
    title :"",
      toastModalStatus: false,//弹框
    toastColor: '',// 图标背景颜色
    toastFontColor: ''// 图标颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        title : options.title
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
   * 名称输入
   */
  name :function(e){
  
    this.setData({
      name : e.detail.value
    })
  },
 /**
  * 备注信息输入
  */
  note :function(e){
    this.setData({
      note: e.detail.value
    })
  },
  /**
   * 手机号信息录入
   */
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 提交申请
   */
  sendMsg :function(){
    let name = this.data.name;
    let phone = this.data.phone;
    let note = this.data.note;
    let title = this.data.title;
    let showTitle = "";
    //检查姓名
    if (String.isBlank(name)){
      wx.showModal({
        content: '联系人不能为空,请输入',
        showCancel: false,
      });
      return false;
    }
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

    /**
     * 发送邮件信息
     */
    wx.request({
      url: 'https://master.order.sanppay.com/mail/sendMsg', //仅为示例，并非真实的接口地址
      data: {
        name: name,
        note: note,
        phone:phone,
        title: title
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
       
        if(res.data.code == 200){
          switch (title+"") {
            case '1':
              showTitle = "您的订单已提交成功，我们的售卡专员会尽快与您联系，如有任何疑问，请拨打我们的客服热线：400-025-5788，谢谢";
              break;
            case '2':
              showTitle = "您的入驻申请已提交成功，我们的客服专员会尽快与您联系，如有任何疑问，请拨打我们的客服热线：400-025-5788，谢谢";
              break;
            case '3':
              showTitle = "您的制卡申请已提交成功，我们的客服专员会尽快与您联系，如有任何疑问，请拨打我们的客服热线：400-025-5788，谢谢";
              break
            default:
              showTitle = "您的广告投放申请已提交成功，我们的客服专员会尽快与您联系，如有任何疑问，请拨打我们的客服热线：400-025-5788，谢谢";
          }
          wx.showModal({
            content: showTitle,
            showCancel: false,
          });
        }
      }
    })

  },



})

