<template>
    <div class="playBox">
        <img src="" class="playBox_img"/>
        <div class="playBox_content">
            <p class="title"></p>
            <p class="singer"></p>
        </div>
        <div class='canvasBox'>
            <view class='bigCircle'></view>
            <view class='littleCircle'></view>
            <img src="/static/images/playBox_pause.png" class="playBox_pause"/>
            <canvas canvas-id="runCanvas" id="runCanvas" class='canvas'></canvas>
        </div>
        <img src="/static/images/playBox_list.png" class="playBox_list"/>
    </div>
</template>
<script>
export default {
    data(){
        return{
        percentage: '', //百分比
        animTime: '', // 动画执行时间
        }
    },
    created(){
        this.draw('runCanvas',100,10000);
    },
    methods:{
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
        setTimeout(function () {
        that.canvasTap(start, end, time, w, h);
        }, time);
    },
        draw(id, percent, animTime){
        var that = this;
        const ctx2 = wx.createCanvasContext(id);
            that.ctx2=ctx2,
            that.percentage=percent,
            that.animTime=animTime
        var time = that.animTime / that.percentage;
        wx.createSelectorQuery().select('#'+id).boundingClientRect(function (rect) { //监听canvas的宽高
            var w = parseInt(rect.width/2); //获取canvas宽的的一半
            var h = parseInt(rect.height/2); //获取canvas高的一半，
            that.canvasTap(0, that.percentage, time, w, h)
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