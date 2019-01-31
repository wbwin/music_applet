const app = getApp()
const util = require("../../utils/util.js")
const innerAudioContext = wx.getBackgroundAudioManager()
Page({
  data:{
    audioValue:0,
    audioMaxTime:0,
    audioMaxTimeShow:'00:00',
    audioValueShow:'00:00',
    play:false,
    singer:'',
  },
  onLoad:function(options){
    let that=this
    that.audio();
  },
  onReady:function(){
    
  },
  audio: function (){
    let that = this
    console.log(wx.getStorageSync('musicMsg'))
    let musicMsg = JSON.parse(wx.getStorageSync('musicMsg'))
    innerAudioContext.title = musicMsg.name
    innerAudioContext.epname = musicMsg.al.name
    let singer=''
    for (var i in musicMsg.ar){
      singer += i == 0 ? musicMsg.ar[i].name : '/' + musicMsg.ar[i].name
    }
    that.setData({
      musicMsg: musicMsg,
      singer: singer
    })
    innerAudioContext.singer = singer
    innerAudioContext.coverImgUrl = musicMsg.al.picUrl
    innerAudioContext.src = 'https://music.163.com/song/media/outer/url?id=' + musicMsg.id+'.mp3'
    innerAudioContext.onPlay(() => {
      that.setData({
        play:true
      })
      that.upDataTime()
      
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  upDataTime:function(){
    let that=this
    innerAudioContext.onTimeUpdate((res)=>{
      let audioMaxTime = Number((innerAudioContext.duration * 1000).toFixed(0))
      let audioValue = Number((innerAudioContext.currentTime * 1000).toFixed(0))
      let audioMaxTimeShow = util.msTime(audioMaxTime)
      let audioValueShow = util.msTime(audioValue)
      that.setData({
        audioMaxTime: audioMaxTime,
        audioValue: audioValue,
        audioMaxTimeShow: audioMaxTimeShow,
        audioValueShow: audioValueShow
      })
    })
  }
})