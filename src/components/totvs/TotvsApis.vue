<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="modalApi = true">Nova API</button>
            <button class="button-8 mb-2" @click="modalToken = true">Token de Acesso</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Método:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Descrição:'"></table-search>
        <table-search :id="'procuraBtn3'" :num="3" :placeholder="'Caminho:'"></table-search>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Método</th>
            <th>Descrição</th>
            <th>Caminho</th>
            <th>Ação</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :key="api.id">
            <td>
                <p>{{ api.id }}</p>
            </td>
            <td>
                <p>{{ api.metodo }}</p>
            </td>
            <td>
                <p>{{ api.descricao }}</p>
            </td>
            <td>
                <p>{{ api.caminho }}</p>
            </td>
            <td v-if="api.metodo == 'GET'">
                <button  class="button-8" @click="gerarRelatorio(api.caminho)">Executar</button>
            </td>
            <td v-if="api.metodo == 'POST'">
                <button :id="`botao${api.id}`" class="button-8" @click="atualizarTabela(api.caminho, api.id)" :disabled="disableBtn">Executar</button>
                <loading :id="`carregando${api.id}`" style="width: 30px; margin-left: 43%" class="esconder"></loading>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>


<modal v-if="modalApi" :title="'Criar nova API Protheus.'">
<template v-slot:body>
      <div class="row">
        <select-floating :placeholder="'Método:'" :id="'metodo'" :options="[{valor: 'GET', descri: 'GET'}, {valor: 'POST', descri: 'POST'}, {valor: 'PUT', descri: 'PUT'}, {valor: 'DELETE', descri: 'DELETE'}]" v-model="lista.metodo"></select-floating>
        <textarea-floating :placeholder="'Descrição:'" :id="'descricao'" v-model="lista.descricao" ></textarea-floating>
        <form-floating :placeholder="'Caminho:'" :id="'caminho'" :type="'text'" v-model="lista.caminho" ></form-floating>
      </div>
</template>
<template v-slot:buttons>
      <button class="button-8" @click="modalApi = false">Fechar</button>
      <button class="button-8" @click="novaApi">Executar</button>
</template>
</modal>

<modal v-if="modalRelatorio" :title="'Dados da consulta.'">
<template v-slot:close><button class="button-8" @click="modalRelatorio = false">Fechar</button></template>
<template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <pre v-if="!carregandoinfo" style="background-color: black; color: white; border-radius: 5px;"> {{ JSON.stringify(dadosRelatorio, null, 2) }} </pre>
</template>
<template v-slot:buttons>
      <button class="button-8" @click="modalRelatorio = false">Fechar</button>
</template>
</modal>

<modal v-if="modalToken" :title="'Token de acesso:'">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
        <pre v-if="!carregandoinfo" style="background-color: black; color: white; border-radius: 5px;"> {{ token }} </pre>
    </template>
    <template v-slot:buttons>
        <button class="button-8" @click="modalToken = false">Fechar</button>
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
        token: '',
        popup: false,
        disableBtn: false,
        carregandoinfoApi: false,
        carregandoinfo: false,
        modalRelatorio: false,
        modalToken: false,
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
    async atualizarTabela(caminho, id){
        try {
            document.getElementById(`botao${id}`).style.display = 'none';
            document.getElementById(`carregando${id}`).style.display = 'block';
            this.disableBtn = true;
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}${caminho}`, {}, config);
            document.getElementById(`botao${id}`).style.display = 'inline-block';
            document.getElementById(`carregando${id}`).style.display = 'none';
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
            this.disableBtn = false;
        } catch (error) {
            console.log(error);
            alert("Erro ao executar atualização.");
            document.getElementById(`botao${id}`).style.display = 'inline-block';
            document.getElementById(`carregando${id}`).style.display = 'none';
            this.disableBtn = false;
        }
    },
    async gerarRelatorio(caminho){
        try {
            this.carregandoinfo = true;
            this.modalRelatorio = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}${caminho}`, config);
            this.dadosRelatorio = response.data;
            this.carregandoinfo = false;
        } catch (error) {
            console.log(error);
            alert("Falha ao gerar relatório");
        }
    },
    async novaApi(){
        try {
            this.modalApi = false;
            this.carregando = true;
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/lista`, this.lista, config);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/lista`, config);
            this.apis = response.data;
            this.resultados = response.data.length;
            this.carregando = false
        } catch (error) {
            console.log(error);
            alert("Erro ao criar nova api.")
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/api/lista`, config);
        this.apis = response.data;
        this.resultados = response.data.length;
        this.token = document.cookie.replace('jwt=', '');
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