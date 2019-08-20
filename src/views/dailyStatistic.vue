<template>
  <div class="hello">
    <div id="time_input">
      <p>分析时间(北京时间): 
        <el-date-picker
          v-model="time_range"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          default-value="2017-08-09 16:00:00"
          :default-time="['16:00:00', '17:00:00']">
        </el-date-picker>
        <el-button plain @click='getStat'>分析</el-button>
      </p>
    </div>
    <div id="charts_view">
      <chart ref="chart1" :options="option1" :auto-resize="true"></chart>
      <chart :options='option2' ></chart>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      option1: {
        title: {
          text: '每日船舶数量统计'
        },
        xAxis: {
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      option2: {},
      time_range: [new Date(2017, 7, 9, 16, 0), new Date(2017, 7, 10, 16, 10)]
    }
  },
  mounted() {
    // this.orgOptions = {
    //     xAxis: {
    //         type: 'category',
    //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //     },
    //     yAxis: {
    //         type: 'value'
    //     },
    //     series: [{
    //         data: [820, 932, 901, 934, 1290, 1330, 1320],
    //         type: 'line',
    //         smooth: true
    //     }]
    // }
    this.option2 = {
      title: {
        text: 'aaa',
        subtext: '动态数据',
        x:'center'
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar',
          smooth: true
      }]
    }
  },
  methods: {
    getStat(){
      this.$axios.get('http://localhost:5000/api/get_daily_statistic/').then(res => {
        // console.log(res.data)
        // res.data.forEach(el => {
        //   this.option1.series.data.push(el)
        // })
        Object.keys(res.data).forEach( key => {
          console.log(key, res.data[key])
          this.option1.series[0].data.push(res.data[key])
        })
      })
    }
  }
}
</script>
<style scoped>
#charts_view {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>