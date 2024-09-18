<template>
  <div class="row mt-2" style="margin-left: 0.1%; width: 99.8%;">
    <div class="col">
      <button class="button-8 mb-2" @click="mostraMes()">Quantidade por mês</button>
      <button class="button-8 mb-2" @click="mostraVend()">Quantidade por mês vendedor</button>
    </div>
  </div>

  <div v-if="mesVer" ref="chart" style="width: 100%; height: 600px;"></div>
  <div v-if="vendVer" ref="orcVend" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'EChartsComponent',
  data() {
    return {
      dados: null,
      mesVer: true,
      vendVer: false,
    };
  },
  mounted() {
    this.mostraMes(); // Chama a função para exibir o gráfico 'mesVer' ao montar o componente
  },
  methods: {
    async mostraMes() {
      try {
        this.mesVer = true;
        this.vendVer = false;
        this.$nextTick(() => this.initChart()); // Inicializa o gráfico após garantir que o DOM foi atualizado
      } catch (error) {
        alert('Falha ao buscar informações. Favor tentar novamente mais tarde.');
      }
    },
    async mostraVend() {
      try {
        this.mesVer = false;
        this.vendVer = true;
        this.$nextTick(() => this.orcVend()); // Inicializa o gráfico após garantir que o DOM foi atualizado
      } catch (error) {
        alert('Falha ao buscar informações. Favor tentar novamente mais tarde.');
      }
    },
    async initChart() {
      const chartDom = this.$refs.chart;
      if (!chartDom) return; // Verifica se o elemento existe

      const myChart = echarts.init(chartDom);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/graficos/orcamentos-quantidade-mes`,
          {
            headers: {
              Authorization: `jwt=${this.getCookie('jwt')}`,
            },
          }
        );

        const meses = response.data.map((element) => element.ano_mes);
        const valores = response.data.map((element) => element.total_registros);

        const option = {
          title: {
            text: 'Quantidade de orçamentos por mês',
          },
          tooltip: {},
          xAxis: {
            data: meses,
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              data: valores,
            },
          ],
        };

        myChart.setOption(option);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    async orcVend() {
      const chartDom = this.$refs.orcVend;
      if (!chartDom) return; // Verifica se o elemento existe

      const myChart = echarts.init(chartDom);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/graficos/orcamentos-quantidade-mes-vend`,
          {
            headers: {
              Authorization: `jwt=${this.getCookie('jwt')}`,
            },
          }
        );

        const vends = [];
        response.data.forEach(element => {
          // Extrai os valores de ORCAMENTOS (que é um JSON array de números)
          const orcamentos = JSON.parse(element.ORCAMENTOS).map(item => item.total_orcamentos);

          vends.push({
            name: element.NOME,
            type: 'bar',
            stack: 'total',
            label: { show: true },
            emphasis: { focus: 'series' },
            data: orcamentos // Coloca os números dos orçamentos no campo 'data'
          });
        });

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {},
          grid: {
            top: '10%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: ['Setembro', 'Agosto', 'Julho', 'Junho', 'Maio', 'Abril'],
          },
          series: vends,
        };

        myChart.setOption(option);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },
  },
};
</script>
