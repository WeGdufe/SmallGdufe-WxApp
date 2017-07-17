// pages/jwxt/schedule.js
var app = getApp()
Page({
  data: {
    modalHidden: true,
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", "#FF7F24", "#87CEFA", "#965527", "#326510", "#a3c62b", "#c20625", "#eb7f00", "#904c95", "#7f5123", "#b5874c", "#14429a", "#58bfea", "#265e83", "#d3578c", "#ffd200", "#0cbba3", "#fea317", "#006634"]
  },
  onLoad: function (options) {
    if (!!options) {
      this.setData(JSON.parse(options.data));
      // console.log(this.data);
    }
  },
  showCardView: function (e) {
    this.setData({
      cur_index: e.currentTarget.dataset.index
    })
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function (res) {
    var that = this
    this.setData({
      modalHidden: true
    })
  },
  gotoIndex: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})