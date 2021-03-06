import Vue from 'vue'
import App from './App'
import axios from 'axios'
import qs from 'qs'
import ApiUrl from './utils/config.js'
import store from './store'
// 时间戳
const NewTimeStamp = new Date().getTime();

axios.defaults.timeout = 30000;
axios.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    // console.log(config,'adapter')
    let data = config.method === 'get' ? config.params : qs.stringify(config.data)
    // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
    wx.request({
      url:ApiUrl.ApiUrl+config.url,
      method:config.method,
      data:data,
      success:(res)=>{ return resolve(res)},
      fail:(err)=>{return reject(err)}
    })
  })
}
// axios 拦截器
function Instance () {
  //请求拦截器
  axios.interceptors.request.use(function ( request ) {
    // request.headers.token = 'token=11124654654687';
    // console.log(request) //请求成功
    return request
  }, function ( error ) {
    // console.log(error); //请求失败
    return Promise.reject(error);
  });
  
  // 添加响应拦截器
  axios.interceptors.response.use(function ( response ) {
    console.log(response.data) //响应成功
    return response;
  }, function ( error ) {
    // console.log(error); //响应失败
    return Promise.reject(error);
  });
}

Instance()

function get (url,params) {
  return axios({
    method:'get',
    url:url,
    params:params
  })
}
function post (url,params) {
  return axios({
    method:'post',
    url:url,
    data:params
  })
}
Vue.config._mpTrace = true
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
Vue.prototype.$store = store
Vue.prototype.globalData = getApp().globalData
Vue.prototype.get=get
export default {
    config: {
      pages: [],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '第一个小程序',
        navigationBarTextStyle: 'black'
      }
    }
  }