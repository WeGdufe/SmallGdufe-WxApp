// pages/jwxt/yjpj.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin()
    var that = this;
    if (!!options['data']) {
      this.setData(JSON.parse(options.data));
    } else if (this.data.lists == null) {
      that.setData({
        config: wx.getStorageSync('CONFIG')
      })
      if(this.showOld()) this.updateList()
    }
  },

  showOld: function() {
    var data = wx.getStorageSync('EXAMSCHEDULE') || false
    this.setData({
      lists: data
    })
    return !data;
  },

  updateList: function () {
    var that = this;
    app.request({
      url: app.getApi('EXAM'),
      data: {
        stu_time : that.data.config.term
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
          return;
        }
        if (res.data.data.length > 0) {
          that.setData({
            lists: res.data.data
          })
          wx.setStorageSync('EXAMSCHEDULE', res.data.data)
        } else {
          wx.showToast({
            title: '没查到考试安排哟',
          })
        }
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
  check: function () {
    app.updateConfig()
    var config = wx.getStorageSync('CONFIG') || false
    if (!config.exam || config.exam == 0) wx.switchTab({
      url: '/pages/index/index',
    })

    this.data.config = config
    return config.exam == 1
  },
  onShareAppMessage: function () {
    var tmp = JSON.parse(JSON.stringify(this.data));
    delete (tmp.colorArrays);
    var json = JSON.stringify(tmp);
    //console.log(json);
    return {
      title: '我的考试时间',
      path: '/pages/jwxt/exam?data=' + json,
      success: function (res) {        // 转发成功
      }
    }
  },
  onPullDownRefresh: function () {
    this.updateList()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新',
    })
  }
})