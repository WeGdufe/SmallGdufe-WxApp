// pages/main/main.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseInfo: null,
    cardInfo: null,
    modalHidden: true,
    notice: null,
    grids: [{
      text: '查询成绩',
      iconPath: '/res/icon_score.png',
      url: '/pages/jwxt/score'
    },
    {
      text: '素拓信息',
      iconPath: '/res/icon_study.png',
      url: '/pages/functions/sztz'
    },
    {
      text: '查空课室',
      iconPath: '/res/icon_searchbook.png',
      url: '/pages/functions/emptyclassroom'
    }, 
    {
      text: '借书助手',
      iconPath: '/res/icon_current_pickcourse.png',
      url: '/pages/lib/search'
    },
    {
      text: '当前借阅',
      iconPath: '/res/icon_now_borrow.png',
      url: '/pages/lib/current'
    }, {
      text: '过去借阅',
      iconPath: '/res/icon_borrow_history.png',
      url: '/pages/lib/history'
    },
    {
      text: '已修学分',
      iconPath: '/res/icon_know.png',
      url: '/pages/query/creditdetails'
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
    }
    ]
  },
  call: {
    navigate: function (options) {
      if (options && options['url']) wx.navigateTo({
        url: options['url'],
      })
    },
  },
  logout: function () {
    wx.showModal({
      title: '注销',
      content: '你确定要注销吗？',
      success: function (res) {
        if (res.confirm) {
          app.logout();
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    let formId = e.detail.formId;
    app.dealFormIds(formId); //处理保存推送码
    if (e.detail.target.dataset.action)
      this.call[e.detail.target.dataset.action](e.detail.target.dataset)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.predeal();
    app.getBaseInfo(function (info) {
      that.setData({
        baseInfo: info
      });
    });
  },
  onShow: function () {
    var that = this
    if (this.apiSwitch.card) this.updateCardInfo();
    var noticeId = wx.getStorageSync('NOTICEID') || false;
    if (this.apiSwitch.notice) wx.request({
      url: app.getApi('NOTICE'),
      success: function (res) {
        that.data.notice = res.data.data;
      },
      fail: function () {
        that.data.notice = {
          id: noticeId
        }
      },
      complete: function () {
        that.setData({
          notice: that.data.notice
        })
        if (!that.data.notice || noticeId == that.data.notice.id) return;
        var time = Date.now() / 1000;
        if (time < that.data.notice.start_time || time > that.data.notice.start_time + that.data.notice.expiration * 3600) return;
        wx.setStorageSync('NOTICEID', that.data.notice.id);
        that.setData({
          modalHidden: false
        })
      }
    })
  },
  predeal: function () {
    app.updateConfig()
    var config = wx.getStorageSync('CONFIG') || false
    var that = this
    if (!!config.card) this.apiSwitch.card = config.card
    if (!!config.form) this.apiSwitch.form = config.form
    if (!!config.notice) this.apiSwitch.notice = config.notice
    if (!!config && !!config.function) {
      this.setData({
        grids: that.data.grids.concat(config.function)
      })
    }
  },

  showNotice: function (res) {
    this.setData({
      modalHidden: true
    })
    if (res.type == 'confirm') {
      if (!!this.data.notice.url && this.data.notice.url.length > 0) {
        wx.navigateTo({
          url: this.data.notice.url
        })
      }
    } else if (res.type == 'cancel') {
      if (!!this.data.notice.cancelurl && this.data.notice.cancelurl.length > 0) {
        wx.navigateTo({
          url: this.data.notice.cancelurl
        })
      }
    }

  },
  onPullDownRefresh: function () {
    this.updateCardInfo()
    wx.stopPullDownRefresh()
  },
  updateCardInfo: function (times = 0) {
    var that = this
    app.request({
      url: app.getApi('CARD'),
      method: 'POST',
      success: function (res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
          return;
        }
        if (!!that.data.cardInfo && that.data.cardInfo.cash == res.data.data.cash) return;
        that.setData({
          cardInfo: res.data.data
        })
        wx.setStorage({
          key: 'cardInfo',
          data: res.data
        })
      },
      fail: function () {
        //console.log(times);
        if (times >= 5) {
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
  apiSwitch: {
    card: true,
    form: true,
    notice: true
  },
  onHide: function() {
    if (this.apiSwitch.form) app.saveFormIds();
  }

})