<template>
    <div ref="chart" style="width: 100%; height: 700px;"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  

  export default {
    name: 'EChartsComponent',
    mounted() {
      this.initChart();
    },
    data(){
      return{
        dados: null,
      }
    },
    methods: {
      async initChart() {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
        const config = {
            headers: {
            'Authorization': `jwt=${getCookie('jwt')}`,
            }
        }

        const chartDom = this.$refs.chart;
        const myChart = echarts.init(chartDom);
  
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/graficos/orcamentos-quantidade-mes`, config);

        let meses = []
        response.data.forEach(element => {
          meses.push(element.ano_mes);
        });

        let valores = []
        response.data.forEach(element => {
          valores.push(element.total_registros);
        });

        const option = {
          title: {
        text: 'Quantidade de orçamentos por mês'
          },
          tooltip: {},
          xAxis: {
            data: meses
          },
          yAxis: {},
          series: [{
            type: 'bar',
            data: valores
          }]
        };
  
        myChart.setOption(option);
      }
    },
  };
  </script>
  