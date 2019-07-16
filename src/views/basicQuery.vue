<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" center="大连">
        <!-- 缩放控件 -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" :showZoomInfo="navigation.showZoomInfo" :enableGeolocation="navigation.enableGeolocation"></bm-navigation>
        <!-- 折线组件 -->
        <bm-polyline class="bm-line" :path="trajectory.polylinePath" stroke-color="blue" 
            stroke-style="dashed"
            :stroke-opacity="0.5"
            :stroke-weight="2"
            :editing="false"
            :clicking='true'>
        </bm-polyline>

        <!-- 航线中 点 组件-->
        <bm-marker v-for="(item, index) in marker.lnglat" :key="'2'+index" 
            :position="item"
            @click="getMarkerInfo"
            :icon="{url: '../../static/poi.png', size: {width: 20, height: 20}}">
            <!-- <bm-info-window :position="item" :show="marker.markerInfo.show">我爱北京天安门</bm-info-window> -->
        </bm-marker>
        <!-- 海量点组件--显示轨迹点 -->
        <!-- <bm-point-collection class="trajectory-points"
            v-for="(item, index) in trajectory.data" :key="'q'+index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_RHOMBUS" color="red"
            size="BMAP_POINT_SIZE_SMALLER">
        </bm-point-collection> -->

        <!-- 标签组件 -->
        <!-- <bm-label v-for="(item, index) in label.position" :key="'1'+index"
        :position="item"
        :labelStyle="{fontSize : '8px'}"
        content='test'>

        </bm-label> -->
        <!-- 信息窗口组件 -->
        <bm-info-window :position="infoWindow.lnglat" title="详细信息" 
            :show="infoWindow.show" 
            @close="infoWindowClose" 
            @open="infoWindowOpen">
            <p>mmsi: {{infoWindow.mmsi}}</p>
            <p>经度: {{infoWindow.lng}}</p>
            <p>纬度: {{infoWindow.lat}}</p>
            <p>时间: {{infoWindow.time}}</p>

            <br>
            <el-button size="mini" round>显示船舶详细信息</el-button>
            <el-button size="mini" round @click="getDataByMMSI">显示船舶一日内轨迹</el-button>
        </bm-info-window>
        <!-- 海量点组件 -->
        <bm-point-collection class="bm-points" 
            v-for="(item, index) in data" :key="index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_STAR" color="green"
            size="BMAP_POINT_SIZE_SMALL"
            @click="clickPoint">
        </bm-point-collection>
    </baidu-map>
    <transition name="el-zoom-in-top">
        <div v-if="flag" class="operateContainer">
            <div class="block">
                <p>按入库时间查询</p>
                <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间"
                default-time="16:00:00"
                default-value="2017-08-09 16:00:00">
                </el-date-picker>
                <el-button @click="getData">获取数据</el-button>
            </div>
            <div class="">
                <p>船舶详细信息</p>

                <p>船舶轨迹详细信息</p>
                <el-table :data="trajectory.data" style="width:100%" height="250">
                    <el-table-column
                        prop="updatetime"
                        label="时间">
                    </el-table-column>
                    <el-table-column 
                        prop="mmsi"
                        label="mmsi号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="lon"
                        label="经度">
                    </el-table-column>
                    <el-table-column
                        prop="lat"
                        label="纬度">
                    </el-table-column>
                    <el-table-column
                        prop="navastaus"
                        label="航行状态">
                    </el-table-column>

                </el-table>
            </div>

        </div>
    </transition>

    <div id="showIcon" @click="flag=!flag">
        <i class="el-icon-circle-close"></i>
    </div>
</div>

</template>

<script>
import * as util from '../util'
export default {
    data() {
        return {
            // 缩放控件
            navigation: {
                anchor: 'BMAP_ANCHOR_TOP_LEFT',
                showZoomInfo: true,
                enableGeolocation: true
            },
            // 地图属性
            map: {
                center: {lng: 0, lat: 0},
                zoom: 5,
                min_zoom: 1,
                max_zoom: 15,
                scroll: true,
            },
            data: {
            },
            // 信息窗口属性
            infoWindow: {
                show: false,
                lnglat: {},
                lng: '',
                lat: '',
                mmsi: '',
                time: '',
                status: ''
            },
            // 折线属性
            trajectory: {
                polylinePath: [],
                data: [],
            },
            // 标签属性
            label: {
                content: 'test',
                position: {lng: '112.368292', lat: '21.369393'}
            },
            // 航线 点 marker属性
            marker: {
                markerInfo: {
                    show: false
                },
                lnglat: [],
            },
            // 船舶详细信息，表格中使用
            shipDetail: {},
            value1: '',
            color: 'yellow',
            show: false,
            flag: true,
            input: ''
        }
    },
    methods:{
        getData(){
            let time = util.dateFormat(this.value1)
            this.$axios.get('http://localhost:5000/api/get_data_by_inserttime/' + time).then(res => {
                this.$message({
                    message: '获取数据成功',
                    type: 'success'
                })
                this.data = res.data
                console.log(res.data)
            })
        },
        getDataByMMSI(){

            let mmsi = this.infoWindow.mmsi
            this.$axios.get('http://localhost:5000/api/get_data_by_mmsi/' + mmsi).then(res => {
                // this.trajectory.polylinePath = null
                this.trajectory.data = res.data[0].detail
                this.trajectory.polylinePath = res.data[0].lnglat
                this.marker.lnglat = res.data[0].lnglat
                this.map.zoom = 8
                console.log('船舶轨迹信息')
                // console.log(this.trajectory.polylinePath)
                console.log(res.data)
                // console.log(this.trajectory.data[0].detail)
            })
        },
        getMarkerInfo(){
            console.log(this.marker.markerInfo.show)
            this.marker.markerInfo.show = true
        },
        clickPoint(e){
            console.log(this.data[0].data)
            let lng = e.point.lng
            let lat = e.point.lat
            this.infoWindow.show = true
            this.infoWindow.lnglat = {lng: e.point.lng, lat: e.point.lat}
            console.log({'lat':lat, 'lon':lng})
            this.data[0].detail.forEach(i => {
                if(i.lat == lat && i.lon == lng){
                    console.log(i.mmsi)
                    this.infoWindow.mmsi = i.mmsi
                    this.infoWindow.lng = i.lon
                    this.infoWindow.lat = i.lat
                    this.infoWindow.time = i.updatetime
                    this.status = i.navastatus
                }
            })
        },
        zoomEvent(b){
            console.log(b.point)
        },
        infoWindowClose (e) {
            this.infoWindow.show = false
        },
        infoWindowOpen (e) {
            this.infoWindow.show = true
        },
        clear () {
            this.infoWindow.contents = ''
        }

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
    height: 80%;
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
