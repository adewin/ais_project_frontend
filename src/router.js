import VueRouter from "vue-router"
import Option1 from "./views/option1.vue"
import Test from './views/test.vue'
import Cluster from './views/clusterAnalysis.vue'
import Query from './views/basicQuery.vue'

const router = new VueRouter({
    routes: [
        { path: '/cluster_analysis', component: Cluster},
        { path: '/basic_query', component: Query },
        { path: '/option1', component: Option1},
        { path: '/test', component: Test}
    ]
})

export default router
