<template>
  <div class="row mt-2" style="margin-left: 0.1%; width: 99.8%;">
    <div class="col">
      <button class="button-8 mb-2" @click="mostraMes()">Quantidade por mês</button>
      <button class="button-8 mb-2" @click="mostraVend()">Quantidade por mês vendedor</button>
    </div>
  </div>

  <div class="row" style="margin-left: 0.1%; width: 98.5%;">
    <div class="col" v-if="mesVer">
      <div ref="chart" style="width: 100%; height: 600px;"></div>
    </div>
    <div class="col-lg-11" v-if="vendVer" style="padding-right: 0;">
      <div ref="orcVend" style="width: 100%; height: 600px;"></div>
    </div>
    <div class="col-lg-1" v-if="vendVer" style="padding-left: 0; padding-right: 0;">
      <button class="button-8 mb-2" @click="alteraVendsB2b()">B2B</button>
      <button class="button-8 mb-2" @click="alteraVendsB2c()">B2C</button>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'EChartsComponent',
  data() {
    return {
      vends: null,
      dados: null,
      mesVer: true,
      vendVer: false,
    };
  },
  mounted() {
    this.mostraMes(); // Chama a função para exibir o gráfico 'mesVer' ao montar o componente
  },
  methods: {
    async alteraVendsB2b() {
      this.vends = [];
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/graficos/orcamentos-quantidade-mes-vend?setor=B2B`,
          {
            headers: {
              Authorization: `jwt=${this.getCookie('jwt')}`,
            },
          }
        );

        response.data.forEach(element => {
          const orcamentos = JSON.parse(element.ORCAMENTOS).map(item => item.total_orcamentos);

          this.vends.push({
            name: element.NOME,
            type: 'bar',
            stack: 'total',
            label: { show: true },
            emphasis: { focus: 'series' },
            data: orcamentos
          });
        });

        // Recria o gráfico com os novos dados
        this.$nextTick(() => this.orcVend()); 

      } catch (error) {
        alert('Falha ao buscar informações. Favor tentar novamente mais tarde.');
      }
    },

    async alteraVendsB2c() {
      this.vends = [];
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_IP}/graficos/orcamentos-quantidade-mes-vend?setor=B2C`,
          {
            headers: {
              Authorization: `jwt=${this.getCookie('jwt')}`,
            },
          }
        );

        response.data.forEach(element => {
          const orcamentos = JSON.parse(element.ORCAMENTOS).map(item => item.total_orcamentos);

          this.vends.push({
            name: element.NOME,
            type: 'bar',
            stack: 'total',
            label: { show: true },
            emphasis: { focus: 'series' },
            data: orcamentos
          });
        });

        // Recria o gráfico com os novos dados
        this.$nextTick(() => this.orcVend());

      } catch (error) {
        alert('Falha ao buscar informações. Favor tentar novamente mais tarde.');
      }
    },
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
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);

      // Limpa o gráfico antes de renderizar novos dados
      myChart.clear();

      try {
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
            data: ['Outubro', 'Setembro', 'Agosto', 'Julho', 'Junho', 'Maio', 'Abril'],
          },
          series: this.vends,
        };

        myChart.setOption(option); // Renderiza o gráfico com os novos dados
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
