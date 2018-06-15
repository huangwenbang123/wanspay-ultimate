Page({
  data: {
   amount:"",
   merchant:"万商支付",
  },
  onLoad: function (options) {
  let that = this;
  if (options.merch_name == '' || options.merch_name==undefined){
    merchant: wx.getStorageSync('CashierDest').merchName
    }
    wx.setStorageSync('jusutongOrderId', 'R' + wx.getStorageSync('jusutongOrderId'))
    var payinfo = wx.getStorageSync("payinfo");
  
    this.setData({
      amount: (payinfo.totalAmount / 100).toFixed(2)
    });

    var payCardNum = '';
    if (payinfo.buyerCardNo == "" || payinfo.buyerCardNo ==null){
     sendTemp()
    }else{
      sendTemp1(that)
    }
  },

  paySuccessButton: function(e){
    wx.switchTab({
      url: "../index/index"
    })
  },
  
});

function getBeforeDate(n) {
  var s = '';
  var d = new Date();
  d.setDate(d.getDate() + n);
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  s = year + "年" + (mon < 10 ? ('0' + mon) : mon) + "月" + (day < 10 ? ('0' + day) : day)+'日';
  return s;
}

function sendTemp() {
  var payinfo = wx.getStorageSync("payinfo");
  console.log("formId is " + wx.getStorageSync('form_id'));
  var fId = wx.getStorageSync('form_id');
  var l = wx.getStorageSync("accessToke");
  var payCardNum = wx.getStorageSync("payCardNum");
  var exchargeRatio = wx.getStorageSync("exchargeRatio");

  if (exchargeRatio == ''){
    exchargeRatio=1;
    }
  console.log('userInfo.openid', wx.getStorageSync('userInfo').openId);
  var d = {
    touser: wx.getStorageSync('userInfo').openId,
    template_id: 'UzqlqILLI7ANNo269lQL4iXHlAuYm1WFJNkjnPSlYnY',//这个是1、申请的模板消息id， 
    page: '/pages/index/index',
    form_id: fId,
    data: {//测试完发现竟然value或者data都能成功收到模板消息发送成功通知，是bug还是故意？？【鄙视、鄙视、鄙视...】 下面的keyword*是你1、设置的模板消息的关键词变量 
      "keyword1": {
        "value": "万商支付",
        "color": "#9b9b9b"
      },
      "keyword2": {
        "value": payinfo.goodsDetail.goodsName,
        "color": "#9b9b9b"
      },
      "keyword3": {
        "value": getBeforeDate(0),
        "color": "#9b9b9b"
      },
      "keyword4": {
        "value": (payinfo.totalAmount / 100).toFixed(2) + '元',
        "color": "#9b9b9b"
      },
      "keyword5": {
        "value": payCardNum,
        "color": "#9b9b9b"
      },
      "keyword6": {
        "value": payinfo.goodsDetail.quantity * exchargeRatio,
        "color": "#9b9b9b"
      },
      "keyword7": {
        "value": payinfo.outTradeNo,
        "color": "#9b9b9b"
      },
      "keyword8": {
        "value": "亲爱的，如果充值账号：" + payinfo.accountNo + ",未能及时到账！请联系我们的客服MM！",
        "color": "#9b9b9b"
      }
    }
  }


  wx.request({
    url: 'https://pay.sanppay.com/order/wechat/notify',
    method: 'post',
    header: {
      'content-type': 'application/json'
    },
    data: {
      "body": {
        "accessToken": l,
        "messageInfo": d
      }
    },
    success: function (data) {
      console.log(data)
      //4.
      if (data.data.success) {

      } else {

      }
    },
    fail: function () {
      console.log('系统错误')
    }
  })

}




function sendTemp1(that) {
  var payinfo = wx.getStorageSync("payinfo");
  console.log("formId is " + wx.getStorageSync('form_id'));
  var fId = wx.getStorageSync('form_id');
  var l = wx.getStorageSync("accessToke");
  var payCardNum = payinfo.buyerCardNo;
  console.log('userInfo.openid', wx.getStorageSync('userInfo').openId);
  var d = {
    touser: wx.getStorageSync('userInfo').openId,
    template_id: 'RQ3v-diP45Hy0B9lMFRJXIRW79jRP-_wRSOcAfToedc',//这个是1、申请的模板消息id， 
    page: '/pages/index/index',
    form_id: fId,
    data: {//测试完发现竟然value或者data都能成功收到模板消息发送成功通知，是bug还是故意？？【鄙视、鄙视、鄙视...】 下面的keyword*是你1、设置的模板消息的关键词变量 
      "keyword1": {
        "value": payinfo.outTradeNo ,
        "color": "#9b9b9b"
      },
      "keyword2": {
        "value": that.data.amount+"元",
        "color": "#0066ff"
      },
      "keyword3": {
        "value": wx.getStorageSync('CashierDest').merchName,
        "color": "#9b9b9b"
      },
      "keyword4": {
        "value": payinfo.buyerCardNo,
        "color": "#9b9b9b"
      },
      "keyword5": {
        "value": getBeforeDate(0),
        "color": "#9b9b9b"
      }
    }
  }


  wx.request({
    url: 'https://pay.sanppay.com/order/wechat/notify',
    method: 'post',
    header: {
      'content-type': 'application/json'
    },
    data: {
      "body": {
        "accessToken": l,
        "messageInfo": d
      }
    },
    success: function (data) {
      console.log(data)
      //4.
      if (data.data.success) {

      } else {

      }
    },
    fail: function () {
      console.log('系统错误')
    }
  })

}