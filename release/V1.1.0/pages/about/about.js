// pages/about/about.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: app.getVersion()
  },
  copyWeChat: function() {
    wx.setClipboardData({
      data: 'fredyongfa',
      success: function (res) {
        wx.showToast({
          title: '已经复制作者微信号'
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})