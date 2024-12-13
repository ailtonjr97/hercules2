<template>
    <img v-if="construcao" style="margin-left: 30%; margin-top: 5%;" src="/images/construcao.gif" alt="Logo">
    <div v-if="!construcao">
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button v-if="!mostraArquivadas && (idLogado == 705 || idLogado == 193 || idLogado == 189 || idLogado == 823)" class="button-8 mb-2" @click="refresh()">Atualizar</button>
            <button v-if="!mostraArquivadas" class="button-8 mb-2" @click="arquivadas()">Arquivadas</button>
            <button v-if="mostraArquivadas" class="button-8 mb-2" @click="abertas()">Abertas</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'Orçamento:'" :id="orcamento" :type="'number'" v-model="orcamento" v-on:keyup.enter="pesquisa()"></form-floating>
        <form-floating :placeholder="'Cliente:'" :id="cliente" :type="'text'" v-model="nomCli" v-on:keyup.enter="pesquisa()"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px;">
            <th>Ações</th>
            <th>ID</th>
            <th>Filial</th>
            <th>Orçamento</th>
            <th>Revisão</th>
            <th>Responsável</th>
            <th>Dt. Solicitação</th>
            <th>Solicit. Cli.</th>
            <th>Dt. Doc OK</th>
            <th>Dt. Resposta</th>
            <th>Prazo Resposta</th>
            <th>Status</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Valor</th>
            <th>Nome Cliente</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(resposta, index) in respostas" :key="resposta.id">
            <td>
                <div class="row" style="width: 80%; margin-left: 15%;">
                    <div class="col d-flex justify-content-center">
                        <button v-if="idLogado == 705 || idLogado == 193 || idLogado == 189 || idLogado == 823" title="Arquivar" class="button-8" @click="confirmaArquivar(resposta.ID)"><i style="font-size: 14px;" class="fas fa-archive"></i></button>
                        <div><button title="Solicitação de Crédito" class="button-8" @click="abreSolicitarDocumento(resposta.ID, resposta.COD_CLIENTE, resposta.LOJA)"><i style="font-size: 14px;" class="fas fa-eye"></i></button></div>
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
                <p>{{ resposta.REVISAO }}</p>
            </td>
            <td>
                <p>{{ resposta.RESPONSAVEL_APROV }}</p>
            </td>
            <td>
                <p>{{formatarData(resposta.DATA_SOLICIT) }} {{ resposta.HORA_SOLICIT }}</p>
            </td>
            <td>
                <p>{{ formatarDataJs(resposta.DT_SOLICIT_DOCUMENTO) }}</p>
            </td>
            <td>
                <p>{{ formatarDataJs(resposta.DATA_DOC_OK) }}</p>
            </td>
            <td>
                <p>{{ formatarDataJs(resposta.DATA_RESP) }}</p>
            </td>
            <td>
                <p>{{ formatarDataJs(resposta.PRAZO_RESPOSTA) }}</p>
            </td>
            <td>
                <p>{{ resposta.RESULTADO_ANALISE }}</p>
            </td>
            <td>
                <button title="Ver Cliente" class="button-8" @click="openClienteModal(resposta.COD_CLIENTE, resposta.LOJA)">{{ resposta.COD_CLIENTE }}</button>
            </td>
            <td>
                <button title="Ver Vendedor" class="button-8" @click="openVendedorModal(resposta.VENDEDOR)">{{ resposta.VENDEDOR }}</button>
            </td>
            <td>
                <p>{{ resposta.VALOR_PEDIDO }}</p>
            </td>
            <td>
                <p>{{ resposta.CLIENTE }}</p>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>

<modal v-if="documentoModal" :title="`Solicitação de Crédito:`">
    <template v-slot:close><button class="button-8" @click="fecharSolicitarDocumento()">Fechar</button></template>
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col-lg-6">
                <div class="row">
                    <div class="col">
                        <form-span :readonly="true" :span="'Nome'" v-model="infoDocumento.NOME_CLIENTE"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <form-span :readonly="true" :span="'E-mail'" v-model="infoDocumento.EMAIL"></form-span>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-lg-6">
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
                    <div class="col-lg-6">
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
                                <div v-if="!mostraArquivadas && (idLogado == 705 || idLogado == 193 || idLogado == 189 || idLogado == 431)" style="margin-left: 2%;"><button title="Solicitar Documentos ao Cliente." class="button-8" @click="perguntarDispararEmailCliente(infoDocumento.COD_CLIENTE, infoDocumento.LOJA, infoDocumento.ID, infoDocumento.EMAIL, infoDocumento.NOME_CLIENTE)"><i style="font-size: 22px;" class="fas fa-envelope"></i></button></div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col d-flex justify-content-start">
                                <form-span :readonly="true" :span="'Doc. OK'" v-model="infoDocumento.DATA_DOC_OK"></form-span>
                                <div v-if="!mostraArquivadas && (idLogado == 705 || idLogado == 193 || idLogado == 189 || idLogado == 431)"><button title="Documentos OK." class="button-8" @click="perguntaDocOk(infoDocumento.ID, infoDocumento.VALOR_PEDIDO_INALTERADO)"><i style="font-size: 22px;" class="fas fa-check"></i></button></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="row mt-2">
                            <span-textarea :span="'Obs. Cadastro'" :altura="'50'" v-model="infoDocumento.OBS_CADASTRO"></span-textarea>
                        </div>
                        <div class="row mt-2">
                            <div class="col d-flex justify-content-evenly">
                                <span-select :span="'Responsável pela Aprovação'" :options="optionsRespAprov" v-model="infoDocumento.RESPONSAVEL_APROV"></span-select>
                                <div style="margin-left: 0.5%;" v-if="!mostraArquivadas && infoDocumento.ARQUIVA == 0 && (idLogado == 705 || idLogado == 193 || idLogado == 189 || idLogado == 431 || idLogado == 823)"><button title="Trocar Responsável" class="button-8" @click="trocaResp(infoDocumento.ID, infoDocumento.RESPONSAVEL_APROV)"><i style="font-size: 22px;" class="fas fa-check"></i></button></div>
                            </div>
                        </div>
<!--                         <div class="row mt-2">
                            <div class="col-lg-12">
                                <input type="checkbox" name="" id="somente-pedido">
                                <label style="margin-left: 1%;" for="somente-pedido"> Aprovar somente este pedido (Não altera crédito).</label>
                            </div>
                        </div> -->
                        <div class="row mt-2">
                            <div class="col-lg-6">
                                <span-select :span="'Result. Análise'" :options="optionsRespAnalise" v-model="resultAnal"></span-select>
                            </div>
                            <div class="col-lg-6">
                                <form-span :readonly="false" :span="'Novo Limite'" :type="'text'" v-model="infoDocumento.NOVO_LIMITE"></form-span>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-lg-6">
                                <span-select :span="'Porcent. à vista'" :options="optionsPercent" v-model="infoDocumento.PERCENTUAL_ADIANT"></span-select>
                            </div>
                            <div class="col-lg-6">
                                <form-span :readonly="true" :span="'Valor à vista para o pedido'" v-model="infoDocumento.VALOR_ADIANT"></form-span>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-lg-12">
                                <form-span :readonly="false" :span="'Resposta análise'" :type="'text'" v-model="infoDocumento.RESPOSTA_ANALISE"></form-span>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-lg-12">
                                <span-textarea :span="'Observação'" :altura="'50'" v-model="infoDocumento.OBS_RESPOSTA"></span-textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-lg-6">
                                <form-span :readonly="true" :span="'Data Resposta'" :type="'text'" v-model="infoDocumento.DATA_RESP"></form-span>
                            </div>
                            <div class="col-lg-6">
                                <form-span :readonly="false" :span="'Prazo Resposta'" :type="'text'" v-model="infoDocumento.PRAZO_RESPOSTA"></form-span>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-lg-12">
                                <button v-if="nameLogado == infoDocumento.RESPONSAVEL_APROV && infoDocumento.ARQUIVA == 0" class="button-8" @click="confirmCredFinaliza()" style="width: 100%;">Finalizar Solicitação de Crédito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <loading v-if="carregandoInfoTabela && !carregandoInfoTabelaErro"></loading>
                <h3 style="text-align: center;" v-if="carregandoInfoTabelaErro">Falha ao buscar parcelas.</h3>
                <div v-if="!carregandoInfoTabela && !carregandoInfoTabelaErro" class="table-wrapper table-responsive table-striped mb-5">
                    <table class="fl-table" id="myTable">
                        <thead>
                          <tr style="height: 25px;">
                            <th>Filial</th>
                            <th>Prefixo</th>
                            <th>Número</th>
                            <th>Parcela</th>
                            <th>Vencimento</th>
                            <th>Valor</th>
                            <th>Saldo</th>
                            <th>Loja</th>
                            <th>Emissão</th>
                            <th>Status</th>
                            <th>LC</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(parcela, index) in parcelas" :key="parcela.E1_PARCELA">
                            <td>{{ parcela.E1_FILIAL }}</td>
                            <td>{{ parcela.E1_PREFIXO }}</td>
                            <td>{{ parcela.E1_NUM }}</td>
                            <td>{{ parcela.E1_PARCELA }}</td>
                            <td>{{ parcela.E1_VENCTO }}</td>
                            <td>{{ parcela.E1_VALOR }}</td>
                            <td>{{ parcela.E1_SALDO }}</td>
                            <td>{{ parcela.E1_LOJA }}</td>
                            <td>{{ parcela.E1_EMISSAO }}</td>
                            <td>{{ parcela.E1_STATUS }}</td>
                            <td>{{ parcela.A1_LC }}</td>
                          </tr>
                        </tbody>
                      </table>
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
        <div class="row mt-2">
            <div class="col">
                <input type="checkbox" id="checkEmailEnviado" v-model="checkEmailEnviado">
                <label for="checkEmailEnviado" style="margin-left: 0.5%;">Esse e-mail já foi enviado manualmente?</label>
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

<modal v-if="credConfimModal" :title="`Confirmação de Análise de Crédito:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <h3>Deseja confirmar a finalização de análise de crédito para esse orçamento?</h3>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="checkbox" id="checkEmailCliente" v-model="checkEmailCliente">
                <label for="checkEmailCliente" style="margin-left: 0.5%;">Deseja enviar e-mail para o cliente?</label>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col">
                <input type="checkbox" id="checkEmailVendedor" v-model="checkEmailVendedor">
                <label for="checkEmailVendedor" style="margin-left: 0.5%;">Deseja enviar e-mail para o vendedor?</label>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="this.credConfimModal = false;">Não</button>
        <button class="button-8 mt-2" @click="credFinaliza()">Sim</button>
    </template>
</modal>

<modal v-if="arquivaModal" :title="`Confirmação para Arquivar:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <h3>Deseja realmente arquivar essa análise de crédito?</h3>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="this.arquivaModal = false;">Não</button>
        <button class="button-8 mt-2" @click="arquivar()">Sim</button>
    </template>
</modal>

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
            checkEmailEnviado: false,
            carregandoInfoTabelaErro: false,
            idLogado: null,
            nomCli: '',
            orcamento: '',
            nomeClientes: [],
            parcelas: null,
            carregandoInfoTabela: false,
            mostraArquivadas: false,
            arquivaId: null,
            arquivaModal: false,
            percent: null,
            checkEmailCliente: false,
            checkEmailVendedor: false,
            credConfimModal: false,
            resultAnal: '',
            construcao: false,
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
                OBS_CADASTRO: '',
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
                DATA_DOC_OK: null,
                RESPONSAVEL_APROV: '',
                FALTA_LIMITE_NUM: null,
                LIMITE_ATUAL_NUM: null,
                NOVO_LIMITE: null,
                VALOR_PEDIDO_NUM: null,
                PERCENTUAL_ADIANT: null,
                VALOR_ADIANT: null,
                RESPOSTA_ANALISE: null,
                OBS_RESPOSTA: null,
                PRAZO_RESPOSTA: null,
                DATA_RESP: null
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
        optionsRespAnalise(){
            return [
                {valor: "APROVADO", descri: 'APROVADO'},
                {valor: "REPROVADO", descri: 'REPROVADO'},
                {valor: "PARCIAL", descri: 'PARCIAL'}
            ];
        },
        optionsRespAprov(){
            return [
                {valor: "Paloma Luana Veiga", descri: 'Paloma Luana Veiga'},
                {valor: "Kesley Machado", descri: 'Kesley Machado'},
                {valor: "Natali Evelin Peres Pereira", descri: 'Natali Evelin Peres Pereira'},
                {valor: "Alex Lemes da Silva", descri: 'Alex Lemes da Silva'},
            ];
        },
        optionsPercent(){
            return [
            {valor: "10", descri: '10'},
            {valor: "15", descri: '15'},
            {valor: "20", descri: '20'},
            {valor: "25", descri: '25'},
            {valor: "30", descri: '30'},
            {valor: "40", descri: '40'},
            {valor: "50", descri: '50'},
            {valor: "60", descri: '60'},
            {valor: "70", descri: '70'},
            {valor: "75", descri: '75'}

            ];
        },
    },
    methods: {
        async trocaResp(id, resp){
            try {
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/troca_resp?id=${id}&resp=${resp}`, config);
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                alert('Falha ao executar ação. Tente novamente mais tarde.')
            }
        },
        async abertas(){
            try {
                this.mostraArquivadas = false;
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.nomeClientes = [];
                response.data.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
                this.respostas = response.data;
                this.carregando = false;
            } catch (error) {
                console.log(error)
                alert('Falha ao executar ação. Tente novamente mais tarde.')
            }
        },
        async arquivadas(){
            try {
                this.mostraArquivadas = true;
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito-arquivadas`, config);
                this.nomeClientes = [];
                response.data.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
                this.respostas = response.data;
                this.carregando = false;
            } catch (error) {
                console.log(error);
                alert('Falha ao executar ação. Tente novamente mais tarde.');
            }
        },
        async arquivar(){
            try {
                this.carregandoinfo = true;
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/financeiro/arquivar`, {'id': this.arquivaId}, config);
                this.arquivaModal = false;
                this.carregandoinfo = false;
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.nomeClientes = [];
                response.data.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
                this.respostas = response.data;
                this.carregando = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert('Falha ao executar ação, favor tentar novamente mais tarde.');
            }
        },
        async confirmaArquivar(id){
            this.arquivaModal = true;
            this.arquivaId = id;
        },
        async confirmCredFinaliza(){
            this.credConfimModal = true;
        },
        async credFinaliza(){
            try {
                    this.credConfimModal = false;
                    this.carregandoinfo = true;
                    if(!this.resultAnal){
                        alert("Campo 'Result. Análise' não pode ser vazio.");
                        this.carregandoinfo = false;
                    }else if(this.resultAnal == 'PARCIAL' && !this.infoDocumento.PERCENTUAL_ADIANT){
                        alert("Campo 'Porcent. à vista' não pode ser vazio.");
                        this.carregandoinfo = false;
                    }else{
                        await axios.post(`${import.meta.env.VITE_BACKEND_IP}/financeiro/cred-finaliza`, [
                            {'result': this.resultAnal},
                            {'diferenca': this.infoDocumento.FALTA_LIMITE_NUM},
                            {'limite': this.infoDocumento.LIMITE_ATUAL_NUM},
                            {'id': this.infoDocumento.ID},
                            {'checkEmailCli': this.checkEmailCliente},
                            {'checkEmailVend': this.checkEmailVendedor},
                            {'emailCli': this.infoDocumento.EMAIL},
                            {'pedido': this.infoDocumento.NUMERO_PEDIDO},
                            {'filial': this.infoDocumento.FILIAL},
                            {'vendCod': this.infoDocumento.VENDEDOR},
                            {'porcentagem': this.infoDocumento.PERCENTUAL_ADIANT},
                            {'valor': this.infoDocumento.VALOR_PEDIDO_NUM},
                            {'respostaAnalise': this.infoDocumento.RESPOSTA_ANALISE},
                            {'obsResposta': this.infoDocumento.OBS_RESPOSTA},
                            {'novo_limite': this.infoDocumento.NOVO_LIMITE}
                        ], config);
                        const campo = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/documento?id=${this.infoDocumento.ID}`, config);
                        this.resultAnal = campo.data[0].RESULTADO_ANALISE;
                        this.infoDocumento.NOVO_LIMITE = campo.data[0].NOVO_LIMITE * 1;
                        this.infoDocumento.VALOR_ADIANT = this.formattedValor(campo.data[0].VALOR_ADIANT * 1);
                        this.infoDocumento.PERCENTUAL_ADIANT = campo.data[0].PERCENTUAL_ADIANT * 1;
                        this.infoDocumento.RESPOSTA_ANALISE = campo.data[0].RESPOSTA_ANALISE;
                        this.infoDocumento.OBS_RESPOSTA = campo.data[0].OBS_RESPOSTA;
                        this.infoDocumento.DATA_RESP = this.formatDateTime(campo.data[0].DATA_RESP);
                        this.infoDocumento.ARQUIVA = campo.data[0].ARQUIVA;
                        this.carregandoinfo = false;
                        this.popup = true;
                        setTimeout(()=>{
                            this.popup = false;
                        }, 2000);
                        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                        this.respostas = response.data;
                    }   
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                this.carregandoinfo = false;
                alert("Falha ao executar ação. Tente novamente mais tarde")
            }
        },
        async ConfirmaDocOk(){
            try {
                this.carregandoinfo = true;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/docok?id=${this.docId}&valor=${this.docValor}&obs=${this.infoDocumento.OBS_CADASTRO}`, config);
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
                this.infoDocumento.OBS_CADASTRO = campo.data[0].OBS_CADASTRO;
                this.infoDocumento.RESPONSAVEL_APROV = campo.data[0].RESPONSAVEL_APROV;
                this.infoDocumento.PRAZO_RESPOSTA = this.formatDateTime(campo.data[0].PRAZO_RESPOSTA);
                this.docOk = false;
                this.docId = null;
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error);
                alert("Falha ao executar ação. Tente novamente mais tarde.");
            }
        },
        async perguntaDocOk(id, valor){
            this.docOk = true;
            this.docId = id;
            this.docValor = valor
        },
        async DispararEmailDocumentos(){
            try {
                if(!this.emailCliente){
                    alert('E-mail do cliente não pode ser vazio. Favor arrumar no Protheus.')
                }else{
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/email?id=${this.emailId}&email=${this.emailCliente}&nome=${this.nomeClienteTrim}&checkemail=${this.checkEmailEnviado}`, config);
                    this.carregandoinfo = false;
                    this.perguntaDisparaEmail = false;
                    this.popup = true;
                    this.checkEmailEnviado = false;
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
                }
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao executar ação. Tente novamente mais tarde.")
            }
        },
        removerDepoisDoPontoEVirgula(email) {
            return email.split(';')[0];
        },
        async perguntarDispararEmailCliente(cod, loja, id, email, nome_cliente){
            try {
                if(email.trim() === ''){
                    alert('E-mail do cliente está vazio.')
                }else{
                    this.perguntaDisparaEmail = true;
                    this.carregandoinfo = true;
                    this.nomeClienteTrim = nome_cliente.trimEnd();
                    const emailFomatado = this.removerDepoisDoPontoEVirgula(email)
                    emailFomatado.trimEnd()
                    this.emailCliente = emailFomatado.trimEnd()
                    this.emailId = id;
                    this.carregandoinfo = false;
                }
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
        formatarDataJs(dataISO) {
            if (!dataISO) {
                return '';
            }

            const data = new Date(dataISO);

            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
            const ano = data.getFullYear();

            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');

            return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
        },
        formatDateTime(dateTimeStr) {
            // Verifica se a string de data e hora é nula ou indefinida
            if (!dateTimeStr) {
                return '';
            }

            // Cria um objeto Date a partir da string ISO
            const date = new Date(dateTimeStr);

            // Extrai os componentes da data e hora
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são base 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Formata a data e hora no padrão desejado
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },
        async openClienteModal(numped, loja){
            try {
                this.carregandoinfo = true;
                this.clienteModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/clientes/${numped}/${loja}`, config);
                this.cliente = response.data
                this.carregandoinfo = false;
            } catch (error) {
                console.log(error)
                this.carregandoinfo = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.')
            }
        },
        async fecharClienteModal(){
            this.clienteModal = false;
            this.cliente = [];
        },
        async abreSolicitarDocumento(id, cod, loja){
            try {
                this.documentoModal = true;
                this.carregandoInfoTabela = true;
                this.carregandoInfoTabelaErro = false;
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/documento?id=${id}`, config);
                const cliente = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/clientes/${cod}/${loja}`, config);
                const cgc = cliente.data.A1_CGC;
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
                    DATA_DOC_OK: '',
                    OBS_CADASTRO: response.data[0].OBS_CADASTRO,
                    RESPONSAVEL_APROV: response.data[0].RESPONSAVEL_APROV,
                    FALTA_LIMITE_NUM: response.data[0].LIMITE_ATUAL - response.data[0].VALOR_PEDIDO,
                    LIMITE_ATUAL_NUM: response.data[0].LIMITE_ATUAL * 1,
                    NOVO_LIMITE: response.data[0].NOVO_LIMITE * 1 || null,
                    RESULTADO_ANALISE: response.data[0].RESULTADO_ANALISE,
                    VALOR_PEDIDO_NUM: response.data[0].VALOR_PEDIDO || null,
                    PERCENTUAL_ADIANT: response.data[0].PERCENTUAL_ADIANT * 1 || null,
                    VALOR_ADIANT: this.formattedValor(response.data[0].VALOR_ADIANT * 1) || null,
                    RESPOSTA_ANALISE: response.data[0].RESPOSTA_ANALISE || null,
                    OBS_RESPOSTA: response.data[0].OBS_RESPOSTA || null,
                    PRAZO_RESPOSTA: this.formatDateTime(response.data[0].PRAZO_RESPOSTA) || null,
                    DATA_RESP: this.formatDateTime(response.data[0].DATA_RESP) || null,
                    ARQUIVA: response.data[0].ARQUIVA,
                    EMAIL_VENDEDOR: response.data[0].EMAIL_VENDEDOR
                };

                this.resultAnal = response.data[0].RESULTADO_ANALISE

                if(response.data[0].DT_SOLICIT_DOCUMENTO != null){
                    this.infoDocumento.DT_SOLICIT_DOCUMENTO = data.toLocaleString('pt-BR', options).replace(',', '');
                }

                if(response.data[0].DATA_DOC_OK != null){
                    this.infoDocumento.DATA_DOC_OK = data2.toLocaleString('pt-BR', options).replace(',', '');
                }

                if(response.data[0].OBS_CADASTRO != null){
                    this.infoDocumento.OBS_CADASTRO = response.data[0].OBS_CADASTRO;
                }else{
                    this.infoDocumento.OBS_CADASTRO = '';
                }

                this.carregandoinfo = false;
                this.parcelas = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/parcelas?cgc=${cgc}`, config);
                this.parcelas = this.parcelas.data
                this.carregandoInfoTabela = false;
            } catch (error) {
                console.log(error);
                if(error.response.status == 404){
                    this.carregandoInfoTabelaErro = true;
                }else{
                    console.log(error.response.status);
                    alert('Falha ao executar ação. Favor tentar novamente mais tarde.');
                }
            }
        },
        async fecharSolicitarDocumento(){
            try {
                this.carregandoInfoTabelaErro = false;
                this.documentoModal = false;
            } catch (error) {
                alert('Falha ao executar ação. Favor tentar novamente mais tarde.');
            }
        },
        async pesquisa(){
            try {
                this.carregando = true;
                let response
                if(this.mostraArquivadas){
                    response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito-arquivadas?orcamento=${this.orcamento}&cliente=${this.nomCli}`, config);
                }else{
                    response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito?orcamento=${this.orcamento}&cliente=${this.nomCli}`, config);
                }
                this.respostas = response.data;
                this.respostas.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                console.log(error)
                alert("Falha ao pesquisar. Favor tentar mais tarde.");
                this.carregando = false;
            }
        },
        esperar(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        trimTrailingSpaces(text) {
            return text.replace(/\s+$/, '');
        },
        async refresh(){
            try {
                this.mostraArquivadas = false;
                this.carregando = true;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/atualiza-proposta-de-frete`, config);
                await this.esperar(1000);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.respostas = response.data;
                response.data.forEach(element => {
                    this.valoresPedido.push((element.VALOR_PEDIDO * 1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                });
                this.respostas.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
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
                    'Authorization': `jwt=${getCookie('jwt')}`,
                    }
                }
                const decoded = jwtDecode(getCookie('jwt'));
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/financeiro/analise-de-credito`, config);
                this.respostas = response.data;
                this.respostas.forEach(element => {
                    this.nomeClientes.push(this.trimTrailingSpaces(element.CLIENTE))
                });
                const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
                response.data.forEach(element => {
                    this.valoresPedido.push((element.VALOR_PEDIDO * 1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                });
                this.idLogado = logado.data[0].intranet_id
                this.nameLogado = logado.data[0].name
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