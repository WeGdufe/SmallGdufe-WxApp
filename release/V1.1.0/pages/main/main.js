// pages/main/main.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseInfo: null,
    cardInfo: null
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
    if(this.data.cardInfo == null) {
      this.updateCardInfo();
    }
    
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