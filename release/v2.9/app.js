//app.js

var timestamp = new Date();
var year = timestamp.getFullYear();
var month = timestamp.getMonth() + 1;
var res = '';
if (month < 2) res = (year - 1).toString() + '-' + year.toString() + '-1';
else if (month < 8) res = (year - 1).toString() + '-' + year.toString() + '-2';
else res = year.toString() + '-' + (year + 1).toString() + '-1';
const cur_turm = res;
var tool = require('./utils/tools/index');
var config = require('./config');
var RSA = require('./utils/wx_rsa.js')
App({
  onLaunch: function (options) {
    tool.setLoginUrl(config.service.loginUrl);
    tool.login();
    var that = this;
    this.getApiConfig();
    var term = wx.getStorageSync('TERM') || false;
    if (!term) wx.setStorageSync('TERM', this.getTerm());
    else {
      this.globalData.term = cur_turm
    }
    this.checkUpdate()
    this.firstLoad()
  },
  getApiConfig: function (func) {
    var api = wx.getStorageSync('API') || false
    if (api) this.api = api
    else {
      var that = this
      wx.request({
        url: config.service.apiUrl,
        success: function (res) {
          wx.setStorageSync('API', res.data.data)
          that.api = res.data.data
          that.updateConfig();
          typeof func == 'function' && func();
        }
      })
    }
  },
  updateApiConfig: function (func) {
    var that = this
    wx.request({
      url: config.service.apiUrl,
      success: function (res) {
        wx.setStorageSync('API', res.data.data)
        that.api = res.data.data
        that.updateConfig();
        typeof func == 'function' && func();
      }
    })
  },
  cmdEncrypt: function (str) {
    var input_rsa = str;
    var encrypt_rsa = new RSA.RSAKey();
    encrypt_rsa = RSA.KEYUTIL.getKey('-----BEGIN PUBLIC KEY-----\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3HptjenaercAr0r1Gd1OSdrtg\
gtQowlHgOpG2kFXejQZZ7gxpPYK7hCq7IP4DkKNfBka4pjuglGUqUyamvR4vzSoL\
oKvMUaze2kk9Z+ bhoBN2Axn6wk1iPKubk / WwHR5wDZy7QZk + Shi5v8 / 7u6cZtxwv\
PPKX153yX7uhereVlQIDAQAB\
-----END PUBLIC KEY-----');
    var encStr = encrypt_rsa.encrypt(input_rsa)
    return encStr
  },
  oldVersionCheck() {
    var key = wx.getStorageSync('enterKey') || false
    if (key) {
      key.pwd = this.cmdEncrypt(key.pwd)
    } else {
      return
    }
    var that = this
    this.request({
      url: that.getApi('SSXX'),
      data: key,
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorage({
            key: 'baseInfo',
            data: res.data.data,
          })
          wx.setStorageSync('enterKey', null);
        } else {
          wx.clearStorage();
          wx.redirectTo({
            url: '/pages/login/login',
          });
        }

      }
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  getBaseInfo: function (cb) {
    var that = this
    wx.getStorage({
      key: 'baseInfo',
      success: function (res) {
        typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.showToast({
          title: '获取资料失败，请重新登录',
          icon: 'loading'
        });
        wx.redirectTo({
          url: '/pages/login/login'
        })
      }
    })
  },
  checkLogin: function () {
    var info = wx.getStorageSync('baseInfo');
    if (!!info) return true;
    else {
      this.logout();
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false;
    }
  },
  updateConfig: function () {
    var config = this.getApi('CONFIG')
    var that = this
    if (config) wx.request({
      url: config,
      success: function (res) {
        config = res.data
        wx.setStorageSync('CONFIG', config.data)
      },
      fail: function () {
        config = {}
        config.exam = 0
      }
    }); else {
      that.getApiConfig();
    }
  },
  logout: function () {
    wx.setStorageSync('baseInfo', null)
    wx.setStorageSync('cardInfo', null)
    wx.setStorageSync('KB', null)
  },
  dealFormIds: function (formId) {
    let formIds = this.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    this.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },
  saveFormIds: function () {
    var formIds = this.globalData.gloabalFomIds; // 获取gloabalFomIds
    if (formIds.length) {//gloabalFomIds存在的情况下 将数组转换为JSON字符串
      formIds = JSON.stringify(formIds);
      this.globalData.gloabalFomIds = [];
      this.request({//通过网络请求发送openId和formIds到服务器
        url: 'https://example.fredy.cn/other/save-form',
        method: 'POST',
        data: {
          formIds: formIds
        },
        success: function (res) {
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    gloabalFomIds: [],
    version: 'v2.9',
    timestamp: Date.now(),
    term: cur_turm
  },
  api: {
    
  },
  request: tool.request,
  getApi: function (name) {
    var res = this.api[name] || false
    if (!res) {
      this.updateApiConfig()
      res = this.api[name] || false
    }
    return res || false;
  },
  getVersion: function () {
    return this.globalData.version
  },
  getTerm: function () {
    return this.globalData.term;
  },
  firstLoad: function() {
    let ver = wx.getStorageSync('VERSION') || false
    if (ver == this.getVersion()) return
    let base = wx.getStorageSync('baseInfo')
    wx.clearStorageSync();
    this.updateApiConfig()
    wx.setStorageSync('baseInfo', base)
    wx.setStorageSync('VERSION', this.getVersion())
    wx.showModal({
      title: '小广财' + this.getVersion(),
      content: '新增“借书助手”功能，关注公众号“小广财”获取更多更新信息。'
    })
  },
  checkUpdate: function() {
    if (!wx.getUpdateManager) return;
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (res.hasUpdate) {
        wx.showToast({
          title: '正在更新版本...'
        })
      }
    })

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showToast({
        title: '更新遇到问题'
      })
    })
  }

})
