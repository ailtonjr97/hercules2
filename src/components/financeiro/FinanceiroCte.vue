<template>
  <popup v-if="popup"></popup>
  <div v-if="carregando" id="loading"></div>
  <div style="overflow: hidden; padding: 0.5%;">
    <table-top class="mb-2" :resultados="resultados">
      <template v-slot:tableButtons>
        <button v-if="!isFirstRequestInProgress" class="button-8" @click="executeRequests">Atualizar</button>
        <button v-if="arquivada == 0" class="button-8" @click="arquivadas(1)">Arquivadas</button>
        <button v-if="arquivada == 1" class="button-8" @click="arquivadas(0)">Abertas</button>
      </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'ID:'"        :id="'id'"       :type="'number'" @keyup.enter="pesquisa()" v-model="filtroId"></form-floating>
        <form-floating :placeholder="'NF:'"        :id="'nf'"       :type="'number'" @keyup.enter="pesquisa()" v-model="filtroNf"></form-floating>
        <form-floating :placeholder="'CTE:'"       :id="'cte'"      :type="'number'" @keyup.enter="pesquisa()" v-model="filtroCte"></form-floating>
        <form-floating :placeholder="'Frete NF:'"  :id="'freteNf'"  :type="'number'" @keyup.enter="pesquisa()" v-model="filtroFreteNf"></form-floating>
        <form-floating :placeholder="'Frete CTE:'" :id="'freteCte'" :type="'number'" @keyup.enter="pesquisa()" v-model="filtroFreteCte"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
      <table class="fl-table" id="myTable">
        <thead>
          <tr style="height: 25px">
            <th>ID</th>
            <th>NF</th>
            <th>CTE</th>
            <th>Frete NF</th>
            <th>Frete CTE</th>
            <th v-if="arquivada == 0">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr :style="{ backgroundColor: api.frete_cte > api.frete_nf ? '#fffacd' : 'initial' }" v-for="api in apis" :key="api.id">
            <td>{{ api.id }}</td>
            <td>{{ api.numero_nf }}</td>
            <td>{{ api.numero_cte }}</td>
            <td>{{ api.frete_nf }}</td>
            <td>{{ api.frete_cte }}</td>
            <td v-if="arquivada == 0"><button title="Arquivar" class="button-8" @click="arquivar(api.id)"><i style="font-size: 14px;" class="fa-solid fa-archive"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
import { getAuthConfig } from '../auth/authToken';
import FormSpan from '../ui/formSpan.vue';
import axios from 'axios';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import Popup from '../ui/Popup.vue';
import SpanSelect from '../ui/spanSelect.vue';
import SpanTextarea from '../ui/spanTextarea.vue';

const config = getAuthConfig();

export default {
  name: 'ComercialOrcamentos',
  components: {
    Popup,
    TableTop,
    TableSearch,
    Modal,
    Loading,
    FormFloating,
    TextareaFloating,
    SelectFloating,
    FormSpan,
    SpanSelect,
    SpanTextarea
  },
  data() {
    return {
      filtroId: '',
      filtroNf: '',
      filtroCte: '',
      filtroFreteNf: '',
      filtroFreteCte: '',
      arquivada: 0,
      isFirstRequestInProgress: false,
      intervalId: null,
      limit: null,
      mostraErro: false,
      novoModal: false,
      popup: false,
      disableBtn: false,
      carregandoinfo: false,
      resultados: 0,
      carregando: true,
      apis: [],
      itemsOrc: [],
      carregandoItemsOrc: false,
      condPagModal: false,
      codPag: null,
      tabPreModal: false,
      tabPre: null
    };
  },
  methods: {
      async pesquisa(){
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, {...config,
              params: {
                  arquivado: this.arquivada,
                  id:        this.filtroId,
                  nf:        this.filtroNf,
                  cte:       this.filtroCte,
                  freteNf:   this.filtroFreteNf,
                  freteCte:  this.filtroFreteCte
              }
          });
          this.apis = response.data;
          this.resultados = response.data.length;
        } catch (error) {
          console.log(error)
          alert('Falha ao executar ação. Tente novamente mais tarde.')
        }
      },
      async arquivadas(arquivada){
          try {
              this.arquivada = arquivada;
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid?arquivado=${arquivada}`, config);
              this.apis = response.data;
              this.resultados = response.data.length;
          } catch (error) {
              alert('Falha ao executar ação. Tente novamente mais tarde.')
          }
      },
      async arquivar(id){
          try {
              await axios.put(`${import.meta.env.VITE_BACKEND_IP}/financeiro/arquiva-cte`, {id: id}, config);
              this.popup = true;
              setTimeout(()=>{
                  this.popup = false;
              }, 2000);
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
              this.apis = response.data;
              this.resultados = response.data.length;
          } catch (error) {
              alert('Falha ao executar ação. Tente novamente mais tarde.')
          }
      },
      async executeFirstRequest() {
          this.isFirstRequestInProgress = true;
          try {
              await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/refresh-cte`, config);
          } catch (error) {
              console.error('Erro na primeira requisição:', error);
          } finally {
              this.isFirstRequestInProgress = false;
              clearInterval(this.intervalId);
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
              this.apis = response.data;
              this.resultados = response.data.length;
              this.popup = true;
              setTimeout(()=>{
                  this.popup = false;
              }, 2000);
          }
          },
          async executeSecondRequest() {
          try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
              this.apis = response.data;
              this.resultados = response.data.length;
          } catch (error) {
              console.error('Erro na segunda requisição:', error);
          }
          },
          startSecondRequestLoop() {
          this.intervalId = setInterval(() => {
              if (this.isFirstRequestInProgress) {
              this.executeSecondRequest();
              }
          }, 1000);
          },
          async executeRequests() {
          this.startSecondRequestLoop();
          await this.executeFirstRequest();
      },
  },
  async created() {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/grid`, config);
      this.apis = response.data;
      this.resultados = response.data.length;
      this.carregando = false;
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar página. Favor tentar mais tarde.");
      this.carregando = false;
    }
  }
};
</script>