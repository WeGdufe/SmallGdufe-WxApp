// pages/lib/current.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'enterKey',
      success: function(res) {
        wx.request({
          url: app.getApi('CBOOK'),
          method: 'POST',
          data: res.data,
          header: app.getApi('HEADER'),
          success: function(res) {
            if(res.data.code == 0) {
              that.setData({
                booksInfo: res.data.data
              })
              if (res.data.data.length == 0) {
                wx.showToast({
                  title: '您当前没有借阅图书喔！',
                })
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'loading'
              })
            }
            
          }
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})