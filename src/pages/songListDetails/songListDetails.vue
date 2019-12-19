<template>
 <div style='overflow:hidden'>
  <div class="bg-img">

    <div class='filter-bg'>
      <div class='header'>
        <!-- <img/> -->
      </div>
      <div class='header-center'>
        <img :src='songListDetails.coverImgUrl' class='header-center-img' />
        <div class='user-info'>
          <span class='user-name'>{{songListDetails.name}}</span>
          <div class='user-message'>
            <img :src='songListDetails.creator.avatarUrl' class='user-image'/>
            <span> {{songListDetails.creator.nickname}}</span>
            <span>></span>
          </div>
        </div>
      </div>
      <!-- <div class='user-tips'>
        <span class='user-tips-text'>95后</span>
        <span class='user-tips-text'>Lv.8</span>
        <span class='user-tips-text'>广州市</span>
        <span class='user-tips-text'>双鱼座</span>
      </div> -->
    </div>
  </div>
  <div class='music-content'>
    <div style='height:225px'></div>
    <div class='music-content-main'>
      <div class='music-bar'>
        <span class='music-bar-text'>音乐</span>
        <span class='music-bar-text'>动态</span>
        <span class='music-bar-text'>关于我</span>
      </div>
      <!-- <div class='music-count'>
        <span>歌单(7)</span>
        <span>共被收藏1次</span>
      </div> -->
      <template v-for='(item,index) in songListDetails.tracks'>
        <div class='music-main' @click='toAudioPlay(item)'>
          <!-- <img class='music-main-image' :src='{{item.coverImgUrl}}'/> -->
          <span class='music-main-numb'>{{index+1}}</span>
          <div class='music-main-introduce'>
            <span class='music-introduce-name'>{{item.name}}</span>
            <span class='music-introduce-count' ><template v-for='(arItem,arIndex) in item.ar' >{{arIndex>1?'/':''}}{{arItem.name}}</template> - {{item.al.name}}</span>
          </div>
          <img src="/static/images/more.png" class="more_img" @click.stop="showMusicDetail(index)"/>
        </div>
      </template>
      
      
    </div>
  </div>
  <div class="commodity_screen" @click="hideModal" v-if="showModalStatus"></div>
  <div :class="[showModalStatus?'up':'down']" class="commodity_attr_box" v-if="showModalStatus">
    <div class="flex_row music_detail_title border_bottom">
      <img :src="tracksDetail.al.picUrl" class="music_detail_img"/>
      <div class="flex_column music_detail_title_right">
        <span class="music_detail_name">歌曲：BB</span>
        <span class="music_detail_author">JJ</span>
      </div>
    </div>
    <ul class="flex_column music_detail_ul">
      <li class="flex_row music_detail_li">
        <img src="/static/images/next_play.png" class="music_detail_icon"/>
        <p class="music_detail_li_p">下一首播放</p>
      </li>
    </ul>
  </div>
</div>

</template>

<script>

export default {
  data () {
    return {
     songListDetails:{creator:{}},
     animation:'',
     animationData:'',
     showModalStatus:true,
     tracksDetail:{},
    }
  },
  onLoad(){
    let that = this
    var options=that.globalData.appOptions.query
    that.get('http://47.104.254.188:3000/playlist/detail?id=' + options.id).then(res=>{
      that.songListDetails=res.data.playlist
      that.tracksDetail=res.data.playlist.tracks[0]
    })
  },
  methods: {
    toAudioPlay(musicMsg){
      let that=this
      console.log(musicMsg)
      wx.setStorageSync('musicMsg', JSON.stringify(musicMsg))
      
      wx.navigateTo({
        url: '../audioPlay/main'
      })
    },
    showMusicDetail(index){
      var that=this
      var tracks=that.songListDetails.tracks
      that.tracksDetail=tracks[index]
      console.log(tracks[index])
      that.showModalStatus=true
    },
    showModal() {
      var that=this
      that.showModalStatus=true
      
    },
    hideModal(){
        var that=this
        console.log(12)
        that.showModalStatus=false
    },
  }
}
</script>

<style lang="less" scoped>
.bg-img{
  width: 100%;
  height: 240px;
  position: relative;
  background:#333;
  background-size:100% 100%;
  padding:1px;
  box-sizing:border-box;
  z-index:1;
}
.bg-img::after{
    content: "";
    width:100%;
    height:240px;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(2px);
    z-index: 2;
}
.filter-bg{
  font-size: 14px;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;
  z-index: 3;
  padding: 0 15px 0 20px;
}

.header-center{
  display: flex;
  font-size: 16px;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  margin-top: 50px;
}
.header-center-img{
  width: 100px;
  height:100px;
  border-radius: 4px;
}
.user-info{
  margin-left: 20px;
}
.user-name{
  display: block;
  font-size: 20px;
  margin-bottom: 20px;
}
.user-message{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.user-image{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 5px;
}
.user-tips{
  margin-top: 15px;
}
.user-tips-text{
  padding: 3px 15px;
  margin-right: 5px;
  background: rgba(255,255,255,0.5);
  border-radius: 15px;
  
}
.music-content{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.music-content-main{
  background-color: #fff;
  border-top-left-radius: 13px;
  border-top-right-radius:13px;
  font-size: 15px;
  z-index: 999;
}
.music-bar{
  padding: 13px 0;
  display: flex;
  flex-direction: row;
}
.music-bar-text{
  flex: 1;
  text-align: center;
}
.music-count{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px;
  background: #f1f1f1;
  font-size: 12px;
  color: #999;
}
.music-main{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 5px;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
}
.music-main-image{
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
.music-main-numb{
  font-size: 18px;
  color: #999;
  margin: 0 13px 0 18px;
}
.music-main-introduce{
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
}
.music-introduce-name{
  max-width: 270px;
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.music-introduce-count{
  display: inline-block;
  max-width: 270px;
  font-size: 13px;
  color: #999;
  margin-top: 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  
}
.commodity_screen {
 width: 100%;
 height: 100%;
 position: fixed;
 top: 0;
 left: 0;
 background: #000;
 opacity: 0.2;
 overflow: hidden;
 z-index: 1000;
 color: #fff;
}
 
.commodity_attr_box {
 width: 100%;
 overflow: hidden;
 position: fixed;
 bottom: 0;
 left: 0;
 z-index: 2000;
 background: #fff;
 padding-top: 10px;
 height: 200px;
 border-radius: 20px 20px 0 0
}
.up{
  animation: up .7s;
}
.down{
  animation: down 1s;
}
@keyframes up{
  0% {transform: translateY(225px);}
  100% { transform: translateY(0); }
}
@keyframes down{
  0% { transform: translateY(0);}
  100% { transform: translateY(225px);}
}
.more_img{
  width: 24px;
  height: 24px;
  margin-right: 10px
}
.music_detail_img{
  width: 50px;
  height: 50px;
  border-radius: 5px;
}
.music_detail_title{
  padding: 15px
}
.music_detail_title_right{
  margin-left: 12px
}
.music_detail_name{
  font-size: 16px;
  color: #333
}
.music_detail_author{
  font-size: 13px;
  color: #999;
  margin-top: 5px
}
.music_detail_ul{

  .music_detail_li{
    padding-left: 20px;
      .music_detail_icon{
        width: 20px;
        height: 20px;
        margin-left: 12px;
      }
      .music_detail_li_p{
        font-size: 16px;
        color: #434343;
        .border_bottom();
      }
  }
}


</style>