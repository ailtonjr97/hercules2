<template>
<popup v-if="popup"></popup>
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
<table-top :resultados="resultados">
    <template v-slot:tableButtons>
        <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
    </template>
</table-top>
<div class="row mb-2">
    <form-floating :placeholder="'Número da NF:'" :id="nf" :type="'number'" v-model="nf" v-on:keyup.enter="pesquisa()"></form-floating>
</div>
<div class="table-wrapper table-responsive table-striped mb-5">
    <table class="fl-table" id="myTable">
    <thead>
        <tr style="height: 25px;">
        <th>NF Número</th>
        <th>Pedido</th>
        <th>Frete Orçamento</th>
        <th>NF Frete</th>
        <th>NF ICMS Frete</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item, index) in items" :key="item.R_E_C_N_O_">
            <td>{{item.F2_DOC}}</td>
            <td>{{item.C5_NUM}}</td>
            <td>{{item.C5_FRETE}}</td>
            <td>{{item.F2_FRETE}}</td>
            <td>{{item.F2_ICMFRET}}</td>
        </tr>
    </tbody>
    </table>
</div>
</div>
</template>

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
import FormSpan from '../ui/formSpan.vue';
import SpanTextarea from '../ui/spanTextarea.vue';
import SpanSelect from '../ui/spanSelect.vue';

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

export default{
    components: {
        SpanTextarea,
        FormSpan,
        SelectFloating,
        FormFloating,
        TableSearch,
        TableTop,
        Popup,
        Modal,
        Loading,
        SpanSelect
    },
    data(){
        return{
            nf: '',
            items: [],
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
    methods: {
        async pesquisa(){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/nfcte?numero=${this.nf}`, config);
                this.items = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                this.carregando = false;
                if(error.response.status == 404){
                    this.items = [];
                    this.resultados = 0;
                }else{
                    alert('Falha na execução. Favor tentar novamente mais tarde.')
                }
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
            const decoded = jwtDecode(getCookie('jwt'));
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/nfcte`, config);
            this.items = response.data;
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