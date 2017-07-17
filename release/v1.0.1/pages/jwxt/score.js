// pages/jwxt/score.js
var app = getApp();
var util = require('../../utils/util.js')
const time_lists = [''];
const s_year = 2014;
for (var year = -1; year < 5; year ++) {
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
    time: '2016-2017-2',
    index: 8,
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
              // console.log(tmp);
              var rec = {}
              var gpa = 0;
              var credit = 0;
              for (var i = 0; i < tmp.length; i++) {
                var key = 'id_' + tmp[i].classCode;
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
    if(this.data.lists == null) {
      this.updateScores();
      // wx.getStorage({
      //   key: 'enterKey',
      //   success: function(res) {
      //     res.data.stu_time = that.data.time;
      //     wx.request({
      //       url: app.getApi('JW'),
      //       data: res.data,
      //       header: app.getApi('HEADER'),
      //       method: 'POST',
      //       success: function(res) {
      //         if(res.data.code == 0) {
      //           tmp = rea.data.data;
      //         }
      //       }
      //     })
      //   },
      // })
      // var tmp = [
      //   {
      //     "time": "2014-2015-1",
      //     "name": "离散数学",
      //     "score": 91,
      //     "credit": 4,
      //     "classCode": "110094",
      //     "dailyScore": 99,
      //     "expScore": 0,
      //     "paperScore": 87
      //   },
      //   {
      //     "time": "2014-2015-1",
      //     "name": "数据结构",
      //     "score": 95,
      //     "credit": 4,
      //     "classCode": "110104",
      //     "dailyScore": 94,
      //     "expScore": 0,
      //     "paperScore": 95
      //   }
      // ];
      // var rec = {}
      // for(var i = 0; i < tmp.length; i++) {
      //   var key = 'id_' + tmp[i].classCode;
      //   rec[key] = true;
      //   tmp[i].id = key
      // }
      // this.setData({
      //   show: rec
      // });
      
      // this.setData({
      //   lists: tmp
      // })
      // console.log(this.data);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})