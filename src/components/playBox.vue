<template>
    <div class="playBox_box" @click="hideModal" :style="{backgroundColor:showModalStatus?'rgba(0,0,0,0.2)':'transparent','zIndex':showModalStatus?'500':'auto'}">
        <div class="playBox" @click.stop="">
            <img :src="playList[playListIndex].al.picUrl" class="playBox_img"/>
            <div class="playBox_content">
                <p class="title" >{{playList[playListIndex].name}}</p>
                <p class="singer"><template v-for='(arItem,arIndex) in playList[playListIndex].ar' >{{arIndex>1?'/':''}}{{arItem.name}}</template></p>
            </div>
            <div class='canvasBox' @click="audioPause">
                <view class='bigCircle' :style="{backgroundColor:playSec||play?'#ccc':'#585858'}"></view>
                <view class='littleCircle'></view>
                <img :src="playSec||play?'/static/images/playBox_pause.png':'/static/images/playBox_play.png'" class="playBox_pause" />
                <canvas canvas-id="runCanvas" id="runCanvas" class='canvas'></canvas>
            </div>
            <img src="/static/images/playBox_list.png" @click="showModal" class="playBox_list"/>
            <div :class="[showModalStatus?'up':'down']" class="commodity_attr_box" v-if="showModalStatus">
                <div class="flex_row music_detail_title border_bottom">
                    播放音乐列表(99)
                </div>
                <scroll-view  :style="{'height': '280px'}" :scroll-y="true" >
                <ul class="flex_column music_detail_ul">
                    <li class="flex_row music_detail_li" v-for="(item,index) in showPlayList">
                        <div class="music_detail_left">
                            <img src="/static/images/playing.png" class="playing"/>
                            <div class="music_box" >
                                <p class="music_name">好听-</p>
                                <p class="author">kahkhnkahkhnajkahkhnajkahkhnajkahkhnajkahkhnajkahkhnajkahkhnajkahkhnajaj</p>
                            </div>
                        </div>
                        <img src="/static/images/delete_play.png" class="delete_play" />
                    </li>
                </ul>
                </scroll-view>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
const util = require("../utils/util.js")
export default {
    data(){
        return{
            percentage: '', //百分比
            animTime: '', // 动画执行时间
            playDetail:{al:{}},
            innerAudioContext:wx.getBackgroundAudioManager(),
            currentTime:0,
            playSec:false,
            canvasTimer:'',
            showModalStatus:true,
            showPlayList:{},
        }
    },
    computed:{
        ...mapState(['playListIndex','playListTime','playList','playListMaxTime','play','plannedSpeed'])
    },
    watch:{
        playListMaxTime(newPlayListMaxTime,oldPlayListMaxTime){
            clearTimeout(this.canvasTimer)
            this.draw('runCanvas',0,100,newPlayListMaxTime*1000);
        }
    },
    created(){
        const that=this
        // console.log(that.playListTime)
        
        
    },
    onLoad(){
        const that=this
        console.log(11)
        that.playSec=that.play
        that.innerAudioContext.onEnded(()=>{
            that.playNextAudio()
        })
    },
    onShow(){
        const that=this
        console.log(that.play)
        clearTimeout(that.canvasTimer)
        if(that.play){
            var currentTime=that.innerAudioContext.currentTime.toFixed(0)
            var duration=that.innerAudioContext.duration.toFixed(0)
            var plannedSpeed=((currentTime/duration)*100).toFixed(2)
            that.draw('runCanvas',plannedSpeed,100,duration*1000);
        }
        
    },
    methods:{
        ...mapActions(['updatePlay','updatePlannedSpeed','updatePlayListMaxTime','updatePlayListIndex','updatePlayList']),
        //暂停音乐
        audioPause(){
            const that=this
            console.log(that.innerAudioContext)
            if(that.play){
                that.innerAudioContext.pause()
                that.playSec=false
                that.updatePlay(false)
                var currentTime=that.innerAudioContext.currentTime
                var duration=that.innerAudioContext.duration
                var plannedSpeed=((that.innerAudioContext.currentTime/that.innerAudioContext.duration)*100).toFixed(2)
                that.updatePlannedSpeed(plannedSpeed)
                clearTimeout(that.canvasTimer)
            }else{
                that.innerAudioContext.play()
                that.playSec=true
                that.draw('runCanvas',that.plannedSpeed,100,that.playListMaxTime*1000);
                that.updatePlay(true)
            }
            
            // that.currentTime=that.innerAudioContext.currentTime.toFixed(0)
            console.log(that.currentTime)
        },
        async getPlayList(audioId,index){
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
        playNextAudio() {
            const that=this
            const nextIndex = that.playListIndex + 1
            if (nextIndex < that.playList.length) {
                let innerAudioContext=util.setBackgroundAudio(playListDetail)
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
                    const newList = that.getPlayList(that.playList[nextIndex].id)
                    // 当前音频在这5条数据中的索引
                    const index = newList.findIndex(item => item.audioId === that.playList[nextIndex].audioId)
                    // 更新到vuex
                    that.updatePlayListIndex(index)
                    that.updatePlayList(newList)
                }
            }
        },
        showModal() {
            var that=this
            const playList=wx.getStorageSync('playList')
            that.showPlayList=playList
            console.log(playList)
            that.showModalStatus=true
        },
        hideModal(){
            var that=this
            console.log(12)
            that.showModalStatus=false
        },
        // 绘制圆形进度条方法
        run(c, w, h) {
        let that = this;
        var num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
        that.ctx2.arc(w, h, w-1, -0.5 * Math.PI, num); //每个间隔绘制的弧度
        that.ctx2.setStrokeStyle("#c95564");
        that.ctx2.setLineWidth("2");
        that.ctx2.setLineCap("butt");
        that.ctx2.stroke();
        that.ctx2.draw();
        },
    /**
     * start 起始百分比
     * end 结束百分比
     * w,h 其实就是圆心横纵坐标
     */
    // 动画效果实现
    canvasTap(start, end, time, w, h) {
        var that = this;
        start++;
        if (start > end) {
        return false;
        }
        that.run(start, w, h);
        that.canvasTimer=setTimeout(function () {
        that.canvasTap(start, end, time, w, h);
        }, time);
    },
        draw(id,speedPercent,percent, animTime){//speedPercent开始百分比
        var that = this;
        const ctx2 = wx.createCanvasContext(id);
            that.ctx2=ctx2,
            that.percentage=percent,
            that.animTime=animTime
        var time = that.animTime / that.percentage;
        wx.createSelectorQuery().select('#'+id).boundingClientRect(function (rect) { //监听canvas的宽高
            var w = parseInt(rect.width/2); //获取canvas宽的的一半
            var h = parseInt(rect.height/2); //获取canvas高的一半，
            that.canvasTap(speedPercent, that.percentage, time, w, h)
        }).exec();
        },
    }
}
</script>
<style lang="less">
.playBox_box{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    .playBox{
        transform:translate3d(0,0,0);
        -webkit-transform:translate3d(0,0,0);
        -o-transform:translate3d(0,0,0);
        -moz-transform:translate3d(0,0,0);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: #fff;
        z-index: 500;
        border-top: 1px solid #f5f5f5;
        .flex_row;
        .playBox_img{
            width: 40px;
            height: 40px;
            margin: 0 5px;
            border-radius: 50%;
        }
        .playBox_content{
            .flex_column;
            flex: 1;
            margin:0 10px 0 5px;
            .title{
                font-size: 15px;
                color: #3e3e3e
            }
            .singer{
                font-size: 12px;
                color: #bababa;
            }
        }
        .canvasBox{
            width: 30px;
            height: 30px;
            position: relative;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            .bigCircle{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                position: absolute;
                top:0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto auto;
                background-color: #ccc;
            }
            .littleCircle{
                width: 28px;
                height: 28px;
                border-radius: 50%;
                position: absolute;
                top:0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto auto;
                background-color: #fff;
            }
            .playBox_pause{
                position: relative;
                width: 15px;
                height: 15px;
                margin: auto auto 8px auto
            }
            .canvas{
                width:30px;
                height: 30px;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto auto;
                z-index: 99;
            }
        }
        .playBox_list{
            width: 25px;
            height: 25px;
            margin: 0 10px 0 20px
        }
        .commodity_attr_box{
            padding-top: 0;
            .music_detail_title{
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color:#333;
            }
            .music_detail_ul{
                .music_detail_li{
                    padding: 15px 10px;
                    .flex_row;
                    .jc_flex_sb;
                    .music_detail_left{
                        .flex_row;
                        .playing{
                            width: 18px;
                            height: 18px;
                            margin-right: 10px;
                        }
                        .music_box{
                            
                            display: block;
                            width: 50%;
                            .text_ellipsis;
                            .music_name{
                                display: inline-block;
                                font-size: 16px;
                                color: #525252;
                            }
                            .author{
                                display: inline-block;
                                vertical-align: bottom;
                                font-size: 13px;
                                color: #a0a0a0;
                            }
                        }
                    }
                    .delete_play{
                        width: 18px;
                        height: 18px;
                    }
                }
            }
            
        }
        
    }
}
    
    
    
    

</style>