<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="abreNovoArquivoModal()">Novo Arquivo</button>
                <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.HOME_ID }}</p>
                </td>
                <td>
                    <a :href="`${ip}/files/${documento.FILENAME}`" target="_blank">{{ documento.ORIGINAL_NAME }}</a>
                </td>
                <td>
                    <p>{{ documento.HOME_CATEGORIA }}</p>
                </td>
                <td>
                    <button class="button-8" title="Inativar" @click="abreExcluirArquivoModal(documento.HOME_ID)"><i style="font-size: 14px;" class="fas fa-trash"></i></button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>

    <modal v-if="excluirArquivoModal" :title="`Inativar arquivo`">
        <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div v-if="!carregandoinfo">
            <div class="row mt-2">
                <h4>Deseja realmente inativar o arquivo {{ nomeArquivoExcluir }}?</h4>
            </div>
        </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8 mt-2" @click="fechaExcluirArquivoModal()">Não</button>
            <button class="button-8 mt-2" @click="confirmaExcluirArquivo()">Sim</button>
        </template>
    </modal>

    <modal v-if="arquivoModal" :title="`Novo arquivo`">
        <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div v-if="!carregandoinfo">
            <div class="row mt-2">
                <input type="file" @change="uploadFile" ref="file">
            </div>
            <div class="row mt-2">
                <span-select :span="'Categoria:'" :options="categoriaOptions" v-model="categoria"></span-select>
            </div>
        </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8 mt-2" @click="fechaNovoArquivoModal()">Fechar</button>
            <button class="button-8 mt-2" @click="salvarArquivo()">Salvar</button>
        </template>
    </modal>
    
</template>
    
    <script>
    import axios from 'axios';
    import { getAuthConfig } from '../auth/authToken';
    import TableTop from '../ui/TableTop.vue';
    import TableSearch from '../ui/TableSearch.vue';
    import Modal from '../ui/Modal.vue';
    import Loading from '../ui/Loading.vue';
    import FormFloating from '../ui/FormFloating.vue';
    import SelectFloating from '../ui/SelectFloating.vue';
    import TextareaFloating from '../ui/TextareaFloating.vue';
    import Popup from '../ui/Popup.vue';
    import AnexFloating from '../ui/AnexFloating.vue';
    import SpanTextarea from '../ui/spanTextarea.vue';
    import FormSpan from '../ui/formSpan.vue';
    import SpanSelect from '../ui/spanSelect.vue';

    const config = getAuthConfig();
    
    export default {
        components: {
            Popup,
            TableTop,
            TableSearch,
            Modal,
            Loading,
            FormFloating,
            SelectFloating,
            TextareaFloating,
            AnexFloating,
            SpanTextarea,
            FormSpan,
            SpanSelect            
        },
        data(){
            return{
                categoria: 'Políticas',
                categoriaOptions: [
                    { valor: "Políticas", descri: 'Políticas' },
                    { valor: "Documentos Padrão", descri: 'Documentos Padrão' },
                    { valor: "Formulários", descri: 'Formulários' },
                    { valor: "Fluxogramas", descri: 'Fluxogramas' },
                    { valor: "Guias", descri: 'Guias' },
                    { valor: "Instrução de Trabalho", descri: 'Instrução de Trabalho' },
                    { valor: "PIP", descri: 'PIP' },
                    { valor: "PIR", descri: 'PIR' },
                    { valor: "Procedimentos", descri: 'Procedimentos' },
                    { valor: "Treinamentos", descri: 'Treinamentos' }
                ],
                excluirId: null,
                nomeArquivoExcluir: '',
                excluirArquivoModal: false,
                obs: '',
                descri: '',
                arquivoModal: false,
                listaArquivos: [],
                images: [],
                ip: import.meta.env.VITE_BACKEND_IP,
                carregando: true,
                documentos: [],
                fullLoad: false,
                modalVerDocumento: false,
                carregandoinfo: false,
                visualizar: {},
                anexos: [],
                user: null,
                popup: false
            }
        },
        methods: {
            async confirmaExcluirArquivo(){
                try {
                    this.carregandoinfo = true;
                    await axios.delete(`${import.meta.env.VITE_BACKEND_IP}/qualidade/anexos-home/${this.excluirId}`, config);
                    this.fechaExcluirArquivoModal();
                    this.carregandoinfo = false;
                    setTimeout(()=>{
                        this.refresh();;
                    }, 500);
                } catch (error) {
                    console.log(error);
                    this.carregandoinfo = false;
                    alert('Falha ao executar ação. Tente novamente mais tarde.');
                }
            },
            async fechaExcluirArquivoModal(){
                try {
                    this.excluirArquivoModal = false;
                    this.nomeArquivoExcluir = '';
                    this.excluirId = null;
                } catch (error) {
                    alert('Falha ao executar ação. Tente novamente mais tarde.')
                    console.log(error);
                    this.excluirArquivoModal = false;
                }
            },
            async abreExcluirArquivoModal(id){
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/anexos-home/${id}`, config);
                    this.nomeArquivoExcluir = response.data[0].ORIGINAL_NAME;
                    this.excluirArquivoModal = true;
                    this.excluirId = id;
                } catch (error) {
                    alert('Falha ao executar ação. Tente novamente mais tarde.')
                    console.log(error);
                    this.excluirArquivoModal = false;
                }
            },
            async uploadFile() {
                this.images = this.$refs.file.files
            },
            async submitFile() {
                for(let i = 0; i < this.images.length; i++){
                    const formData = new FormData();
                    formData.append('file', this.images[i]);
                    formData.append('categoria', this.categoria);
                    const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': document.cookie };
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/anexos-home-arquivo`, formData, { headers });
                }
            },
            async salvarArquivo(){
                try {
                    this.carregandoinfo = true;
                    this.submitFile();
                    this.carregandoinfo = false;
                    this.fechaNovoArquivoModal();
                    setTimeout(()=>{
                        this.refresh();;
                    }, 500);
                } catch (error) {
                    this.carregandoinfo = false;
                    alert('Falha ao executar. Tente novamente mais tarde.')
                    console.log(error);
                }
            },
            async fechaNovoArquivoModal(){
                try {
                    this.arquivoModal = false;
                    this.descri = '';
                    this.obs = '';
                    this.categoria = 'Políticas'
                } catch (error) {
                    console.log(error);
                    this.descri = '';
                    this.obs = '';
                    this.arquivoModal = false;  
                }
            },
            async abreNovoArquivoModal(){
                try {
                    this.arquivoModal = true;
                } catch (error) {
                   console.log(error);
                   this.arquivoModal = false;
                }
            },
            async refresh(){
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/anexos-home`, config);
                    this.documentos = response.data;
                    this.resultados = response.data.length;
                    this.popup = true;
                    setTimeout(()=>{
                        this.popup = false;
                    }, 2000);
                } catch (error) {
                   console.log(error);
                   alert("Falha ao buscar informações. Tente novamente mais tarde.")
                }
            }
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/anexos-home`, config);
                this.user = loggedIn.data[0];
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