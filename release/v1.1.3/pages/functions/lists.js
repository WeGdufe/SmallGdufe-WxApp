// pages/functions/lists.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    notice: null,
    grids: [{
      text: '查询成绩',
      iconPath: '/res/icon_score.png',
      url: '/pages/jwxt/score'
    }, {
      text: '查四六级',
      iconPath: '/res/icon_current_pickcourse.png',
      url: '/pages/jwxt/cet'
    }, {
      text: '素拓信息',
      iconPath: '/res/icon_study.png',
      url: '/pages/functions/sztz'
    }, {
      text: '搜索图书',
      iconPath: '/res/icon_searchbook.png',
      url: '/pages/lib/search'
    }, {
      text: '当前借阅',
      iconPath: '/res/icon_now_borrow.png',
      url: '/pages/lib/current'
    }, {
      text: '过去借阅',
      iconPath: '/res/icon_borrow_history.png',
      url: '/pages/lib/history'
    }, {
      text: '常用服务',
      iconPath: '/res/icon_know.png',
      url: '/pages/time/open'
    }, 
      //  {
      //     text: '校历',
      //     iconPath: '/res/icon_calendar.png',
      //     url: ''
      // }, 
      {
         text: '上课时间',
         iconPath: '/res/icon_arrange_class.png',
         url: '/pages/time/class'
       }, 
      //  {   text: '地图',
      //     iconPath: '/res/icon_map.png',
      //     url: ''
      // }
    ]
  },
  onLoad: function() {
    
  },
  onShow: function() {
    var that = this
    var noticeId = wx.getStorageSync('NOICEID') || false;
    wx.request({
      url: app.getApi('NOTICE'),
      success: function(res) {
        that.setData({
          notice: res.data.data
        })
      },
      complete: function() {
        if (noticeId == that.data.notice.id) return;
        var time = Date.now();
        if (time < that.data.notice.start_time || time > that.data.notice.start_time + that.data.notice.expiration * 3600000) return;
        wx.setStorageSync('NOICEID', that.data.notice.id);
          that.setData({
            modalHidden: false
          })
        
      }
    })
  },
  showNotice: function(res) {
    this.setData({
      modalHidden: true
    })
    if (res.type == 'confirm') {
      if (this.data.notice.url != null && this.data.notice.url.length > 0) {
        wx.navigateTo({
          url: this.data.notice.url
        })
      }
  }
  }
})