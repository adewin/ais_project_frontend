<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" center="大连"
        @ready="setDistanceToolInstance"
        @click="getPointByClick"
        @rightclick="getPointByrightClick">
        <bm-control class="bm-dis">
            <button @click="openDistanceTool">开启测距</button>
        </bm-control>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

        <bm-point-collection class="bm-points"
            v-for="(item, index) in data1" :key="index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_CRICLE" :color="getColor(item.value)"
            size="BMAP_POINT_SIZE_SMALL">
        </bm-point-collection>
        <!-- 海量点组件 -->
        <bm-point-collection class="bm-clusters"
            v-for="(item, index) in data2" :key="'ss'+index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_STAR" :color="getColor(item.value)"
            size="BMAP_POINT_SIZE_SMALL"
            @click="clickHandler">
        </bm-point-collection>

    </baidu-map>
    <transition name="el-zoom-in-top">
        <div v-if="flag" class="operateContainer">
            <el-collapse >
                <el-collapse-item title="分析区域" name="1">
                    左上：<el-input placeholder="左击地图获得" v-model="point1" clearable=""></el-input>
                    右下：<el-input placeholder="右击地图获得" v-model="point2" clearable=""></el-input>
                    <el-button @click="getDataByRectangle">获取数据</el-button>
                    <el-button @click="clearData1">清除数据</el-button>
                </el-collapse-item>
                <el-collapse-item title="K-Dist图" name="2">
                    <el-button>生成K-Dist图</el-button>
                </el-collapse-item>
                <el-collapse-item title="DBSCAN聚类" name="3">
                    搜索半径（m）：<el-input placeholder="搜索半径" v-model="eps" clearable=""></el-input>
                    <br>
                    最小个数：<el-input placeholder="最小个数" v-model="minpts" clearable=""></el-input>
                    <br>
                    <el-button @click="getClusterValue">计算</el-button>
                </el-collapse-item>
            </el-collapse>
            
        </div>
    </transition>

    <div id="showIcon" @click="flag=!flag">
        <i class="el-icon-circle-close"></i>
    </div>
</div>
</template>

<script>
import DistanceTool from 'bmaplib.distancetool'

export default {
    data() {
        return {
            // 地图属性
            map: {
                center: {lng: 0, lat: 0},
                zoom: 7,
                min_zoom: 1,
                max_zoom: 15,
                scroll: true,
            },
            data1: {},
            data2: {},
            // 点击地图时获取的坐标信息
            point1: '',
            point2: '',
            eps: '',
            minpts: '',
            show: false,
            flag: true,
            input: ''
        }
    },
    unmount(){
        distanceTool && distanceTool.close()
    },
    methods:{
        getDataByRectangle(){
            // console.log('kasi')
            this.$axios.post('http://localhost:5000/api/get_data_by_rectangle', {lnglat_top_left: this.point1, lnglat_bottom_right: this.point2}).then((res) => {
                console.log(res.data)
                this.data1 = res.data
            }).catch((err) => {
                console.log(err)
            })
        },
        getClusterValue(){
            console.log('asss')
            this.$axios.post('http://localhost:5000/api/calc_dbscan_by_rectangle', {lnglat_top_left: this.point1, lnglat_bottom_right: this.point2, eps: this.eps, minpts: this.minpts}).then(res => {
                console.log(res.data)
                this.data2 = res.data
            })
        },
        clearData1(){
            this.data1 = null
            this.point1 = ''
            this.point2 = ''
        },
        getColor(value){
            // 生成随机颜色
            if (value == -1) {
                return 'white'
            } else {
                for(let i = 0; i<=100; i ++){
                    if(value == i){
                        return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
                    }
                }
            }
        },
        clickHandler(e){
            console.log(e)
            console.log(e.point)
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
        // 测距工具
        setDistanceToolInstance({map}) {
            this.distanceTool = new DistanceTool(map, {lineStroke:2})
        },
        openDistanceTool(e){
            const {distanceTool} = this
            distanceTool && distanceTool.open()
        }
    },
    watch: {

    },
    computed: {
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
    height: 88%;
    position: absolute;
    top: 60px;
    right: 0%;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #545c64;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    overflow: hidden;
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
.bm-dis {

}
</style>

