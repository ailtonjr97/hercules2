<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
      <table-top class="mb-2" :resultados="resultados">
        <template v-slot:tableButtons>
          <button class="button-8" @click="refresh()">Atualizar</button>
        </template>
      </table-top>
      <div class="row mb-2">
          <form-floating :placeholder="'Número:'" :id="'numero'" :type="'number'" @keyup.enter="pesquisa(numero)" v-model="numero"></form-floating>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
                <th>Filial</th>
                <th>Número</th>
                <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr :style="{ backgroundColor: api.frete_cte > api.frete_nf ? '#fffacd' : 'initial' }" v-for="api in apis" :key="api.R_E_C_N_O_">
                <td>{{ api.F2_FILIAL }}</td>
                <td>{{ api.F2_DOC }}</td>
                <td>
                  
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </template>
  
  <script>
  import { getAuthConfig, getAuthConfig2 } from '../auth/authToken';
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
  const config2 = getAuthConfig2();
  
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
        numero: '',
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
        async refresh(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/guia-nf`, config);
                this.apis = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                console.log(error)
                alert('Falha ao executar ação. Tente novamente mais tarde.');
                this.carregando = false;
            }
        },
        async pesquisa(numero){
          try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/guia-nf?numero=${numero}`, config);
                this.apis = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
          } catch (error) {
                console.log(error)
                alert('Falha ao executar ação. Tente novamente mais tarde.');
                this.carregando = false;
          }
        },
    },
    async created() {
      try {
        const config = getAuthConfig();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/guia-nf`, config);
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