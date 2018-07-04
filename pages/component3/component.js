// component.js
import hexMD5 from '../../utils/util.js';
Component({
  // 组件属性
  properties: {
    //输入框密码位数
    value_length: {
      type: Number,
      value: 0,
      // 监听输入框密码变化
      observer: function(newVal, oldVal) {
        console.log(newVal)
        let countIndex = wx.getStorageSync("countryIndex");
        console.log('countIndex', countIndex)
        console.log("cardInfo", wx.getStorageSync('cardInfo')[0])
        let cardInfo = wx.getStorageSync('cardInfo')[countIndex];

        let payinfo = wx.getStorageSync('payinfo');
        let orderId = payinfo.outTradeNo;
        let totalAmount = payinfo.totalAmount;
        let that = this;
        let input_value = that.data.input_value
        that.triggerEvent('valueNow', input_value)
        // 当输入框的值等于6时（发起支付等...）
        if (newVal == 6) {
          // 设定延时事件处理
          //支付密码支付
          wx.request({
            url: 'https://account.sanppay.com/account/check',
            method: 'post',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'body': {
                'custId': wx.getStorageSync('custId'),
                'acctId': cardInfo.acctId,
                'acctSecret': input_value
              }
            },
            success: function(data) {
              console.log("校验卡号", data)
              if (data.data.code != "200") {
                wx.showToast({
                  title: data.data.msg,
                  icon: 'none',
                  duration: 2000
                })
                return;
              }

              if (cardInfo.totalAmount < totalAmount) {
                wx.showToast({
                  title: "余额不足,请检查卡片！",
                  icon: 'none',
                  duration: 2000
                })
                return;

              }
              var lastValue = {
                "outTradeNo": orderId,
                "buyerCardNo": cardInfo.acctId,
                "payAmount": totalAmount
              }
              wx.setStorageSync("payCardNum", cardInfo.acctId);
              console.log("6位密码支付")
              console.log(lastValue);
              wx.request({
                url: 'https://pay.sanppay.com/order/pay',
                method: 'put',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  "body": lastValue
                },
                success: function (data) {
                  console.log('下单信息',data)
                  if (data.data.code == '200'){
                    wx.redirectTo({
                      url: '/pages/prepay/msg_success?merch_name=' + '万商支付'
                    })
                 }else{
                    wx.redirectTo({
                      url: '/pages/prepay/msg_fail'
                    })
                 }
                }, 
                fail: function () {
                  console.log('系统错误')
                }

              })
              // wx.redirectTo({
              //   url: '/pages/prepay/msg_success?merch_name=' + '万商支付'
              // })
            },
            fail: function() {
              console.log('系统错误')
            }
          })
        }
      }
    },

    // 是否显示间隔输入框
    interval: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal) {

      }
    },

    // 是否有下一步按钮（如果有则当输入6位数字时不自动清空内容）
    isNext: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal) {

      }
    },

    //输入框聚焦状态
    get_focus: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {

      }
    },
    //输入框初始内容
    input_value: {
      type: String,
      value: "",
      observer: function(newVal, oldVal) {

      }
    },
    //输入框聚焦样式 
    focus_class: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {

      }
    },
    //输入框格子数
    value_num: {
      type: Array,
      value: [1, 2, 3, 4, 5, 6],
      observer: function(newVal, oldVal) {

      }
    },
    //输入框高度
    height: {
      type: String,
      value: "70rpx",
      observer: function(newVal, oldVal) {

      }
    },
    //输入框宽度
    width: {
      type: String,
      value: "550rpx",
      observer: function(newVal, oldVal) {

      }
    },
    //是否明文展示
    see: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {

      }
    },
  },

  // 初始化数据
  data: {

  },

  // 组件方法
  methods: {

    // 获得焦点时
    get_focus() {
      let that = this;
      that.setData({
        focus_class: true
      })
    },

    // 失去焦点时
    blur() {
      let that = this;
      that.setData({
        focus_class: false
      })
    },

    // 点击聚焦
    set_focus() {
      let that = this;
      that.setData({
        get_focus: true
      })
    },

    // 获取输入框的值
    get_value(data) {
      let that = this;
      // 设置空数组用于明文展现
      let val_arr = [];
      // 获取当前输入框的值
      let now_val = data.detail.value
      // 遍历把每个数字加入数组
      for (let i = 0; i < 6; i++) {
        val_arr.push(now_val.substr(i, 1))
      }
      // 获取输入框值的长度
      let value_length = data.detail.value.length;
      // 更新数据
      that.setData({
        value_length: value_length,
        val_arr: val_arr,
        input_value: now_val
      });

    },
  }
})