// pages/bmfw/huafei/huafei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "",
    phoneNum: "",
    flag: false,
    projectName: '全国手机话费充值',
    projectNo: '',
    phoneName: '',
    url: "charge.sanppay.com"
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
   * 输入框值改变
   */
  inputChange: function(e) {
    console.log(e)
    let value = e.detail.value.replace(/\s+/g, "");
    if (value.length == 11) {
      //判断手机号码是否合法
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (myreg.test(value)) {
        //合法操作
        isChinaMobilePhoneNum(value, this)
        this.setData({
          flag: true,
          msg: this.data.phoneName
        })
      } else {
        this.setData({
          msg: "手机号格式有误，请重新填写",
          phoneNum: value,
          flag: false,
        })
      }
      //给手机号隔开
      value = value.substring(0, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7, 11);
      this.setData({
        phoneNum: value
      })
    } else {
      this.setData({
        msg: "",
        flag: false,
      })
    }

  },
  /**
   * 充值
   */
  toCharge: function(e) {

    let flag = this.data.flag;
    let that = this;
    if (flag) {
      wx.showLoading({
        title: '疯狂加载中',
        mask: true
      })
      console.log(e)
      //组装业务进行充值
      let billKey = that.data.phoneNum.replace(/\s+/g, "");
      let projectName = that.data.projectName;
      //判断手机是哪个运营商
      isChinaMobilePhoneNum(billKey, that)
      let projectNo = that.data.projectNo;
      if (projectNo == '') {
        wx.showToast({
          title: '不能识别的手机号',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      wx.request({
        url: 'https://charge.sanppay.com/utilities/dueamount',
        method: "POST",
        data: {
          billKey: billKey,
          projectNo: that.data.projectNo,
          projectName: projectName,
          queryNum: 1,
          filed1: e.currentTarget.dataset.amount
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          wx.hideLoading()
          console.log(res.data)
          //话费充值预处理完成
          if (res.data.code == 200) {
            // 话费 预下单
            let outTradeNo = dataHms()
            let buziType = "PHONE"
            let sellerId = "301320120010105"
            let sellerName = that.data.projectName
            let operatorId = wx.getStorageSync('userInfo').unionId
            let accountNo = res.data.body.billKey
            let totalAmount = res.data.body.data[0].dueAmount
            let goodsDetail = {}

            goodsDetail.goodsId = res.data.body.projectNo;
            goodsDetail.goodsName = sellerName;
            goodsDetail.goodsCategory = "PHONE";
            goodsDetail.quantity = 1;
            goodsDetail.accountNo = accountNo;
            goodsDetail.price = totalAmount;
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


            // wx.request({
            //   url: 'https://nidaye.sanppay.com/utilities/chargeTest',
            //   method: "POST",
            //   data: {
            //     accountNo: billKey,
            //     totalAmount: e.currentTarget.dataset.amount,
            //     tradeNo: '170606101752',
            //     goodsId: '755060303',
            //     goodsCategory: 'PHONE'
            //   },
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   success: function(res) {
            //     wx.hideLoading()
            //     console.log(res.data)
            //     //充值话费成功
            //     if (res.data.code == 200) {

            //     }
            //   }
            // })
          } else {
            wx.showToast({
              title: '业务繁忙，请稍后重试',
              icon: 'none',
              duration: 2000
            })
          }

        }
      })
    }
  },
  //获取formId
  submitInfo: function(e) {
    console.log('以下是formId')
    console.log(e.detail.formId);
    wx.setStorageSync('form_id', e.detail.formId);
  },

  //获取用户手机号 
  getPhoneNumber: function(e) {
    let that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    //发送后台 秘钥 换取手机号
    wx.request({
      url: 'https://account.sanppay.com/getPhoneNumber',
      method: "POST",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        session_key: wx.getStorageSync('userInfo').session_key,
        xcxFlag: "wszf"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res)
        if (res.data.msg == "解密成功") {
          wx.setStorage({
            key: "phoneInfo",
            data: res.data.phoneInfo.purePhoneNumber,
          })
          var value = res.data.phoneInfo.purePhoneNumber
          //合法操作
          isChinaMobilePhoneNum(value, that)
          that.setData({
            flag: true,
            msg: that.data.phoneName
          })
          value = value.substring(0, 3) + ' ' + value.substring(3, 7) + ' ' + value.substring(7, 11);
          //讲手机号存入input框中
          that.setData({
            phoneNum: value
          })
        } else {
          wx.showToast({
            title: '获取手机号失败，请手动输入',
            icon: 'none',
            duration: 2000
          })
        }
      },
    })

  }



})


function isChinaMobilePhoneNum(phone, that) {
  var CMCC = /(^((13[4-9]{1})|(147)|(15[0-2]{1})|(15[7-9]{1})|(178)|(18[2-4]{1})|(18[7-8]{1}))\d{8}$)|(^((1703)|(1705)|(1706))\d{7}$)/; //中国移动  
  var CUCC = /(^((13[0-2]{1})|(145)|(155)|(156)|(171)|(175)|(176)|(185)|(186))\d{8}$)|(^(170[7-9]{1})\d{7}$)/; //中国联通  
  var CTCC = /(^((133)|(149)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$)|(^(170[0-2]{1})\d{7}&)/; //中国电信  

  var projectNo = "";
  let phoneName = ''
  if (CMCC.test(phone, that)) {
    projectNo = "755060304";
    phoneName = "中国移动"

  } else if (CUCC.test(phone)) {
    projectNo = "755060303";
    phoneName = "中国联通"

  } else if (CTCC.test(phone)) {
    projectNo = "755060302";
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