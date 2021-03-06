// pages/jwxt/schedule.js
var app = getApp()
const weeks = ['所有课程'];
for (var i = 1; i < 20; i++) {
  weeks.push("第" + i.toString() + "周");
}
Page({
  data: {
    modalHidden: true,
    array: weeks,
    index: 0,
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", "#FF7F24", "#87CEFA", "#965527", "#326510", "#a3c62b", "#c20625", "#eb7f00", "#904c95", "#7f5123", "#b5874c", "#14429a", "#58bfea", "#265e83", "#d3578c", "#ffd200", "#0cbba3", "#fea317", "#006634"]
  },
  onLoad: function (options) {
    if (!!options['data']) {
      this.setData(JSON.parse(options.data));
      if (!!options.data.title) wx.setNavigationBarTitle({
        title: '别人' + options.data.title + '的课表',
      })
    }
  },
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      index: e.detail.value
    })
    wx.setStorage({
      key: 'KB',
      data: that.data
    })
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