// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from './http'

// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局引入百度地图
import BaiduMap from 'vue-baidu-map'

// 全局引入Echarts
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

Vue.prototype.$axios = axios
Vue.component('chart', ECharts)

Vue.use(ElementUI)
Vue.use(BaiduMap, {
  ak: 'T3KMmyUrOd3vG3hXFHBjTfazGWYUjG1V'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
