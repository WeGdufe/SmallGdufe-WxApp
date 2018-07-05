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
    app.request({
      url: app.getApi('CARD_TODAY'),
      method: 'POST',
      success: function (res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
          return;
        }
        that.setData({
          dayInfo: res.data.data
        })
      },
      complete: function () {
        if (!!that.data.dayInfo && that.data.dayInfo.length == 0) {
          wx.showToast({
            title: '没有交易记录喔',
            icon: 'loading'
          })
        }
      },
    });

  }
})