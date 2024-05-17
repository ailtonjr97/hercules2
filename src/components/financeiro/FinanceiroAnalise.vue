<template>
    <div v-if="this.nome != 'admin' || this.nome != 'Everson Saporetti'">
        <img style="margin-left: 10%; margin-top: 5%;" src="/images/construcao.png" alt="Minha Imagem">
    </div>
    <div v-if="this.nome == 'admin' || this.nome == 'Everson Saporetti'">
        <popup v-if="popup"></popup>
        <div v-if="carregando" id="loading"></div>
        <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
        <table-top :resultados="resultados">
            <template v-slot:tableButtons>
                <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
            </template>
        </table-top>
        <div class="row mb-2">
            <form-floating :placeholder="'ID:'" :id="'id'" :type="'text'" v-model="identificador" v-if="!pedidoAllRev" v-on:keyup.enter="pesquisa(pedido, cotador_id, results, vendedor, identificador)"></form-floating>
        </div>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px;">
                <th>Ações</th>
                <th>ID</th>
                <th>Filial</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="resposta in respostas" :key="resposta.id">
                <td>
                    <div class="row" style="width: 80%; margin-left: 15%;">
                        <div class="col d-flex justify-content-start">
                            <div><button title="Cotar" class="button-8" @click="openEditarModal(resposta.id)"><i style="font-size: 14px;" class="fa-solid fa-pen"></i></button></div>
                        </div>
                    </div>
                </td>
                <td>
                    <p>{{ resposta.id }}</p>
                </td>
                <td>
                    <p>{{ resposta.filial }}</p>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </div>
</template>

<style>
table {
	 table-layout: fixed;
}
 table th {
    z-index: 1;
    resize: horizontal;
	overflow: hidden;
	white-space: nowrap;
}

table td{
	overflow: hidden;
}
</style>
    
<script>
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import Popup from '../ui/Popup.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import FormFloating from '../ui/FormFloating.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import SelectFloating from '../ui/SelectFloating.vue';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const config = {
    headers: {
    'Authorization': getCookie('jwt'),
    }
}

export default{
    components: {
        SelectFloating,
        FormFloating,
        TableSearch,
        TableTop,
        Popup,
        Modal,
        Loading
    },
    data(){
        return{
            logado: {},
            results: 1000,
            popup: false,
            resultados: null,
            fullLoad: false,
            carregandoinfo: false,
            carregando: true,
            editar: {
                transp_nome_select: '',
                transp_nome2_select: '',
                valor: '',
                prazo: '',
                cotador_id_2: null
            }
        }
    },
    computed: {
    optionsFiliais(){
            return [
                {valor: "0101001", descri: 'FIBRACEM MATRIZ'},
                {valor: "0101002", descri: 'FIBRACEM FILIAL CD.'},
                {valor: "0101003", descri: 'FIBRACEM ESPIRITO SANTO CD'},
                {valor: "0101004", descri: 'FIBRACEM INDUSTRIA LINHARES'},
                {valor: "0101005", descri: 'FIBRACEM IMPORTACAO LINHARES'},
                {valor: "0101006", descri: 'FIBRACEM INJECOES'}
            ];
        },
    },
    methods: {
        async pesquisa(pedido, cotador_id, results, vendedor, identificador){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/pesquisa?pedido=${pedido}&resultados=${results}&cotador_id=${cotador_id}&vendedor=${vendedor}&identificador=${identificador}`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                alert("Falha ao pesquisar. Favor tentar mais tarde.");
                this.carregando = false;
            }
        },
        async refresh(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/atualiza-proposta-de-frete`, config);
                this.carregando= false
/*                 this.respostas = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false; */
            } catch (error) {
                alert("Falha ao recarregar. Favor tentar novamente mais tarde.")
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
                    'Authorization': getCookie('jwt'),
                    }
                }
                const decoded = jwtDecode(getCookie('jwt'));
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.respostas = response.data;
                const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
                this.logado = logado.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>