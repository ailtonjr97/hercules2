<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="abrirNovaEntidade">Nova Entidade</button>
                <button class="button-8 mb-2" @click="pageRefresh">Atualizar</button>
                <button class="button-8 mb-2" @click="showInactives" v-if="!inactive">Inativos</button>
                <button class="button-8 mb-2" @click="showActives" v-if="inactive">Ativos</button>
            </template>
        </table-top>
        <div class="row mb-2">
            <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
            <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome:'"></table-search>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5" v-if="!inactive">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="documento in documentos" :key="documento.id">
                <td>
                    <p>{{ documento.id }}</p>
                </td>
                <td>
                    <p>{{ documento.nome }}</p>
                </td>
                <td>
                    <button class="button-8 mb-2" @click="abrirNovoDocumento(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-file-circle-plus"></i></button>
                    <button class="button-8" @click="openAnexoModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-folder-open"></i></button>
                    <button class="button-8" @click="openEditarModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button>
                    <button class="button-8" @click="openEmailModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-envelope"></i></button>
                    <button class="button-8" @click="openInativarModal(documento.id)"><i style="font-size: 14px;" class="fa-solid fa-ban"></i></button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5" v-if="inactive">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="inactive in inactives" :key="inactive.id">
                <td>
                    <p>{{ inactive.id }}</p>
                </td>
                <td>
                    <p>{{ inactive.nome }}</p>
                </td>
                <td>
                    <button class="button-8 mb-2" @click="reactivateUser(inactive.id)"><i style="font-size: 14px;" class="fa-solid fa-check"></i></button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    
<modal v-if="novaEntidade" :title="'Nova Entidade:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo">
            <select-floating :placeholder="'Natureza:'" :id="'natureza'" :options="[{valor: 'Pessoa Física', descri: 'Pessoa Física'}, {valor: 'Pessoa Jurídica', descri: 'Pessoa Jurídica'}, {valor: 'Outros', descri: 'Outros'}]" v-model="criar.natureza"></select-floating>
            <select-floating :placeholder="'Regime:'" :id="'regime'" :options="[{valor: 'CLT', descri: 'CLT'}, {valor: 'Estágio', descri: 'Estágio'}, {valor: 'Terceiro', descri: 'Terceiro'}, {valor: 'Fornecedor', descri: 'Fornecedor'}, {valor: 'Transportadora', descri: 'Transportadora'}, {valor: 'Outros', descri: 'Outros'}]" v-model="criar.regime"></select-floating>
            <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="criar.nome"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Endereço:'" :id="'endereco'" :type="'text'" v-model="criar.endereco"></form-floating>
            <form-floating :placeholder="'Número:'" :id="'endereco_numero'" :type="'text'" v-model="criar.endereco_numero"></form-floating>
            <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="criar.bairro"></form-floating>
            <form-floating :placeholder="'Cidade:'" :id="'cidade'" :type="'text'" v-model="criar.cidade"></form-floating>
            <select-floating :placeholder="'País:'" :id="'pais'" :options="paises" v-model="criar.pais"></select-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'E-mail:'" :id="'email'" :type="'email'" v-model="criar.email"></form-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharNovaEntidade">Fechar</button>
        <button class="button-8" @click="enviarNovaEntidade">Executar</button>
    </template>
</modal>

<modal v-if="novoDocumento" :title="'Novo Documento:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row" v-if="!carregandoinfo" style="text-align: center;">
            <input v-if="images == 0" style="width: 100%; height: 250px;" type="file" id="images" @change="uploadFile" ref="file" multiple>
            <div v-if="images != 0" id="carouselExampleIndicators" class="carousel slide" data-bs-interval="false" style="border-radius: 5px">
                <ol class="carousel-indicators">
                    <li v-for="(imagem, idx) in images" :key="idx" :class="{ 'active': idx==0 }" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="idx"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item" v-for="(imagem, idx) in images" :key="idx" :class="{ 'active': idx==0 }">
                        <div class="row">
                            <div class="col-lg-8">
                                <embed class="preview" :src="imagem.source" style="width: 100%; height: 600px;">
                            </div>
                            <div class="col-lg-4">
                                <form-floating :placeholder="'Título:'" :id="'titulo'" :type="'text'" v-model="anexoInfoTitulo[idx]"></form-floating>
                                <textarea-floating :altura="'200'" class="mt-2" :placeholder="'Descritivo:'" :id="'descri'" v-model="anexoInfoDescritivo[idx]" ></textarea-floating>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev" style="left: 1%; width: 5%; height: 20%; top: 50%;">
                    <img src="/images/setaEsq.png" alt="" style="width: 100%;">
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next" style="left: 95%; width: 5%; height: 20%; top: 50%;">
                    <img src="/images/setaEsq.png" alt="" style="width: 100%; transform: rotate(180deg); color: white;">
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="refazerDocumentos">Refazer</button>
        <button class="button-8" @click="fecharNovoDocumento">Fechar</button>
        <button class="button-8" @click="submitFile">Executar</button>
    </template>
</modal>

<modal v-if="anexosModal" :title="'Documentos:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row mt-2" v-if="!carregandoinfo">
            <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table mb-3" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>ID</th>
                <th>Nome</th>
                <th>Título</th>
                <th>Descritivo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="anexo in listaArquivos" :key="anexo.id">
                <td>
                    <p>{{ anexo.id }}</p>
                </td>
                <td>
                    <a target="__blank" :href="`${ip}/files/${anexo.filename}`">{{ anexo.original_name }}</a>
                </td>
                <td>
                    <p>{{ anexo.rh_docs_titulo }}</p>
                </td>
                <td>
                    <p>{{ anexo.rh_docs_descritivo }}</p>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeAnexoModal">Fechar</button>
    </template>
</modal>

<modal v-if="visualizarModal" :title="'Visualizar informações:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Natureza:'" :id="'natureza'" :type="'text'" v-model="listaVisualizar.natureza" ></form-floating>
            <form-floating :placeholder="'Regime:'" :id="'regime'" :type="'text'" v-model="listaVisualizar.regime" ></form-floating>
            <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="listaVisualizar.nome" ></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Endereço:'" :id="'endereco'" :type="'text'" v-model="listaVisualizar.endereco" ></form-floating>
            <form-floating :placeholder="'Número:'" :id="'endereco_numero'" :type="'number'" v-model="listaVisualizar.endereco_numero" ></form-floating>
            <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="listaVisualizar.bairro" ></form-floating>
            <form-floating :placeholder="'Cidade:'" :id="'cidade'" :type="'text'" v-model="listaVisualizar.cidade" ></form-floating>
            <form-floating :placeholder="'País:'" :id="'pais'" :type="'text'" v-model="listaVisualizar.pais" ></form-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeVisualizarModal">Fechar</button>
    </template>
</modal>

<modal v-if="editarModal" :title="'Informações da entidade:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row mt-2" v-if="!carregandoinfo">
            <chosen-select-floating :descritivoEscolhido="natureza.descritivoEscolhido" :valorEscolhido="natureza.valorEscolhido" :options="[{valor: 'Pessoa Física', descri: 'Pessoa Física'}, {valor: 'Pessoa Jurídica', descri: 'Pessoa Jurídica'}, {valor: 'Outros', descri: 'Outros'}]" v-model="editar.natureza" :placeholder="'Natureza:'" :id="'natureza'"></chosen-select-floating>
            <chosen-select-floating :descritivoEscolhido="regime.descritivoEscolhido" :valorEscolhido="regime.valorEscolhido" :options="[{valor: 'CLT', descri: 'CLT'}, {valor: 'Estágio', descri: 'Estágio'}, {valor: 'Terceiro', descri: 'Terceiro'}, {valor: 'Fornecedor', descri: 'Fornecedor'}, {valor: 'Transportadora', descri: 'Transportadora'}, {valor: 'Outros', descri: 'Outros'}]" v-model="editar.regime" :placeholder="'Regime:'" :id="'regime'"></chosen-select-floating>
            <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="editar.nome"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'Endereço:'" :id="'endereco'" :type="'text'" v-model="editar.endereco"></form-floating>
            <form-floating :placeholder="'Número:'" :id="'endereco_numero'" :type="'text'" v-model="editar.endereco_numero"></form-floating>
            <form-floating :placeholder="'Bairro:'" :id="'bairro'" :type="'text'" v-model="editar.bairro"></form-floating>
            <form-floating :placeholder="'Cidade:'" :id="'cidade'" :type="'text'" v-model="editar.cidade"></form-floating>
            <chosen-select-floating :descritivoEscolhido="pais.descritivoEscolhido" :valorEscolhido="pais.valorEscolhido" :options="paises" v-model="editar.pais" :placeholder="'País:'" :id="'pais'"></chosen-select-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo">
            <form-floating :placeholder="'E-mail:'" :id="'email'" :type="'text'" v-model="editar.email"></form-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="closeEditarModal">Fechar</button>
        <button class="button-8" @click="enviarEditar">Editar</button>
    </template>
</modal>

<modal v-if="inativarModal" :title="'Inativar entidade:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <h1>{{ entidadeParaInativar }}</h1>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharInativarModal">Não</button>
        <button class="button-8" @click="enviarInativar">Sim</button>
    </template>
</modal>

<modal v-if="emailModal" :title="'Requisição de documento por email:'">
    <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <div class="row mt-2" v-if="!carregandoinfo">
            <chosen-select-floating :options="[{valor: 'RG', descri: 'RG'}, {valor: 'CPF', descri: 'CPF'}, {valor: 'CNH', descri: 'CNH'}]" :placeholder="'Documento:'" :id="'emailSolicit'" v-model="emailSolicit"></chosen-select-floating>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharEmailModal">Fechar</button>
        <button class="button-8" @click="enviarEmail">Enviar</button>
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
import Popup from '../ui/Popup.vue';
import ChosenSelectFloating from '../ui/ChosenSelectFloating.vue'

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

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
        ChosenSelectFloating
    },
    data(){
        return{
            emailSolicit: '',
            emailModal: false,
            inactive: false,
            inactives: [],
            entidadeParaInativar: '',
            inativarModal: false,
            natureza: {valorEscolhido: '', descritivoEscolhido: ''},
            naturezaOptions: [],
            regime: {valorEscolhido: '', descritivoEscolhido: ''},
            regimeOptions: [],
            pais: {valorEscolhido: '', descritivoEscolhido: ''},
            editarModal: false,
            listaVisualizar: {},
            visualizarModal: false,
            ip: import.meta.env.VITE_BACKEND_IP,
            anexosModal: false,
            whereId: null,
            selectedFiles: [],
            images: [],
            popup: false,
            paises: [],
            novaEntidade: false,
            novoDocumento: false,
            carregando: true,
            documentos: [],
            fullLoad: false,
            carregandoinfo: false,
            criar: {
                natureza: '',
                regime: '',
                nome: '',
                endereco: '',
                endereco_numero: '',
                bairro: '',
                cidade: '',
                pais: '',
                email: ''
            },
            anexoInfoTitulo:[],
            anexoInfoDescritivo:[],
            editar: {
                natureza: {},
                regime: {},
                nome: '',
                endereco: '',
                endereco_numero: '',
                bairro: '',
                cidade: '',
                pais: {},
                email: ''
            }
        }
    },
    methods: {
        async fecharEmailModal(){
            try {
                this.emailSolicit = '';
                this.emailModal = false
            } catch (error) {
                alert("Erro ao fechar modal.");
            }
        },
        async enviarEmail(){
            try {
                this.emailModal = false;
                this.carregando = true;
                console.log(this.emailSolicit == '')
                if(!this.emailSolicit == ''){
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/entidade/${this.whereId}`, config);
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/email/${response.data[0].email}/${this.emailSolicit}`, config);
                    this.pageRefresh();
                }else{
                    alert("Favor escolher um documento");
                    this.carregando = false;
                    this.emailModal = true;
                }
            } catch (error) {
                console.log(error);
                alert("Erro ao enviar e-mail ou campo e-mail do usuário vazio. Favor tentar mais tarde.");
                this.emailModal = false;
                this.emailSolicit = '';
                this.carregando = false;
            }
        },
        async openEmailModal(id){
            try {
                this.carregandoinfo = true;
                this.emailModal = true
                this.whereId = id
                this.carregandoinfo = false;
            } catch (error) {
                this.emailModal = false;
                alert("Erro ao abrir modal de e-mail. Favor tentar mais tarde.");
            }
        },
        async reactivateUser(id){
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/ativar-entidade/${id}`, config);
                this.pageRefresh();
                this.inactive = false;
            } catch (error) {
                alert("Erro ao reativar usuário.")
            }
        },
        async showActives(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/get_all`, config);
                this.documentos = response.data;
                this.resultados = response.data.length;
                this.inactives = [];
                this.inactive = false;
                this.carregando = false;
            } catch (error) {
              alert("Erro ao mostrar lista de usuários ativos.")  
            }
        },
        async showInactives(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/inactive`, config);
                this.inactives = response.data;
                this.inactive = true;
                this.carregando = false;  
            } catch (error) {
              alert("Erro ao mostrar lista de usuários inativos.")  
            }
        },
        async openInativarModal(id){
            try {
                this.carregandoinfo = true;
                this.inativarModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/entidade/${id}`, config);
                this.whereId = id;
                this.entidadeParaInativar = response.data[0].nome;
                this.carregandoinfo = false;
            } catch (error) {
                this.inativarModal = false;
                alert("Erro ao tentar abrir modal")
            }
        },
        async enviarInativar(){
            try {
                this.carregando = true;
                this.inativarModal = false;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/inativar-entidade/${this.whereId}`, config);
                this.pageRefresh();
                this.entidadeParaInativar = '';
            } catch (error) {
                this.inativarModal = false;
                alert("Erro ao tentar inativar usuário.") 
            }
        },
        async fecharInativarModal(){
            try {
                this.entidadeParaInativar = '';
                this.inativarModal = false;
            } catch (error) {
                alert("Erro ao fechar modal.") 
            }
        },
        async openEditarModal(id){
            try {
                this.whereId = id;
                this.editarModal = true;
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/entidade/${id}`, config);

                this.natureza.valorEscolhido = response.data[0].natureza;
                this.natureza.descritivoEscolhido = response.data[0].natureza;
                this.regime.valorEscolhido = response.data[0].regime;
                this.regime.descritivoEscolhido = response.data[0].regime;
                this.pais.valorEscolhido = response.data[0].pais;
                this.pais.descritivoEscolhido = response.data[0].pais;

                this.editar.natureza = response.data[0].natureza;
                this.editar.regime = response.data[0].regime;
                this.editar.nome = response.data[0].nome;
                this.editar.endereco = response.data[0].endereco;
                this.editar.endereco_numero = response.data[0].endereco_numero;
                this.editar.bairro = response.data[0].bairro;
                this.editar.cidade = response.data[0].cidade;
                this.editar.pais = response.data[0].pais;
                this.editar.email = response.data[0].email;

                const responsePaises = await axios.get('https://servicodados.ibge.gov.br/api/v1/paises/{paises}');
                responsePaises.data.forEach(element => {
                    this.paises.push({descri: element.nome.abreviado, valor: element.nome.abreviado})
                });
                
                this.carregandoinfo = false;
            } catch (error) {
                alert("Erro ao carregar modal. Favor tentar mais tarde.")
            }
        },
        async enviarEditar(){
            try {
                this.closeEditarModal()
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/editar-entidade/${this.whereId}`, this.editar, config);
                this.pageRefresh();
            } catch (error) {
                console.log(error);
                alert("Falha ao preencher campos da entidade.");
                this.carregando = false;
                this.refresh();
            }
        },
        async closeEditarModal(){
            this.editarModal = false;
        },
        async openVisualizarModal(id){
            try {
                this.visualizarModal = true;
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/entidade/${id}`, config);
                this.listaVisualizar = response.data[0];
                this.carregandoinfo = false;
            } catch (error) {
                alert("Erro ao abrir modal.");
            }
        },
        async closeVisualizarModal(){
            try {
                this.visualizarModal = false;
                this.listaVisualizar = [];
            } catch (error) {
                alert("Erro ao fechar modal.")
            }
        },
        async closeAnexoModal(){
            this.anexosModal = false;
            this.images = [];
            this.selectedFiles = [];
        },
        async openAnexoModal(id){
            try {
                this.carregandoinfo = true;
                this.anexosModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/anexos-lista/${id}`, config);
                this.listaArquivos = response.data
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert("Falha ao abrir anexos. Favor tentar mais tarde.")
            }
        },
        async refazerDocumentos(){
            this.images = [];
            this.selectedFiles = [];
        },
        async uploadFile(e) {
            this.selectedFiles = e.target.files;
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.images.push({"source": URL.createObjectURL(this.selectedFiles[i])});
            }
        },
        async submitFile() {
            try {
                this.novoDocumento = false;
                this.carregando = true;
                for(let i = 0; i < this.selectedFiles.length; i++){
                    const formData = new FormData();
                    formData.append('file', this.selectedFiles[i]);
                    formData.append('titulo', this.anexoInfoTitulo[i]);
                    formData.append('descritivo', this.anexoInfoDescritivo[i]);
                    const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': document.cookie };
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/anexos/${this.whereId}`, formData, { headers });
                };
                for(let i = 0; i < this.selectedFiles.length; i++){
                    this.anexoInfoTitulo[i] = '';
                    this.anexoInfoDescritivo[i] = '';
                };
                this.images = [];
                this.selectedFiles = [];
                this.pageRefresh();
            } catch (error) {
                alert("Erro ao subir arquivos")
                this.images = [];
                this.selectedFiles = [];
                this.pageRefresh();
            }
        },
        async showPopup(){
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
        },
        async pageRefresh(){
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/get_all`, config);
                this.documentos = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                var self = this;
                Object.keys(this.criar).forEach(function(key, index) {
                    self.criar[key] = '';
                });
                this.images = [];
                this.selectedFiles = [];
                this.showPopup();
                this.novoDocumento = false;
                this.carregando = false;
            } catch (error) {
                console.log(error)
                alert("Falha ao carregar página.");
            }
        },
        async abrirNovaEntidade(){
            this.novaEntidade = true;
            this.carregandoinfo = true;
            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/paises/{paises}');
            response.data.forEach(element => {
                this.paises.push({descri: element.nome.abreviado, valor: element.nome.abreviado})
            });
            this.carregandoinfo = false;
        },
        async fecharNovaEntidade(){
            this.paises = [];
            this.novaEntidade = false;
        },
        async enviarNovaEntidade(){
            try {
                this.fecharNovaEntidade();
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/create`, this.criar, config);
                this.pageRefresh();
            } catch (error) {
                console.log(error)
                alert('Erro ao criar documento. Favor tentar mais tarde.')
            }
        },
        async abrirNovoDocumento(id){
            this.whereId = id
            this.novoDocumento = true;
        },
        async fecharNovoDocumento(){
            this.images = [];
            this.selectedFiles = [];
            this.novoDocumento = false;
            this.selectedFiles = [];
        },
    },
    async created(){
        try {
            const config = {
                headers: {
                'Authorization': document.cookie,
                }
            }
            const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
            this.userSetor = loggedIn.data[0].setor;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/rh/documentos/get_all`, config);
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
.drop-container {
  position: relative;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
  border: 2px dashed #555;
  color: #444;
  cursor: pointer;
  transition: background .2s ease-in-out, border .2s ease-in-out;
}

.drop-container:hover,
.drop-container.drag-active {
  background: #eee;
  border-color: #111;
}

.drop-container:hover .drop-title,
.drop-container.drag-active .drop-title {
  color: #222;
}

.drop-title {
  color: #444;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  transition: color .2s ease-in-out;
}

input[type=file] {
  width: 350px;
  max-width: 100%;
  color: #000000;
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #555;
}

input[type=file]::file-selector-button {
  margin-top: 6%;
  margin-left: 40%;
  border: none;
  background: #396ddd;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background .2s ease-in-out;
}

input[type=file]::file-selector-button:hover {
  background: #0d45a5;
}
</style>