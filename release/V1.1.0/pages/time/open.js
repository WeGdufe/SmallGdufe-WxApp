// pages/lib/open.js
var app = getApp()
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
    var that = this;
    wx.request({
      url: app.getApi('LIB'),
      success: function(res) {
        // console.log(res)
        that.setData({
          lists: res.data.data
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})