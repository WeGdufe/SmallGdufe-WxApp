//logs.js
var app = getApp()
Page({
  data: {
    logs: null
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.getApi('LOG_ALL'),
      success: function(res) {
        // console.log(res);
        var tmp = res.data.data.split('\n')
        that.setData({
          logs: tmp
        })
      }
    })
  }
})
