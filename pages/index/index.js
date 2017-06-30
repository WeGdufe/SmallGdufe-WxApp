//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //motto: 'Hello World',
    userInfo: {},
    tips: null
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    // console.log('onLoad')
    var that = this;
    if(this.data.tips == null) {
      this.updateTips()
    }
    
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    app.checkLogin();
  },
  onPullDownRefresh: function () {
    this.updateTips();
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
  }
})
