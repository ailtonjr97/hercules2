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
          <form-floating :placeholder="'Código:'" :id="'codigo'" :type="'text'" @keyup.enter="pesquisa()" v-model="codigo"></form-floating>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
                <th>Código</th>
                <th>Descrição</th>
                <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="api in apis" :key="api.R_E_C_N_O_">
                <td>{{ api.B1_COD }}</td>
                <td>{{ api.B1_DESC }}</td>
                <td><button title="Ver mais" class="button-8" @click="abrirProdutoModal(api.B1_FILIAL, api.B1_COD)">Ver mais </button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal v-if="produtoModal" :title="`Informações do Produto.`">
      <template v-slot:body>
      <loading v-if="carregandoinfo"></loading>
      <div v-if="!carregandoinfo">
        <div class="row">
          <div class="col-sm-2">
            <form-span :span="'Filial'" :type="'text'" v-model="produtoInfo.B1_FILIAL" readonly></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Código'" :type="'text'" v-model="produtoInfo.B1_COD" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Descrição'" :type="'text'" v-model="produtoInfo.B1_DESC" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col">
            <form-span :span="'Tipo'" :type="'text'" v-model="produtoInfo.B1_TIPO" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Unidade'" :type="'text'" v-model="produtoInfo.B1_UM" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Peso'" :type="'text'" v-model="produtoInfo.B1_PESO" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Peso Bruto'" :type="'text'" v-model="produtoInfo.B1_PESBRU" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Cód. Barras'" :type="'text'" v-model="produtoInfo.B1_CODBAR" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col">
            <form-span :span="'GTIN'" :type="'text'" v-model="produtoInfo.B1_CODGTIN" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Prod. Import'" :type="'text'" v-model="produtoInfo.B1_IMPORT" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Aliq. IPI'" :type="'text'" v-model="produtoInfo.B1_IPI" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Origem'" :type="'text'" v-model="produtoInfo.B1_ORIGEM" readonly></form-span>
          </div>
        </div>
      </div>
      </template>
      <template v-slot:buttons v-if="!carregandoinfo">
          <button class="button-8 mt-2" @click="fecharProdutoModal()">Fechar</button>
      </template>
    </modal>

  </template>
  
  <script>
  import { jwtDecode } from "jwt-decode";
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
        produtoInfo: null,
        produtoModal: false,
        codigo: '',
        popup: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
      };
    },
    methods: {
      async fecharProdutoModal(){
        try {
          this.produtoInfo = null;
          this.produtoModal = false;
        } catch (error) {
          console.log(error)
          alert('Falha ao executar ação. Tente novamente mais tarde.');
          this.carregando = false;
        }
      },
      async abrirProdutoModal(filial, codigo){
        try {
          this.carregandoinfo = true;
          this.produtoModal = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/logistica/produto?filial=${filial}&codigo=${codigo}`, config);
          this.produtoInfo = response.data;
          this.carregandoinfo = false;
        } catch (error) {
          console.log(error)
          alert('Falha ao executar ação. Tente novamente mais tarde.');
          this.carregando = false;
        }
      },
      async pesquisa(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/logistica/produtos/all?codigo=${this.codigo}`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde.');
            this.carregando = false;
        }
      },
      async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/logistica/produtos/all`, config);
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/logistica/produtos/all`, config);
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