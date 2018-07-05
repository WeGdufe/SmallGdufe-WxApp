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
    if (!!options['data']) {
      this.setData(JSON.parse(options['data']));
      // console.log(this.data);
    }
    if (this.data.lists == null) {
      this.updateSztz();
    }
  },

  updateSztz: function () {
    var that = this;
    app.request({
      url: app.getApi('SZTZ'),
      success: function (res) {
        // console.log(res);
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
    var json = JSON.stringify(this.data);
    return {
      title: '我的素拓分',
      path: '/pages/functions/sztz?data=' + json,
    }
  }
})