const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  const msTime=timeTemp=>{
    if (!timeTemp) return ''
    timeTemp = new Date(timeTemp).getTime()
    timeTemp = new Date(timeTemp)
    
    var min = timeTemp.getMinutes()
    min = checkAddZone(min)
  
    var se = timeTemp.getSeconds()
    se = checkAddZone(se)
  
    return  min + ':' + se
  }
  function checkAddZone(num) {
    return num < 10 ? '0' + num.toString() : num
  }
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  module.exports = {
    formatTime: formatTime,
    msTime: msTime
  }