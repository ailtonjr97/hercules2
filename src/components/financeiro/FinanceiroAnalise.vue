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
        <form-floating :placeholder="'ID:'" :id="'id'" :type="'number'" v-model="id" v-on:keyup.enter="pesquisa()"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px;">
            <th>Ações</th>
            <th>ID</th>
            <th>Filial</th>
            <th>Pedido</th>
            <th>Data Hora Solicitação</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(resposta, index) in respostas" :key="resposta.id">
            <td>
                <div class="row" style="width: 80%; margin-left: 15%;">
                    <div class="col d-flex justify-content-center">
                        <div><button title="Solicitação de Crédito" class="button-8" @click="abreSolicitarDocumento(resposta.ID)"><i style="font-size: 14px;" class="fas fa-money-bill"></i></button></div>
                    </div>
                </div>
            </td>
            <td>
                <p>{{ resposta.ID }}</p>
            </td>
            <td>
                <p>{{ resposta.FILIAL }}</p>
            </td>
            <td>
                <p>{{ resposta.NUMERO_PEDIDO }}</p>
            </td>
            <td>
                <p>{{formatarData(resposta.DATA_SOLICIT) }} {{ resposta.HORA_SOLICIT }}</p>
            </td>
            <td>
                <button title="Ver Cliente" class="button-8" @click="openClienteModal(resposta.COD_CLIENTE, resposta.LOJA)">{{ resposta.COD_CLIENTE }}</button>
            </td>
            <td>
                <button title="Ver Cliente" class="button-8" @click="openVendedorModal(resposta.VENDEDOR)">{{ resposta.VENDEDOR }}</button>
            </td>
            <td>
                <p>{{ valoresPedido[index] }}</p>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>

<modal v-if="documentoModal" :title="`Solicitação de Crédito:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col-md-3">
                <div class="row">
                    <div class="col">
                        <form-span :readonly="true" :span="'ID'" v-model="infoDocumento.ID"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Pedido'" v-model="infoDocumento.NUMERO_PEDIDO"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Cliente'" v-model="infoDocumento.COD_CLIENTE"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Valor'" v-model="infoDocumento.VALOR_PEDIDO"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Limite Atual'" v-model="infoDocumento.LIMITE_ATUAL"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Diferença'" v-model="infoDocumento.FALTA_LIMITE"></form-span>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="row">
                    <div class="col">
                        <form-span :readonly="true" :span="'Data Solicit.'" v-model="infoDocumento.DATA_SOLICIT"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Vendedor'" v-model="infoDocumento.VENDEDOR"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Filial'" v-model="infoDocumento.FILIAL"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'Loja'" v-model="infoDocumento.LOJA"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col d-flex justify-content-start">
                        <form-span :readonly="true" :span="'Solicit Cli.'" v-model="infoDocumento.DT_SOLICIT_DOCUMENTO"></form-span>
                        <div style="margin-left: 2%;"><button title="Solicitar Documentos ao Cliente." class="button-8" @click="perguntarDispararEmailCliente(infoDocumento.COD_CLIENTE, infoDocumento.LOJA, infoDocumento.ID, infoDocumento.EMAIL, infoDocumento.NOME_CLIENTE)"><i style="font-size: 22px;" class="fas fa-envelope"></i></button></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col d-flex justify-content-start">
                        <form-span :readonly="true" :span="'Doc. OK'" v-model="infoDocumento.DATA_DOC_OK"></form-span>
                        <div style="margin-left: 2%;"><button title="Documentos OK." class="button-8" @click="perguntaDocOk(infoDocumento.ID, infoDocumento.VALOR_PEDIDO_INALTERADO)"><i style="font-size: 22px;" class="fas fa-check"></i></button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharSolicitarDocumento()">Fechar</button>
    </template>
</modal>

<modal v-if="clienteModal" :title="`Cliente:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row" style="height: 50px;">
            <div class="col-sm-2">
                <form-span :readonly="true" :span="'Código'" v-model="cliente.A1_COD"></form-span>
            </div>
            <div class="col-lg-6">
                <form-span :readonly="true" :span="'Nome:'" v-model="cliente.A1_NOME"></form-span><br>
            </div>
            <div class="col">
                <form-span :readonly="true" :span="'CNPJ:'" v-model="cliente.A1_CGC"></form-span><br>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <form-span :readonly="true" :span="'Endereço:'" v-model="cliente.A1_END"></form-span><br>
            </div>
            <div class="col-md-4">
                <form-span :readonly="true" :span="'Município:'" v-model="cliente.A1_MUN"></form-span><br>
            </div>
            <div class="col-sm-2">
                <form-span :readonly="true" :span="'Estado:'" v-model="cliente.A1_EST"></form-span><br>
            </div>
            <div class="col-sm-2">
                <form-span :readonly="true" :span="'CEP:'" v-model="cliente.A1_CEP"></form-span><br>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharClienteModal()">Fechar</button>
    </template>
</modal>

<modal v-if="vendedorModal" :title="`Vendedor:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col-sm-2">
                <form-span :readonly="true" :span="'Filial'" v-model="vendedor.A3_FILIAL"></form-span><br>
            </div>
            <div class="col-sm-2">
                <form-span :readonly="true" :span="'Código'" v-model="vendedor.A3_COD"></form-span><br>
            </div>
            <div class="col-md-4">
                <form-span :readonly="true" :span="'Nome'" v-model="vendedor.A3_NOME"></form-span><br>
            </div>
            <div class="col-md-4">
                <form-span :readonly="true" :span="'Email'" v-model="vendedor.A3_EMAIL"></form-span><br>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharVendedorModal()">Fechar</button>
    </template>
</modal>

<modal v-if="perguntaDisparaEmail" :title="`Confirmação de envio de e-mail:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <h3>Deseja disparar e-mail solicitando documentos ao cliente {{nomeClienteTrim}}?</h3>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharPerguntaDisparaEmail()">Não</button>
        <button class="button-8 mt-2" @click="DispararEmailDocumentos()">Sim</button>
    </template>
</modal>

<modal v-if="docOk" :title="`Confirmação de documentação:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <h3>Toda documentação está OK para esse cliente?</h3>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="this.docOk = false">Não</button>
        <button class="button-8 mt-2" @click="ConfirmaDocOk()">Sim</button>
    </template>
</modal>

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
import FormSpan from '../ui/formSpan.vue';

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
        FormSpan,
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
            docValor: null,
            docOk: false,
            docId: null,
            emailId: '',
            emailCliente: '',
            nomeClienteTrim: '',
            perguntaDisparaEmail: false,
            valoresPedido: [],
            vendedor: {},
            vendedorModal: null,
            infoDocumento: {
                LIMITE_ATUAL: null,
                VALOR_PEDIDO: null,
                VALOR_PEDIDO_INALTERADO: null,
                ID: null,
                NUMERO_PEDIDO: null,
                COD_CLIENTE: null,
                VENDEDOR: null,
                FILIAL: null,
                LOJA: null,
                DATA_SOLICIT: null,
                HORA_SOLICIT: null,
                FALTA_LIMITE: null,
                DT_SOLICIT_DOCUMENTO: null,
                EMAIL: null,
                NOME_CLIENTE: null,
                DATA_DOC_OK: null
            },
            cliente: [],
            clienteModal: false,
            documentoModal: false,
            id: null,
            nameLogado: '',
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
        async ConfirmaDocOk(){
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/docok?id=${this.docId}&valor=${this.docValor}`, config);
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
                const campo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/documento?id=${this.docId}`, config);
                const dataISO = campo.data[0].DATA_DOC_OK;
                const data = new Date(dataISO);
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'  // Ajuste conforme o seu fuso horário, se necessário
                };
                this.infoDocumento.DATA_DOC_OK = data.toLocaleString('pt-BR', options).replace(',', '');
                this.docOk = false;
                this.docId = null;
            } catch (error) {
                console.log(error)
                alert("Falha ao executar ação. Tente novamente mais tarde.")
            }
        },
        async perguntaDocOk(id, valor){
            this.docOk = true;
            this.docId = id;
            this.docValor = valor
        },
        async DispararEmailDocumentos(){
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/email?id=${this.emailId}&email=${this.emailCliente}&nome=${this.nomeClienteTrim}`, config);
                this.carregandoinfo = false;
                this.perguntaDisparaEmail = false;
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
                const campo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/documento?id=${this.emailId}`, config);
                const dataISO = campo.data[0].DT_SOLICIT_DOCUMENTO;
                const data = new Date(dataISO);
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'  // Ajuste conforme o seu fuso horário, se necessário
                };
                this.infoDocumento.DT_SOLICIT_DOCUMENTO = data.toLocaleString('pt-BR', options).replace(',', '');
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao executar ação. Tente novamente mais tarde.")
            }
        },
        async perguntarDispararEmailCliente(cod, loja, id, email, nome_cliente){
            try {
                this.perguntaDisparaEmail = true;
                this.carregandoinfo = true;
                this.nomeClienteTrim = nome_cliente.trimEnd();
                this.emailCliente = email.trimEnd();
                this.emailId = id;
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                this.carregandoinfo = false;
                alert("Falha ao executar ação. Favor tentar novamente mais tarde.")
                this.perguntaDisparaEmail = false;
            }
        },
        async fecharPerguntaDisparaEmail(){
            this.nomeClienteTrim = '';
            this.carregandoinfo = false;
            this.carregando = false;
            this.perguntaDisparaEmail = false;
        },
        async fecharVendedorModal(){
            this.vendedorModal = false;
            this.vendedor = {};
        },
        async openVendedorModal(cod){
            try {
                this.carregandoinfo = true;
                this.vendedorModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/vendedor?cod=${cod}`, config);
                this.vendedor = response.data
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error);
                this.carregandoinfo = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.');
            }
        },
        formattedValor(valor) {
            if (valor != null) {
                return `${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            } else {
                return '';
            }
        },
        formatarData(data){
            const ano = data.substring(0, 4);
            const mes = data.substring(4, 6);
            const dia = data.substring(6, 8);

            return `${dia}/${mes}/${ano}`;
        },
        async openClienteModal(numped, loja){
            try {
                this.carregandoinfo = true;
                this.clienteModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/clientes/${numped}/${loja}`, config);
                this.cliente = response.data.objects[0]
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.')
            }
        },
        async fecharClienteModal(){
            this.clienteModal = false;
            this.cliente = [];
        },
        async abreSolicitarDocumento(id){
            try {
                this.documentoModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/documento?id=${id}`, config);
                const data = new Date(response.data[0].DT_SOLICIT_DOCUMENTO);
                const data2 = new Date(response.data[0].DATA_DOC_OK);
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'  // Ajuste conforme o seu fuso horário, se necessário
                };

                this.infoDocumento = {
                    LIMITE_ATUAL: this.formattedValor(response.data[0].LIMITE_ATUAL * 1) || null,
                    VALOR_PEDIDO: this.formattedValor(response.data[0].VALOR_PEDIDO * 1) || null,
                    VALOR_PEDIDO_INALTERADO: response.data[0].VALOR_PEDIDO || null,
                    ID: response.data[0].ID || null,
                    NUMERO_PEDIDO: response.data[0].NUMERO_PEDIDO || null,
                    COD_CLIENTE: response.data[0].COD_CLIENTE || null,
                    VENDEDOR: response.data[0].VENDEDOR || null,
                    FILIAL: response.data[0].FILIAL || null,
                    LOJA: response.data[0].LOJA || null,
                    DATA_SOLICIT: `${this.formatarData(response.data[0].DATA_SOLICIT)} ${response.data[0].HORA_SOLICIT}` || null,
                    HORA_SOLICIT: response.data[0].HORA_SOLICIT || null,
                    FALTA_LIMITE:this.formattedValor(response.data[0].LIMITE_ATUAL - response.data[0].VALOR_PEDIDO),
                    DT_SOLICIT_DOCUMENTO: '',
                    EMAIL: response.data[0].EMAIL_CLIENTE,
                    NOME_CLIENTE: response.data[0].CLIENTE,
                    DATA_DOC_OK: ''
                };


                if(response.data[0].DT_SOLICIT_DOCUMENTO != null){
                    this.infoDocumento.DT_SOLICIT_DOCUMENTO = data.toLocaleString('pt-BR', options).replace(',', '');
                }

                if(response.data[0].DATA_DOC_OK != null){
                    this.infoDocumento.DATA_DOC_OK = data.toLocaleString('pt-BR', options).replace(',', '');
                }
            } catch (error) {
                console.log(error);
                alert('Falha ao executar ação. Favor tentar novamente mais tarde.');
            }
        },
        async fecharSolicitarDocumento(){
            try {
                this.documentoModal = false;
            } catch (error) {
                alert('Falha ao executar ação. Favor tentar novamente mais tarde.');
            }
        },
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
        esperar(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        async refresh(){
            try {
                this.carregando = true;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/atualiza-proposta-de-frete`, config);
                await this.esperar(1000);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
                console.log(error)
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
                response.data.forEach(element => {
                    this.valoresPedido.push((element.VALOR_PEDIDO * 1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                });
                this.nameLogado = logado.data[0].name
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