//index.js
//获取应用实例
const app = getApp()
const util = require("../../utils/util.js")

Page({
  data: {
    songListDetails:{},
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    let that = this
    util.request('http://139.199.9.198:3000/playlist/detail?id=' + options.id, 'get', {}, res => {
      console.log(res)
      that.setData({
        songListDetails: res.playlist
           
      })
      
    }, res => {})
  },
  toAudioPlay:function(e){
    let that=this
    let musicMsg = e.currentTarget.dataset.musicmsg
    wx.setStorageSync('musicMsg', JSON.stringify(musicMsg))
    
    wx.navigateTo({
      url: '../audioPlay/audioPlay'
    })
  }
  
})
