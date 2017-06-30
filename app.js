//app.js
App({
  // onLaunch: function() {
  //   //调用API从本地缓存中获取数据
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)
  // },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
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
      success: function(res) {
        typeof cb == "function" && cb(res.data)
      },
      fail: function() {
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
  checkLogin: function() {
    wx.getStorage({
      key: 'baseInfo',
      fail: function() {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      },
    })
  },

  globalData: {
    userInfo: null
  },
  api: {
    BASE: 'https://lanlan.natapp4.cc/api.php?r=jw/get-basic',
    JW: 'https://lanlan.natapp4.cc/api.php?r=jw/get-grade',
    KB: 'https://lanlan.natapp4.cc/api.php?r=jw/get-schedule',
    CET: 'https://lanlan.natapp4.cc/api.php?r=jwc/get-cet',
    XL: 'https://lanlan.natapp4.cc/api.php?r=jwc/get-xiaoli',
    TIPS: 'https://lanlan.natapp4.cc/api.php?r=info/info-tips',
    SZTZ: 'https://lanlan.natapp4.cc/api.php?r=info/few-sztz',
    CARD: 'https://lanlan.natapp4.cc/api.php?r=card/current-cash',
    CARD_TODAY: 'https://lanlan.natapp4.cc/api.php?r=card/consume-today',
    RBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/renew-book',
    DBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/get-book-store-detail',
    SBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/search-book',
    HBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/borrowed-book',
    CBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/current-book',
    VBOOK: 'https://lanlan.natapp4.cc/api.php?r=opac/get-renew-book-verify',
    LOGOUT: 'https://lanlan.natapp4.cc/api.php?r=work/all-logout',
    LIB: 'https://lanlan.natapp4.cc/api.php?lib=tips',
    HEADER: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  },
  getApi: function(name) {
    return this.api[name];
  },
  
})
