<template>
  <baidu-map class="map" :zoom="5" :center="{lng: 116.404, lat: 39.915}" @ready="setDistanceToolInstance">
    <bm-control>
      <button @click="openDistanceTool">开启测距</button>
    </bm-control>
  </baidu-map>
</template>

<script>
import DistanceTool from 'bmaplib.distancetool'

export default {
  unmount () {
    distanceTool && distanceTool.close()
  },
  methods: {
    setDistanceToolInstance ({map}) {
      this.distanceTool = new DistanceTool(map, {lineStroke : 2})
    },
    openDistanceTool (e) {
      const {distanceTool} = this
      distanceTool && distanceTool.open()
    }
  }
}
</script>

<style scoped>
.map {
    width: 100%;
    height: 100%;
}
</style>
