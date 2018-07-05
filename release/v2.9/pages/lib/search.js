// pages/lib/search.js
var app = getApp();
var sliderWidth = 50; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksInfo: [],
    detail: null,
    page: 1,
    scroll: 0,
    tabs: ["热门推荐", "搜索", "收藏夹"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    favorBooks: [],
    topBooks: []
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  bindQuery: function () {
    this.query()
  },
  query: function (page = 1) {
    var that = this
    app.request({
      url: app.getApi('SBOOK'),
      method: 'POST',
      data: {
        bookName: that.data.inputVal,
        page: page
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (page == 1) {
            that.setData({
              booksInfo: res.data.data,
              page: page + 1
            })
            wx.showToast({
              title: '一共找到' + res.data.data.length + '条记录',
            })
          } else {
            that.setData({
              booksInfo: that.data.booksInfo.concat(res.data.data),
              page: page + 1
            })
            wx.showToast({
              title: '本次加载' + res.data.data.length + '条记录',
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/res/me_exit.png'
          })
        }
      }
    })
  },
  favorFromSearch: function(e) {
    var index = e.currentTarget.id;
    this.data.favorBooks.push(this.data.booksInfo[index])
    wx.showToast({
      title: '收藏成功',
    })
  },
  favorFromTop: function (e) {
    var index = e.currentTarget.id;
    this.data.favorBooks.push(this.data.topBooks[index])
    wx.showToast({
      title: '收藏成功',
    })
  },
  // 刷新收藏夹
  refreshFavor: function() {
    this.setData({
      favorBooks: this.data.favorBooks
    })
  },
  saveFavor: function() {
    wx.setStorageSync('FAVORBOOK', this.data.favorBooks)
  },
  loadFavor: function() {
    var tmp = wx.getStorageSync('FAVORBOOK') || []
    this.data.favorBooks = tmp
  },
  deleteFavor: function (e) {
    var books = this.data.favorBooks;
    var index = e.currentTarget.id;
    books.splice(index, 1);
    this.setData({
      favorBooks: books
    });
  },
  clearFavor: function() {
    let that = this
    wx.showModal({
      title: '不可恢复操作',
      content: '你确定是要清空收藏夹吗？',
      success: function(res) {
        if(res.confirm) {
          that.data.favorBooks = []
          wx.showToast({
            title: '清空完成',
          })
        }
      }
    })
  },
  getTopBooks: function() {
    let that = this
    app.request({
      url: app.getApi('TOPBOOK'),
      method: 'POST',
      data: {
        type: that.data.topType
      },
      success: function(res) {
        if(res.data.code == 0) {
          that.setData({
            topBooks: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  showDetail: function (e) {
    var index = e.currentTarget.id;
    var book = []
    if (this.data.activeIndex == 2)
        book = this.data.favorBooks[index];
    else if (this.data.activeIndex == 0)
        book = this.data.topBooks[index];
    else
        book = this.data.booksInfo[index];
    this.data.scroll = e.touches[0].pageY - e.touches[0].clientY
    wx.navigateTo({
      url: 'details?data=' + JSON.stringify(book),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.loadFavor();
    this.getTopBooks()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  tabClick: function (e) {
    if (e.currentTarget.id == 2) this.refreshFavor() //点击收藏夹刷新
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: that.data.scroll,
      })
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.saveFavor(); // 保存收藏夹
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 2) {
      if (this.data.booksInfo.length % 20 == 0 && this.data.booksInfo.length != 0) {
        this.query(this.data.page);
      } else {
        wx.showToast({
          title: '已经加载完所有结果',
        })
      }
    }
  }
})