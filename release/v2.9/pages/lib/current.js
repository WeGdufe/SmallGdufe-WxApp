// pages/lib/current.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksInfo: null,
    verify_code: null,
    current_index: 0,
    modalHidden: true,
    inputCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updataLists()
  },
  updataLists: function () {
    var that = this;
    app.request({
      url: app.getApi('CBOOK'),
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
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
            icon: 'none'
          })
        }

      }
    })
  },
  selectBook: function (e) {
    var index = e.currentTarget.id;
    let that = this
    this.setData({
      current_index: index,
      modalHidden: false
    })
    if (this.data.verify_code == null) {
      this.verify()
    }
  },
  verify: function (e) {
    let that = this
    app.request({
      url: app.getApi('RENEWVERIFY'),
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            verify_code: res.data.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  updCode: function (e) {
    this.setData({
      inputCode: e.detail.value
    })
  },
  renew: function (res) {
    var that = this
    if (res.type == 'confirm') {
      let book = this.data.booksInfo[that.data.current_index]
      app.request({
        url: app.getApi('RENEWBOOK'),
        method: 'POST',
        data: {
          barId: book.barId,
          checkId: book.checkId,
          verify: that.data.inputCode
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              modalHidden: true
            })
            wx.showToast({
              title: res.data.data.data,
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    } else {
      that.setData({
        modalHidden: true
      })
    }
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