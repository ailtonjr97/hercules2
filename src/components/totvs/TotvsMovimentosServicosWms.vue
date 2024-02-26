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
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Filial:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Produto:'"></table-search>
        <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Lote:'"></table-search>
        <table-search :id="'procuraBtn4'" :num="4" :placeholder="'Documento:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Filial</th>
            <th>Produto</th>
            <th>Lote</th>
            <th>Documento</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.id">
            <td>
                <p>{{ api.id }}</p>
            </td>
            <td>
                <p>{{ api.filial }}</p>
            </td>
            <td>
                <p>{{ api.produt }}</p>
            </td>
            <td>
                <p>{{ api.lotect }}</p>
            </td>
            <td>
                <p>{{ api.doc }}</p>
            </td>
            <td>
                <button class="button-8"><i style="font-size: 14px;" class="fa-solid fa-eye" @click="abrirModalInfo(api.id)"></i></button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="modalInfo" :title="'Informações:'">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <form-floating :placeholder="'ID:'" :id="'id'" :type="'text'" v-model="movimento.id" ></form-floating>
            <form-floating :placeholder="'Filial:'" :id="'filial'" :type="'text'" v-model="movimento.filial" ></form-floating>
            <form-floating :placeholder="'Produto:'" :id="'produt'" :type="'text'" v-model="movimento.produt" ></form-floating>
            <form-floating :placeholder="'Lote:'" :id="'lotect'" :type="'text'" v-model="movimento.lotect" ></form-floating>
            <form-floating :placeholder="'Documento:'" :id="'doc'" :type="'text'" v-model="movimento.doc" ></form-floating>
        </div>
    </div>
    </template>
    <template v-slot:buttons>
        <button class="button-8 mt-4" @click="fecharModalInfo()">Fechar</button>
    </template>
</modal>

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
        modalInfo: false,
        popup: false,
        carregandoinfo: false,
        modalRelatorio: false,
        resultados: 0,
        carregando: true,
        apis: [],
        modalApi: false,
        carregandoinfo: false,
        visualizar: {},
        dadosRelatorio: {},
        movimento: {}
    }
},
methods: {
    async abrirModalInfo(id){
        try {
            this.modalInfo = true;
            this.carregandoinfo = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/d12/get_one/${id}`, config);
            this.movimento = response.data[0];
            this.carregandoinfo = false;
        } catch (error) {
            this.carregandoinfo = false;
            alert("Falha ao mostrar mais informações.");
        }
    },
    async fecharModalInfo(){
        this.carregandoinfo = false;
        this.modalInfo = false;
    },
    async refresh(){
        try {
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/d12/get_all`, config);
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/d12/get_all`, config);
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