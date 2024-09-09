<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
                <th>Tabela</th>
                <th>Atualizar em Massa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>SCJ010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scj-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SCK010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-scK-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SD2010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sd2-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SA1010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SB1010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb1-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SB5010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sb5-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
            </tr>
            <tr>
                <td>SA3010</td>
                <td><button title="Atualizar" class="button-8" @click="atualizarTabela('/local/atualizar-sa3-massa')"><i style="font-size: 16px;" class="fa-solid fa-refresh"></i></button></td>
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