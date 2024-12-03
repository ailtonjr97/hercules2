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
            <th>Dt. Emissao Orc.</th>
            <th>Orçamento</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="api in apis" :key="api.R_E_C_N_O_">
            <td>{{ api.CJ_FILIAL }}</td>
            <td>{{ api.CJ_EMISSAO }}</td>
            <td>{{ api.CJ_NUM }}</td>
            <td style="width: 50px;">{{ api.A1_NOME }}</td>
            <td style="width: 50px;">{{ api.A3_NREDUZ }}</td>
            <td>
              <button title="Detalhes" class="button-8" @click="abrirOrcamentoModal(api.CJ_FILIAL, api.CJ_NUM, api.CJ_CLIENTE, api.CJ_LOJA, api.A1_NOME)">
                Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <modal v-if="orcamentoModal" :title="`Detalhes do Orçamento:`">
    <template v-slot:body>
      <loading v-if="carregandoinfo"></loading>
      <div v-if="!carregandoinfo">
        <div class="row">
          <div class="col">
            <button class="button-8 mb-2" @click="mostraOrcamento()">Orçamento</button>
            <button class="button-8 mb-2" @click="mostraOutros()">Outros</button>
          </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
          <div class="col">
            <form-span :span="'Número'" :type="'text'" v-model="orcamento.CJ_NUM" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'DT Emissão'" :type="'date'" v-model="orcamento.CJ_EMISSAO" readonly></form-span>
          </div>
          <div class="col d-flex justify-content-evenly">
            <form-span :span="'Cliente'" :type="'text'" v-model="orcamento.CJ_CLIENTE" readonly></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Clientes', `/consulta/cliente?filial=${orcamento.CJ_FILIAL}&cliente=${orcamento.CJ_CLIENTE}&loja=${orcamento.CJ_LOJA}`, ['Código', 'Loja', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col">
            <form-span :span="'Loja'" :type="'text'" v-model="orcamento.CJ_LOJA" readonly></form-span>
          </div>
          <div class="col">
            <form-span :span="'Cliente Entr'" :type="'text'" v-model="orcamento.CJ_CLIENT" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
          <div class="col-sm-2">
            <form-span :span="'Loja Entrega'" :type="'text'" v-model="orcamento.CJ_LOJAENT" readonly></form-span>
          </div>
          <div class="col-sm-2 d-flex justify-content-evenly">
            <form-span :span="'Cond.Pagto'" :type="'text'" v-model="orcamento.CJ_CONDPAG" readonly></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Condição de Pagamento', `/consulta/cond-pag?cod=${orcamento.CJ_CONDPAG}`, ['Tipo', 'Descrição', 'Código'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-lg-6">
            <form-span :span="'Nome Cliente'" :type="'text'" v-model="nomCli" readonly></form-span>
          </div>
          <div class="col-sm-2 d-flex justify-content-evenly">
            <form-span :span="'Tabela'" :type="'text'" v-model="orcamento.CJ_TABELA" readonly></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Tabela de Preço', `/consulta/tab-preco?cod=${orcamento.CJ_TABELA}&filial=${orcamento.CJ_FILIAL}`, ['Código', 'Descrição'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="row mt-2" v-if="optionsOrcamentos">
          <div class="col-sm-2">
            <span-select :span="'Tipo Frete'" :options="tiposFrete" v-model="orcamento.CJ_TPFRETE"></span-select>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Redespacho'" :type="'text'" v-model="orcamento.CJ_XREDESP" readonly></form-span>
          </div>
          <div class="col-sm-2 d-flex justify-content-evenly">
            <form-span :span="'Vendedor 1'" :type="'text'" v-model="orcamento.CJ_XVEND1" readonly></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Vendedor', `/consulta/vendedor?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XVEND1}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-md-3">
            <span-select :span="'Tp Liberação'" :options="tpLiberacao" v-model="orcamento.CJ_TIPLIB"></span-select>
          </div>
          <div class="col-sm-2">
            <form-span :span="'UF Cliente'" :type="'text'" v-model="orcamento.CJ_XESTADO" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOrcamentos">
          <div class="col-sm-2">
            <form-span :span="'PEDIDO KORP'" :type="'text'" v-model="orcamento.CJ_XPVKORP" readonly></form-span>
          </div>
          <div class="col-sm-2">
            <span-select :span="'Tipo Cliente'" :options="tipoCliente" v-model="orcamento.CJ_TIPOCLI"></span-select>
          </div>
          <div class="col-md-4">
            <form-span :span="'DESC TABELA'" :type="'text'" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOrcamentos">
          <div class="col-md-4">
            <form-span :span="'Nome Vend'" :type="'text'" v-model="orcamento.A3_NOME" readonly></form-span>
          </div>
          <div class="col-md-4">
            <form-span :span="'Frete + Imp.'" :type="'text'" v-model="orcamento.CJ_XFREIMP" readonly></form-span>
          </div>
          <div class="col-md-4">
            <form-span :span="'Dt. Validade'" :type="'date'" v-model="orcamento.CJ_VALIDA" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOrcamentos">
          <span-textarea :span="'Observacao'" :altura="50" v-model="orcamento.CJ_XOBS"></span-textarea>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Prazo Real'" :type="'date'" v-model="orcamento.CJ_XENTREG"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Frete Cot.'" :type="'text'" v-model="orcamento.CJ_CST_FTS" readonly></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Vlr. Frete'" :type="'text'" v-model="orcamento.CJ_XFREMA" readonly></form-span>
          </div>
          <div class="col-sm-3 d-flex justify-content-evenly">
            <form-span :span="'Transp. Simu'" :type="'text'" v-model="orcamento.CJ_XTRANSP" readonly></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Transportadora', `/consulta/transportadora?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XTRANSP}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Simu. Frete'" :type="'text'" v-model="orcamento.CJ_XFRESIM" readonly></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Desconto 1'" :type="'text'" v-model="orcamento.CJ_DESC1"></form-span>
          </div>
          <div class="col-sm-3">
            <form-span :span="'Cotação/Ped.'" :type="'text'" v-model="orcamento.CJ_COTCLI"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Frete'" :type="'text'" v-model="orcamento.CJ_FRETE"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Seguro'" :type="'text'" v-model="orcamento.CJ_SEGURO"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Despesa'" :type="'text'" v-model="orcamento.CJ_DESPESA"></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Frete Auton.'" :type="'text'" v-model="orcamento.CJ_FRETAUT"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Moeda'" :type="'text'" v-model="orcamento.CJ_MOEDA"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Filial Venda'" :type="'text'"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Filial Entr.'" :type="'text'"></form-span>
          </div>
          <div class="col-sm-2">
            <span-select :span="'Carga'" :options="tipoCarga" v-model="orcamento.CJ_TPCARGA"></span-select>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Indenizacao'"  :type="'text'" v-model="orcamento.CJ_DESCONT"></form-span>
          </div>
          <div class="col-sm-3">
            <form-span :span="'Log usuario'"  :type="'text'" v-model="orcamento.CJ_LOGUSL"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Usuário Incl'" :type="'text'" v-model="orcamento.CJ_XUSRINC"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Percentual'"   :type="'text'" v-model="orcamento.CJ_XPERCEN"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Proposta No.'" :type="'text'" v-model="orcamento.CJ_PROPOST"></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Val. Percent'"  :type="'text'" v-model="orcamento.CJ_XVALPER"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Forma Pgto.'"  :type="'text'" v-model="orcamento.CJ_XFORMA"></form-span>
          </div>
          <div class="col-md-5">
            <form-span :span="'Mot. Rejeita'"  :type="'text'" v-model="orcamento.CJ_XMOTREJ"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Oportunidade'"  :type="'text'" v-model="orcamento.CJ_NROPOR"></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-3 d-flex justify-content-evenly">
            <form-span :span="'Vendedor 2'"  :type="'text'" v-model="orcamento.CJ_XVEND2"></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Vendedor', `/consulta/vendedor?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XVEND2}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Usuario Lib.'"  :type="'text'" v-model="orcamento.CJ_XUSRLIB"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Revisao Op.'"  :type="'text'" v-model="orcamento.CJ_REVISA"></form-span>
          </div>
          <div class="col-sm-3 d-flex justify-content-evenly">
            <form-span :span="'Vendedor 3'"  :type="'text'" v-model="orcamento.CJ_XVEND3"></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Vendedor', `/consulta/vendedor?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XVEND3}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Taxa Moeda'"  :type="'text'" v-model="orcamento.CJ_TXMOEDA"></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-3 d-flex justify-content-evenly">
            <form-span :span="'Vendedor 4'"   :type="'text'" v-model="orcamento.CJ_XVEND4"></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Vendedor', `/consulta/vendedor?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XVEND4}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-sm-3">
            <span-select :span="'Presença Com'" :options="indPres" v-model="orcamento.CJ_INDPRES"></span-select>
          </div>
          <div class="col-sm-2 d-flex justify-content-evenly">
            <form-span :span="'Vendedor 5'"   :type="'text'" v-model="orcamento.CJ_XVEND5"></form-span>
            <button style="margin-left: 1%;" class="button-8" @click="openModalPadrao('Vendedor', `/consulta/vendedor?filial=${orcamento.CJ_FILIAL}&codigo=${orcamento.CJ_XVEND5}`, ['Código', 'Nome'])">
              <i style="font-size: 16px;" class="fas fa-search"></i>
            </button>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Cód. Interme'" :type="'text'" v-model="orcamento.CJ_CODA1U"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Perc. Adian.'" :type="'text'" v-model="orcamento.CJ_XFINPCD"></form-span>
          </div>
        </div>
        <div class="row mt-2"  v-if="optionsOutros">
          <div class="col-sm-2">
            <form-span :span="'Prospect'"  :type="'text'" v-model="orcamento.CJ_PROSPE"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Loja Prosp.'"  :type="'text'" v-model="orcamento.CJ_LOJPRO"></form-span>
          </div>
          <div class="col-sm-2">
            <form-span :span="'Vlr. Adian'"  :type="'text'" v-model="orcamento.CJ_XFINVLD"></form-span>
          </div>
        </div>
        <div class="row mt-2">
          <loading v-if="carregandoItemsOrc && optionsOrcamentos"></loading>
        </div>
        <div v-if="!carregandoItemsOrc && optionsOrcamentos" class="table-wrapper table-responsive table-striped mt-4">
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
              <tr v-for="item in itemsOrc" :key="item.CK_ITEM">
                <td>{{ item.CK_ITEM }}</td>
                <td>{{ item.CK_PRODUTO }}</td>
                <td>{{ item.CK_DESCRI }}</td>
                <td>{{ item.CK_UM }}</td>
                <td>{{ item.CK_QTDVEN }}</td>
                <td>{{ item.CK_PRCVEN }}</td>
                <td>{{ item.CK_VALOR }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button-8 mt-2" @click="orcamentoModal = false;">Fechar</button>
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
      optionsOrcamentos: true,
      optionsOutros: false,
      orcamento: null,
      titulo: '',
      orcamentoModal: false,
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
      itemsOrc: [],
      carregandoItemsOrc: false,
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
    async mostraOrcamento() {
      try {
        this.optionsOrcamentos = true;
        this.optionsOutros = false;
      } catch (error) {
        console.error(error);
      }
    },
    async mostraOutros() {
      try {
        this.optionsOrcamentos = false;
        this.optionsOutros = true;
      } catch (error) {
        console.error(error);
      }
    },
    async abrirOrcamentoModal(CJ_FILIAL, CJ_NUM, CJ_CLIENTE, CJ_LOJA, A1_NOME) {
      try {
        this.orcamentoModal = true;
        this.carregandoinfo = true;
        this.carregandoItemsOrc = true;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamento-info?filial=${CJ_FILIAL}&numero=${CJ_NUM}&cliente=${CJ_CLIENTE}&loja=${CJ_LOJA}`, config);
        this.nomCli = A1_NOME;
        this.orcamento = response.data;
        this.carregandoinfo = false;
        const items = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamento-items?filial=${CJ_FILIAL}&numero=${CJ_NUM}`, config);
        this.itemsOrc = items.data;
        this.carregandoItemsOrc = false;
      } catch (error) {
        console.log(error);
        alert('Falha ao executar ação. Tente novamente mais tarde');
      }
    },
    async pesquisa() {
      try {
        this.carregando = true;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos?filial=${this.filial}&numero=${this.numero}&cliente=${this.cliente}&vendedor=${this.vendedor}`, config);
        this.apis = response.data;
        this.resultados = response.data.length;
        this.carregando = false;
      } catch (error) {
        this.carregando = false;
        if (error.response.status == 404) {
          this.apis = [];
          this.resultados = 0;
        } else {
          alert('Falha ao executar ação. Tente novamente mais tarde');
        }
      }
    },
    async refresh() {
      try {
        this.carregando = true;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
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
