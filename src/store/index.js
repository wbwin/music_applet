import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        playListIndex:0,//playList当前的index
        playListDetail:{},//playList当前在5条音乐中的index
        playListMaxTime:0,//音乐的播放时间
        playListTime:0,//当前音乐的播放进度
        playList:[],//音乐列表
        play:false,//是否播放音乐
        plannedSpeed:0,//音乐播放进度的百分比
    },
    getters:{
        // changeCount:function(count){
        //     return count
        // }
    },
    mutations:{
        playListIndexUpdate(state,index){
            console.log(state)
            state.playListIndex=index
        },
        playListDetailUpdate(state,detail){
            state.playListDetail=detail
        },
        playListMaxTimeUpdate(state,time){
            console.log(time)
            state.playListMaxTime=time
        },
        playListTimeUpdate(state,time){
            state.playListTime=time
        },
        playListUpdate(state,newList){
            state.playList=[...newList]
        },
        playUpdate(state,bl){
            state.play=bl
        },
        plannedSpeedUpdate(state,speed){
            state.plannedSpeed=speed
        }
    },
    actions:{
        updatePlayListIndex(context,param){
            context.commit('playListIndexUpdate',param)
        },
        updatePlayListDetail(context,param){
            context.commit('playListDetailUpdate',param)
        },
        updatePlayListMaxTime(context,param){
            context.commit('playListMaxTimeUpdate',param)
        },
        updatePlayListTime(context,param){
            context.commit('playListTimeUpdate',param)
        },
        updatePlayList(context,param){
            context.commit('playListUpdate',param)
        },
        updatePlay(context,param){
            context.commit('playUpdate',param)
        },
        updatePlannedSpeed(context,param){
            context.commit('plannedSpeedUpdate',param)
        },
    },
    plugins: [
	    createPersistedState({
	      storage: {
	        getItem: key => wx.getStorageSync(key),
	        setItem: (key, value) => wx.setStorageSync(key, value),
	        removeItem: key => () => {}
	      }
	    })
	  ]
})
export default store