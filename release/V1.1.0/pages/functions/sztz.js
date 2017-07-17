// pages/functions/sztz.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.lists == null) {
      this.updateSztz();
    }
  },

  updateSztz: function() {
    var that = this;
    wx.getStorage({
      key: 'enterKey',
      success: function (res) {
        wx.request({
          url: app.getApi('SZTZ'),
          data: res.data,
          method: 'POST',
          header: app.getApi('HEADER'),
          success: function (res) {
            // console.log(res);
            that.setData({
              lists: res.data.data
            })
          }
        })
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})