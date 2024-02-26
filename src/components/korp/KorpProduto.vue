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
<div class="row mt-2" style="width: 99.5%; margin-left: 0.3%;">
    <div class="col-sm-2">
        <form-floating :placeholder="'Peso líquido:'" :id="'peso'" v-model="campos.PESO" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Peso bruto:'" :id="'PESOBRUTO'" v-model="campos.PESOBRUTO" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Categoria:'" :id="'categoria'" v-model="campos.CATEGORIA" :type="'text'" readonly></form-floating>
        <p>{{ categoria.DESC_CAT }}</p>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Conta Gerencial:'" :id="'conta_gerencial'" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Família:'" :id="'FAMILIA'" v-model="campos.FAMILIA" :type="'text'" readonly></form-floating>
        <p>{{ familia.DESGRUPO }}</p>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'C. Custo Entrada:'" :id="'n/a'" :type="'text'" readonly></form-floating>
    </div>
</div>
<div class="row" style="width: 99.5%; margin-left: 0.3%;">
    <div class="col-sm-2">
        <form-floating :placeholder="'Volume:'" :id="'VOLUME'" v-model="campos.VOLUME" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Grupo:'" :id="'CODGRUPO'" v-model="campos.CODGRUPO" :type="'text'" readonly></form-floating>
        <p>{{ grupo.DESCRICAO }}</p>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'C. Custo Saída:'" :id="'CCUSTO_VENDA'" v-model="campos.CCUSTO_VENDA" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'M3:'" :id="'METRAGEM_CUBICA'" v-model="campos.METRAGEM_CUBICA" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-3">
        <form-floating :placeholder="'Sub-Grupo:'" :id="'CCUSTO_VENDA'" v-model="campos.CODSUBGRUPO" :type="'text'" readonly></form-floating>
        <p>{{subgrupo.DESCRICAO}}</p>
    </div>
</div>
<div class="row" style="width: 99.5%; margin-left: 0.3%;">
    <div class="col-sm-3">
        <form-floating :placeholder="'Gênero Item:'" :id="'SPD_COD_GEN'" v-model="campos.SPD_COD_GEN" :type="'text'" readonly></form-floating>
        <p>{{genero.DESC_GENERO}}</p>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Código de barras:'" :id="'COD_BARRA'" v-model="campos.COD_BARRA" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Classe:'" :id="'CLASSE'" v-model="campos.CLASSE" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Tipo Item:'" :id="'TIPO_ITEM'" v-model="campos.TIPO_ITEM" :type="'text'" readonly></form-floating>
        <p>{{tipo.DESC_TIPO_ITEM}}</p>
    </div>
    <div class="col-sm-2">
        <form-floating :placeholder="'Código EAN:'" :id="'CODIGO_EAN'" v-model="campos.CODIGO_EAN" :type="'text'" readonly></form-floating>
    </div>
</div>
<div class="row" style="width: 99.5%; margin-left: 0.3%;">
    <div class="col-sm-3">
        <form-floating :placeholder="'Marca:'" :id="'MARCA'" v-model="campos.MARCA" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-3">
        <form-floating :placeholder="'Código de barras interno:'" :id="'MARCA'" v-model="campos.MARCA" :type="'text'" readonly></form-floating>
    </div>
    <div class="col-sm-3">
        <form-floating :placeholder="'Código de barras interno trib.:'" :id="'MARCA'" v-model="campos.MARCA" :type="'text'" readonly></form-floating>
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
            familia: '',
            categoria: '',
            grupo: '',
            subgrupo: '',
            genero: '',
            tipo: '',
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/${this.$route.params.id}`, config);
                const camposResponse = response.data[0];
                const categoria = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/categoria/${camposResponse.CATEGORIA}`, config);
                this.categoria = categoria.data[0];
                const familia = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/familia/${camposResponse.FAMILIA}`, config);
                this.familia = familia.data[0];
                const grupo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/grupo/${camposResponse.CODGRUPO}`, config);
                this.grupo = grupo.data[0];
                const subgrupo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/subgrupo/${camposResponse.CODSUBGRUPO}`, config);
                this.subgrupo = subgrupo.data[0];
                const genero = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/genero/${camposResponse.SPD_COD_GEN}`, config);
                this.genero = genero.data[0];
                const tipo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/korp/produto/tipo/${camposResponse.TIPO_ITEM}`, config);
                this.tipo = tipo.data[0];
                this.campos = Object.fromEntries(Object.entries(camposResponse).filter(([_, v]) => v != null));
                this.dataConvertida = this.campos.DATA.split('T');
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert("Erro ao carregar página. Favor tentar mais tarde.");
                this.carregando = false;
            }
    }
}
</script>