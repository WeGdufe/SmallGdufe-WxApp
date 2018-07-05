// pages/query/electric.js
const buildings = ['23', '26', '27', '29', '30', '32'];
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    building: null,
    room: '',
    lists: []
  },
  switchInput: function() {
    this.setData({
      isself: false
    })
  },

  query: function() {
    var that = this
    wx.setNavigationBarTitle({
      title: that.data.building + '栋 ' + that.data.room,
    })
    app.request({
      url: app.getApi('ELECTRIC'),
      method: 'POST',
      data: {
        building: that.data.building,
        room: that.data.room
      },
      success: function(res) {
        if(res.data.code == 0) {
          that.setData({
            lists: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1500
          });
        }
      },
      fail: function(res) {

      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var profile = wx.getStorageSync('baseInfo') || false
    if (!!profile && !!profile.electric) {
      this.setData({isself: true})
      this.setData(profile.electric)
      this.query()
    } else {
      wx.showToast({
        title: '当前宿舍不支持查询',
        image: '/res/me_exit.png'
      })
    }
  },

  inputRoom: function (e) {
    this.setData({
      room: e.detail.value
    })
  },

  selectBuilding: function (e) {
    console.log(e)
    var that = this
    wx.showActionSheet({
      itemList: buildings,
      success: function (res) {
        that.setData({
          building: buildings[res.tapIndex]
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

  onPullDownRefresh: function() {
    this.query()
  }
})