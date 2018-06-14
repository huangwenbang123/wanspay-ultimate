// pages/bmfu/bmfu.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.js');
var qqmapsdk;
import { String } from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    busi: {},
    city: {},
    province: {},
    url: "https://master.order.sanppay.com",
    multiArray: {},
    multiIndex: [0, 0],
    cityCode: {},
    name: "",
    water: false,
    electricity: false,
    fuelGas: false,
    nowCityCode : "",
    nowProvinceCode : "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //从本地拿到用户的地址信息
    console.log(app)
    this.setData({
      name: app.globalData.addressInfo[1] + " " + app.globalData.addressInfo[0],
      nowCityCode: app.globalData.addressInfo[2],
      nowProvinceCode: app.globalData.addressInfo[3]
    })
    
    getPage(this);
    wx.request({
      url: 'https://master.order.sanppay.com/wxsp/charge/index',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        let multiArray = [];
        let province = [];
        let cityCode = [];
        let city = [];

        for (var i = 0; i < res.data.province.chargeProvinces.length; i++) {
          province.push(res.data.province.chargeProvinces[i].provinceName);
          cityCode.push(res.data.province.chargeProvinces[i].provinceCode);
        }

        for (var i = 0; i < res.data.city.chargeCities.length; i++) {
          if (res.data.city.chargeCities[i].status == "01" &&
            (res.data.province.chargeProvinces[0].provinceCode == res.data.city.chargeCities[i].provinceCode)
          ) {
            city.push(res.data.city.chargeCities[i].cityName);
          }
        }

        multiArray.push(province);
        multiArray.push(city);
        console.log(province)
        console.log(city)
        console.log(multiArray)
        that.setData({
          busi: res.data.busi,
          city: res.data.city,
          province: res.data.province,
          multiArray: multiArray,
          cityCode: cityCode,
        })

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
   * 话费充值页面
   */
  huafei: function () {
    wx.navigateTo({ url: '/pages/bmfw/huafei/huafei', })
  },
  /**
   * 流量充值页面
   */
  liuliang: function () {
    wx.navigateTo({ url: '/pages/bmfw/liuliang/liuliang', })
  },
  /**
   * 加油卡充值
   */
  sinopec: function () {
    wx.navigateTo({ url: '/pages/bmfw/sinopec/sinopec', })
  },

  /**
   * 省市区选择
   */
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log('picker发送选择改变，携带值为', e)
    let pickerCity = [];
    //所有城市列表
    let allCity = this.data.city.chargeCities;
    //所有省份列表
    let allProvince = this.data.province.chargeProvinces;
    //全部省代码
    let allProvinceCode = e.currentTarget.dataset.citycode;
    //当前 prcker 选择的 省 的代码
    let provinceCode = allProvinceCode[data.multiIndex[0]];
    console.log('picker发送选择改变，当前 prcker 选择的 省 的代码 携带值为', provinceCode)
    //当前 prcker 选择的 市 的代码
    let cityCode = "";
    let inputName = "";
    let pickerCityCode = [];
    //找出当前省的 所有可用市区的代码 和当前选择市的名称
    console.log(allCity)
    for (var i = 0; i < allCity.length; i++) {
      if (provinceCode == allCity[i].provinceCode) {
        pickerCity.push(allCity[i].cityName);
        pickerCityCode.push(allCity[i].cityCode);
      }
    }
    let multiArray = this.data.multiArray;
    multiArray[1] = pickerCity;
    //显示省市名称 获取 picker 显示的 省市名称 
    inputName = allProvince[this.data.multiIndex[0]].provinceName + " " + multiArray[1][this.data.multiIndex[1]];  
    this.setData({
      multiArray: multiArray,
      name: inputName,
      nowCityCode: pickerCityCode[this.data.multiIndex[1]],
      nowProvinceCode: provinceCode
    })

    getPage(this);

  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  /**
   * 跳转选择缴费缴费机构页面
   */
  goCharge: function (e) {
    //将地区码 和 缴费编号 带到 选择缴费机构页面

    let busiCode = e.currentTarget.dataset.busicode;
    let nowProvinceCode = this.data.nowProvinceCode;
    let nowCityCode = this.data.nowCityCode;
    console.log("省代码 市代码 is" + nowProvinceCode, nowCityCode)
    switch (e.currentTarget.dataset.busicode + "") {
      case "04": wx.navigateTo({ url: '../bmfw/huafei/huafei' }); break;
      case "05": wx.navigateTo({ url: '../bmfw/liuliang/liuliang' }); break;
      case "06": wx.navigateTo({ url: '../bmfw/sinopec/sinopec' }); break;
      default: wx.navigateTo({ url: '../bmfw/paymentInstitutions/paymentInstitutions?busiCode=' + busiCode + '&provinceCode=' + nowProvinceCode + "&cityCode=" + nowCityCode, })
    }
  }

})

function getCityCode() {
  qqmapsdk = new QQMapWX({
    key: 'YE4BZ-RXGCS-UUAO3-6W5QX-6EVAZ-KOBQ5'
  });
  // 调用接口
  qqmapsdk.getCityList({
    success: function (res) {
      console.log("一下为所有城市代码");
      console.log(JSON.stringify(res.result[0]));
      console.log(JSON.stringify(res.result[1]));
      console.log(JSON.stringify(res.result[2]));
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}


//通过当前地址代码信息遍历出页面
function getPage(that) {
  let nowCityCode = that.data.nowCityCode;
  let nowProvinceCode = that.data.nowProvinceCode;
  let arrBusi = [];
  console.log("省份代码 province is " + nowProvinceCode + " ,城市信息 nowCityCode is " + nowCityCode)

  wx.request({
    url: 'https://master.order.sanppay.com/utilities/company',
    method: "POST",
    data: {
      cityCode: nowCityCode,
      provinceCode: nowProvinceCode
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data.body)
      arrBusi = res.data.body;
      wx.setStorage({key: "arrBusi",data: arrBusi})
      let water = false;
      let electricity = false;
      let fuelGas = false;

      if (!String.isBlank(arrBusi)) {
        //遍历出 页面显示的业务类型
        for (var i = 0; i < arrBusi.length; i++) {
          switch (arrBusi[i].busiCode) {
            case "01": water = true; break;
            case "02": electricity = true; break;
            case "03": fuelGas = true; break;
          }
        }
        that.setData({
          water: water,
          electricity: electricity,
          fuelGas: water
        })
      }
    }
  })
}