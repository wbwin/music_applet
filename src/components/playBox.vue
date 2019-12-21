<template>
    <div class="playBox">
        <img :src="playListDetail.al.picUrl" class="playBox_img"/>
        <div class="playBox_content">
            <p class="title" >{{playListDetail.name}}</p>
            <p class="singer"><template v-for='(arItem,arIndex) in playListDetail.ar' >{{arIndex>1?'/':''}}{{arItem.name}}</template></p>
        </div>
        <div class='canvasBox' @click="audioPause">
            <view class='bigCircle' :style="{backgroundColor:playSec||play?'#ccc':'#585858'}"></view>
            <view class='littleCircle'></view>
            <img :src="playSec||play?'/static/images/playBox_pause.png':'/static/images/playBox_play.png'" class="playBox_pause" />
            <canvas canvas-id="runCanvas" id="runCanvas" class='canvas'></canvas>
        </div>
        <img src="/static/images/playBox_list.png" class="playBox_list"/>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
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
        }
    },
    computed:{
        ...mapState(['playListIndex','playListDetail','playListTime','playList','playListMaxTime','play','plannedSpeed'])
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
    },
    onShow(){
        const that=this
        console.log(that.play)
        clearTimeout(that.canvasTimer)
        if(that.play){
            var currentTime=that.innerAudioContext.currentTime
            var duration=that.innerAudioContext.duration
            var plannedSpeed=((that.innerAudioContext.currentTime/that.innerAudioContext.duration)*100).toFixed(2)
            that.draw('runCanvas',plannedSpeed,100,that.playListMaxTime*1000);
        }
        
    },
    methods:{
        ...mapActions(['updatePlay','updatePlannedSpeed']),
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
    .playBox{
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
    }
    
    
    

</style>