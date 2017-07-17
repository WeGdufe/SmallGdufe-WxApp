// pages/functions/lists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      text: '时间安排',
      iconPath: '/res/icon_calendar.png',
      url: '/pages/time/open'
    },
      // , {
      //     text: '校历',
      //     iconPath: '/res/icon_calendar.png',
      //     url: ''
      // }, {
      //   text: '排课表',
      //   iconPath: '/res/icon_arrange_class.png',
      //   url: ''
      // }, {
      //     text: '地图',
      //     iconPath: '/res/icon_map.png',
      //     url: ''
      // }
    ]
  }
})