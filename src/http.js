import axios from 'axios'
import {Loading, Message} from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let loading
function startLoading() {
    loading = Loading.service({
        target: 'container',
        lock: true,
        text: '拼命获取数据中...',
        background: 'rgba(0,0,0,0,7)'
    })
}

function endLoading(){
    loading.close()
}
// 请求拦截
axios.interceptors.request.use(config => {
    //加载动画
    startLoading()
    return config
}, error => {
    return Promise.reject(error)
})
//响应拦截
axios.interceptors.response.use(response => {
    // 结束加载动画
    endLoading()
    return response
}, error => {
    endLoading()
    Message.error(error.response.data)
    return Promise.reject(error)
})
export default axios