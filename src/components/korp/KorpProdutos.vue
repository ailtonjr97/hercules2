<template>
<popup v-if="popup"></popup>
<div v-if="carregando" id="loading"></div>
<div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
<table-top :resultados="resultados">
    <template v-slot:tableButtons>
        <button class="button-8 mb-2" @click="refresh">Atualizar</button>
        <button class="button-8 mb-2" @click="exportarModal = true">Exportar</button>
    </template>
</table-top>
<div class="row mb-2">
    <form-floating :placeholder="'Código:'" :id="'codigo'" :type="'text'" v-model="codigo" v-on:keyup.enter="pesquisaProduto(codigo, results, nome)"></form-floating>
    <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="nome" v-on:keyup.enter="pesquisaProduto(codigo, results, nome)"></form-floating>
    <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisaProduto(codigo, results, nome)"></form-floating>
</div>
<div class="table-wrapper table-responsive table-striped mb-5">
    <table class="fl-table" id="myTable">
    <thead>
        <tr style="height: 25px">
        <th>Código</th>
        <th>Nome</th>
        <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="produto in produtos" :key="produto.CODIGO">
        <td>
            <p>{{ produto.CODIGO }}</p>
        </td>
        <td>
            <p>{{ produto.DESCRI }}</p>
        </td>
        <td>
            <router-link :to="`/korp/produto/${produto.CODIGO}`"><button class="button-8"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></router-link>
        </td>
        </tr>
    </tbody>
    </table>
</div>
</div>
<modal v-if="exportarModal" :title="'Exportar para:'">
    <template v-slot:body>
        <div class="row">
            <div class="col">
                <a href=""></a>
                <img src="/images/excel.png" alt="" style="width: 10%; cursor: pointer;" @click="exportarExcel">
                <img src="/images/pdf.png" alt="" style="width: 10%; cursor: pointer; margin-left: 2%;" @click="exportarPdf">
            </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="exportarModal = false">Fechar</button> 
    </template>
</modal>
</template>

<script>
import axios from 'axios';
import Popup from '../ui/Popup.vue';
import TableTop from '../ui/TableTop.vue';
import TableSearch from '../ui/TableSearch.vue';
import FormFloating from '../ui/FormFloating.vue';
import Modal from '../ui/Modal.vue';

const config = {
    headers: {
    'Authorization': document.cookie,
    }
}

export default{
    components: {
        FormFloating,
        TableSearch,
        TableTop,
        Popup,
        Modal
    },
    data(){
        return{
            exportarModal: false,
            nome: '',
            results: 1000,
            resultados: null,
            codigo: '',
            popup: false,
            produtos: [],
            resultados: null,
            fullLoad: false,
            carregandoinfo: false,
            carregando: true,
        }
    },
    methods: {
        async exportarExcel(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/korp/produtos/excel?codigo=${this.codigo}&resultados=${this.results}&nome=${this.nome}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': document.cookie,
                    }
                }).then((response) => {
                    // create file link in browser's memory
                    const href = URL.createObjectURL(response.data);

                    // create "a" HTML element with href to file & click
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'arquivo.xlsx');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);

                    this.carregando = false;
                });
                this.exportarModal = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async exportarPdf(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/korp/produtos/pdf?codigo=${this.codigo}&resultados=${this.results}&nome=${this.nome}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': document.cookie,
                    }
                }).then((response) => {
                    // create file link in browser's memory
                    const href = URL.createObjectURL(response.data);

                    // create "a" HTML element with href to file & click
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'arquivo.pdf');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);

                    this.carregando = false;
                });
                this.exportarModal = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async refresh(){
            this.carregando = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produtos/get_all`, config);
            this.produtos = response.data;
            this.resultados = response.data.length;
            this.fullLoad = true;
            this.carregando = false;
        },
        async pesquisaProduto(codigo, results){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produtos/pesquisa?codigo=${codigo}&resultados=${results}&nome=${this.nome}`, config);
                this.produtos = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao pesquisar produtos. Favor tentar mais tarde.");
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produtos/get_all`, config);
                this.produtos = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>