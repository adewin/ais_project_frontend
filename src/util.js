/* eslint-disable no-unreachable */
// 全局通用函数

// Date对象转化为yyyy-MM-dd格式
export function dateFormat (dateObj) {
  let year = dateObj.getFullYear()
  let month = (dateObj.getMonth() + 1 >= 10) ? (dateObj.getMonth() + 1) : ('0' + (dateObj.getMonth() + 1))
  let date = (dateObj.getDate() >= 10) ? (dateObj.getDate()) : ('0' + dateObj.getDate())
  let hour = (dateObj.getHours() >= 10) ? (dateObj.getHours()) : ('0' + dateObj.getHours())
  let min = (dateObj.getMinutes() >= 10) ? (dateObj.getMinutes()) : ('0' + dateObj.getMinutes())
  // let sec = (dateObj.getSeconds() >= 10) ? (dateObj.getSeconds()) : ('0' + dateObj.getSeconds())
  return year + '-' + month + '-' + date + ' ' + hour + ':' + min
}

// 船舶类型数值转成字符
export function getShipType (number) {
  switch (number) {
    case 50: return '引航船'
      break
    case 51: return '搜救船'
      break
    case 52: return '拖轮'
      break
    case 53: return '港口供应轮'
      break
    default: return '无效值'
  }
}
