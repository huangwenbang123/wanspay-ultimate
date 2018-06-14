import hexMD5 from '../../utils/util.js';
import { String } from '../../utils/util.js';

Page({
  data: {
      pageNum: 1,
      orderList:"",
  },

  onLoad: function () {
    //页面加载时 查询用户订单信息
    var that = this;

    wx.request({
      url: 'https://cashiertest.sanppay.com/wxsp/order/info',//自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        unionId: wx.getStorageSync('userInfo').userInfo.unionId,
      },
      success: function (data) {
       console.log(data);
       if (data.data.biz_content!=null){
         var arrayList = data.data.biz_content;
         for (var i = 0; i < arrayList.list.length; i++) {
           var payTime = arrayList.list[i].payTime;
           arrayList.list[i].payTime = formattime(payTime, "Y-M-D h:m:s")
         }
         that.setData({
           orderList:arrayList
         })
       }
      },
      fail: function () {
        console.log(data);
      }
    })
  },

  

})

//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}  

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formattime(number, format) {

  if (number != null) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];//  
    var returnArr = [];


    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));


    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));


    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    //format.replace(/\//g,'-');  
    return format.replace(/\//g, '-');


  } else {
    return number;
  }
}  