// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sno: '',
    pwd: '',
    isAgree: false
  },
  bindAgreeChange: function (e) {
    var that = this;
    this.setData({
      isAgree: !!e.detail.value.length
    });
    if (this.data.isAgree) {
      wx.showModal({
        title: '使用须知',
        content: '该小程序为广财学生作品，非官方产品，作者保证不会保存你们任何的个人信息，请放心使用。有任何问题可通过“关于”联系作者。',
        cancelText: '不同意',
        confirmText: '我放心',
        success: function(res){
          if(res.cancel) {
            that.setData({
              isAgree: false
            })
          }
        }
      })
    }
  },
  /**
   * 事件处理函数
   */
  login: function () {
    //console.log()
    if (this.data.isAgree == false) {
      wx.showToast({
        title: '您未同意《使用须知》，不能登录！',
        icon: 'loading'
      });
      return;
    }
    var that = this
    wx.setStorage({
      key: 'enterKey',
      data: this.data,
    })
    console.log(this.data);
    wx.request({
      url: app.getApi('BASE'),
      data: that.data,
      method: 'POST',
      header: app.getApi('HEADER'),
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          res.data.data.sno = that.data.sno;
          wx.setStorage({
            key: 'baseInfo',
            data: res.data.data,
          })
          wx.showToast({
            title: '欢迎您，' + res.data.data.name,
            duration: 1000,
            complete: function() {
              wx.switchTab({
                url: '/pages/main/main'
              })
            }
          });
        } else {
          wx.showToast({
            title: '登录失败 :' + res.data.msg,
            icon: 'loading',
            duration: 1500
          });
        }

      }
    });
  },
  inputSno: function (e) {
    // console.log(e.detail.value)
    this.setData({
      sno: e.detail.value
    })
  },
  inputPwd: function (e) {
    // console.log(e.detail.value)
    this.setData({
      pwd: e.detail.value
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})