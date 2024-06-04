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
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.R_E_C_N_O_">
                <td>{{ api.CJ_FILIAL }}</td>
                <td>{{ api.CJ_NUM }}</td>
                <td style="width: 50px;">{{ api.A1_NOME }}</td>
                <td style="width: 50px;">{{ api.A3_NOME }}</td>
                <td><button title="Detalhes" class="button-8" @click="abrirOrcamentoModal(api.CJ_FILIAL, api.CJ_NUM, api.CJ_CLIENTE, api.CJ_LOJA)"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></td>
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
                <form-span :span="'Número:'" :type="'text'" v-model="orcamento.CJ_NUM" readonly></form-span>
            </div>
            <div class="col">
                <form-span :span="'DT Emissão:'" :type="'text'" v-model="orcamento.CJ_EMISSAO" readonly></form-span>
            </div>
            <div class="col d-flex justify-content-evenly">
                <form-span :span="'Cliente:'" :type="'text'" v-model="orcamento.CJ_CLIENTE" readonly></form-span>
                <button style="margin-left: 1%;" class="button-8" @click="modalCliente(orcamento.CJ_FILIAL, orcamento.CJ_CLIENTE, orcamento.CJ_LOJA)"><i style="font-size: 16px;" class="fas fa-search"></i></button>
            </div>
            <div class="col">
                <form-span :span="'Loja:'" :type="'text'" v-model="orcamento.CJ_LOJA" readonly></form-span>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons>
        <button class="button-8 mt-2" @click="orcamentoModal = false;">Fechar</button>
    </template>
</modal>

<modal v-if="clienteModal" :title="`Informações do Cliente.`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <form-span :span="'teste'" :type="'text'"  readonly></form-span>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="clienteModal = false">Fechar</button>
    </template>
</modal>

</template>

<script>
import { jwtDecode } from "jwt-decode";
import FormSpan from '../ui/formSpan.vue'
import axios from 'axios';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
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

export default {
components: {
    Popup,
    TableTop,
    TableSearch,
    Modal,
    Loading,
    FormFloating,
    TextareaFloating,
    SelectFloating,
    FormSpan
},
data(){
    return{
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
    }
},
methods: {
    async modalCliente(filial, cliente, loja){
        try {
            this.clienteModal = true;
            this.carregandoinfo = true;
            const response =  await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/cliente-info?filial=${filial}&cliente=${cliente}&loja=${loja}`, config);
            this.carregandoinfo = false;
        } catch (error) {
            this.carregandoinfo = false;
            alert('Falha ao executar ação. Tente novamente mais tarde');
        }
    },
    async mostraOrcamento(){
        try {
            this.optionsOrcamentos = true;
            this.optionsOutros = false;
        } catch (error) {
            
        }
    },
    async mostraOutros(){
        try {
            this.optionsOrcamentos = false;
            this.optionsOutros = true;
        } catch (error) {
            
        }
    },
    async abrirOrcamentoModal(CJ_FILIAL, CJ_NUM, CJ_CLIENTE, CJ_LOJA){
        try {
            this.orcamentoModal = true;
            this.carregandoinfo = true;
            const response =  await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamento-info?filial=${CJ_FILIAL}&numero=${CJ_NUM}&cliente=${CJ_CLIENTE}&loja=${CJ_LOJA}`, config);
            this.orcamento = response.data
            this.carregandoinfo = false;
        } catch (error) {
            alert('Falha ao executar ação. Tente novamente mais tarde');
        }
    },
    async pesquisa(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos?filial=${this.filial}&numero=${this.numero}&cliente=${this.cliente}&vendedor=${this.vendedor}`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.carregando = false;
            if(error.response.status == 404){
                this.apis = [];
                this.resultados = 0;
            }else{
                alert('Falha ao executar ação. Tente novamente mais tarde');
            };
        }
    },
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert('Falha ao executar ação. Tente novamente mais tarde.')
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
                const decoded = jwtDecode(getCookie('jwt'));
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/orcamentos`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            console.log(error)
            alert("Erro ao carregar página. Favor tentar mais tarde.");
            this.carregando = false;
        }
    }
}
</script>