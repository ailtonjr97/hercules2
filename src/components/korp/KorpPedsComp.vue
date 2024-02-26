<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="refresh">Atualizar</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'Código:'" :id="'codigo'" :type="'text'" v-model="codigo" v-on:keyup.enter="pesquisaDado(codigo, results, rassoc)"></form-floating>
        <form-floating :placeholder="'Razão Social:'" :id="'rassoc'" :type="'text'" v-model="rassoc" v-on:keyup.enter="pesquisaDado(codigo, results, rassoc)"></form-floating>
        <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisaDado(codigo, results, rassoc)"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Número Documento</th>
            <th>Razão Social</th>
            <th>Requisitante</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="dado in dados" :key="dado.NUMERO_PEDIDO">
            <td>
                <p>{{ dado.NUMERO_PEDIDO }}</p>
            </td>
            <td>
                <p>{{ dado.RASSOC }}</p>
            </td>
            <td>
                <p>{{ dado.REQUISITANTE }}</p>
            </td>
            <td>
                <router-link :to="`/korp/pedido-de-compra/${dado.NUMERO_PEDIDO}`"><button class="button-8"><i style="font-size: 14px;" class="fa-solid fa-eye"></i></button></router-link>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
    </template>
    
    <script>
    import axios from 'axios';
    import Popup from '../ui/Popup.vue';
    import TableTop from '../ui/TableTop.vue';
    import TableSearch from '../ui/TableSearch.vue';
    import FormFloating from '../ui/FormFloating.vue';
    
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
            Popup
        },
        data(){
            return{
                results: 1000,
                resultados: null,
                codigo: '',
                popup: false,
                dados: [],
                resultados: null,
                fullLoad: false,
                carregandoinfo: false,
                carregando: true,
                rassoc: ''
            }
        },
        methods: {
            async refresh(){
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/pedidos-de-compra/get_all`, config);
                this.dados = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            },
            async pesquisaDado(codigo, results, rassoc){
                try {
                    this.carregando = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/pedidos-de-compra/pesquisa?codigo=${codigo}&resultados=${results}&rassoc=${rassoc}`, config);
                    this.dados = response.data;
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
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/pedidos-de-compra/get_all`, config);
                    this.dados = response.data;
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