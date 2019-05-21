// 全局通用函数

//Date对象转化为yyyy-MM-dd格式
export function dateFormat(dateObj){
    let year = dateObj.getFullYear()
    let month = (dateObj.getMonth() +1 >= 10)? (dateObj.getMonth() + 1):('0'+(dateObj.getMonth() + 1))
    let date = (dateObj.getDate() >= 10) ? (dateObj.getDate()):('0'+dateObj.getDate())
    let hour = (dateObj.getHours() >= 10) ? (dateObj.getHours()):('0'+dateObj.getHours())
    let min = (dateObj.getMinutes() >= 10) ? (dateObj.getMinutes()) : ('0'+dateObj.getMinutes())
    let sec = (dateObj.getSeconds() >= 10) ? (dateObj.getSeconds()) : ('0'+ dateObj.getSeconds())
    return year+'-'+month+'-'+date+' '+ hour+':'+min
}