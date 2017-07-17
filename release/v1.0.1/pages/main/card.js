// pages/main/card.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayInfo: null
  },
  pdata: {
    sno: '',
    pwd: '',
    cardNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'enterKey',
      success: function(res) {
        that.pdata.sno = res.data.sno;
        that.pdata.pwd = res.data.pwd;
      },
      fail: function() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    });
    wx.getStorage({
      key: 'cardInfo',
      success: function(res) {
        that.pdata.cardNum = res.data.data.cardNum;
        // console.log(that.pdata);
        wx.request({
          url: app.getApi('CARD_TODAY'),
          data: that.pdata,
          method: 'POST',
          header: app.getApi('HEADER'),
          success: function(res) {
            // console.log(res);
            that.setData({
              dayInfo: res.data.data
            })
          },
          complete: function() {
            if (that.data.dayInfo == null || that.data.dayInfo.length == 0) {
              wx.showToast({
                title: '您今天没有校园卡交易喔',
                icon: 'loading'
              })
            }
          }
        })
      },
    });
    
  }
})