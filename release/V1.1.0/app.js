//app.js
App({
  onLaunch: function() {
    var hasUsed = wx.getStorageSync('hasUsed') || false;
    var that = this
    if(!hasUsed) {
      wx.request({
        url: that.getApi('LOG_LATEST'),
        success: function(res) {
          var logs = res.data.data.split('\n');
          var content = '';
          for(var i = 1; i < logs.length; i++) {
            content += logs[i] + ";";
          }
          wx.showModal({
            title: '更新日志 ' + logs[0],
            content: content,
            showCancel: false
          })
        },
        complete: function() {
          wx.setStorageSync('hasUsed', true);
        }
      })      
      
    }
    
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // wx.redirectTo({
    //   url: 'pages/jwxt/schedule'
    // })
  },

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
    userInfo: null,
    version: 'v1.1.0',
    timestamp: Date.now()
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
    LOG_LATEST: 'https://lanlan.natapp4.cc/api.php?log=latest',
    LOG_ALL: 'https://lanlan.natapp4.cc/api.php?log=all',
    HEADER: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  },
  getApi: function(name) {
    return this.api[name];
  },
  getVersion: function() {
    return this.globalData.version
  },
  getTerm: function() {
    var timestamp = new Date();
    var year = timestamp.getFullYear();
    var month = timestamp.getMonth() + 1;
    var res = '';
    if(month < 2) res = (year-1).toString() + '-' + year.toString() + '-1';
    else if (month < 8) res = (year - 1).toString() + '-' + year.toString() + '-2';
    else res = year.toString() + '-' + (year+1).toString() + '-1';
    return res;
  }
  
})
