<template>
        <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <router-link class="button-8 mb-2" to="/qualidade/documentos">Documento Ativos</router-link>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Tipo Documento:'"></table-search>
            <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Data:'"></table-search>
            <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Inspetor:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Inspetor</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.id }}</p>
                </td>
                <td>
                    <p>{{ documento.tipo_doc }}</p>
                </td>
                <td>
                    <p>{{ documento.data }}</p>
                </td>
                <td>
                    <p>{{ documento.inspetor }}</p>
                </td>
                <td>
                    <button class="button-8" @click="verDocumento(documento.id)">Visualizar</button>
                    <button class="button-8" v-if="documento.anexo != 0" @click="openAnexoModal(documento.id)">Anexos</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>


    <modal v-if="modalVerDocumento" :title="'Visualizar documento'">
    <template v-slot:body>
      <loading v-if="carregandoinfo"></loading>
      <div v-if="!carregandoinfo">
          <div class="row">
              <h3>Qualidade:</h3>
              <form-floating :placeholder="'Data:'" :id="'data'" :type="'date'" v-model="visualizar.data" ></form-floating>
              <form-floating :placeholder="'Inspetor:'" :id="'inspetor'" :type="'text'" v-model="visualizar.inspetor" ></form-floating>
              <form-floating :placeholder="'Código Produto:'" :id="'cod_prod'" :type="'text'" v-model="visualizar.cod_prod" ></form-floating>
              <form-floating :placeholder="'Descrição:'" :id="'descri'" :type="'text'" v-model="visualizar.descri" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <form-floating :placeholder="'Lote/ODF:'" :id="'lote_odf'" :type="'text'" v-model="visualizar.lote_odf" ></form-floating>
              <form-floating :placeholder="'Lance:'" :id="'lance'" :type="'text'" v-model="visualizar.lance" ></form-floating>
              <form-floating :placeholder="'Quantidade Metragem:'" :id="'quantidade_metragem'" :type="'text'" v-model="visualizar.quantidade_metragem" ></form-floating>
              <form-floating :placeholder="'CPNC Número:'" :id="'cpnc_numero'" :type="'text'" v-model="visualizar.cpnc_numero" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <textarea-floating :placeholder="'Motivo da NC:'" :id="'motivo_nc'" v-model="visualizar.motivo_nc" ></textarea-floating>
              <hr class="mt-2">
          </div>
          <div class="row">
              <h3>EDP:</h3>
              <form-floating :placeholder="'Responsável:'" :id="'edp_responsavel'" :type="'text'" v-model="visualizar.edp_responsavel" ></form-floating>
              <form-floating :placeholder="'Data:'" :id="'edp_data'" :type="'date'" v-model="visualizar.edp_data" ></form-floating>
              <form-floating :placeholder="'Tempo Previsto:'" :id="'tempo_previsto'" :type="'text'" v-model="visualizar.tempo_previsto" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <textarea-floating :placeholder="'Motivo da NC:'" :id="'instrucao_reprocesso'" v-model="visualizar.instrucao_reprocesso" ></textarea-floating>
              <hr class="mt-2">
          </div>
          <div class="row">
              <h3>PCP:</h3>
              <form-floating :placeholder="'Responsável:'" :id="'pcp_responsavel'" :type="'text'" v-model="visualizar.pcp_responsavel" ></form-floating>
              <form-floating :placeholder="'Data:'" :id="'pcp_data'" :type="'date'" v-model="visualizar.pcp_data" ></form-floating>
              <form-floating :placeholder="'ODF Retrabalho:'" :id="'pcp_odf_retrabalho'" :type="'text'" v-model="visualizar.pcp_odf_retrabalho" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <textarea-floating :placeholder="'Motivo da NC:'" :id="'instrucao_reprocesso'" v-model="visualizar.instrucao_reprocesso" ></textarea-floating>
              <hr class="mt-2">
          </div>
          <div class="row">
              <h3>Produção:</h3>
              <form-floating :placeholder="'Tempo Realizado:'" :id="'prod_tempo_realizado'" :type="'text'" v-model="visualizar.prod_tempo_realizado" ></form-floating>
              <form-floating :placeholder="'Insumos:'" :id="'prod_insumos'" :type="'text'" v-model="visualizar.prod_insumos" ></form-floating>
              <form-floating :placeholder="'Sucata:'" :id="'prod_sucata'" :type="'text'" v-model="visualizar.prod_sucata" ></form-floating>
          </div>
          <div class="row mt-2">
              <form-floating :placeholder="'Responsável:'" :id="'prod_responsavel'" :type="'text'" v-model="visualizar.prod_responsavel" ></form-floating>
              <form-floating :placeholder="'Data:'" :id="'prod_data'" :type="'date'" v-model="visualizar.prod_data" ></form-floating>
              <form-floating :placeholder="'Status:'" :id="'prod_status'" :type="'text'" v-model="visualizar.prod_status" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <textarea-floating :placeholder="'Observações da Produção:'" :id="'prod_obs'" v-model="visualizar.prod_obs" ></textarea-floating>
              <hr class="mt-2">
          </div>
          <div class="row">
              <h3>Qualidade:</h3>
              <form-floating :placeholder="'Responsável:'" :id="'quali_responsavel'" :type="'text'" v-model="visualizar.quali_responsavel" ></form-floating>
              <form-floating :placeholder="'Data:'" :id="'quali_data'" :type="'date'" v-model="visualizar.quali_data" ></form-floating>
              <form-floating :placeholder="'Status:'" :id="'quali_status'" :type="'text'" v-model="visualizar.quali_status" ></form-floating>
          </div>
          <div class="row mt-2" v-if="!carregandoinfo">
              <textarea-floating :placeholder="'Observações da Qualidade:'" :id="'quali_parecer'" v-model="visualizar.quali_parecer" ></textarea-floating>
              <hr class="mt-2">
          </div>
      </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
          <button class="button-8" @click="closeVerDocumento()">Fechar</button>
    </template>
  </modal>

  <modal v-if="anexosModal" :title="'Anexos:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row mt-2" v-if="!carregandoinfo">
                <div v-for="anexo in listaArquivos" :key="anexo.id" class="col">
                    <a target="__blank" :href="`${ip}/files/${anexo.filename}`">{{ anexo.original_name }}</a>
                </div>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeAnexoModal">Fechar</button>
        </template>
    </modal>
</template>

<script>
import axios from 'axios';

import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import AnexFloating from '../ui/AnexFloating.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default {
    components: {
        TableTop,
        TableSearch,
        Modal,
        Loading,
        FormFloating,
        SelectFloating,
        TextareaFloating,
        AnexFloating
    },
    data(){
        return{
            ip: import.meta.env.VITE_BACKEND_IP,
            listaArquivos: [],
            anexosModal: false,
            modalNc: false,
            carregando: true,
            documentos: [],
            fullLoad: false,
            modalVerDocumento: false,
            carregandoinfo: false,
            visualizar: {},
        }
    },
    methods: {
        async closeVerDocumento(){
            this.modalVerDocumento = false;
        },
        async verDocumento(id){
            try {
                this.carregandoinfo = true;
                this.modalVerDocumento = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/${id}`, config);
                this.visualizar = response.data[0];
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert('Erro ao mostrar documentos. Favor tentar mais tarde.')
                this.carregandoinfo = false
            }
        },
        async openAnexoModal(id){
                try {
                    this.carregandoinfo = true;
                    this.anexosModal = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/anexos-lista/${id}`, config);
                    this.listaArquivos = response.data
                    this.carregandoinfo = false;
                } catch (error) {
                    console.log(error)
                    alert("Falha ao abrir anexos. Favor tentar mais tarde.")
                }
        },
        async closeAnexoModal(){
            this.anexosModal = false;
            this.images = []
        },
    },
    async created(){
        try {
            const config = {
                headers: {
                'Authorization': document.cookie,
                }
            }
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/inactive`, config);
            this.documentos = response.data;
            this.resultados = response.data.length;
            this.fullLoad = true;
            this.carregando = false;
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
    }
}
</script>