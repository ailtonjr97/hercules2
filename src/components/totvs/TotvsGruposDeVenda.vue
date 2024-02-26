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
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Código:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Descrição:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Código</th>
            <th>Descrição</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.id">
            <td>
                <p>{{ api.id }}</p>
            </td>
            <td>
                <p>{{ api.grpven }}</p>
            </td>
            <td>
                <p>{{ api.descri }}</p>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>
</template>

<script>
const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

import axios from 'axios';

import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import Modal from '../ui/Modal.vue';
import Loading from '../ui/Loading.vue';
import FormFloating from '../ui/FormFloating.vue';
import TextareaFloating from '../ui/TextareaFloating.vue';
import SelectFloating from '../ui/SelectFloating.vue';
import Popup from '../ui/Popup.vue';

export default {
components: {
    Popup,
    TableTop,
    TableSearch,
    Modal,
    Loading,
    FormFloating,
    TextareaFloating,
    SelectFloating
},
data(){
    return{
        popup: false,
        disableBtn: false,
        carregandoinfoApi: false,
        carregandoinfo: false,
        modalRelatorio: false,
        resultados: 0,
        carregando: true,
        apis: [],
        modalApi: false,
        carregandoinfo: false,
        visualizar: {},
        dadosRelatorio: {},
        lista: {
            metodo: '',
            descricao: '',
            caminho: ''
        }
    }
},
methods: {
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/acy/get_all`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            alert("Falha ao recarregar página.");
            this.carregando = false;
        }
    },
},
async created(){
    try {
        const config = {
            headers: {
            'Authorization': document.cookie,
            }
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/acy/get_all`, config);
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

<style>
.esconder{
    display: none;
}
</style>