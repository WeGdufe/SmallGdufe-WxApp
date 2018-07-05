// pages/jwxt/yjpj.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    finished: false
  },

  save: function() {
    this.yjpj()
  },
  finish: function() {
    this.setData({
      finished: true
    })
  },
  home: function() {
    wx.switchTab({
      url: '/pages/main/main',
    })
  },
  submit: function(res) {
    var that = this
    wx.showModal({
      title: '此操作不可逆！',
      content: '确定一键评教并提交吗？',
      success: function(res) {
        if(res.confirm) {
          that.yjpj(1)
        }
      }
    })
  },

  yjpj: function (submit = 0) {
    wx.showLoading({
      title: '正在评教，请耐心等待',
    })
    var that = this
    app.request({
      url: app.getApi('OTHER_PJ'),
      method: 'POST',
      data: {
        submit: submit
      },
      success: function (res) {
        if(res.data.code == 0) {
          var log = res.data.data
          that.setData({
            logs: log.split('\n'),
            finished: true
          })
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
        }
      },fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '遇到错误，请重试',
          image: '/res/me_exit.png'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin()
    app.updateConfig()
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
    // var config = wx.getStorageSync('CONFIG') || false
    // if (!config || !config.pj) {
    //     config = {}
    //     config.pj = 0
    // }
    // if (config.pj == 0) wx.navigateBack()
  }
})