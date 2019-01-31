//index.js
//获取应用实例
const app = getApp()
const util=require("../../utils/util.js")

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    musicMessage:[],
    collectMusicMessage:[],
    userMessage:'',
    collectCount:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that=this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.getUserMessage();
    that.getUserMusicMessage();
  },
  getUserMessage:function(e){
    let that=this
    util.request('http://139.199.9.198:3000/user/detail?uid=118644089', 'get', {}, res => {
      that.setData({
        userMessage: res
      })
    }, res => { })
  },
  getUserMusicMessage:function(e){
    let that = this
    util.request('http://139.199.9.198:3000/user/playlist?uid=118644089', 'get', {}, res => {
      for (var i in res.playlist){
        if (res.playlist[i].description){
          let collectMusicMessage = that.data.collectMusicMessage
          collectMusicMessage.push(res.playlist[i])          
          that.setData({
            collectMusicMessage: collectMusicMessage
          })
        }else{
          let musicMessage = that.data.musicMessage
          let collectCount = 0
          musicMessage.push(res.playlist[i])
          for (var i in musicMessage) {
            collectCount += musicMessage[i].subscribedCount
          }
          that.setData({
            musicMessage: musicMessage,
            collectCount: collectCount
          })
        }
      }
    }, res => { })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toSongListDetails:function(e){
    let that=this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../songListDetails/songListDetails?id='+id
    })
  },
})
