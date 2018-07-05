// pages/jwxt/score.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keys: [],
    details: null,
    show: {},
  },
  updateScores: function () {
   let that = this
    app.request({
      url: app.getApi('CREDITDETAILS'),
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          let info = res.data.data;
          let tmp = Object.keys(info)
          var rec = {}
          for (var i = 0; i < tmp.length; i++) {
            var key = 'id_' + i;
            rec[key] = true;
          }
          // 一次性setData
          that.setData({
            details: info,
            show: rec,
            keys: tmp
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
        }
      }
    })
  },
  show: function (e) {
    var tar = e.currentTarget.id
    this.data.show[tar] = !this.data.show[tar]
    this.setData({
      show: this.data.show
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!!options['data']) {
      this.setData(JSON.parse(options.data));
    } else if (this.data.lists == null) {
      this.updateScores();
    }
  },
})