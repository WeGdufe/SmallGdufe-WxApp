// pages/lib/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksInfo: null,
    detail: null
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  query: function () {
    var that = this
    wx.request({
      url: app.getApi('SBOOK'),
      method: 'POST',
      header: app.getApi('HEADER'),
      data: {
        bookName: that.data.inputVal
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 0) {
          that.setData({
            booksInfo: res.data.data
          })
          wx.showToast({
            title: '一共找到' + res.data.data.length + '条记录',
          })
        } else {
          wx.showToast({
            title: '书名不能为空！',
            icon: 'loading'
          })
        }
      }
    })
  },
  showDetail: function(e) {
    var macno = e.currentTarget.id;
    var that = this;
    wx.navigateTo({
      url: 'details?macno=' + macno,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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