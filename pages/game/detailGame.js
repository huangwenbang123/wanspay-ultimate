// pages/game/detailGame.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchargeRatio:'',
    gameInfo:[],
    sallist:[],
    productList: ["10", "20", "30","50","100","200"],
    selectFlag: false,
    countries: [],
    countryIndex: 0,
    active: "",
    amount:"",
    input1Value:"",
    inputValue:"",
    realserverlist:[],
    numberList:[],
    placeValue:"",
    teststr:"",
    itemSalesPrice:"",
    orderId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var gameInfo = JSON.parse(options.prc); 
    console.log(gameInfo)
    this.setData({
      gameInfo: gameInfo,
      exchargeRatio: gameInfo.exchargeRatio,
      placeValue: "请输入"+gameInfo.unitName+"数",
      teststr: gameInfo.itemSalesPrice + "元/" + gameInfo.exchargeRatio + gameInfo.unitName,
      itemSalesPrice: gameInfo.itemSalesPrice
    })
    
    var sallistss = [];
    for (var index in this.data.productList) {
      var indexValue = this.data.productList[index];
      var ser = (indexValue*gameInfo.itemSalesPrice).toFixed(2)+'';

      var str = { "fix": indexValue * gameInfo.exchargeRatio,"itemSalesPrice":ser};
      sallistss.push(str);
    }
    this.setData({
      sallist: sallistss
    })
    if (gameInfo.selectFlag==0){
      this.setData({
        selectFlag: true
      })
    }else{
      var str = gameInfo.gameId;
    var o = { "gameId": str};
    var that = this;
    wx.request({
      url: 'https://master.order.wanspay.com/test/game/queryGameArea',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": o
      },
      success: function (data) {
        console.log(data)
        var serverlist = [];
       
        serverlist.push("请选则服务区");
        for (var index in data.data.body.datas) {
          var ser = data.data.body.datas[index].server;
          var dealser = ser.split("w")[1];
          serverlist.push(dealser);
        }
        console.log(serverlist);
        console.log(data);
        that.setData({
          countries: serverlist,
          realserverlist: data.data.body.datas
        })
      }
    })
    }
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
  active: function (res) {    
    console.log(this.data.gameInfo)

    if (this.data.active != '') {
      if (res.currentTarget.dataset.num != this.data.active) {
        var valueter = parseFloat(this.data.sallist[res.currentTarget.dataset.num - 1].itemSalesPrice);
        var lastValue = valueter.toFixed(2);
        this.setData({
          active: res.currentTarget.dataset.num,
          amount: this.data.productList[res.currentTarget.dataset.num-1],
          teststr: this.data.productList[res.currentTarget.dataset.num - 1] * this.data.exchargeRatio + this.data.gameInfo.unitName+'/'+lastValue + '元'
        })
      } else {
        console.log(this.data.gameInfo)
        this.setData({
          active: '',
          amount:'',
          teststr: this.data.gameInfo.itemSalesPrice + "元/" + this.data.gameInfo.exchargeRatio + this.data.gameInfo.unitName
        })
      }
    } else {
      console.log(this.data.active)
      var valueter = parseFloat(this.data.sallist[res.currentTarget.dataset.num - 1].itemSalesPrice);
      var lastValue = valueter.toFixed(2);
      this.setData({
     
        active: res.currentTarget.dataset.num,
        amount: this.data.productList[res.currentTarget.dataset.num-1],
        teststr: this.data.productList[res.currentTarget.dataset.num - 1] * this.data.exchargeRatio + this.data.gameInfo.unitName+'/' + lastValue + '元'
      })
    }
  },

  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },

  saveCar: function (e) {

    wx.setStorageSync('form_id', e.detail.formId)
    var that = this;
    var inputValue = that.data.inputValue;
    var input1Value = that.data.input1Value;
    if (inputValue == '' || input1Value == '' || inputValue != input1Value) {
      wx.showToast({
        title: '请检查充值账号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    
    var amount = this.data.amount;
    if (amount == 0 || amount == null || amount == '' || typeof (amount) == "undefined") {
      wx.showToast({
        title: '请输入充值数量!',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (that.data.selectFlag==false&&that.data.countryIndex==0){
      wx.showToast({
        title: '请选择服务区!',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (that.data.amount < that.data.gameInfo.minPrice) {
      wx.showToast({
        title: "充值数量不能低于" + that.data.gameInfo.minPrice,
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (that.data.amount > that.data.gameInfo.maxPrice / that.data.exchargeRatio) {
      wx.showToast({
        title: "充值数量不能高于" + this.data.gameInfo.maxPrice / that.data.exchargeRatio,
        icon: 'none',
        duration: 1000
      })

      return;
    }
    wx.setStorageSync("exchargeRatio", that.data.exchargeRatio)
    var serverInfo = that.data.realserverlist[that.data.countryIndex-1];
    if (that.data.selectFlag == true){
      var goodsDetail = {
        "goodsId": that.data.gameInfo.itemId,
        "goodsName": that.data.gameInfo.itemName,
        "goodsCategory": "GAME",
        "quantity": that.data.amount,
        "price": (that.data.gameInfo.itemSalesPrice * 100).toFixed(0),
        "ext1": "",
        "ext2": ""
      }
    }else{
    var goodsDetail = {
      "goodsId": that.data.gameInfo.itemId,
      "goodsName": that.data.gameInfo.itemName,
      "goodsCategory": "GAME",
      "quantity": that.data.amount ,
      "price": (that.data.gameInfo.itemSalesPrice * 100).toFixed(0),
      "ext1": serverInfo.area,
      "ext2": serverInfo.server
    }
    }
    var bizContent = {
      "totalAmount": (that.data.gameInfo.itemSalesPrice * 100 * that.data.amount).toFixed(0),
      "accountNo": input1Value,
      "sellerId": that.data.gameInfo.merchantId,
      "operatorId": wx.getStorageSync('userInfo').unionId,
      "outTradeNo": wx.getStorageSync('jusutongOrderId'),
      "buziType": "GAME",
      "goodsDetail": goodsDetail
    }
    let lastValue=JSON.stringify(bizContent);
    wx.navigateTo({ url: '/pages/video/videoPay?bizContent=' + lastValue})
  },

  bindblurEvent: function () {
    var inputValue = this.data.inputValue;
    var input1Value = this.data.input1Value;
    if (inputValue!=''&&input1Value != '' && (input1Value != inputValue)) {
        wx.showToast({
        title: '两次输入账号不同,请重新输入',
        icon: 'none',
        duration: 1000
        })
        this.setData({
        input1Value: "",
        inputValue: ""
        })
    } 

  },
  bindblur1Event:function(){
    var inputValue= this.data.inputValue;
    var input1Value = this.data.input1Value;
    if (inputValue != '' && input1Value != ''&&input1Value != inputValue){
        wx.showToast({
          title: '两次输入账号不同,请重新输入',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          input1Value: "",
          inputValue: ""
        })
    }
  },
  mobileInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  mobile1Input: function (e) {
    this.setData({
      input1Value: e.detail.value
    })
  },

  mobile2Input: function (e) {

   var testValue= e.detail.value;
  
   if (testValue == 0 || testValue == null || testValue == '' || typeof (testValue) == "undefined") {
      this.setData({
        amount:'',
        teststr:this.data.gameInfo.itemSalesPrice + "元/" + this.data.gameInfo.exchargeRatio + this.data.gameInfo.unitName
      })
      wx.showToast({
        title: '充值数量不能为0',
        icon: 'none',
        duration: 1000
      })
    } else{
     this.setData({
       amount: testValue,
       teststr: testValue*this.data.gameInfo.exchargeRatio + this.data.gameInfo.unitName+"/"+parseFloat(testValue * this.data.gameInfo.itemSalesPrice).toFixed(2)+"元",
       active: ''
     })
   }
  }
})