// pages/main/main.js
var app = getApp();
var cur_term = app.getTerm();
var date = new Date();
var s_year = date.getFullYear();
var end = 0;
const time_lists = [];
for (var year = -5; year <= end; year++) {
  for (var i = 1; i < 3; i++) {
    time_lists.push((s_year + year).toString() + '-' + (s_year + year + 1).toString() + '-' + i.toString());
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseInfo: null,
    cardInfo: null,
    time_lists: time_lists,
    index: time_lists.indexOf(cur_term)
  },
  bindTimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      });
      wx.setStorageSync('TERM', this.data.time_lists[this.data.index]);
  },
  logout: function() {
    wx.showModal({
      title: '注销',
      content: '你确定要注销吗？',
      success: function(res) {
        if(res.confirm) {
          wx.clearStorage();
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getBaseInfo(function(info){
      // console.log(info);
      that.setData({
        baseInfo: info
      });
    });
  },
  onShow: function() {
    this.updateCardInfo();
  },
  onPullDownRefresh: function() {
    this.updateCardInfo()
    wx.stopPullDownRefresh()
  },
  updateCardInfo: function(times = 0) {
    var that = this
    wx.getStorage({
      key: 'enterKey',
      success: function (res) {
        wx.request({
          url: app.getApi('CARD'),
          data: res.data,
          method: 'POST',
          header: app.getApi('HEADER'),
          success: function (res) {
            // console.log(res);
            that.setData({
              cardInfo: res.data.data
            })
            wx.setStorage({
              key: 'cardInfo',
              data: res.data
            })
          },
          fail: function() {
            console.log(times);
            if(times >= 5) {
              wx.showToast({
                title: '查询超时,请下拉重试',
                icon: 'loading'
              })
              return;
            }
            that.updateCardInfo(times + 1);
          }
        })
      },
    })
  }
})