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
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="pedido" :id="'procuraBtn0'" :num="0" :placeholder="'Pedido:'" :type="'text'"></form-floating >
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="dataEnt" :id="'procuraBtn2'" :num="2" :placeholder="'Data de Entrega:'" :type="'date'"></form-floating >
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="limit" :id="'procuraBtn1'" :num="1" :placeholder="'Limite:'" :type="'number'"></form-floating >
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Itens</th>
            <th>ID</th>
            <th>Filial</th>
            <th>Pedido</th>
            <th>Data de Entrega</th>
            <th>Liberado Comercial</th>
            <th>Separado CD</th>
            <th>Liberado Faturamento</th>
            <th>Faturado</th>
            <th>Liberado Expedição</th>
            <th>Expedido</th>
            </tr>
        </thead>
        <tbody>
            <div>
                
            </div>
            <tr v-for="api in apis">
                <td>
                    <button data-bs-toggle="collapse" :data-bs-target="'#a' + api.C5_FILIAL + api.C5_NUM" title="Itens" class="button-8"><i class="fa-solid fa-bars"></i></button>
                    <tr>
                        <div :id="'a' + api.C5_FILIAL + api.C5_NUM" class="panel-collapse collapse mt-2 mb-2">
                            <div class="table-wrapper table-striped">
                                <table class="fl-table" id="myTable">
                                    <thead>
                                        <th>Código</th>
                                        <th>Descrição</th>
                                        <th>Quantidade</th>
                                        <th>Separado CD</th>
                                        <th>Usuário</th>
                                        <th>Data</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="iten in api.itens[0]">
                                            <td style="word-wrap: break-word; width: 5px;">{{ iten.C6_PRODUTO }}</td>
                                            <td>{{ iten.C6_QTDVEN }}</td>
                                            <td>{{ iten.C6_DESCRI }}</td>
                                            <td><input type="checkbox" name="" id="" :checked="iten.C6_XSEPCD ? true: false" @click="marcaSepC6(iten.C6_FILIAL, iten.C6_NUM, iten.C6_ITEM, iten.C6_PRODUTO, $event)" :disabled="!api.C5_XLIBCOM"></td>
                                            <td>{{ iten.C6_XNSEPCD }}</td>
                                            <td>{{ iten.C6_XHSEPCD }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </tr>
                </td>
                <td>{{ api.R_E_C_N_O_ }}</td>
                <td>{{ api.C5_FILIAL}}</td>
                <td>{{ api.C5_NUM}}</td>
                <td>{{ api.C5_FECENT}}</td>
                <td>
                    <input class="mt-4" @click="marcaLibCom(api.C5_FILIAL, api.C5_NUM, api.C5_XLIBFAT, $event)" type="checkbox" name="liberado_comercial" id="liberado_comercial" :checked="api.C5_XLIBCOM ? true : false"><br>
                    {{ api.C5_XNLIBCO  }}<br>
                    {{ api.C5_XHLIBCO }}
                </td>
                <td>
                    <input class="mt-4" @click="$event.preventDefault()" type="checkbox" name="separado_cd" id="separado_cd" :checked="api.C5_XSEPCD ? true : false"><br>
                    {{ api.C5_XNSEPCD  }}<br>
                    {{ api.C5_XHSEPCD }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaLibFat(api.C5_FILIAL, api.C5_NUM, api.C5_XFATURD, $event)" type="checkbox" name="liberado_faturamento" id="liberado_faturamento" :checked="api.C5_XLIBFAT ? true : false" :disabled="!api.C5_XSEPCD"><br>
                    {{ api.C5_XNLIBFA  }}<br>
                    {{ api.C5_XHLIBFA }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaFaturd(api.C5_FILIAL, api.C5_NUM, api.C5_XLIBEXP, $event)" type="checkbox" name="faturado" id="faturado" :checked="api.C5_XFATURD ? true : false" :disabled="!api.C5_XLIBFAT"><br>
                    {{ api.C5_XNFATUR  }}<br>
                    {{ api.C5_XHFATUR  }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaLibexp(api.C5_FILIAL, api.C5_NUM, api.C5_XEXPEDI, $event)" type="checkbox" name="liberado_expedicao" id="liberado_expedicao" :checked="api.C5_XLIBEXP ? true : false" :disabled="!api.C5_XFATURD"><br>
                    {{ api.C5_XNLIBEX  }}<br>
                    {{ api.C5_XHLIBEX }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaExpedi(api.C5_FILIAL, api.C5_NUM, $event)" type="checkbox" name="expedido" id="expedido" :checked="api.C5_XEXPEDI ? true : false" :disabled="!api.C5_XLIBEXP"><br>
                    {{ api.C5_XNEXPED  }}<br>
                    {{ api.C5_XHEXPED }}
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="mostraErro" :title="`Erro:`" :textoPadrao="textoPad">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="this.mostraErro = false">Fechar</button>
    </template>
</modal>


</template>

<script>

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

import axios from 'axios';
import { jwtDecode } from "jwt-decode";
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
        dataEnt: '',
        mostraErro: false,
        textoPad: '',
        pedido: '',
        limit: null,
        nome: '',
        setor: '',
        alertaPedido: false,
        numped: '',
        filial: '',
        novoModal: false,
        abriu: false,
        popup: false,
        disableBtn: false,
        carregandoinfo: false,
        resultados: 0,
        carregando: true,
        apis: [],
    }
},
methods: {
    async mostraModal(erro){
        this.mostraErro = true;
        this.textoPad = erro;
        this.carregando = false;
    },
    async pesquisa(){
        try {
            this.carregando = true;
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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?limit=${this.limit}&pedido=${this.pedido}&data_ent=${this.dataEnt}`, config);
            const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.apis = response.data;
            this.setor = logado.data[0].setor;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            if(error.response.status == 404){
                this.mostraModal("Nenhum resultado encontrado.");
            }else{
                this.mostraModal("Falha ao buscar resultados.");
            }
        }
    },
    async marcaExpedi(filial, num, e){
        try {
            if(this.setor != "Logística"){
                this.mostraModal("Somente usuários do setor da Logística podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XEXPEDI/T/${this.nome}/C5_XNEXPED/C5_XHEXPED`, config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XEXPEDI/F/${this.nome}/C5_XNEXPED/C5_XHEXPED`, config);
                }
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            this.mostraModal("Falha ao executar ação. Tente novamente mais tarde.");
            e.preventDefault();
        }
    },
    async marcaLibexp(filial, num, expedi, e){
        try {
            if(expedi){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Expedido' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro"){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBEXP/T/${this.nome}/C5_XNLIBEX/C5_XHLIBEX`, config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBEXP/F/${this.nome}/C5_XNLIBEX/C5_XHLIBEX`, config);
                }
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            this.mostraModal("Falha ao executar ação. Tente novamente mais tarde.");
            e.preventDefault();
        }
    },
    async marcaFaturd(filial, num, lebxp, e){
        try {
            if(lebxp){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Liberado Expedicao' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro"){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XFATURD/T/${this.nome}/C5_XNFATUR/C5_XHFATUR`, config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XFATURD/F/${this.nome}/C5_XNFATUR/C5_XHFATUR`, config);
                }
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            this.mostraModal("Falha ao executar ação. Tente novamente mais tarde.");
            e.preventDefault();
        }
    },
    async marcaLibFat(filial, num, faturd, e){
        try {
            if(faturd){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Faturado' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro"){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBFAT/T/${this.nome}/C5_XNLIBFA/C5_XHLIBFA`, config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBFAT/F/${this.nome}/C5_XNLIBFA/C5_XHLIBFA`, config);
                }
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            this.mostraModal("Falha ao executar ação. Tente novamente mais tarde.");
            e.preventDefault();
        }
    },
    async marcaLibCom(filial, num, libfat, e){
        try {
            if(libfat){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Liberado Faturamento' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Comercial"){
                this.mostraModal("Somente usuários do setor Comercial podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBCOM/T/${this.nome}/C5_XNLIBCO/C5_XHLIBCO`, config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBCOM/F/${this.nome}/C5_XNLIBCO/C5_XHLIBCO`, config);
                }
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            this.mostraModal("Falha ao executar ação. Tente novamente mais tarde.")
            e.preventDefault();
        }
    },
    async marcaSepC6(filial, num, item, produto, event){
        try {
            if(!event.target.checked){
                event.preventDefault()
            }else if (this.setor != "Logística"){
                this.mostraModal("Somente usuários do setor da Logística podem editar esse campo.")
                event.preventDefault()
            }else{
                this.carregando = true;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_c6xsepcd/${filial}/${num}/${item}/${produto}/${this.nome}`, config);
                this.refresh();
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
            }
        } catch (error) {
            mostraModal("Falha ao executar ação. Tente novamente mais tarde.")
            event.preventDefault()
        }
    },
    async refresh(){
        try {
            this.carregando = true;
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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?limit=100&pedido=${this.pedido}&data_ent=${this.dataEnt}`, config);
            const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.apis = response.data;
            this.setor = logado.data[0].setor;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.mostraModal("Falha ao recarregar página.")
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?limit=100&pedido=&data_ent=`, config);
        const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        this.apis = response.data;
        this.setor = logado.data[0].setor;
        this.nome = logado.data[0].name;
        this.resultados = response.data.length;
        this.carregando = false;
    } catch (error) {
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