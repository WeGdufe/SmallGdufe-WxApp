//index.js
//获取应用实例
var app = getApp()
var sliderWidth = 96; 
Page({
  data: {
    tips: null,
    tabs: ["每日提醒", "课程表"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", "#FF7F24", "#87CEFA", "#965527", "#326510", "#a3c62b", "#c20625", "#eb7f00", "#904c95", "#7f5123", "#b5874c", "#14429a", "#58bfea", "#265e83", "#d3578c", "#ffd200", "#0cbba3", "#fea317", "#006634"],
    wlist: null,
    cur_index: 0,
    modalHidden: true,
    screenHeight: 640
  },
  tmpCoures: {},
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onLoad: function () {
    // console.log('onLoad')
    this.updateLists()
    var that = this;
    // var size = wx.getSystemInfoSync()
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          screenHeight: res.screenHeight
        });
      }
    });
    if(this.data.tips == null) {
      this.updateTips()
    }
    app.checkLogin();
  },
  onPullDownRefresh: function () {
    this.updateTips();
    this.updateLists();
    wx.stopPullDownRefresh();
  },
  updateTips: function() {
    var that = this;
    wx.getStorage({
      key: 'enterKey',
      success: function (res) {
        wx.request({
          url: app.getApi('TIPS'),
          data: res.data,
          method: 'POST',
          header: app.getApi('HEADER'),
          success: function (res) {
            // console.log(res);
            if (res.data.code != 0) return;
            var tmp = res.data.data;
            for (var i = 0; i < tmp.length; i++) {
              tmp[i].description = tmp[i].description.replace(/<.*?>/g, '');
            }
            // console.log(tmp);
            that.setData({
              tips: tmp
            })
          }
        })
      }
    })
  },
  updateLists: function () {
    var pdata = wx.getStorageSync('enterKey');
    pdata.stu_time = app.getTerm();
    var that = this;
    wx.request({
      url: app.getApi('KB'),
      method: 'POST',
      header: app.getApi('HEADER'),
      data: pdata,
      success: function (res) {
        if (res.data.code == 0) {
          var tmp = res.data.data;
          var cnt = 0, hlist = {};
          for (var i = 0; i < tmp.length; i++) {
            tmp[i].show = tmp[i].name.substr(0, 8);
            tmp[i].color_index = !!hlist[tmp[i].name] ? hlist[tmp[i].name] : hlist[tmp[i].name] = ++cnt;
          }
          that.setData({
            wlist: tmp
          })
        }
      }
    })
  },
  showCardView: function (e) {
    console.log(e);
    this.setData({
      cur_index: e.currentTarget.dataset.index
    })
    this.tmpCoures = this.data.wlist[this.data.cur_index];
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function (res) {
    console.log(res);
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
    }

  },
  updshow: function (e) {
    console.log(this.tmpCoures)
    console.log(e)
    this.tmpCoures.show = e.detail.value
  },
  updloc: function (e) {
    this.tmpCoures.location = e.detail.value
  },
  updper: function (e) {
    this.tmpCoures.period = e.detail.value
  },
  onShareAppMessage: function () {
    var tmp = JSON.parse(JSON.stringify(this.data));
    delete(tmp.colorArrays);
    delete(tmp.tips);
    var json = JSON.stringify(tmp);
    console.log(json);
    return {
      title: '给你看看我的课表',
      path: '/pages/jwxt/schedule?data=' + json,
      success: function (res) {        // 转发成功
        wx.showToast({
          title: '分享课表成功',
        })
      }
    }
  }
})
