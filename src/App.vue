<template>
<div id="main">
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple">AIS数据分析系统</div></el-col>
        <!-- <el-col :span="4"><div class="grid-content bg-purple">导航一</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple-light">导航二</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">导航三</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple-light">导航四</div></el-col> -->
      </el-row>
    </el-header>
    <el-container>
      <!-- sidebar -->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">

              <!-- <span slot="title"></span> -->
          </el-menu-item>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>基础查询</span>
            </template>
            <el-menu-item-group>
              <router-link to="basic_query"><el-menu-item index="2-1">基础查询</el-menu-item></router-link>
              <!-- <router-link to="statistic"><el-menu-item index="2-2">轨迹查询</el-menu-item></router-link>  -->
            </el-menu-item-group>
          </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>聚类分析</span>
              </template>
              <el-menu-item-group>
                <router-link to="/cluster_analysis"><el-menu-item index="3-1">聚类分析</el-menu-item></router-link>
                <router-link to="/point_analysis"><el-menu-item index="3-2">点分析</el-menu-item></router-link>
              </el-menu-item-group>

            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>统计和可视化</span>
              </template>
              <el-menu-item-group>
                <router-link to="/daily_statistic"><el-menu-item index="4-1">每日统计</el-menu-item></router-link>
                <!-- <router-link to="/test"><el-menu-item index="4-2">地图测试2</el-menu-item></router-link> -->
              </el-menu-item-group>
            </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleOpen(key, keyPath){
      console.log(key, keyPath)
    },
    handleClose(key, keyPath){
      console.log(key, keyPath)
    }
  },
}
</script>

<style scoped>
  #main {
    height: 100%;
    padding: 60px 0 0;
    box-sizing: border-box;
    background: #547da3;
  }

  .el-header {
    background-color: #ffd04b;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 60px;
    margin: -60px 0 0;
  }
  .grid-content.bg-purple {
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 5px;
    color: #545c64;
  }
  .el-container.is-vertical {
    width: 100%;
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: left;
    /* line-height: 200px; */
  }
  .el-menu {
    border: 0;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%;
    text-align: center;
    padding: 0 0 0 0;
    border: 1px solid blue;
    /* line-height: 160px; */
  }
  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }

</style>
