<script>
export default {
    created(){
         // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    }
}
</script>

<style lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
} 
/*flex*/
.flex_column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex_row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.jc_flex_start {
  justify-content: flex-start
}

.jc_flex_end {
  justify-content: flex-end
}

.jc_flex_sb {
  justify-content: space-between;
}

.jc_flex_sa {
  justify-content: space-around;
}

.jc_flex_center {
  justify-content: center;
}

.ai_flex_start {
  align-items: flex-start
}

.ai_flex_end {
  align-items: flex-end
}

.ai_flex_center {
  align-items: center
}
/*默认底边框*/ 
.border_bottom{
  border-bottom: 0.5px solid #f5f5f5
}
/*底部弹框*/
.commodity_screen {
 width: 100%;
 height: 100%;
 position: fixed;
 top: 0;
 left: 0;
 background: #000;
 opacity: 0.2;
 overflow: hidden;
 z-index: 550;
 color: #fff;
}
 
.commodity_attr_box {
 width: 100%;
 overflow: hidden;
 position: fixed;
 bottom: 0;
 left: 0;
 z-index:600;
 background: #fff;
 padding-top: 10px;
//  height: 200px;
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

</style>