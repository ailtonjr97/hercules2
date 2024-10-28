<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
                <th>Tabela</th>
                <th>Atualizar STAMP</th>
                <th>Atualizar em massa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>SCJ - Orcamentos</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scj')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scj-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SCK - Itens de Orcamento</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scK')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scK-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SD2 - Itens de Venda da NF</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sd2')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sd2-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SF2 - Cabecalho das NF de Saida</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sf2')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sf2-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SA1 - Clientes</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa1')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SB1 - Descricao Generica do Produto</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb1')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SB5 - Dados Adicionais do Produto</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb5')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb5-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SA3 - Vendedores</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa3')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa3-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SC5 - Pedidos de Venda</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sc5')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sc5-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>DA0 - Tabela de Precos</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-da0')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-da0-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>DA1 - Itens da Tabela de Precos</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-da1')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-da1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SC1 - Solicitacoes de Compra</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sc1')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sc1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SPZ - Acessos Visitantes</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sbz')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sbz-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SE4 - Condicoes de Pagamento</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-se4')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-se4-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SE1 - Contas a Receber</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-se1')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-se1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SEA - Títulos Enviados ao Banco</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sea')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sea-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SA4 - Transportadoras</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa4')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa4-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SYS_USR - Usuários</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sysusr')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
        carregando: false,
        apis: [],
      };
    },
    methods: {
        async atualizarTabela(caminho){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP + caminho}`, config);
                this.carregando = false;
            } catch (error) {
                this.carregando = false;
                console.log(error)
            }
        }
    }
  };
  </script>