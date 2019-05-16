import Vue from 'vue'
import app from './app.vue'

// 引入axios
// import axios from 'axios'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
import axios from './http'
Vue.prototype.$axios = axios

// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入路由管理 
import VueRouter from 'vue-router';
Vue.use(VueRouter)
import router from './router.js'

// 全局引入百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
    ak: 'T3KMmyUrOd3vG3hXFHBjTfazGWYUjG1V'
})

// 全局引入echarts
import VCharts from 'v-charts'
Vue.use(VCharts)
// 全局注册组件
// import BMap from './components/bmap.vue'
// Vue.component('bmap', BMap)

var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router
})