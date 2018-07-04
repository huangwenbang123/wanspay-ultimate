// pages/bmfw/sinopec/sinopec.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    hiddenFlag: false,
    name: "",
    num: "",
    active: "2",
    projectName: '全国中石化加油卡充值',
    projectNo: '025008302',
    info: '',
    xunhuan: '',
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
   * 返回上一层
   */
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //获取formId
  submitInfo: function (e) {
    console.log('以下是formId')
    console.log(e.detail.formId);
    wx.setStorageSync('form_id', e.detail.formId);
  },

  /**
   * 缴费编号
   */
  inputValue: function(e) {
    this.setData({
      chargeNum: e.detail.value
    })
    if (this.data.chargeNum.length == 19) {
      this.setData({
        flag: false
      })
    }
  },
  /**
   * 获取缴费信息
   */
  next: function() {
    let that = this;
    wx.showLoading({
      title: '疯狂加载中',
      mask: true
    })
    wx.request({
      url: 'https://charge.sanppay.com/utilities/dueamount',
      method: "POST",
      data: {
        billKey: this.data.chargeNum,
        projectNo: '025008302',
        projectName: this.data.projectName,
        queryNum: 1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 200) {
          // 光大成功返回 进行充值操作
          let name = res.data.body.data[0].customerName.split("·");
          let num = res.data.body.billKey;
          let info = res.data.body.data;
          let xunhuan = [];
          let a = [];
          let j = 0;
          for (let i = 0; i <= res.data.body.data.length; i++) {
            if (i % 3 == 0 && i!=0) {
              xunhuan[j] = a;
              console.log("a is",a)
              a = [];
              j++;
            }
            a.push(res.data.body.data[i]);

          }
          console.log("name", name)
          that.setData({
            hiddenFlag: true,
            name: name[0],
            num: num,
            info: info,
            xunhuan: xunhuan
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
  /**
   * 点击样式
   */
  active: function(res) {
    if (this.data.active != '') {
      if (res.currentTarget.dataset.num != this.data.active) {
        this.setData({
          active: res.currentTarget.dataset.num,
        })
      } else {
        this.setData({
          active: '',
        })
      }
    } else {
      this.setData({
        active: res.currentTarget.dataset.num,
      })
    }
  },
  /**
   * 中石化加油卡缴费 
   */
  toCharge :function(){
    wx.showLoading({
      title: '疯狂加载中',
      mask: true
    })
    let that = this;
    let billKey = that.data.chargeNum
    // 中石化加油卡 预下单
    let outTradeNo = dataHms()
    let buziType = "PETROLEUM"
    let sellerId = "301320120010105"
    let sellerName = that.data.projectName
    let operatorId = wx.getStorageSync('userInfo').unionId
    let contractNo = that.data.info[that.data.active - 1].contractNo
    let accountNo = that.data.chargeNum
    let totalAmount = that.data.info[that.data.active - 1].dueAmount

    let goodsDetail = {}
    goodsDetail.goodsId = that.data.projectNo;
    goodsDetail.goodsName = sellerName;
    goodsDetail.goodsCategory = "PETROLEUM";
    goodsDetail.quantity = 1;
    goodsDetail.price = totalAmount;
    goodsDetail.accountNo = accountNo;
    goodsDetail.ext1 = contractNo;
    goodsDetail.ext2 = that.data.info[that.data.active - 1].filed4
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
      success: function (data) {
        console.log(data)
        wx.navigateTo({
          url: '/pages/pay/pay?outTradeNo=' + data.data.body.outTradeNo + "&sellerName=" + sellerName + "&amount=" + totalAmount / 100,
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  }
})


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

function reverse(str) {
  if (str.length == 0) return null;
  var i = str.length;
  var dstr = "";
  while (--i >= 0) {
    dstr += str.charAt(i);
  }
  return dstr;
}