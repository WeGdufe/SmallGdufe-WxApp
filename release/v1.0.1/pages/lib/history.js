// pages/lib/history.js
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
      success: function (res) {
        wx.request({
          url: app.getApi('HBOOK'),
          method: 'POST',
          data: res.data,
          header: app.getApi('HEADER'),
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({
                booksInfo: res.data.data
              })
              if (res.data.data.length == 0) {
                wx.showToast({
                  title: '您还没有借阅过图书喔！',
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
    if(this.data.booksInfo != null) {
      wx.showToast({
        title: '加载完毕，一共找到' + this.data.booksInfo.length + '条记录！'
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '已经到底了喔'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})