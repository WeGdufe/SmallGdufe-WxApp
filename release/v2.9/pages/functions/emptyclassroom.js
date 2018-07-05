// pages/functions/emptyclassroom.js
const app = getApp()
const config = wx.getStorageSync('CONFIG') || {}
const date = new Date()
const weeks = [];
for (var i = 1; i < 20; i++) {
  weeks.push("第" + i.toString() + "周");
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',],
    lists: [],
    buildIndex: 0,
    weeks: weeks,
    week: config.week,
    day: (date.getDay() + 6) % 7,
    build: [["SJ1", "SS1", "SJ2","J1", "B4", "S1", "Z1","B5","SJ3"],
      ["佛山-励学楼", "佛山-拓新楼", "佛山-笃行楼", "广州-第一教学楼", "广州-经管实验楼(北4)", "广州-实验楼", "广州-综合楼", "广州-第三教学楼(北5)", "佛山-厚德楼"]]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getLists();
    let build = wx.getStorageSync('BUILDING') || 0
    this.setData({
      buildIndex: build
    })
    this.getLists();
  },

  weekUp: function() {
    this.setData({
      week: Math.min(this.data.week + 1, 18)
    })
    this.getLists();
  },
  weekDown: function () {
    this.setData({
      week: Math.max(this.data.week - 1, 1)
    })
    this.getLists();
  },
  dayUp: function () {
    this.setData({
      day: (this.data.day + 1) % 7
    })
  },
  dayDown: function () {
    this.setData({
      day: (this.data.day + 6) % 7
    })
  },

  buildPicker: function(e) {
    wx.setStorageSync('BUILDING', e.detail.value)
    this.setData({
      buildIndex: e.detail.value
    })
    this.getLists();
  },
  buildWeekPicker: function(e) {
    this.data.week = e.detail.value + 1
    this.setData({
      week: e.detail.value + 1
    })
    this.getLists();
  },
  buildDayPicker: function (e) {
    this.data.day = e.detail.value
    this.setData({
      day: e.detail.value
    })
  },

  getLists: function() {
    var that = this
    wx.showLoading({
      title: '查询中...',
    })
    app.request({
      url: app.getApi('KKS'),
      data: {
        stu_time: config.term,
        week: that.data.week,
        building: that.data.build[0][that.data.buildIndex]
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          lists: res.data.data
        })
        wx.hideLoading()
      },
      fail: function(res) {
        wx.showToast({
          title: '查询失败',
        })
      }
    })
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