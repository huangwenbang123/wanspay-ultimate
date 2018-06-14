// pages/others/form/form.js
const app = getApp()
Page({
  data: {
    cardlist:[],
    modalCardput2:true,
    deletecard:'',
    index:'',
    custId :"",
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
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let custId = wx.getStorageSync('custId');
    that.setData({
      custId: custId
    })
    var userInfo= wx.getStorageSync('userInfo');
    console.log(userInfo)
    wx.request({
      url: 'https://account.sanppay.com/account/list',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "acctType":'CARD',
          "custId": custId
        }

      },
      success: function (data) {
        if (data.data.body != undefined){
        var cardlist=[];
        for(var index in data.data.body){
          console.log("卡包信息", data.data.body)
          var card = data.data.body[index];
          var partcard='';
          if (card.acctId.substr(0, 10) == '5180025170' || card.acctId.substr(0, 10) == '5180025060' || card.acctId.substr(0, 10) == '5180025180' ){
            partcard = card.acctId.substr(0, 10);       
          }else{
            partcard='others';
          }

          var bal = '¥'+ (card.acctBal / 100).toFixed(2);
          if (card.acctState!="VALID"){
            bal='卡片异常'
          }
          cardlist.push({ card: card.acctId, bal:bal, partcard: partcard })
        }
        that.setData({
          cardlist: cardlist
        })
        }
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  colsePwdPay:function(){
    let inputData = this.data.inputData;
    //inputData.input_value="";
    this.setData({
    modalCardput2: true,
    inputData: inputData
})
  },
  valueSix(e) {
    var that=this;
    console.log(e.detail);
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo.unionId);
    wx.request({
      url: 'https://account.sanppay.com/account/delete',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      data: {
        "body": {
          "custId": this.data.custId,
          "acctId": this.data.deletecard,
          "acctSecret": e.detail
        }

      },
      success: function (data) {
        console.log("删除",data);

        if (data.data.code == 200) {
          that.data.cardlist.splice(that.data.index, 1);
          that.setData({
            modalCardput2: true,
            cardlist: that.data.cardlist,
          
          })
          wx.showToast({
            title:"删除成功",
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })

  },
  delete1: function (e) {
    console.log('删除', e);
    var index = e.currentTarget.dataset.index;
    this.data.cardlist[index].scrollLeft = 0;
    this.data.cardlist.splice(index, 1);
    this.setData({
      cardlist: this.data.cardlist
    });
  },
  delete: function (e) {
    console.log('删除', e);
    var index = e.currentTarget.dataset.index;
    console.log(this.data.cardlist[index].acctId)
    this.setData({
      deletecard: this.data.cardlist[index].card,
      modalCardput2:false,
      index:index
    });
  },

  cancel: function (e) {
    var index = e.currentTarget.dataset.index;
    var cardnum=this.data.cardlist[index].card;
 
    if (cardnum.substr(7, 1)=='0'){
      wx.showToast({
        title:'此卡为不记名卡，不能修改密码！',
        icon:'none'
      })
      return;
   }
   
    console.log('密码修改', cardnum);
    wx.navigateTo({ url: '/pages/changeCardSecret/changeCardSecret?acctId=' + cardnum})
  },
  shenqing:function(){
    
    wx.navigateTo({ url: '/pages/business/merchantsIn/merchantsIn'})
  },

  addCard:function(){
    wx.navigateTo({ url: '/pages/addCard/addCard'})
  }
})