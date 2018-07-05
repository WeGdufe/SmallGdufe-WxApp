// pages/jwxt/score.js
var app = getApp();
var cur_term = app.getTerm();
var date = new Date();
var s_year = date.getFullYear();
const end = date.getMonth() < 9 ? -1 : 0;
const term = date.getMonth() < 9 && date.getMonth() > 3 ? 2 : 1;
const time_lists = ['整个大学'];
for (var year = -5; year <= end; year++) {
  time_lists.push((s_year + year).toString() + '-' + (s_year + year + 1).toString());
}
const term_lists = ['整个学年', '第一学期', '第二学期'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: null,
    msg: false,
    show: {},
    multiArray: [time_lists, term_lists],
    multiIndex: [end + 6, term],
    minor: false
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    this.updateScores();
  },
  minorChange: function (e) {
    this.data.minor = !this.data.minor;
    this.updateScores();
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    this.setData(data);
  },
  fade: function () {
    var data = [
      {
        name: '王者荣耀',
        score: 82,
        credit: 3
      }, {
        name: '王者荣耀',
        score: 77,
        credit: 2
      }, {
        name: '王者荣耀',
        score: 80,
        credit: 3
      }, {
        name: '王者荣耀',
        score: 86,
        credit: 1
      }, {
        name: '王者荣耀',
        score: 97,
        credit: 3
      }, {
        name: '王者荣耀',
        score: 71,
        credit: 3
      }, {
        name: '王者荣耀',
        score: 84,
        credit: 0.5
      }, {
        name: '王者荣耀',
        score: 95,
        credit: 4
      }, {
        name: '王者荣耀',
        score: 96,
        credit: 2
      }, {
        name: '王者荣耀',
        score: 79,
        credit: 4
      }, {
        name: '王者荣耀',
        score: 86,
        credit: 1
      }, {
        name: '王者荣耀',
        score: 92,
        credit: 2
      }, {
        name: '王者荣耀',
        score: 60,
        credit: 4
      },
    ];
    var title = '一共需要修读150学分，免修0学分，已修读150学分，还需修读0学分，主修课程平均学分绩点5.0，辅修课程平均学分绩点0。';
    this.setData({
      msg: title,
      details: data,
      GPA: 5.0
    });
    this.calcGPA(data);
  },
  calcGPA(tmp) {
    var that = this
    var gpa = 0;
    var credit = 0;
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i].score >= 60) {
        credit += tmp[i].credit;
          gpa += tmp[i].credit * (tmp[i].score - 50) / 10;
      }
    }
    // 一次性setData
    that.setData({
      GPA: Math.round(100 * gpa / credit) / 100,
      minor: that.data.minor
    })
  },
  updateScores: function () {
    var that = this;
    var data = {}
    if (that.data.multiIndex[0] != 0) {
      data.stu_time = that.data.multiArray[0][that.data.multiIndex[0]];
      if (that.data.multiIndex[1])
        data.stu_time += '-' + that.data.multiIndex[1].toString()
    }
    if (that.data.minor) {
      data.minor = 1
    }
    //console.log(res.data);
    app.request({
      url: app.getApi('JW'),
      data: data,
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          let info = res.data.data
          let tmp = info.details;
          if (!info.details || info.details.length == 0) {
            wx.showToast({
              title: '还没有出成绩喔',
              icon: 'loading'
            })
            return;
          }
          var rec = {}
          for (var i = 0; i < tmp.length; i++) {
            var key = 'id_' + i;
            rec[key] = true;
            tmp[i].id = key
          }
          info.show = rec;
          info.minor = that.data.minor;
          // 一次性setData
          that.setData(info)
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
        }
      }
    })
  },
  show: function (e) {
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
    if (!!options['data']) {
      this.setData(JSON.parse(options.data));
    } else if (this.data.lists == null) {
      this.updateScores();
    }
    if (!wx.canIUse('picker.mode.multiSelector')) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法更换学期，请升级到最新微信版本后重试。'
      })
      return;
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