<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
      <table-top :resultados="resultados">
        <template v-slot:tableButtons>
          <button class="button-8 mb-2" @click="abrirModalNovo">Novo</button>
          <button class="button-8 mb-2" @click="pageRefresh">Atualizar</button>
        </template>
      </table-top>
      <div class="row mb-2">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome Solicit.:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Código Cliente:'"></table-search>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
              <th>ID</th>
              <th>Nome Solicit.</th>
              <th>Código Cliente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="itens in list" :key="itens.id" @dblclick="abrirModalVisu(itens.id)">
              <td>
                <p>{{ itens.id }}</p>
              </td>
              <td>
                <p>{{ itens.nome }}</p>
              </td>
              <td>
                <p>{{ itens.cliente_cod }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal v-if="chaveModalNovo" :title="'Nova Propriedade do Cliente:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row" v-if="!carregandoinfo">
                <form-floating :placeholder="'Nome do solicitante:'" :id="'nome'" :type="'text'" v-model="novo.nome"></form-floating>
                <form-floating :placeholder="'Código do Cliente:'" :id="'cliente_cod'" :type="'text'" v-model="novo.cliente_cod"></form-floating>
                <form-floating :placeholder="'Nome do Cliente:'" :id="'cliente_nome'" :type="'text'" v-model="novo.cliente_nome"></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo">
                <form-floating :placeholder="'Número da Nota Fiscal:'" :id="'numero_nf'" :type="'number'" v-model="novo.numero_nf"></form-floating>
                <form-floating :placeholder="'Transportadora:'" :id="'transportadora'" :type="'text'" v-model="novo.transportadora"></form-floating>
                <form-floating :placeholder="'Número RRC:'" :id="'rrc'" :type="'text'" v-model="novo.rrc"></form-floating>
            </div>
            <div class="row mt-2">
                <input type="file" name="anexo-inicio" id="anexo-inicio" multiple @change="handleFileUpload">
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="fecharModalNovo">Fechar</button>
            <button class="button-8" @click="enviarNovo">Salvar</button>
        </template>
    </modal>

    <modal v-if="chaveModalVisu" :title="'Propriedade do Cliente:'">
        <template v-slot:body>
            <loading v-if="carregandoinfo"></loading>
            <div class="row">
                <div class="col">
                    <button class="button-8" @click="mudaChave('chaveGeral')">Geral</button>
                    <button class="button-8" @click="mudaChave('chaveAnexo')">Anexos</button>
                </div>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
                <form-floating :placeholder="'Nome do solicitante:'" :id="'nome'" :type="'text'" v-model="visu.nome"></form-floating>
                <form-floating :placeholder="'Código do Cliente:'" :id="'cliente_cod'" :type="'text'" v-model="visu.cliente_cod"></form-floating>
                <form-floating :placeholder="'Nome do Cliente:'" :id="'cliente_nome'" :type="'text'" v-model="visu.cliente_nome"></form-floating>
            </div>
            <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
                <form-floating :placeholder="'Número da Nota Fiscal:'" :id="'numero_nf'" :type="'number'" v-model="visu.numero_nf"></form-floating>
                <form-floating :placeholder="'Transportadora:'" :id="'transportadora'" :type="'text'" v-model="visu.transportadora"></form-floating>
                <form-floating :placeholder="'Número RRC:'" :id="'rrc'" :type="'text'" v-model="visu.rrc"></form-floating>
            </div>
            <div class="row mt-4" v-if="!carregandoinfo && chaveAnexo">
                <tr v-for="anexos in listaAnexos" :key="anexos.ID">
                    <td>
                        <a :href="`${ip}/files/${anexos.FILENAME}`" target="_blank">{{ anexos.ORIGINAL_NAME }}</a>
                    </td>
                </tr>
            </div>
        </template>
        <template v-slot:buttons v-if="!carregandoinfo">
            <button class="button-8" @click="fecharModalVisu">Fechar</button>
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
    import Popup from '../ui/Popup.vue';
    
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
            Popup,
            TableTop,
            TableSearch,
            Modal,
            FormFloating,
            SelectFloating,
            TextareaFloating,
            AnexFloating,
            Loading
        },
        data(){
            return{
                ip: import.meta.env.VITE_BACKEND_IP,
                listaAnexos: null,
                selectedFile: null,
                selectedFiles: [],
                visu: {
                    nome: null,
                    cliente_cod: null,
                    cliente_nome: null,
                    numero_nf: null,
                    transportadora: null,
                    rrc: null
                },
                novo: {
                    nome: null,
                    cliente_cod: null,
                    cliente_nome: null,
                    numero_nf: null,
                    transportadora: null,
                    rrc: null
                },
                chaveModalNovo: false,
                chaveModalVisu: false,
                chaveAnexo: false,
                chaveGeral: true,
                userSetor: null,
                intranetId: null,
                resultados: null,
                fullLoad: false,
                carregandoinfo: false,
                carregando: true,
                list: null,
                popup: false
            }
        },
        methods: {
            mudaChave(chave) {
                try {
                    // Define todas as chaves que podem ser exibidas como false
                    this.chaveGeral = false;
                    this.chaveAnexo = false;
                    // Agora ativa a chave especificada pelo parâmetro
                    this[chave] = true;
                } catch (error) {
                    console.log(error);
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            handleFileUpload(event) {
                // event.target.files é um FileList; converta para array se necessário
                this.selectedFiles = Array.from(event.target.files);
            },
            async fecharModalVisu(){
                try {
                    Object.keys(this.visu).forEach(key => {
                        this.visu[key] = null;
                    });
                    this.chaveModalVisu = false;
                    this.chaveAnexo = false;
                    this.chaveGeral = true;
                    this.selectedFiles = [];
                } catch (error) {
                    console.log(error)
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            async abrirModalVisu(id) {
                try {
                    this.chaveModalVisu = true;
                    this.carregandoinfo = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedade/${id}`, config);
                    const anexos = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades-arquivo/${id}`, config);
                    this.listaAnexos = anexos.data;
                    this.visu = response.data[0];
                    this.carregandoinfo = false;   
                } catch (error) {
                    console.log(error)
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            async pageRefresh(){
                try {
                    this.carregando = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, config);
                    this.list = response.data;
                    this.resultados = response.data.length;
                    this.fullLoad = true;
                    this.carregando = false;
                } catch (error) {
                   console.log(error)
                   alert("Falha ao carregar página.");
                   this.carregando = false;
                }
            },
            async enviarNovo(){
                try {
                    // Envia os dados da nova propriedade
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, this.novo, config);
                    const id = response.data.id;
                    
                    // Se houver arquivos selecionados, faça o upload de todos
                    if(this.selectedFiles && this.selectedFiles.length > 0) {
                    const formData = new FormData();
                    // Anexa cada arquivo com o mesmo nome de campo (por exemplo, 'files')
                    this.selectedFiles.forEach(file => {
                        formData.append('files', file);
                    });
                    // Envie o id para relacionar os arquivos à propriedade
                    formData.append('id', id); 
                    
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades-arquivo`, formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `jwt=${getCookie('jwt')}`
                        }
                    });
                    }
                    
                    // Fechar modal, exibir popup e atualizar a lista
                    await this.fecharModalNovo();
                    this.popup = true;
                    setTimeout(() => { this.popup = false; }, 2000);
                    await this.pageRefresh();
                } catch (error) {
                    console.error(error);
                    alert("Erro ao executar. Favor tentar novamente mais tarde.");
                    this.carregando = false;
                }
            },
            async fecharModalNovo(){
                try {
                    Object.keys(this.novo).forEach(key => {
                        this.novo[key] = null;
                    });
                    this.chaveModalNovo = false;
                } catch (error) {
                    console.log(error)
                    alert("Erro ao carregar página. Favor tentar mais tarde.");
                    this.carregando = false;
                }
            },
            async abrirModalNovo(){
                try {
                    this.chaveModalNovo = true;
                } catch (error) {
                    console.log(error)
                    alert("Erro ao carregar página. Favor tentar mais tarde.");
                    this.carregando = false;
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, config);
                this.list = response.data;
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
  .fl-table tbody tr:hover {
    background-color: #e0e0e0; /* Altere para a cor desejada */
  }
</style>