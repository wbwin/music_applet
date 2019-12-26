<template>
  <div>
  <div class='bg-img' :style='{background:"url("+playList[playListIndex].al.picUrl+") no-repeat center",backgroundSize:"cover"}'>
  </div>
  <div class="bg-img_bg"></div>
<div class='main'>
    <div class='main-musicMsg'>
      <div class='main-musicMsg-lf'>
        <span class='main-musicMsg-name'>{{playList[playListIndex].name}}</span>
        <span class='main-musicMsg-author'><template v-for='(arItem,arIndex) in playList[playListIndex].ar' >{{arIndex>0?'/':''}}{{arItem.name}}</template>></span>
      </div>
      <div>

      </div>

    </div>
    <div class='main-musicMsg-img'>
      <div class='img-bg'></div>
      <img class='music-img' :style="{animationPlayState:play?'running':'paused'}"  :src='playList[playListIndex].al.picUrl'/>
    </div>
    <div class="music_view">
      <div class='music-sliderView'>
        <span class='musicTime'>{{audioValueShow}}</span>
        <slider :value="audioValue" step="10" backgroundColor="rgba(255,255,255,0.3)" block-size="14" class='music-slider' :max="audioMaxTime"></slider>
        <span class='musicTime'>{{audioMaxTimeShow}}</span>
      </div>
      <div class='main-musicButton'>
        <img src='/static/images/icon-listLoop.png' class="musicButton_img"/>
        <img src='/static/images/icon-np.png' @click="playLastAudio()" class="musicButton_img"/>
        <div class="pause_box" @click.stop="audioPause">
          <img :src="play?'/static/images/icon-pause.png':'/static/images/icon-begin.png'" class="musicButton_img"/>
        </div>
        <img src='/static/images/icon-np.png' @click="playNextAudio()" class="musicButton_img next_right"/>
        <img src='/static/images/playBox_list_w.png' class="musicButton_img "/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../../utils/api.js'
const util = require("../../utils/util.js")
import {mapState,mapActions} from 'vuex'
export default {
  data () {
    return {
      audioValue:0,
      audioMaxTime:0,
      audioMaxTimeShow:'00:00',
      audioValueShow:'00:00',
      singer:'',
      innerAudioContext:wx.getBackgroundAudioManager(),
      musicMsg:{al:{},ar:[]}
    }
  },
  computed:{
    ...mapState(['playListIndex','playListTime','playList','play','plannedSpeed'])
  },
  onLoad(){
      let that=this
      that.audio();
  },
  methods: {
    ...mapActions(['updatePlayListIndex','updatePlayListTime','updatePlayList','updatePlayListMaxTime','updatePlay','updatePlannedSpeed']),
    audio: function (){
      let that = this
      that.get(api.lyric,{id:that.playList[that.playListIndex].id}).then(function(res){
        var lines=res.data.lrc.lyric
        console.log(lines)
        let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
        while (!pattern.test(lines[0])) {
          lines = lines.slice(1);
        }
        console.log(lines.length)
      })
      console.log(that.innerAudioContext)
      let musicMsg = that.playList[that.playListIndex]
      that.upDataTime()
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
    },
    //暂停开始音乐
        audioPause(){
            const that=this
            console.log(that.innerAudioContext)
            if(that.play){
                that.innerAudioContext.pause()
                that.updatePlay(false)
                var currentTime=that.innerAudioContext.currentTime
                var duration=that.innerAudioContext.duration
                var plannedSpeed=((that.innerAudioContext.currentTime/that.innerAudioContext.duration)*100).toFixed(2)
                that.updatePlannedSpeed(plannedSpeed)
            }else{
                that.innerAudioContext.play()
                that.updatePlay(true)
            }
            
        },
        async getPlayList(audioId){
            const that=this
            const playList=wx.getStorageSync('playList')
            if(playList && playList.length > 0){//判断缓存中是否有音乐列表 有则直接使用 否则重新存缓存
                return that.subPlayList(playList, audioId)
            }else{
                // const list=that.songListDetails.tracks
                // wx.setStorageSync('playList',list)
                // return that.subPlayList(list, audioId)
                console.log('缓存没数据')
            }
        },
        //更新vuex中的音乐列表 保证一定有5条数据
        subPlayList(playList, audioId) {
            let tempArr = [...playList]
            const count = 5 // 保持vuex中最多5条数据
            const middle = parseInt(count / 2) // 中点的索引
            const len = tempArr.length
            // 如果整个原始的播放列表本来就少于5条数据，说明不需要裁剪，直接返回
            if (len <= count) {
                return tempArr
            }
            // 找到当前要播放的音频的所在位置
            const index = tempArr.findIndex(item => item.id === audioId)
            // 截取当前音频的前后两条数据
            tempArr = tempArr.splice(Math.max(0, Math.min(len - count, index - middle)), count)
            return tempArr
        },
       //下一首
        async playNextAudio() {
            const that=this
            const nextIndex = that.playListIndex + 1
            if (nextIndex < that.playList.length) {
                let innerAudioContext=util.setBackgroundAudio(that.playList[nextIndex])
                innerAudioContext.onPlay(() => {
                    that.updatePlayListMaxTime(innerAudioContext.duration.toFixed(0))
                    that.updatePlay(true)
                })
                innerAudioContext.onEnded(()=>{ 
                    that.playNextAudio()
                })
                that.updatePlayListIndex(nextIndex)
                
                // 当判断到已经到vuex的playList的边界了，重新从storage中拿数据补充到playList
                if (nextIndex === that.playList.length - 1 || nextIndex === 0) {
                    // 拿到只有当前音频前后最多5条数据的列表
                    const newList = await that.getPlayList(that.playList[nextIndex].id)
                    // 当前音频在这5条数据中的索引
                    const index = newList.findIndex(item => item.id === that.playList[nextIndex].id)
                    // 更新到vuex
                    that.updatePlayListIndex(index)
                    that.updatePlayList(newList)
                }
            }
        },
        //上一首
        async playLastAudio() {
            const that=this
            const lastIndex = that.playListIndex - 1
            if (lastIndex >= 0) {
                let innerAudioContext=util.setBackgroundAudio(that.playList[lastIndex])
                innerAudioContext.onPlay(() => {
                    that.updatePlayListMaxTime(innerAudioContext.duration.toFixed(0))
                    that.updatePlay(true)
                })
                innerAudioContext.onEnded(()=>{ 
                    that.playNextAudio()
                })
                that.updatePlayListIndex(lastIndex)
                
                // 当判断到已经到vuex的playList的边界了，重新从storage中拿数据补充到playList
                if (lastIndex === 0) {
                    // 拿到只有当前音频前后最多5条数据的列表
                    const newList = await that.getPlayList(that.playList[lastIndex].id)
                    // 当前音频在这5条数据中的索引
                    const index = newList.findIndex(item => item.id === that.playList[lastIndex].id)
                    // 更新到vuex
                    that.updatePlayListIndex(index)
                    that.updatePlayList(newList)
                }
                
            }
        },
  }
}
</script>

<style lang="less">
.bg-img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  padding:1px;
  box-sizing:border-box;
  z-index:1;
  filter: blur(50px);
}
.bg-img_bg{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  background-color: #000;
  opacity: 0.5;
  //  filter: blur(10px);
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
.music_view{
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
}
.main-musicButton{
  padding: 0 25px;
  .flex_row;
  .jc_flex_sa;
  .pause_box{
    .flex_row;
    .jc_flex_center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #fff;
  }
  .musicButton_img{
    width:24px;
    height:24px
  }
  .next_right{
    transform: rotate(180deg);
  }
}


</style>