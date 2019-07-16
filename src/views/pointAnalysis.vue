<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" 
        :mapStyle="map.map_style" center="大连"
        @click="getPointByClick"
        @rightclick="getPointByrightClick">
    <!-- 热力图组件 -->
    <bml-heatmap :data="heatmap.data" :max="heatmap.max" 
    :radius="10">
    </bml-heatmap>
    <!-- 聚合点组件 -->
    <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="(item, index) in clusterer.markers" :key="index" 
        :position="{lng: item.lng, lat: item.lat}"></bm-marker>
    </bml-marker-clusterer>
    </baidu-map>
    <transition name="el-zoom-in-top">
        <div v-if="flag" class="operateContainer">
            <p><el-button id="clear-button" type="info" icon="el-icon-delete" 
                size="mini" @click="clearLayers" circle></el-button>
            </p>
            空间范围
            <p><el-input maxlength="50px" v-model="point1" placeholder="左击地图获取坐标" clearable><template slot="prepend">左上</template></el-input></p>
            <p><el-input maxlength="50px" v-model="point2" placeholder="右击地图获取坐标" clearable><template slot="prepend">右下</template></el-input></p>
            <!-- <p><el-button @click="startPolygon">开启范围选择</el-button></p> -->
            <div class="block">
                <p>时间范围</p>
                <el-date-picker
                v-model="time_range"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                default-value="2017-08-09 16:00:00"
                :default-time="['16:00:00', '17:00:00']">
                </el-date-picker>
                <p>
                    <el-tooltip effect="dark" content="生成全球范围内的热力图" placement="bottom">
                        <el-button @click="generateHeatmap">生成热力图</el-button>
                    </el-tooltip>
                </p>

                <el-tooltip class="item" effect="dark" content="为便于显示和运行，时间间隔为开始时间后一分钟" placement="bottom">
                    <el-button @click="generateClusterer">生成集聚点</el-button>
                </el-tooltip>
            </div>
        </div>
    </transition>

    <div id="showIcon" @click="flag=!flag">
        <i class="el-icon-circle-close"></i>
    </div>
</div>
</template>

<script>
import {BmlHeatmap, BmlMarkerClusterer} from 'vue-baidu-map'
import * as util from '../util'
export default {
    components: {
        BmlHeatmap,
        BmlMarkerClusterer
    },
    data() {
        return {
            // 地图属性
            map: {
                center: {lng: 0, lat: 0},
                zoom: 6,
                min_zoom: 2,
                max_zoom: 15,
                scroll: true,
                map_style: {
                    style:'midnight'
                }
            },
            //多边形属性
            polygon: {
                polygonPath: []
            },
            // 热力图属性
            heatmap: {
                data: [],
                max: 1000,
            },
            // 聚合点属性
            clusterer: {
                markers: []
            },
            flag: true,
            point1: '',
            point2: '',
            time_range: [new Date(2017, 7, 9, 16, 0), new Date(2017, 7, 9, 16, 10)]
        }
    },
    methods:{
        generateHeatmap(){
            if(this.time_range == ''){
                this.$message({
                    message: '时间不能为空',
                    type: 'warning'
                })
            } else {
                let stime = util.dateFormat(this.time_range[0])
                let etime = util.dateFormat(this.time_range[1])

                this.$axios.get('http://localhost:5000/api/get_data_by_timerange/?start=' + stime + '&end=' + etime).then(res => {
                    this.$message({
                        message: '获取数据成功',
                        type: 'success'
                    })
                    this.heatmap.data = res.data[0].lnglat
                })
            }
        },
        generateClusterer(){
            if(this.point1 == '' && this.point2 == ''){
                this.$message({
                    message: '空间范围不能为空',
                    type: 'warning'
                })
            } else {
                this.heatmap.data = []
                let stime = util.dateFormat(this.time_range[0])
                // let etime = util.dateFormat(this.time_range[1])
                let top = this.point1
                let bottom = this.point2
                this.$axios.get('http://localhost:5000/api/get_data_by_time_space/?start='+stime+'&top='+top+'&bottom='+ bottom).then(res => {
                    console.log(res.data)
                    this.clusterer.markers = res.data[0].lnglat
                })
            }
        },
        clearLayers(){
            this.heatmap.data = []
            this.clusterer.markers = []
        },
        // 双击地图获得经纬度坐标
        getPointByClick(e){
            if (this.point2 != ''){
                if(this.point2.split(',')[0] <= e.point.lng ){
                    alert('右下点的经度不能小于左上点')
                } else if (this.point2.split(',')[1] >= e.point.lat){
                    alert('右下点的纬度不能大于左上点')
                } else {
                    this.point1 = e.point.lng + ',' + e.point.lat
                }
            } else {
                this.point1 = e.point.lng + ',' + e.point.lat
            }
        },
        getPointByrightClick(e){
            if (this.point1 != ''){
                if(this.point1.split(',')[0] >= e.point.lng ){
                    alert('左上点的经度不能大于右下点')
                } else if (this.point1.split(',')[1] <= e.point.lat){
                    alert('左上点的纬度不能小于右下点')
                } else {
                    this.point2 = e.point.lng + ',' + e.point.lat
                }
            } else {
                this.point2 = e.point.lng + ',' + e.point.lat
            }
        },
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
    width: 25%;
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
#clear-button {
    position: absolute;
    left: 10px;
    top: 10px;
}
#clear-button :hover::after{
    position: absolute;
    left: 32px;
    top: 6px;
    z-index: 2;
    content: '清除图层';
    font-size: 14px;
}
#showIcon {
    z-index: 999;
    position: absolute;
    bottom: 10px;
    right: 11%;
}
.el-icon-circle-close {
    font-size: xx-large;
    color: #ffd04b;
}
.bm-points {
    color: yellow;
}
</style>



