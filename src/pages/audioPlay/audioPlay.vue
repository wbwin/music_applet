<template>
  <div class='bg-img' :style='{background:"url("+musicMsg.al.picUrl+") no-repeat center",backgroundSize:"100% 100%"}'>
  <div class='main'>
    <div class='main-musicMsg'>
      <div class='main-musicMsg-lf'>
        <span class='main-musicMsg-name'>{{musicMsg.name}}</span>
        <span class='main-musicMsg-author'>{{musicMsg.ar[0].name}} ></span>
      </div>
      <div>

      </div>

    </div>
    <div class='main-musicMsg-img'>
      <div class='img-bg'></div>
      <img class='music-img' :style="{animationPlayState:play?'running':'paused'}"  :src='musicMsg.al.picUrl'/>
    </div>
    <div class='music-sliderView'>
      <span class='musicTime'>{{audioValueShow}}</span>
      <slider :value="audioValue" step="10" backgroundColor="rgba(255,255,255,0.3)" block-size="14" class='music-slider' :max="audioMaxTime"></slider>
      <span class='musicTime'>{{audioMaxTimeShow}}</span>
    </div>
    <div class='main-musicButton'>
      <img src='/static/images/icon-listLoop.png' class="musicButton_img"/>
      <img src='/static/images/icon-np.png' class="musicButton_img"/>
      <img src='/static/images/icon-pause.png' class="musicButton_img"/>
      <img src='/static/images/icon-np.png' class="musicButton_img"/>
    </div>
  </div>
</div>
</template>

<script>
const util = require("../../utils/util.js")
export default {
  data () {
    return {
      audioValue:0,
      audioMaxTime:0,
      audioMaxTimeShow:'00:00',
      audioValueShow:'00:00',
      play:false,
      singer:'',
      innerAudioContext:wx.getBackgroundAudioManager(),
      musicMsg:{al:{},ar:[]}
    }
  },
  onLoad(){
      let that=this
      that.audio();
  },
  methods: {
    audio: function (){
      let that = this
      
      console.log(that.innerAudioContext)
      let musicMsg = JSON.parse(wx.getStorageSync('musicMsg'))
      that.innerAudioContext.title = musicMsg.name
      that.innerAudioContext.epname = 2
      let singer=''
      
      that.innerAudioContext.singer = musicMsg.ar.name
      that.innerAudioContext.coverImgUrl =musicMsg.al.picUrl
      that.innerAudioContext.src = 'https://music.163.com/song/media/outer/url?id='+musicMsg.id+'.mp3'
      that.innerAudioContext.onPlay(() => {
        that.play=true
        that.upDataTime()
        
      })
      that.innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      that.musicMsg=musicMsg
    },
    upDataTime:function(){
      let that=this
      that.innerAudioContext.onTimeUpdate((res)=>{
        let audioMaxTime = Number((that.innerAudioContext.duration * 1000).toFixed(0))
        let audioValue = Number((that.innerAudioContext.currentTime * 1000).toFixed(0))
        let audioMaxTimeShow = util.msTime(audioMaxTime)
        let audioValueShow = util.msTime(audioValue)
          that.audioMaxTime=audioMaxTime,
          that.audioValue=audioValue,
          that.audioMaxTimeShow=audioMaxTimeShow,
          that.audioValueShow=audioValueShow
      })
    }
  }
}
</script>

<style scoped>
.bg-img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  padding:1px;
  box-sizing:border-box;
  z-index:1;
}
.bg-img::after{
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(20px);
    z-index: 2;
}
.main{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3
}
.main-musicMsg{
  padding: 10px 20px;
  border-bottom: thin solid rgba(255,255,255,0.1);
  color: #fff;
  font-size: 15px;
}
.main-musicMsg-lf{
  display: flex;
  flex-direction: column;
  justify-content: center
}
.main-musicMsg-name{
  font-size: 18px;
}
.main-musicMsg-author{
  opacity: 0.4
}
.main-musicMsg-img{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  position: relative;
}
.img-bg{
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: #999;
  opacity: 0.3
}
.music-img{
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  animation: music-img 40s linear infinite;
}
@keyframes music-img {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.music-sliderView{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  font-size: 10px;
  margin-top: 50px;
}
.musicTime{
  opacity: 0.5
}
.music-slider{
  flex: 1
}
.musicButton_img{
  width:37px;
  height:37px
}

</style>