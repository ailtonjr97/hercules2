<template>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
<!--                <button class="button-8 mb-2" @click="abrirModalNovoDocumento">Novo Documento</button>-->
                <router-link to="/qualidade/minuta-retrabalho/arquivados" class="button-8">Arquivados</router-link>
                <button class="button-8 mb-2" @click="pageRefresh">Atualizar</button>
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
                <th>Produto</th>
                <th>Linha Produtiva</th>
                <th>Status</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.ID }}</p>
                </td>
                <td>
                    <p>{{ documento.TIPO_DOC }}</p>
                </td>
                <td>
                    <p>{{ documento.DATA }}</p>
                </td>
                <td>
                    <p>{{ documento.INSPETOR }}</p>
                </td>
                <td>
                    <p>{{ documento.COD_PROD }}</p>
                </td>
                <td>
                    <p>{{ documento.LINHA_PRODUTIVA }}</p>
                </td>
                <td>
                    <p v-if="documento.EDP_PREENCHIDO == 0">Aguardando EDP</p>
                    <p v-if="documento.PCP_PREENCHIDO == 0 && documento.EDP_PREENCHIDO == 1">Aguardando PCP</p>
                    <p v-if="documento.PCP_PREENCHIDO == 1 && documento.PRODUCAO_PREENCHIDO == 0">Aguardando Produção</p>
                    <p v-if="documento.PRODUCAO_PREENCHIDO == 1 && documento.QUALIDADE_PREENCHIDO == 0">Aguardando Qualidade</p>
                    <p v-if="documento.MOTIVO_NC_PREENCHIDO == 0">Aguardando Motivo NC</p>
                    <p v-if="documento.EDP_PREENCHIDO == 1 && documento.PCP_PREENCHIDO == 1 && documento.PRODUCAO_PREENCHIDO == 1 && documento.QUALIDADE_PREENCHIDO == 1 && documento.MOTIVO_NC_PREENCHIDO == 1">Pronto para arquivar</p>
                </td>
                <td>
                    <button class="button-8" @click="verDocumento(documento.ID)">Visualizar</button>
<!--                    <button class="button-8" @click="openModalEdp(documento.ID)" v-if="(documento.EDP_PREENCHIDO == 0 && userSetor == 'Engenharia de Processos') || intranetId == 843 || intranetId == 765 || intranetId == 391">Preencher EDP</button>-->
<!--                    <button class="button-8" @click="openModalPcp(documento.ID)" v-if="documento.EDP_PREENCHIDO == 1 && documento.PCP_PREENCHIDO == 0 && userSetor == 'PCP'">Preencher PCP</button>-->
<!--                    <button class="button-8" @click="openModalProducao(documento.ID)" v-if="documento.PCP_PREENCHIDO == 1 && documento.PRODUCAO_PREENCHIDO == 0 && userSetor == 'Producao'">Preencher Produção</button>-->
<!--                    <button class="button-8" @click="openModalQualidade(documento.ID)" v-if="(documento.PRODUCAO_PREENCHIDO == 1 && documento.QUALIDADE_PREENCHIDO == 0 && userSetor == 'Qualidade') || intranetId == 391">Preencher Qualidade</button>-->
<!--                    <button class="button-8" @click="openModalNc(documento.ID)" v-if="documento.MOTIVO_NC_PREENCHIDO == 0">Motivo NC</button>-->
                    <button class="button-8" @click="inactivateDocument(documento.ID)" v-if="documento.EDP_PREENCHIDO == 1 && documento.PCP_PREENCHIDO == 1 && documento.PRODUCAO_PREENCHIDO == 1 && documento.QUALIDADE_PREENCHIDO == 1 && documento.MOTIVO_NC_PREENCHIDO == 1">Arquivar</button>
                    <button class="button-8" @click="inactivateDocument(documento.ID)" v-if="intranetId == 1 || intranetId == 326 || intranetId == 545">Arquivar Agora</button>
                    <button class="button-8" v-if="documento.ANEXO != 0" @click="openAnexoModal(documento.ID)">Anexos</button>
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
                <form-floating :placeholder="'Data:'" :id="'data'" :type="'date'" v-model="visualizar.DATA" ></form-floating>
                <form-floating :placeholder="'Inspetor:'" :id="'inspetor'" :type="'text'" v-model="visualizar.INSPETOR" ></form-floating>
                <form-floating :placeholder="'Código Produto:'" :id="'cod_prod'" :type="'text'" v-model="visualizar.COD_PROD" ></form-floating>
                <form-floating :placeholder="'Descrição:'" :id="'descri'" :type="'text'" v-model="visualizar.DESCRI" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <form-floating :placeholder="'Lote/ODF:'" :id="'lote_odf'" :type="'text'" v-model="visualizar.LOTE_ODF" ></form-floating>
                <form-floating :placeholder="'Lance:'" :id="'lance'" :type="'text'" v-model="visualizar.LANCE" ></form-floating>
                <form-floating :placeholder="'Quantidade Metragem:'" :id="'quantidade_metragem'" :type="'text'" v-model="visualizar.QUANTIDADE_METRAGEM" ></form-floating>
                <form-floating :placeholder="'CPNC Número:'" :id="'cpnc_numero'" :type="'text'" v-model="visualizar.CPNC_NUMERO" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Motivo da NC:'" :id="'motivo_nc'" v-model="visualizar.MOTIVO_NC" ></textarea-floating>
                <hr class="mt-2">
            </div>
            <div class="row">
                <h3>EDP:</h3>
                <form-floating :placeholder="'Responsável:'" :id="'edp_responsavel'" :type="'text'" v-model="visualizar.EDP_RESPONSAVEL" ></form-floating>
                <form-floating :placeholder="'Data:'" :id="'edp_data'" :type="'date'" v-model="visualizar.EDP_DATA" ></form-floating>
                <form-floating :placeholder="'Tempo Previsto:'" :id="'tempo_previsto'" :type="'text'" v-model="visualizar.TEMPO_PREVISTO" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Instrução de reprocesso:'" :id="'instrucao_reprocesso'" v-model="visualizar.INSTRUCAO_REPROCESSO" ></textarea-floating>
                <hr class="mt-2">
            </div>
            <div class="row">
                <h3>PCP:</h3>
                <form-floating :placeholder="'Responsável:'" :id="'pcp_responsavel'" :type="'text'" v-model="visualizar.PCP_RESPONSAVEL" ></form-floating>
                <form-floating :placeholder="'Data:'" :id="'pcp_data'" :type="'date'" v-model="visualizar.PCP_DATA" ></form-floating>
                <form-floating :placeholder="'ODF Retrabalho:'" :id="'pcp_odf_retrabalho'" :type="'text'" v-model="visualizar.PCP_ODF_RETRABALHO" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Observações do PCP:'" :id="'instrucao_reprocesso'" v-model="visualizar.PCP_OBS" ></textarea-floating>
                <hr class="mt-2">
            </div>
            <div class="row">
                <h3>Produção:</h3>
                <form-floating :placeholder="'Tempo Realizado:'" :id="'prod_tempo_realizado'" :type="'text'" v-model="visualizar.PROD_TEMPO_REALIZADO" ></form-floating>
                <form-floating :placeholder="'Insumos:'" :id="'prod_insumos'" :type="'text'" v-model="visualizar.PROD_INSUMOS" ></form-floating>
                <form-floating :placeholder="'Sucata:'" :id="'prod_sucata'" :type="'text'" v-model="visualizar.PROD_SUCATA" ></form-floating>
            </div>
            <div class="row mt-2">
                <form-floating :placeholder="'Responsável:'" :id="'prod_responsavel'" :type="'text'" v-model="visualizar.PROD_RESPONSAVEL" ></form-floating>
                <form-floating :placeholder="'Data:'" :id="'prod_data'" :type="'date'" v-model="visualizar.PROD_DATA" ></form-floating>
                <form-floating :placeholder="'Status:'" :id="'prod_status'" :type="'text'" v-model="visualizar.PROD_STATUS" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Observações da Produção:'" :id="'prod_obs'" v-model="visualizar.PROD_OBS" ></textarea-floating>
                <hr class="mt-2">
            </div>
            <div class="row">
                <h3>Qualidade:</h3>
                <form-floating :placeholder="'Responsável:'" :id="'quali_responsavel'" :type="'text'" v-model="visualizar.QUALI_RESPONSAVEL" ></form-floating>
                <form-floating :placeholder="'Data:'" :id="'quali_data'" :type="'date'" v-model="visualizar.QUALI_DATA" ></form-floating>
                <form-floating :placeholder="'Status:'" :id="'quali_status'" :type="'text'" v-model="visualizar.QUALI_STATUS" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Observações da Qualidade:'" :id="'quali_parecer'" v-model="visualizar.QUALI_PARECER" ></textarea-floating>
                <hr class="mt-2">
            </div>
        </div>
      </template>
      <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeVerDocumento()">Fechar</button>
      </template>
    </modal>
    
    <modal v-if="modalNovoDocumento" :title="'Novo Documento:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <form-floating :placeholder="'Data:'" :id="'data'" :type="'date'" v-model="criar.data"></form-floating>
                <select-floating :placeholder="'Inspetores'" :id="'inspetor'" :options="inspetores" v-model="criar.inspetor"></select-floating>
                <form-floating :placeholder="'Código Produto:'" :id="'cod_prod'" :type="'text'" v-model="criar.cod_prod" ></form-floating>
                <form-floating :placeholder="'Descrição:'" :id="'descri'" :type="'text'" v-model="criar.descri" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <form-floating :placeholder="'Lote/ODF:'" :id="'lote_odf'" :type="'text'" v-model="criar.lote_odf" ></form-floating>
                <form-floating :placeholder="'Lance:'" :id="'lance'" :type="'text'" v-model="criar.lance" ></form-floating>
                <form-floating :placeholder="'Quantidade Metragem:'" :id="'quantidade_metragem'" :type="'text'" v-model="criar.quantidade_metragem" ></form-floating>
                <form-floating :placeholder="'CPNC Número:'" :id="'cpnc_numero'" :type="'text'" v-model="criar.cpnc_numero" ></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalNovoDocumento">Fechar</button>
            <button class="button-8" @click="enviarNovoDocumento">Salvar</button>
        </template>
    </modal>
    
    <modal v-if="modalEdp" :title="'EDP:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <select-floating :placeholder="'Responsável:'" :id="'edp_responsavel'" :options="edp_responsaveis" v-model="modalEdpBody.edp_responsavel"></select-floating>
                <form-floating :placeholder="'Data:'" :id="'edp_data'" :type="'date'" v-model="modalEdpBody.edp_data"></form-floating>
                <form-floating :placeholder="'Tempo Previsto:'" :id="'tempo_previsto'" :type="'text'" v-model="modalEdpBody.tempo_previsto"></form-floating>
                <form-floating :placeholder="'Linha Produtiva:'" :id="'linha_produtiva'" :type="'text'" v-model="modalEdpBody.linha_produtiva"></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Instrução de Reprocesso:'" :id="'instrucao_reprocesso'" v-model="modalEdpBody.instrucao_reprocesso"></textarea-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalEdp">Fechar</button>
            <button class="button-8" @click="enviarEdp">Executar</button>
        </template>
    </modal>

    <modal v-if="modalPcp" :title="'PCP:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <select-floating :placeholder="'Responsável:'" :id="'pcp_responsavel'" :options="pcp_responsaveis" v-model="modalPcpBody.pcp_responsavel"></select-floating>
                <form-floating :placeholder="'Data:'" :id="'pcp_data'" :type="'date'" v-model="modalPcpBody.pcp_data"></form-floating>
                <form-floating :placeholder="'ODF Retrabalho:'" :id="'pcp_odf_retrabalho'" :type="'text'" v-model="modalPcpBody.pcp_odf_retrabalho"></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Observações PCP:'" :id="'pcp_obs'" v-model="modalPcpBody.pcp_obs"></textarea-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalPcp">Fechar</button>
            <button class="button-8" @click="enviarPcp">Executar</button>
        </template>
    </modal>

    <modal v-if="modalProducao" :title="'Produção:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <form-floating :placeholder="'Tempo Realizado:'" :id="'prod_tempo_realizado'" :type="'text'" v-model="modalProducaoBody.prod_tempo_realizado"></form-floating>
                <form-floating :placeholder="'Insumos:'" :id="'prod_insumos'" :type="'text'" v-model="modalProducaoBody.prod_insumos"></form-floating>
                <form-floating :placeholder="'Sucata:'" :id="'prod_sucata'" :type="'text'" v-model="modalProducaoBody.prod_sucata"></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <select-floating :placeholder="'Responsável:'" :id="'prod_responsavel'" :options="producao_responsaveis" v-model="modalProducaoBody.prod_responsavel"></select-floating>
                <form-floating :placeholder="'Data:'" :id="'prod_data'" :type="'date'" v-model="modalProducaoBody.prod_data"></form-floating>
                <select-floating :placeholder="'Status:'" :id="'prod_status'" :options="[{valor: 'OK', descri: 'OK'}, {valor: 'Nao OK', descri: 'Nao OK'}, {valor: 'N/A', descri: 'N/A'}]" v-model="modalProducaoBody.prod_status"></select-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Observações da Produção:'" :id="'pcp_obs'" v-model="modalProducaoBody.prod_obs"></textarea-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalProducao">Fechar</button>
            <button class="button-8" @click="enviarProducao">Executar</button>
        </template>
    </modal>

    <modal v-if="modalQualidade" :title="'Qualidade:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <select-floating :placeholder="'Responsável:'" :id="'quali_responsavel'" :options="qualidade_responsaveis" v-model="modalQualidadeBody.quali_responsavel"></select-floating>
                <form-floating :placeholder="'Data:'" :id="'quali_data'" :type="'date'" v-model="modalQualidadeBody.quali_data"></form-floating>
                <select-floating :placeholder="'Status:'" :id="'quali_status'" :options="[{valor: 'OK', descri: 'OK'}, {valor: 'Nao OK', descri: 'Nao OK'}, {valor: 'N/A', descri: 'N/A'}]" v-model="modalQualidadeBody.quali_status"></select-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Parecer da Qualidade:'" :id="'quali_parecer'" v-model="modalQualidadeBody.quali_parecer"></textarea-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalQualidade">Fechar</button>
            <button class="button-8" @click="enviarQualidade">Executar</button>
        </template>
    </modal>

    <modal v-if="modalNc" :title="'Motivo NC:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row mt-2" v-if="!carregandoinfo">
                <textarea-floating :placeholder="'Preencher motivo NC:'" :id="'motivo_nc'" v-model="modalNcBody.motivo_nc"></textarea-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <input type="file" @change="uploadFile" ref="file" multiple>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="closeModalNc">Fechar</button>
            <button class="button-8" @click="enviarNc">Executar</button>
        </template>
    </modal>

    <modal v-if="anexosModal" :title="'Anexos:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row mt-2" v-if="!carregandoinfo">
                <div class="col">
                    <div v-for="anexo in listaArquivos" :key="anexo.id" class="col">
                        <a :href="`${ip}/files/${anexo.FILENAME}`" target="_blank">{{ anexo.ORIGINAL_NAME }}</a>
                    </div>
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
    import { getAuthConfig } from '../auth/authToken';
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const config = {
        headers: {
        'Authorization': `jwt=${getCookie('jwt')}`,
        }
    }

    const config2 = getAuthConfig();
    
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
                intranetId: null,
                listaArquivos: [],
                images: [],
                ip: import.meta.env.VITE_BACKEND_IP,
                anexosModal: false,
                userSetor: null,
                whereId: null,
                modalEdp: false,
                modalPcp: false,
                modalProducao: false,
                modalQualidade: false,
                modalNovoDocumento: false,
                modalNc: false,
                carregando: true,
                documentos: [],
                fullLoad: false,
                modalVerDocumento: false,
                carregandoinfo: false,
                visualizar: {},
                inspetores: [],
                edp_responsaveis: [],
                pcp_responsaveis: [],
                producao_responsaveis: [],
                qualidade_responsaveis: [],
                anexos: [],
                criar: {
                    data: '',
                    inspetor: '',
                    cod_prod: '',
                    descri: '',
                    lote_odf: '',
                    lance: '',
                    quantidade_metragem: '',
                    cpnc_numero: '',
                },
                modalEdpBody: {
                    tempo_previsto: '',
                    instrucao_reprocesso: '',
                    edp_responsavel: '',
                    edp_data: '',
                    linha_produtiva: ''
                },
                modalPcpBody: {
                    pcp_odf_retrabalho: '',
                    pcp_responsavel: '',
                    pcp_data: '',
                    pcp_obs: ''
                },
                modalProducaoBody: {
                    prod_tempo_realizado: '',
                    prod_insumos: '',
                    prod_sucata: '',
                    prod_obs: '',
                    prod_responsavel: '',
                    prod_data: '',
                    prod_status: ''
                },
                modalQualidadeBody: {
                    quali_parecer: '',
                    quali_responsavel: '',
                    quali_data: '',
                    quali_status: '',
                },
                modalNcBody: {
                    motivo_nc: '',
                },
            }
        },
        methods: {
            async uploadFile() {
                this.images = this.$refs.file.files
            },
            async submitFile() {
                for(let i = 0; i < this.images.length; i++){
                    const formData = new FormData();
                    formData.append('file', this.images[i]);
                    const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': document.cookie };
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/anexos/${this.whereId}`, formData, { headers });
                }
                this.pageRefresh();
            },
            async submitFileCriar(id) {
                try {
                    for(let i = 0; i < this.images.length; i++){
                        const formData = new FormData();
                        formData.append('file', this.images[i]);
                        const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': document.cookie };
                        await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/anexos/${id}`, formData, { headers });
                    }
                    this.pageRefresh();
                } catch (error) {
                    console.log(error)
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
            async inactivateDocument(id){
                try {
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/inactivate/${id}`, config);
                    this.pageRefresh();
                } catch (error) {
                    console.log(error)
                    alert("Falha ao arquivar documento. Favor tentar mais tarde.")
                }
            },
            async openModalEdp(id){
                try {
                    this.whereId = id;
                    this.carregandoinfo = true;
                    this.modalEdp = true;
                    const config = {
                        headers: {
                        'Authorization': document.cookie,
                        }
                    }
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores?setor=Engenharia de Processos`, config);
                    response.data.forEach(element => {
                        this.edp_responsaveis.push({descri: element.name, valor: element.name})
                    });
                    this.carregandoinfo = false;
                } catch (error) {
                    console.log(error);
                    alert("Erro ao abrir modal do EDP.")
                    this.carregandoinfo = false;
                }
            },
            async closeModalEdp(){
                this.modalEdp = false;
                this.edp_responsaveis = [];
            },
            async enviarEdp(){
                try {
                    const config = {
                        headers: {
                        'Authorization': document.cookie,
                        }
                    }
                    this.closeModalEdp();
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarEdp/${this.whereId}`, this.modalEdpBody, config);
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/email-setor/PCP/${this.whereId}`, config);
                    this.submitFile();
                } catch (error) {
                    console.log(error)
                    alert("Falha ao preenchar campos do EDP.");
                    this.carregando = false;
                }
            },
            async openModalNc(id){
                try {
                    this.whereId = id;
                    this.modalNc = true;
                } catch (error) {
                    alert("Erro ao abrir modal da NC.")
                    this.carregandoinfo = false;
                }
            },
            async closeModalNc(){
                this.modalNc = false;
            },
            async enviarNc(){
                try {
                    this.closeModalNc();
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarNc/${this.whereId}`, this.modalNcBody, config);
                    this.submitFile();
                } catch (error) {
                    alert("Falha ao preenchar campos da NC.");
                    this.carregando = false;
                }
            },
            async openModalQualidade(id){
                try {
                    this.whereId = id;
                    this.carregandoinfo = true;
                    this.modalQualidade = true;
                    const config = {
                        headers: {
                        'Authorization': document.cookie,
                        }
                    }
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores?setor=Qualidade`, config);
                    response.data.forEach(element => {
                        this.qualidade_responsaveis.push({descri: element.name, valor: element.name})
                    });
                    this.carregandoinfo = false;
                } catch (error) {
                    console.log(error);
                    alert("Erro ao abrir modal da Qualidade.")
                    this.carregandoinfo = false;
                }
            },
            async closeModalQualidade(){
                this.modalQualidade = false;
                this.qualidade_responsaveis = [];
            },
            async enviarQualidade(){
                try {
                    this.closeModalQualidade();
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarQualidade/${this.whereId}`, this.modalQualidadeBody, config);
                    this.submitFile();
                } catch (error) {
                    console.log(error)
                    alert("Falha ao preenchar campos da Qualidade.");
                    this.carregando = false;
                }
            },
            async openModalPcp(id){
                this.whereId = id;
                this.carregandoinfo = true;
                this.modalPcp = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores?setor=PCP`, config);
                response.data.forEach(element => {
                    this.pcp_responsaveis.push({descri: element.name, valor: element.name})
                });
                this.carregandoinfo = false;
            },
            async enviarPcp(){
                try {
                    this.closeModalPcp();
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarPcp/${this.whereId}`, this.modalPcpBody, config);
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/email-setor/Producao/${this.whereId}`, config);
                    this.submitFile();
                } catch (error) {
                    console.log(error)
                    alert("Falha ao preenchar campos do PCP.");
                    this.carregando = false;
                }
            },
            async closeModalPcp(){
                this.modalPcp = false;
                this.pcp_responsaveis = [];
            },
            async enviarProducao(){
                try {
                    this.closeModalProducao();
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/editarProducao/${this.whereId}`, this.modalProducaoBody, config);
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/email-setor/Qualidade/${this.whereId}`, config);
                    this.submitFile();
                } catch (error) {
                    console.log(error)
                    alert("Falha ao preenchar campos da Produção.");
                    this.carregando = false;
                }
            },
            async openModalProducao(id){
                this.whereId = id;
                this.carregandoinfo = true;
                this.modalProducao = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores?setor=Producao`, config);
                response.data.forEach(element => {
                    this.producao_responsaveis.push({descri: element.name, valor: element.name})
                });
                this.carregandoinfo = false;
            },
            async closeModalProducao(){
                this.modalProducao = false;
                this.producao_responsaveis = [];
            },
            async pageRefresh(){
                try {
                    this.carregando = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/get_all`, config);
                    this.documentos = response.data;
                    this.resultados = response.data.length;
                    this.fullLoad = true;
                    this.carregando = false;
                    var self = this;
                    Object.keys(this.criar).forEach(function(key, index) {
                        self.criar[key] = '';
                    });
                    Object.keys(this.modalEdpBody).forEach(function(key, index) {
                        self.modalEdpBody[key] = '';
                    });
                    Object.keys(this.modalPcpBody).forEach(function(key, index) {
                        self.modalPcpBody[key] = '';
                    });
                    Object.keys(this.modalProducaoBody).forEach(function(key, index) {
                        self.modalProducaoBody[key] = '';
                    });
                    Object.keys(this.modalQualidadeBody).forEach(function(key, index) {
                        self.modalQualidadeBody[key] = '';
                    });
                    Object.keys(this.modalNcBody).forEach(function(key, index) {
                        self.modalNcBody[key] = '';
                    });
                    this.images = []
                } catch (error) {
                   console.log(error)
                   alert("Falha ao carregar página.");
                   this.carregando = false;
                }
            },
            async closeVerDocumento(){
                this.modalVerDocumento = false;
            },
            async closeModalNovoDocumento(){
                this.modalNovoDocumento = false;
                this.inspetores = [];
            },
            async enviarNovoDocumento(){
                try {
                    this.closeModalNovoDocumento();
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/create`, this.criar, config);
                    if(response.status == 200){
                        const id = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/ultimo-documento`, config);
                        if(id.status == 200){
                            await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/email-setor/Engenharia de Processos/${id.data.ID}`, config);
                        }
                        this.submitFileCriar(id.data.ID);
                    }else{
                        console.log(error)
                        alert('Erro ao criar documento. Favor tentar mais tarde.')
                    }
                } catch (error) {
                    console.log(error)
                    alert('Erro ao criar documento. Favor tentar mais tarde.')
                }
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
            async abrirModalNovoDocumento(){
                try {
                    this.carregandoinfo = true;
                    this.modalNovoDocumento ? this.modalNovoDocumento = false : this.modalNovoDocumento = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/inspetores?setor=Qualidade`, config);
                    response.data.forEach(element => {
                        this.inspetores.push({descri: element.name})
                    });
                    this.carregandoinfo = false;
                } catch (error) {
                    console.log(error)
                    alert('Erro ao procurar inspetores. Favor tentar mais tarde.')
                    this.carregandoinfo = false
                }
            },
        },
        async created(){
            try {
                function getCookie(name) {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                }
                const config = {
                    headers: {
                    'Authorization': `jwt=${getCookie('jwt')}`,
                    }
                }
                const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
                this.userSetor = loggedIn.data[0].setor;
                this.intranetId = loggedIn.data[0].intranet_id;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/documentos/get_all`, config);
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

<style scoped>
    table {
         table-layout: auto;
    }
     table th {
        z-index: 1;
        resize: none;
        overflow: hidden;
    }
    
    table td{
        overflow: hidden;
    }
</style>