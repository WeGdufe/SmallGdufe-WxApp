// pages/jwxt/cet.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cet_result: null
  },
  pdata: {
    zkzh: '',
    xm: ''
  },
  /**
   * 事件处理函数
   */
  query: function () {
    //console.log()
    var that = this
    wx.request({
      url: app.getApi('CET'),
      data: that.pdata,
      method: 'POST',
      header: app.getApi('HEADER'),
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          that.setData({
            cet_result: res.data.data
          })
        } else {
          wx.showToast({
            title: '查询失败 :' + res.data.msg,
            icon: 'loading',
            duration: 1500
          });
        }
      }
    });
  },
  inputKh: function (e) {
    // console.log(e.detail.value)
    this.pdata.zkzh = e.detail.value;
  },
  inputXm: function (e) {
    // console.log(e.detail.value)
    this.pdata.xm = e.detail.value;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})