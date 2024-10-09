<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
      <table-top :resultados="resultados">
        <template v-slot:tableButtons>
          <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
        </template>
      </table-top>
      <div class="row mb-2">
        <div class="col">
          <form-floating :placeholder="'Filial:'" :id="'filial'" :type="'number'" @keyup.enter="pesquisa()" v-model="filial"></form-floating>
        </div>
        <div class="col">
          <form-floating :placeholder="'Número:'" :id="'numero'" :type="'number'" @keyup.enter="pesquisa()" v-model="numero"></form-floating>
        </div>
        <div class="col">
          <form-floating :placeholder="'Cliente:'" :id="'cliente'" :type="'text'" @keyup.enter="pesquisa()" v-model="cliente"></form-floating>
        </div>
        <div class="col">
          <form-floating :placeholder="'Vendedor:'" :id="'vendedor'" :type="'text'" @keyup.enter="pesquisa()" v-model="vendedor"></form-floating>
        </div>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
              <th>Filial</th>
              <th>Número</th>
              <th>Emissão</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="api in apis" :key="api.R_E_C_N_O_">
              <td>{{ api.C5_FILIAL }}</td>
              <td>{{ api.C5_NUM }}</td>
              <td>{{ api.C5_EMISSAO }}</td>
              <td>{{ api.A1_NOME }}</td>
              <td>{{ api.A3_NREDUZ }}</td>
              <td>
                <button title="Detalhes" class="button-8" @click="abrirPedidoModal(api.C5_FILIAL, api.C5_NUM)">
                  <i style="font-size: 14px;" class="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <modal v-if="pedidoModal" :title="`Detalhes do Pedido:`">
      <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div v-if="!carregandoinfo">
          <div class="row">
            <div class="col">
              <button class="button-8 mb-2" @click="mostraPedido()">Pedido</button>
              <button class="button-8 mb-2" @click="mostraOutros()">Outros</button>
            </div>
          </div>
          <div class="row mt-2" v-if="optionsPedidos">
            <div class="col">
              <form-span :span="'Filial'" :type="'text'" v-model="info.C5_FILIAL" readonly></form-span>
            </div>
            <div class="col">
              <form-span :span="'Número'" :type="'text'" v-model="info.C5_NUM" readonly></form-span>
            </div>
          </div>
          <div v-if="!carregandoItemsPed && optionsPedidos" class="table-wrapper table-responsive table-striped mt-4">
            <table class="fl-table" id="myTable">
              <thead>
                <tr style="height: 25px">
                  <th>Número</th>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Unidade</th>
                  <th>Quantidade</th>
                  <th>Preço de Venda</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsGrid" :key="item.C6_ITEM">
                  <td>{{ item.C6_ITEM }}</td>
                  <td>{{ item.C6_PRODUTO }}</td>
                  <td>{{ item.C6_DESCRI }}</td>
                  <td>{{ item.C6_UM }}</td>
                  <td>{{ item.C6_QTDVEN }}</td>
                  <td>{{ item.C6_PRCVEN }}</td>
                  <td>{{ item.C6_VALOR }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-slot:buttons>
        <button class="button-8 mt-2" @click="pedidoModal = false;">Fechar</button>
      </template>
    </modal>  
  
    <modal v-if="modalPadrao" :title="modalPadraoTitle">
      <template v-slot:body>
        <loading v-if="carregandoInfoModal"></loading>
        <div v-if="!carregandoInfoModal">
          <div class="row">
            <div v-for="(item, index) in modalPadraoItem" class="col-md-3 mt-2">
              <form-span :span="modalPadraoDescritivos[index]" :type="'text'" v-model="computedModalPadraoItems[index]" readonly></form-span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:buttons v-if="!carregandoInfoModal">
        <button class="button-8 mt-2" @click="modalPadrao = false">Fechar</button>
      </template>
    </modal>
  
  </template>
  
  <script>
  import { computed } from 'vue';
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
        carregandoInfoModal: false,
        modalPadraoDescritivos: null,
        modalPadraoTitle: '',
        modalPadraoItem: null,
        modalPadrao: false,
        //0=Não aplica;1=Presencial;2=Não Presencial,Net;3=Não Presencial,Teleatend.;5=Presencial,Fora do Estab.;9=Não Presencial,Outros  
        indPres: [                                                                              
          { valor: "0", descri: '0 - Não aplica' },
          { valor: "1", descri: '1 - Presencial' },
          { valor: "2", descri: '2 - Não Presencial,Net' },
          { valor: "3", descri: '3 - Não Presencial,Teleatend.' },
          { valor: "5", descri: '5 - Presencial,Fora do Estab.' },
          { valor: "9", descri: '9 - Não Presencial,Outros ' },
        ],
        tipoCarga: [                                                                              
          { valor: "1", descri: '1 - Utiliza' },
          { valor: "2", descri: '2 - Nao utiliza' },
          { valor: "3", descri: '3 - Utiliza sem unitizacao  ' },
        ],
        tipoCliente: [
          { valor: "F", descri: 'F - Cons.Final' },
          { valor: "L", descri: 'L - Prod.Rural' },
          { valor: "R", descri: 'R - Revendedor' },
          { valor: "S", descri: 'S - Solidario' },
          { valor: "X", descri: 'X - Exportacao/Importacao'},
        ],
        tpLiberacao: [
          { valor: "1", descri: '1 - Libera por Item' },
          { valor: "2", descri: '2 - Libera por Pedido' },
        ],
        tiposFrete: [
          { valor: "C", descri: 'C - CIF' },
          { valor: "F", descri: 'F - FOB' },
        ],
        nomCli: '',
        clienteItems: null,
        clienteModal: false,
        vendedor: '',
        loja: '',
        cj_emissao: '',
        nome_cliente: '',
        optionsPedidos: true,
        optionsOutros: false,
        info: null,
        titulo: '',
        pedidoModal: false,
        mostraErro: false,
        textoPad: '',
        filial: '',
        numero: '',
        dt_emissao: '',
        cliente: '',
        limit: null,
        mostraErro: false,
        novoModal: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
        itemsGrid: [],
        carregandoItemsPed: false,
        condPagModal: false,
        codPag: null,
        tabPreModal: false,
        tabPre: null
      };
    },
    computed: {
      computedModalPadraoItems: {
        get() {
          return this.modalPadraoItem;
        },
        set(newValue) {
          this.modalPadraoItem = newValue;
        }
      }
    },
    methods: {
      async openModalPadrao(title, api, descritivos) {
        try {
          this.modalPadraoDescritivos = descritivos;
          this.modalPadraoTitle = title;
          this.modalPadrao = true;
          this.carregandoInfoModal = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}${api}`, config);
          this.modalPadraoItem = response.data;
          this.carregandoInfoModal = false;
        } catch (error) {
          this.carregandoInfoModal = false;
          if (error.response.status == 404) {
            alert('Nenhum resultado encontrado.');
          } else {
            alert('Falha ao executar ação. Tente novamente mais tarde');
          }
        }
      },
      async mostraPedido() {
        try {
          this.optionsPedidos = true;
          this.optionsOutros = false;
        } catch (error) {
          console.error(error);
        }
      },
      async mostraOutros() {
        try {
          this.optionsPedidos = false;
          this.optionsOutros = true;
        } catch (error) {
          console.error(error);
        }
      },
      async abrirPedidoModal(C5_FILIAL, C5_NUM) {
        try {
          this.pedidoModal = true;
          this.carregandoinfo = true;
          this.carregandoItemsPed = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedido-info?filial=${C5_FILIAL}&numero=${C5_NUM}`, config);
          this.info = response.data;
          this.carregandoinfo = false;
          const items = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedido-items?filial=${C5_FILIAL}&numero=${C5_NUM}`, config);
          this.itemsGrid = items.data;
          this.carregandoItemsPed = false;
        } catch (error) {
          console.log(error);
          alert('Falha ao executar ação. Tente novamente mais tarde');
        }
      },
      async pesquisa() {
        try {
          this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos?filial=${this.filial}&numero=${this.numero}&cliente=${this.cliente}&vendedor=${this.vendedor}`, config);
          this.apis = response.data;
          this.resultados = response.data.length;
          this.carregando = false;
        } catch (error) {
          this.carregando = false;
          if (error.response?.status == 404) {
            this.apis = [];
            this.resultados = 0;
          } else {
            alert('Falha ao executar ação. Tente novamente mais tarde.');
          }
        }
      },
      async refresh() {
        try {
          this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos`, config);
          this.apis = response.data;
          this.resultados = response.data.length;
          this.carregando = false;
        } catch (error) {
          alert('Falha ao executar ação. Tente novamente mais tarde.');
        }
      }
    },
    async created() {
      try {
        const config = getAuthConfig();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/pedidos`, config);
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
  
  <style scoped>
  /* Seus estilos aqui */
  </style>
  