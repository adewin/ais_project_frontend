<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" center="大连">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <!-- 折线组件 -->
        <bm-polyline class="bm-line" :path="trajectory.polylinePath" stroke-color="blue" 
            stroke-style="dashed"
            :stroke-opacity="0.5" 
            :stroke-weight="2"
            :editing="false"
            :clicking='true'
            @mouseup="polylineEvent">
        </bm-polyline>

        <!-- 海量点组件--显示轨迹点 -->
        <!-- <bm-point-collection class="trajectory-points"
            v-for="(item, index) in trajectory.data" :key="'q'+index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_RHOMBUS" color="red"
            size="BMAP_POINT_SIZE_SMALLER">
        </bm-point-collection> -->

        <!-- 标签组件 -->
        <bm-label :content="label.content"
            :position="label.position"
            :labelStyle="{color: 'red', fontSize : '24px'}" title="Hover me"
        >

        </bm-label>
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
        </div>
    </transition>

    <div id="showIcon" @click="flag=!flag">
        <i class="el-icon-circle-close"></i>
    </div>
</div>

</template>

<script>
export default {
    data() {
        return {
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
                time: ''
            },
            // 折线属性
            trajectory: {
                polylinePath: [],
                data: {},
            },
            // 标签属性
            label: {
                content: 'test',
                position: {lng: 116.404, lat: 39.915}
            },
            value1: '',
            color: 'yellow',
            show: false,
            flag: true,
            input: ''
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
                this.data = res.data
                console.log(res.data)
            })
        },
        getDataByMMSI(){
            console.log(this.trajectory.polylinePath)
            let mmsi = this.infoWindow.mmsi
            this.$axios.get('http://localhost:5000/api/get_data_by_mmsi/' + mmsi).then(res => {
                this.trajectory.polylinePath = null
                this.trajectory.data = res.data
                this.trajectory.polylinePath = res.data[0].lnglat
            })
        },
        polylineEvent(e){
            console.log('kaishi')
            console.log(e.point)
        },
        clickPoint(e){
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
                }
            })
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
