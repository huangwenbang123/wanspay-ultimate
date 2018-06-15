import hexMD5 from '../../utils/util.js';
import { String } from '../../utils/util.js';

Page({
  data: {
    clickevent:'',
    pagesize:5,
    totalRows:"",
    firstcard:"",
    startdata:"",
    orderList:[],
    cardlist:[],
    accountIndex: 0,
    photonum:'',
    noneorblock:'none',
    thisday:'qita',
    selectedDate: '',//选中的几月几号
    selectedWeek: '',//选中的星期几
    curYear: 2017,//当前年份
    curMonth: 0,//当前月份
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList: []
  },

  onLoad: function () {
  
    //页面加载时 查询用户卡片信息 
    var that = this;
    wx.request({
      url: 'https://account.sanppay.com/account/card/list',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "custId": wx.getStorageSync("custId")
        }

      },
      success: function (data) {
        wx.showLoading({
          title: '交易记录加载中',
          mask:true
        });
        console.log("查询交易记录卡片信息", data)
        if (data.data.body != undefined) {
          var cardlist = data.data.body;
        var firstcard = data.data.body[0];
        var photonum = firstcard.substr(0,10);
        if (photonum == '5180025170' || photonum == '5180025060' || photonum == '5180025180') {
          that.setData({
            cardlist: cardlist,
            photonum: photonum,
            firstcard:firstcard
          })
        } else {
          that.setData({
            cardlist: cardlist,
            photonum: 'qita',
            firstcard: firstcard
          })
        }

         /**请求卡片信息结束 */
 /**请求交易记录开始 */
        wx.request({
          url: 'https://pay.sanppay.com/order/page',//自己的服务接口地址
          method: 'put',
          header: {
            'content-type': 'application/json'
          },
          data: {
            "body": {
              "acctType": "CARD",
              "cardNo": that.data.firstcard,
              "txnStartDt": getBeforeDate(0),
              "txnEndDt": getBeforeDate(0),
              "pageSize":5
            }
          },
          success: function (data) {

            console.log("查询介意记录",data);
            if (data.data.code == 200) {
              var arrayList = data.data.body.data;
              var clickevent='';
              if (data.data.body.totalRows<=5){
                clickevent='已加载全部';
              }else{
                clickevent = '加载更多';
              }
              that.setData({
                orderList: arrayList,
                startdata: getBeforeDate(0) + '至' + getBeforeDate(0),
                totalRows: data.data.body.totalRows,
                clickevent: clickevent
              })
              wx.hideLoading();
            }else{
              wx.showToast({
                title: '查询失败',
                icon: 'success',
                duration: 2000
              })
              wx.hideLoading();
            }
          },
          fail: function () {
            console.log(data);
            wx.showToast({
              title: '查询失败',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading();
          }
        })
        /**请求交易记录结束 */
      }else{

          wx.hideLoading();

          wx.showModal({
            title: '提示',
            content: '亲爱的，您还没有卡片，请先添加卡片！',
            confirmText: "添加卡片",
            cancelText: "返回首页",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                wx.redirectTo({ url: '/pages/addCard/addCard' })
              } else {
                wx.switchTab({
                 url: '/pages/index/index' })
              }
            }
          });
      }
    }
    })
  },
  bindAccountChange: function (e) {
    var wsq=this;
    wx.showLoading({
      title: '交易记录加载中',
      mask: true
    });
    var firstcard = this.data.cardlist[e.detail.value];
    var substrvalue = firstcard.substr(0,10);
   if (substrvalue == '5180025170' || substrvalue == '5180025060' || substrvalue == '5180025180'){
     this.setData({
       accountIndex: e.detail.value,
       firstcard: firstcard,
       photonum: substrvalue,
       noneorblock: 'none',
       selectedDate: '',
       startdata:''
     })
   }else{
     this.setData({
       accountIndex: e.detail.value,
       firstcard: firstcard,
       photonum: 'qita',
       noneorblock: 'none',
       selectedDate: '',
       startdata: ''
     })
   }
   
   wx.request({
     url: 'https://pay.sanppay.com/order/page',//自己的服务接口地址
     method: 'put',
     header: {
       'content-type': 'application/json'
     },
     data: {
       "body": {
         "acctType": "CARD",
         "cardNo": this.data.firstcard,
         "txnStartDt": getBeforeDate(0),
         "txnEndDt": getBeforeDate(0),
         "pageSize": 5
       }
     },
     success: function (data) {

       console.log("查询介意记录", data);
       if (data.data.code == 200) {

         var clickevent='';
         if (data.data.body.totalRows <= 5) {
           clickevent = '已加载全部';
         } else {
           clickevent = '加载更多';
         }

         var arrayList = data.data.body.data;
         wsq.setData({
           orderList: arrayList,
           startdata: getBeforeDate(0) + '至' + getBeforeDate(0),
           totalRows: data.data.body.totalRows,
           clickevent: clickevent,
           pagesize: 5
         })
         wx.hideLoading();
       } else {
         wx.showToast({
           title: '查询失败',
           icon: 'success',
           duration: 2000
         })
         wx.hideLoading();
       }
     },
     fail: function () {
       console.log(data);
       wx.showToast({
         title: '查询失败',
         icon: 'success',
         duration: 2000
       })
       wx.hideLoading();
     }
   })



  },
   //日期js------开始
  onShow: function () {
    var today = new Date();//当前时间  
    var y = today.getFullYear();//年  
    var mon = today.getMonth() + 1;//月  
    var d = today.getDate();//日  
    var i = today.getDay();//星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      thisday: y + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (d < 10 ? ('0' + d) : d),
      selectedWeek: this.data.weekArr[i]
    });

    this.getDateList(y, mon - 1);
  },
  getDateList: function (y, mon) {
    var vm = this;
    //如果是否闰年，则2月是29日
    var daysCountArr = this.data.daysCountArr;
    if (y % 4 == 0 && y % 100 != 0) {
      this.data.daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    //第几个月；下标从0开始实际月份还要再+1  
    var dateList = [];
    // console.log('本月', vm.data.daysCountArr[mon], '天');
    dateList[0] = [];
    var weekIndex = 0;//第几个星期
    for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
      var week = new Date(y, mon, (i + 1)).getDay();
      // 如果是新的一周，则新增一周
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
      if (weekIndex == 0) {
        dateList[weekIndex].unshift({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      } else {
        dateList[weekIndex].push({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      }
    }
    // console.log('本月日期', dateList);
    vm.setData({
      dateList: dateList
    });
  },
  selectDate: function (e) {
    //星期几 vm.data.weekArr[e.currentTarget.dataset.date.week]
  
    var vm = this;
    var thisDay = vm.data.thisday;//带零的
    var startDay = vm.data.selectedDate;//不带零的
    var endDay= e.currentTarget.dataset.date.value;//不带零的
  
    
    var arrday=endDay.split('-');
  var endDay0 = arrday[0] + "-" + (arrday[1] < 10 ? ('0' + arrday[1]) : arrday[1]) + "-" + (arrday[2] < 10 ? ('0' + arrday[2]) : arrday[2]); //带零的

  if (endDay0 > thisDay){
     
      wx.showToast({
        title: '不能大于当前日期！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (startDay==''){
      vm.setData({
        selectedDate: endDay,//不带零的
        startdata: endDay0+'至？'
      });
    }else{
      vm.setData({
        selectedDate: endDay//不带零的
      });


      var arrday = startDay.split('-');
      var startDay0 = arrday[0] + "-" + (arrday[1] < 10 ? ('0' + arrday[1]) : arrday[1]) + "-" + (arrday[2] < 10 ? ('0' + arrday[2]) : arrday[2]);//带零的

      wx.showLoading({
        title: '交易记录加载中',
        mask: true
      });

      var txnStartDt='';
      var txnEndDt='';



      if (startDay0 > endDay0){
        txnStartDt = endDay0;
        txnEndDt = startDay0;
      }else{
        txnStartDt = startDay0;
        txnEndDt = endDay0;
      }
      vm.setData({
        startdata: txnStartDt + '至' + txnEndDt
      })
      wx.request({
        url: 'https://pay.sanppay.com/order/page',
        method: 'put',
        header: {
          'content-type': 'application/json'
        },
        data: {
          "body": {
            "acctType": "CARD",
            "cardNo": vm.data.firstcard,
            "txnStartDt": txnStartDt,
            "txnEndDt": txnEndDt,
            "pageSize": 5
          }
        },
        success: function (data) {
          console.log("查询介意记录", data);
          if (data.data.code == 200) {
            var clickevent = '';
            if (data.data.body.totalRows <= 5) {
              clickevent = '已加载全部';
            } else {
              clickevent = '加载更多';
            }

            var arrayList = data.data.body.data;
            vm.setData({
              orderList: arrayList,
              totalRows: data.data.body.totalRows,
              pagesize: 5,
              selectedDate:'',
              clickevent: clickevent
             })
            wx.hideLoading();
          } else {
           
            wx.showToast({
              title: '查询失败',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading();
          }
        },
        fail: function () {
          console.log(data);
          wx.showToast({
            title: '查询失败',
            icon: 'success',
            duration: 2000
          })
          wx.hideLoading();
        }
      })
    }
  },
  preMonth: function () {
    // 上个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    // console.log('上个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  nextMonth: function () {
    // 下个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    // console.log('下个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  }
   //日期js------结束

   ,
  typehide:function(){
    if (this.data.noneorblock=='block'){
      this.setData({
        noneorblock: 'none',
      })
    }else{
    this.setData({
      noneorblock:'block',
      selectedDate: '',
      selectedWeek: ''
    })
    }
  },
  saveCar:function(){
    var vm =this;
    var totalrows = vm.data.totalRows;
    console.log('totalrows', totalrows)
    var pagesize = vm.data.pagesize;
    var dates = vm.data.startdata.split('至');

    if (dates[1]=='？'){
      wx.showToast({
        title: '请选择另一个日期',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (totalrows > pagesize){
      wx.showLoading({
        title: '交易记录加载中',
        mask: true
      });

      wx.request({
        url: 'https://pay.sanppay.com/order/page',
        method: 'put',
        header: {
          'content-type': 'application/json'
        },
        data: {
          "body": {
            "acctType": "CARD",
            "cardNo": vm.data.firstcard,
            "txnStartDt": dates[0],
            "txnEndDt": dates[1],
            "pageSize": totalrows
          }
        },
        success: function (data) {
          console.log("查询介意记录", data);
          if (data.data.code == 200) {
            var arrayList = data.data.body.data;
            vm.setData({
              orderList: arrayList,
              selectedDate: '',
              pagesize: totalrows,
              clickevent: '已加载全部'
            })
            wx.hideLoading();
          } else {

            wx.showToast({
              title: '查询失败',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading();
          }
        },
        fail: function () {
          console.log(data);
          wx.showToast({
            title: '查询失败',
            icon: 'success',
            duration: 2000
          })
          wx.hideLoading();
        }
      })
    }else{
      wx.showToast({
        title: '客官,我也是有底线的^-^！',
        icon: 'none',
        duration: 2000
      })
    }
  }
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

function getBeforeDate(n) {
  var s='';
  var d=new Date();
  d.setDate(d.getDate() + n);
  var  year = d.getFullYear();
  var mon = d.getMonth() + 1;
 var day = d.getDate();
  s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
  return s;
}