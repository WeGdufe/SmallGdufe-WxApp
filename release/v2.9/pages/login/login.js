// pages/login/login.js
var app = getApp()

var config = require('../../config.js');
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
        content: '该小程序为广财学生作品，非官方产品，但作者保证数据传输的安全性，不会被盗取，请放心使用。有任何问题可通过“反馈”联系作者。',
        cancelText: '不同意',
        confirmText: '我放心',
        success: function (res) {
          if (res.cancel) {
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
    if (this.data.isAgree == false) {
      wx.showToast({
        title: '请阅读《使用须知》',
        icon: 'loading'
      });
      return;
    }
    var that = this
    // console.log(this.data);
    app.request({
      url: app.getApi('SSXX'),
      data: {
        sno: that.data.sno,
        pwd: app.cmdEncrypt(that.data.pwd)
      },
      method: 'POST',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 0) {
          wx.setStorage({
            key: 'baseInfo',
            data: res.data.data,
          })
          wx.showToast({
            title: '欢迎您，' + res.data.data.name,
            duration: 1000,
            complete: function () {
              wx.switchTab({
                url: '/pages/main/main',
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
  
  tiyan: function (e) {
    var that = this
    app.request({
      url: app.getApi('SSXX'),
      data: {
        sno: 'testaccount',
        pwd: app.cmdEncrypt('wxapp')
      },
      method: 'POST',
      success: function (res) {
        wx.setStorage({
          key: 'baseInfo',
          data: {
            sno: '88888888888',
            name: '体验者',
            birthday: '88888888',
            classroom: '体验班',
            department: '体验学院',
            major: '体验工程',
            electric: false
          },
        })
        wx.showToast({
          title: '欢迎您，体验者',
          duration: 1000,
          complete: function () {
            wx.switchTab({
              url: '/pages/main/main'
            })
          }
        });
      }
    });
  },
  inputSno: function (e) {
    this.setData({
      sno: e.detail.value
    })
  },
  inputPwd: function (e) {
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