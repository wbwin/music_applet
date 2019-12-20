import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state:{
        playListIndex:0,//playList当前的index
        playListTime:0,//当前音乐的播放进度
        playList:[],//音乐列表
    },
    getters:{
        // changeCount:function(count){
        //     return count
        // }
    },
    mutations:{
        playListIndexUpdate(state,index){
            state.playListIndex=index
        },
        playListTimeUpdate(time){
            state.playListTime=time
        },
        playListUpdate(state,newList){
            state.playList=[...newList]
        }
    },
    actions:{
        updatePlayListIndex(context,param){
            context.commit('playListIndexUpdate',param)
        },
        updatePlayListTime(context){
            context.commit('playListTimeUpdate',param)
        },
        updatePlayList(context,param){
            context.commit('playListUpdate',param)
        },
    }
})
export default store