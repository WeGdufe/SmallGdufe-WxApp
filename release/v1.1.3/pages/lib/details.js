// pages/lib/details.js
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
    var that = this;
    wx.request({
      url: app.getApi('DBOOK'),
      data: options,
      method: 'POST',
      header: app.getApi('HEADER'),
      success: function (res) {
        // console.log(res);
        if(res.data.code == 0) {
          that.setData({
            lists: res.data.data
          })
        } else {
          wx.showToast({
            title: '获取详情失败，请重试',
            icon: 'loading',
            complete: function() {
              wx.navigateBack();
            }
          })
        }
      }
    })
  }
})