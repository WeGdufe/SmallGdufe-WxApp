// pages/jwxt/score.js
var app = getApp();
var cur_term = app.getTerm();
var date = new Date();
var s_year = date.getFullYear();
var end = date.getMonth() < 8 ? -1 : 0;
const time_lists = [''];
for (var year = -5; year <= end; year ++) {
  for(var i = 1; i < 3; i++) {
    time_lists.push((s_year + year).toString() + '-' + (s_year + year + 1).toString() + '-' + i.toString());
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: null,
    show: {},
    time: cur_term,
    index: time_lists.indexOf(cur_term),
    time_lists: time_lists
  },
  bindTimeChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.time = this.data.time_lists[e.detail.value];
    this.setData({
      index: e.detail.value
    })
    this.updateScores();
    // console.log(this.data);
  },
  updateScores: function() {
    var that = this;
    var tmp = {};
    wx.getStorage({
      key: 'enterKey',
      success: function (res) {
        res.data.stu_time = that.data.time;
        wx.request({
          url: app.getApi('JW'),
          data: res.data,
          header: app.getApi('HEADER'),
          method: 'POST',
          success: function (res) {
            if (res.data.code == 0) {
              tmp = res.data.data;
              if(tmp.length == 0) {
                wx.showToast({
                  title: '还没有出成绩喔',
                  icon: 'loading'
                })
                return;
                }
              // console.log(tmp);
              var rec = {}
              var gpa = 0;
              var credit = 0;
              for (var i = 0; i < tmp.length; i++) {
                var key = 'id_' + i;
                rec[key] = true;
                tmp[i].id = key
                if(tmp[i].score >= 60) {
                  credit += tmp[i].credit;
                  gpa += tmp[i].credit * (tmp[i].score - 50) / 10;
                }
              }
              that.setData({
                GPA: Math.round(100 * gpa / credit) / 100
              })
              that.setData({
                show: rec
              });

              that.setData({
                lists: tmp
              })
            }
          }
        })
      }
    })
  },
  show: function(e) {
    // console.log(e);
    var tar = e.currentTarget.id
    this.data.show[tar] = !this.data.show[tar]
    this.setData({
      show: this.data.show
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      if(!!options['data']) {
        this.setData(JSON.parse(options.data));
      } else if(this.data.lists == null) {
      this.updateScores();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var json = JSON.stringify(this.data);
    return {
      title: '给你看看我的成绩',
      path: '/pages/jwxt/score?data=' + json,
      success: function (res) {        // 转发成功
        wx.showToast({
          title: '别人通过你分享的页面可以看到你当前的成绩',
        })
      }
    }
  }
})