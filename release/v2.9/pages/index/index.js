//index.js
//获取应用实例
var app = getApp()
const weeks = ['所有课程'];
for (var i = 1; i < 20; i++) {
  weeks.push("第" + i.toString() + "周");
}
var cur_term = app.getTerm();
var date = new Date();
var s_year = date.getFullYear();
var end = 0;
app.updateConfig();
var config = wx.getStorageSync('CONFIG') || {}
if(!config.week) config.week = 0
const time_lists = [];
for (var year = -5; year <= end; year++) {
  for (var i = 1; i < 3; i++) {
    time_lists.push((s_year + year).toString() + '-' + (s_year + year + 1).toString() + '-' + i.toString());
  }
}
Page({
  data: {
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", "#FF7F24", "#87CEFA", "#965527", "#326510", "#a3c62b", "#c20625", "#eb7f00", "#904c95", "#7f5123", "#b5874c", "#14429a", "#58bfea", "#265e83", "#d3578c", "#ffd200", "#0cbba3", "#fea317", "#006634"],
    wlist: null,
    cur_index: 0,
    time_lists: time_lists,
    time_index: time_lists.indexOf(cur_term),
    modalHidden: true,
    term: app.getTerm(),
    array: weeks,
    index: config.week || 0,
    showPopup: false
  },
  other: {
    flag: 0
  },
  bindTimeChange: function (e) {
    this.setData({
      time_index: e.detail.value,
      term: this.data.time_lists[e.detail.value]
    });
    wx.setStorageSync('TERM', this.data.time_lists[e.detail.value]);
    this.updateLists(true);
  },
  tmpCoures: {},
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  onLoad: function () {
    var that = this
    app.checkLogin();
  },
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      index: e.detail.value
    })
    wx.setStorage({
      key: 'KB',
      data: that.data
    })
  },
  refreshList: function() {
    this.hidePopup()
    this.updateLists(true)
    wx.showToast({
      title: '课表已刷新',
    })
  },
  updateLists: function (isNew = false) {
    if (!app.checkLogin()) return;
    var week = config.week
    var that = this;
    if (!isNew) {
      var res = wx.getStorageSync('KB') || null;
      if (!isNew && !!res) {
        res.index = week
        this.setData(res);
        return;
      } else {
        isNew = true;
      }
    }
    if (!isNew) return; // 不从服务器获取
    app.request({
      url: app.getApi('KB'),
      method: 'POST',
      data: {
        stu_time: that.data.term
      },
      success: function (res) {
        if (res.data.code == 0) {
          var tmp = res.data.data;
          if (!tmp || tmp.length == 0) {
            wx.showToast({
              title: "课表为空\n或未开放",
              image: '/res/me_exit.png'
            })
            return;
          }
          var cnt = 0, hlist = {};
          for (var i = 0; i < tmp.length; i++) {

            tmp[i].show = tmp[i].name.substr(0, 8);
            tmp[i].color_index = !!hlist[tmp[i].name] ? hlist[tmp[i].name] : hlist[tmp[i].name] = ++cnt;
            tmp[i].weeks = that.dealOneCourse(tmp[i])
          }
          that.setData({
            index: week,
            wlist: tmp,
            showPopup: false
          })
          wx.setStorage({
            key: 'KB',
            data: that.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
        }
      }
    })
  },
  dealOneCourse: function (course) {
    var str = course.period
    var odd = str.match('单')
    var even = str.match('双')
    var indexoflef = str.indexOf('(') + str.indexOf('[') + 1
    var nstr = str.substr(0, indexoflef)
    var per = nstr.split(',')
    var res = [true]
    for (var i = 0; i < per.length; i++) {
      var tmp = per[i].split('-')
      var s = parseInt(tmp[0])
      var t = parseInt(tmp[tmp.length - 1])

      for (var j = s; j <= t; j++) {
        if (j % 2 == 0 && !odd) {
          res[j] = true
        } if (j % 2 == 1 && !even) {
          res[j] = true
        }
      }
    }
    return res
  },
  showCardView: function (e) {
    // console.log(e);
    var id = e.currentTarget.dataset.index
    this.setData({
      cur_index: id
    })
    this.tmpCoures = this.data.wlist[id];
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function (res) {
    var that = this
    this.setData({
      modalHidden: true
    })
    if (res.type == 'confirm') {
      if (this.tmpCoures.show.length < 1 || this.tmpCoures.period.length < 1) {
        wx.showToast({
          title: '内容不能为空喔'
        })
        return;
      }
      this.data.wlist[this.cur_index] = this.tmpCoures
      this.setData({
        wlist: that.data.wlist
      })
      wx.setStorage({
        key: 'KB',
        data: that.data,
      })
    }

  },
  updshow: function (e) {
    this.tmpCoures.show = e.detail.value
  },
  updloc: function (e) {
    this.tmpCoures.location = e.detail.value
  },
  updper: function (e) {
    this.tmpCoures.period = e.detail.value
  },
  updtea: function (e) {
    this.tmpCoures.teacher = e.detail.value
  },
  calcWeek: function() {
    var config = wx.getStorageSync('CONFIG') || {}
    var term_begin = '2018-03-04 00:00:00';
    if(config.term_begin) {
      term_begin = config.term_begin
    }
    var end = Date.now()
    var begin = new Date(term_begin).getTime()
    var d = (end - begin) / (3600 * 1000 * 7 * 24);
    return parseInt(d) + 1;
  },
  onShow: function () {
    if(this.other.flag < 2) {
      config = wx.getStorageSync('CONFIG') || {}
      if (!config.week) config.week = 0
      this.other.flag++
    }
    console.log(config);
    this.updateLists();
  },
  onShareAppMessage: function () {
    var that = this
    var json = JSON.stringify({
      wlist: that.data.wlist,
      modalHidden: true,
      index: that.data.index,
      title: weeks[that.data.index]
    });
    //console.log(json);
    return {
      title: '我的课程表',
      path: '/pages/jwxt/schedule?data=' + json,
    }
  },
  showPopup() {
    this.setData({
      showPopup: true
    });
  },
  hidePopup() {
    this.setData({
      showPopup: false
    });
  }
})
