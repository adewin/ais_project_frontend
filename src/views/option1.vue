<template>
<div class="container">
    <baidu-map class="map" 
        :zoom="map.zoom" 
        :min-zoom="map.min_zoom" :max-zoom="map.max_zoom" 
        :scroll-wheel-zoom="map.scroll" center="大连">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>

        <bm-point-collection class="bm-points" 
            v-for="(item, index) in data" :key="index"
            :points="item.lnglat" shape="BMAP_POINT_SHAPE_STAR" :color="getColor(item.value)"
            size="BMAP_POINT_SIZE_SMALL"
            @click="clickerHandler">
        </bm-point-collection>
    </baidu-map>
    <transition name="el-zoom-in-top">
        <div v-if="flag" class="operateContainer">
        <el-collapse >
            <el-collapse-item title="数据" name="1">
                <el-input placeholder="请输入内容" v-model="input" clearable=""></el-input>
                <el-button @click="getData">获取数据</el-button>
            </el-collapse-item>
            <el-collapse-item title="参数一" name="2">
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
            // marker 属性
            marker: {
                markerPoint: {lng: 120, lat: 35},
            },
            data: {
            },
            color: 'yellow',
            show: false,
            flag: true,
            input: ''
        }
    },
    methods:{
        getData(){
            this.$axios.get('http://127.0.0.1:5000/api/get_lnglat_by_mmsi').then((res) => {
                console.log(res.data)
                this.data = res.data
            }).catch((err) => {
                
            })
        },
        clickerHandler(e){
            alert(`点的值为`)
        },
        map_event(e){
            console.log(e.target.getCenter())
            console.log(e.target.getZoom())
        },
        infoWindowClose () {
            this.show = false
        },
        infoWindowOpen () {
            this.show = true
        },
        getColor(i){
            // 生成随机颜色
            // '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
            switch (i){
                case -1: return 'black'
                break
                case 1: return 'red'
                break
                case 2: return 'yellow'
                break
                case 3: return 'green'
                break
                case 4: return 'cyan'
            }
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


