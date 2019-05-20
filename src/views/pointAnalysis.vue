<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" center="大连">
    <bml-heatmap :data="heatmap.data" :max="heatmap.max" 
    :radius="10">
    </bml-heatmap>
    </baidu-map>
    <transition name="el-zoom-in-top">
        <div v-if="flag" class="operateContainer">
            分析范围
            <div class="block">
                <p>按入库时间查询</p>
                <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间"
                default-time="16:00:00"
                default-value="2017-08-09 16:00:00">
                </el-date-picker>
                <el-button @click="getData">生成热力图</el-button>
            </div>
        </div>
    </transition>

    <div id="showIcon" @click="flag=!flag">
        <i class="el-icon-circle-close"></i>
    </div>
</div>

</template>

<script>
import {BmlHeatmap} from 'vue-baidu-map'
export default {
    components: {
        BmlHeatmap
    },
    data() {
        return {
            // 地图属性
            map: {
                center: {lng: 0, lat: 0},
                zoom: 6,
                min_zoom: 1,
                max_zoom: 15,
                scroll: true,
            },
            // 热力图属性
            heatmap: {
                data: [],
                max: 1000,
            },
            flag: true,
            value1: ''
        }
    },
    methods:{
        getData(){
            let year = this.value1.getFullYear()
            let month = (this.value1.getMonth() +1 >= 10)? (this.value1.getMonth() + 1):('0'+(this.value1.getMonth() + 1))
            let date = (this.value1.getDate() >= 10) ? (this.value1.getDate()):('0'+this.value1.getDate())
            let hour = (this.value1.getHours() >= 10) ? (this.value1.getHours()):('0'+this.value1.getHours())
            let min = (this.value1.getMinutes() >= 10) ? (this.value1.getMinutes()) : ('0'+this.value1.getMinutes())
            let sec = (this.value1.getSeconds() >= 10) ? (this.value1.getSeconds()) : ('0'+ this.value1.getSeconds())
            let time = year+'-'+month+'-'+date+' '+ hour+':'+min
            console.log(time)

            this.$axios.get('http://localhost:5000/api/get_data_by_inserttime/' + time).then(res => {
                this.$message({
                    message: '获取数据成功',
                    type: 'success'
                })
                this.heatmap.data = res.data[0].lnglat
                console.log(res.data)
                console.log(this.heatmap.data)
            })
        }
    }
}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
.map {
    width: 100%;
    height: 100%;
}
.operateContainer {
    z-index: 999;
    width: 30%;
    height: 80%;
    position: absolute;
    top: 60px;
    right: 0%;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #545c64;
    text-align: center;
    color: #fff;
    padding: 20px 10px;
    box-sizing: border-box;
}
#showIcon {
    z-index: 999;
    position: absolute;
    bottom: 10px;
    right: 14%;
}
.el-icon-circle-close {
    font-size: xx-large;
    color: #ffd04b;
}
.bm-points {
    color: yellow;
}
</style>



