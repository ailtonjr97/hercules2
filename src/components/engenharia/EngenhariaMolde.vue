<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div class="row mb-2 mt-2" style="width: 99.5%; margin-left: 0.3%;">
        <div class="col-sm-2">
            <form-floating :placeholder="'Código:'" :id="'CODIGO'" v-model="campos.CODIGO" :type="'text'" readonly></form-floating>
        </div>
        <div class="col-lg-9">
            <form-floating :placeholder="'Descritivo:'" :id="'DESCRI'" v-model="campos.DESCRI" :type="'text'" readonly></form-floating>
        </div>
        <div class="col-sm-1">
            <form-floating :placeholder="'Status:'" :id="'STATUS'" v-model="campos.STATUS" :type="'text'" readonly></form-floating>
        </div>
    </div>
    <div class="row mb-2" style="width: 99.5%; margin-left: 0.3%;">
        <div class="col-md-4 mt-2">
            <form-floating :placeholder="'Complemento:'" :id="'COMPLEMENTO_DESCRI'" v-model="campos.COMPLEMENTO_DESCRI" :type="'text'" readonly></form-floating>
        </div>
        <div class="col-sm-2 mt-2">
            <form-floating :placeholder="'Unidade de medida:'" :id="'UNIDADE'" v-model="campos.UNIDADE" :type="'text'" readonly></form-floating>
        </div>
        <div class="col-sm-2 mt-2">
            <form-floating :placeholder="'Data cadastro:'" :id="'DATA'" v-model="dataConvertida[0]" :type="'date'" readonly></form-floating>
        </div>
        <div class="col-sm-2 mt-2">
            <form-floating :placeholder="'Localiza:'" :id="'LOCALIZA'" v-model="campos.LOCALIZA" :type="'text'" readonly></form-floating>
        </div>
    </div>
    <div class="row mb-2 mt-3" style="width: 99.5%; margin-left: 0.3%;">
        <div class="col-md-4">
            <button class="button-8" @click="refresh">Gerais</button>
        </div>
    </div>
    <div class="row" style="width: 99.5%; margin-left: 0.3%;">
        <div class="col mt-2">
            <form-floating :placeholder="'Peso líquido:'" :id="'peso'" v-model="campos.PESO" :type="'text'" readonly></form-floating>
        </div>
        <div class="col mt-2">
            <form-floating :placeholder="'Categoria:'" :id="'categoria'" v-model="campos.CATEGORIA" :type="'text'" readonly></form-floating>
            <p>{{ categoria.DESC_CAT }}</p>
        </div>
        <div class="col mt-2">
            <form-floating :placeholder="'Conta Gerencial:'" :id="'conta_gerencial'" :type="'text'" readonly></form-floating>
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
                categoria: '',
                dataConvertida: '',
                popup: false,
                campos: '',
                carregando: true,
            }
        },
        methods: {
        },
        async created(){
                try {
                    const config = {
                        headers: {
                        'Authorization': document.cookie,
                        }
                    }
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/engenharia/moldes/${this.$route.params.id}`, config);
                    console.log(response.data[0])
                    this.carregando = false;
                } catch (error) {
                    console.log(error);
                    alert("Erro ao carregar página. Favor tentar mais tarde.");
                    this.carregando = false;
                }
        }
    }
    </script>