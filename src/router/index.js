import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import BasicQuery from '../views/basicQuery.vue'
import Cluster from '../views/clusterAnalysis.vue'
import PointAnalysis from '../views/pointAnalysis.vue'
import DailyStatistic from '../views/dailyStatistic.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: 'basic_query' },
    { path: '/basic_query', component: BasicQuery },
    { path: '/cluster_analysis', component: Cluster },
    { path: '/point_analysis', component: PointAnalysis },
    { path: '/daily_statistic', component: DailyStatistic }
  ]
})
