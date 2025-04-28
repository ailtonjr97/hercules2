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
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="filialFiltro"  :id="'procuraBtn4'" :num="4" :placeholder="'Filial:'"          :type="'text'"></form-floating >
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="pedido"        :id="'procuraBtn0'" :num="0" :placeholder="'Pedido:'"          :type="'text'"></form-floating >
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="vendedor"      :id="'procuraBtn3'" :num="3" :placeholder="'Vendedor:'"        :type="'text'"></form-floating >
        <form-floating  v-on:keyup.enter="pesquisa()" v-model="clienteFiltro" :id="'procuraBtn5'" :num="5" :placeholder="'Cliente:'"         :type="'text'"></form-floating >
        <form-floating  @change="pesquisa()" v-model="dataEnt"       :id="'procuraBtn2'" :num="2" :placeholder="'Data de Entrega:'" :type="'date'"></form-floating >
    </div>
    <div class="row mb-2">
        <div class="col">
            <input                      type="radio" name="filtro_radio" id="filtro_separado_cd"           @click="pesquisa('C5_XSEPCD', 'C5_XLIBCOM', 'F', 'F')"><label for="filtro_separado_cd">Aguard. Separado CD</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_liberado_comercial"    @click="pesquisa('C5_XSEPCD', 'C5_XLIBCOM', 'T', 'F')"><label for="filtro_liberado_comercial">Aguardando Liberado Comercial</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_liberado_faturamento"  @click="pesquisa('C5_XLIBCOM', 'C5_XLIBFAT', 'T', 'F')"><label for="filtro_liberado_faturamento">Aguardando Liberado Faturamento</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_retorno_fiscal"        @click="pesquisa('C5_XLIBFAT', 'C5_XRETFIS', 'T', 'F')"><label for="filtro_retorno_fiscal">Aguardando Retorno Fiscal</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_faturado"              @click="pesquisa('C5_XRETFIS', 'C5_XFATURD', 'T', 'F')"><label for="filtro_faturado">Aguardando Faturado</label>
        </div>
    </div>
    <div class="row mb-2">
        <div class="col">
            <input type="radio" name="filtro_radio" id="filtro_liberado_expedicao"                 @click="pesquisa('C5_XFATURD', 'C5_XLIBEXP', 'T', 'F')"><label for="filtro_liberado_expedicao">Aguardando Liberado Expedição</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_nota_impressa" @click="pesquisa('C5_XLIBEXP', 'C5_XNOTIMP', 'T', 'F')"><label for="filtro_nota_impressa">Aguardando Nota Impressa</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_expedido"      @click="pesquisa('C5_XNOTIMP', 'C5_XEXPEDI', 'T', 'F')"><label for="filtro_expedido">Aguardando Expedido</label>
            <input class="separa-radio" type="radio" name="filtro_radio" id="filtro_todos"         @click="pesquisa()" checked><label for="filtro_todos">Todos</label>
        </div>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Itens</th>
            <!-- <th>ID</th> -->
            <th>Filial</th>
            <th>Pedido</th>
            <th>Retorno/Nota</th>
            <th>Vendedor</th>            
            <th>Cliente</th>
            <th>Nome Cliente</th>
            <th>Data de Entrega</th>
            <th>Separado CD</th>
            <th>Liberado Comercial</th>
            <th>Liberado Faturamento</th>
            <th>Retorno Fiscal</th>
            <th>Faturado</th>
            <th>Liberado Expedição</th>
            <th>Nota Impressa</th>
            <th>Expedido</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="api in apis" :style="{backgroundColor: api.C5_XRECLAM === '1' ? '#cb5f5f' : (!api.C5_XEXPEDI && isDataEntregaVencida(api.C5_FECENT) ? '#f5d774' : '')}">
                <td>
                    <button @click="openItensModal(api.C5_FILIAL, api.C5_NUM, api.C5_VEND1, api.C5_CLIENTE, api.C5_XLIBCOM)" title="Itens" class="button-8">Itens</button>
                    <button v-if="userId == 441 || userId == 849 || userId == 431  || userId == 654 || userId == 294" @click="openValFreteModal(api.C5_FILIAL, api.C5_NUM)" title="Alterar valor frete" class="button-8"><i class="fa-solid fa-truck"></i></button>
                </td>
                <!-- <td>{{ api.R_E_C_N_O_ }}</td> -->
                <td>{{ api.C5_FILIAL}}</td>
                <td>{{ api.C5_NUM}}</td>
                <td>{{ api.C5_XPEDTR}}</td>
                <td>
                    {{ api.A3_NREDUZ}}  <br>
                    <button v-if="setor == 'Comercial'" @click="atualizaObsVend(api.C5_FILIAL, api.C5_NUM, api.C5_XOBSV)" title="Enviar" class="button-8" style="bottom: 10px;">Enviar</button>
                    <textarea v-model="api.C5_XOBSV" cols="8" rows="1" style="resize: both; overflow: auto;" maxlength="200"></textarea>
                </td>              
                <td>
                    <button title="Ver cliente" class="button-8" @click="openClienteModal(api.C5_CLIENTE, api.C5_LOJACLI)">{{ api.C5_CLIENTE }}</button>
                </td>
                <td>{{ api.A1_NOME}}</td>             
                <td>{{ api.C5_FECENT}}</td>
                <td>
                    <input class="mt-4" @click="$event.preventDefault()" type="checkbox" name="separado_cd" id="separado_cd" :checked="api.C5_XSEPCD === 'T'"><br>
                    {{ api.C5_XNSEPCD  }}<br>
                    {{ api.C5_XHSEPCD }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaLibCom(api.C5_FILIAL, api.C5_NUM, api.C5_XLIBFAT, $event)" type="checkbox" name="liberado_comercial" id="liberado_comercial" :checked="api.C5_XLIBCOM === 'T'" :disabled="api.C5_XSEPCD === 'F'"><br>
                    {{ api.C5_XNLIBCO  }}<br>
                    {{ api.C5_XHLIBCO }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaLibFat(api.C5_FILIAL, api.C5_NUM, api.C5_XRETFIS, $event)" type="checkbox" name="liberado_faturamento" id="liberado_faturamento" :checked="api.C5_XLIBFAT === 'T'" :disabled="api.C5_XLIBCOM === 'F'"><br>
                    {{ api.C5_XNLIBFA  }}<br>
                    {{ api.C5_XHLIBFA }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaRetFis(api.C5_FILIAL, api.C5_NUM, api.C5_XFATURD, $event)" type="checkbox" name="retorno_fiscal" id="retorno_fiscal" :checked="api.C5_XRETFIS === 'T'" :disabled="api.C5_XLIBFAT === 'F'"><br>
                    {{ api.C5_XNRETFI }}<br>
                    {{ api.C5_XHRETFI }}<br>
                    <span v-if="api.C5_XRETFIS">Nota: {{ api.NOTA_RET }}</span>
                    
                </td>
                <td>
                    <input class="mt-4" @click="marcaFaturd(api.C5_FILIAL, api.C5_NUM, api.C5_XLIBEXP, $event)" type="checkbox" name="faturado" id="faturado" :checked="api.C5_XFATURD === 'T'" :disabled="api.C5_XRETFIS === 'F'"><br>
                    {{ api.C5_XNFATUR  }}<br>
                    {{ api.C5_XHFATUR  }}
                </td>
                <td>
                    <input class="mt-4" @click="marcaLibexp(api.C5_FILIAL, api.C5_NUM, api.C5_XNOTIMP, $event)" type="checkbox" name="liberado_expedicao" id="liberado_expedicao" :checked="api.C5_XLIBEXP === 'T'" :disabled="api.C5_XFATURD === 'F'"><br>
                    {{ api.C5_XNLIBEX  }}<br>
                    {{ api.C5_XHLIBEX }}<br>
                    <span v-if="api.C5_XLIBEXP">Nota: {{ api.C5_NOTA }}</span><br>
                    <a v-if="api.C5_XLIBEXP" :href="`http://aplicacao.fibracem.com:8080/qualidade/certificado-garantia?filial=${api.C5_FILIAL}&cli=${api.C5_CLIENTE}&doc=${api.C5_NOTA}&loja=${api.C5_LOJACLI}`" class="button-8" target="_blank">Certificado</a>
                </td>
                <td>
                    <input class="mt-4" @click="marcaNotaImp(api.C5_FILIAL, api.C5_NUM, api.C5_XEXPEDI, $event)" type="checkbox" name="nota_impressa" id="nota_impressa" :checked="api.C5_XNOTIMP === 'T'" :disabled="api.C5_XLIBEXP === 'F'"><br>
                    {{ api.C5_XNNOTIM  }}<br>
                    {{ api.C5_XHNOTIM }}<br>
                </td>
                <td>
                    <input class="mt-4" @click="marcaExpedi(api.C5_FILIAL, api.C5_NUM, $event)" type="checkbox" name="expedido" id="expedido" :checked="api.C5_XEXPEDI === 'T'" :disabled="api.C5_XNOTIMP === 'F'"><br>
                    {{ api.C5_XNEXPED  }}<br>
                    {{ api.C5_XHEXPED }}
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>

<modal v-if="abreAltValorFrete" :title="`Alterar valor de frete do pedido ${freteNum} filial ${freteFilial}:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <form-floating :placeholder="'Valor:'" :id="'valFrete'" :type="'number'" v-model="freteVal"></form-floating><br>
            </div>
            <div class="col">
                <select-floating :placeholder="'Tipo Frete:'" :id="'tiposFrete'" :options="tiposFrete" v-model="freteTipo"></select-floating>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="closeValFreteModal()">Fechar</button>
        <button class="button-8 mt-2" @click="alterarValFrete(freteFilial, freteNum)">Salvar</button>
    </template>
</modal>

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

<modal v-if="clienteModal" :title="`Cliente:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col-sm-2">
                <form-floating :placeholder="'Código:'" :id="'cod'" :type="'text'" v-model="cliente.A1_COD" readonly></form-floating><br>
            </div>
            <div class="col">
                <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="cliente.A1_NOME" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'CNPJ:'" :id="'cnpj'" :type="'text'" v-model="cliente.A1_CGC" readonly></form-floating><br>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <form-floating :placeholder="'Endereço:'" :id="'end'" :type="'text'" v-model="cliente.A1_END" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Código Município:'" :id="'cod_mun'" :type="'text'" v-model="cliente.A1_COD_MUN" readonly></form-floating><br>
            </div>
            <div class="col-md-3">
                <form-floating :placeholder="'Município:'" :id="'mun'" :type="'text'" v-model="cliente.A1_MUN" readonly></form-floating><br>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'Estado:'" :id="'est'" :type="'text'" v-model="cliente.A1_EST" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'CEP:'" :id="'cep'" :type="'text'" v-model="cliente.A1_CEP" readonly></form-floating><br>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharClienteModal()">Fechar</button>
    </template>
</modal>

<modal v-if="itensModal" :title="`Itens do Orçamento:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
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
                    <tr v-for="iten in itensLista" :key="iten.C6_ITEN">
                        <td style="word-wrap: break-word; width: 5px;">{{ iten.C6_PRODUTO }}</td>
                        <td>{{ iten.C6_DESCRI }}</td>
                        <td>{{ iten.C6_QTDVEN }}</td>
                        <td><input type="checkbox" name="" id="" :checked="iten.C6_XSEPCD === 'T'" v-model="iten.C6_XSEPCD" @click="marcaSepC6(iten.C6_FILIAL, iten.C6_NUM, iten.C6_ITEM, iten.C6_PRODUTO, $event, vendListaItem, clienteListaItem, iten.C6_XSEPCD)"></td>
                        <td>{{ iten.C6_XNSEPCD }}</td>
                        <td>{{ iten.C6_XHSEPCD }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="itensModal = false">Fechar</button>
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
    'Authorization': `jwt=${getCookie('jwt')}`,
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
        freteTipo: "C",
        freteVal: null,
        freteNum: null,
        freteFilial: null,
        abreAltValorFrete: false,
        userId: null,
        clienteFiltro: '',
        libcom: null,
        vendListaItem: null,
        clienteListaItem: null,
        itensLista: null,
        itensModal: false,
        filialFiltro: '',
        vendedor: '',
        dataEnt: '',
        mostraErro: false,
        textoPad: '',
        pedido: '',
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
        clienteModal: false,
        cliente: [],     
    }
},
computed:{
    tiposFrete(){
            return [
                {valor: "C", descri: 'C - CIF'},
                {valor: "F", descri: 'F - FOB'},
        ];
    },
},
methods: {
    isDataEntregaVencida(data) {
        if (!data) return false;
        const [dia, mes, ano] = data.split('/');
        const dataEntrega = new Date(`${ano}-${mes}-${dia}T00:00:00`);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return dataEntrega < hoje;
    },
    async alterarValFrete(filial, num){
        try {
            this.carregandoinfo = true;
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/atualiza-val-frete?filial=${filial}&numero=${num}`, {'texto': this.freteVal, 'tipo': this.freteTipo}, config);
            this.carregandoinfo = false;
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde');
            this.carregando = false;
            this.carregandoinfo = false;
        }
    },
    async closeValFreteModal(){
        try {
            this.freteFilial = null;
            this.freteNum = null;
            this.abreAltValorFrete = false;
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde');
            this.carregando = false;
        }
    },
    async openValFreteModal(filial, num){
        try {
            this.freteFilial = filial;
            this.freteNum = num;
            this.abreAltValorFrete = true;
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde');
            this.carregando = false;
        }
    },
    async atualizaObsVend(filial, numero, texto){
        try {
            this.carregando = true;
            await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/atualiza-obs-vend?filial=${filial}&numero=${numero}`, {'texto': texto}, config);
            this.carregando = false;
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde');
            this.carregando = false;
        }
    },
    async openItensModal(filial, numero, vendedor, cliente, libcom){
        try {
            this.libcom = libcom
            this.vendListaItem = vendedor;
            this.clienteListaItem = cliente;
            this.carregandoinfo = true;
            this.itensModal = true;
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/itens?filial=${filial}&numero=${numero}`, config);
            this.itensLista = response.data;
            this.carregandoinfo = false;
        } catch (error) {
            console.log(error)
            alert('Falha ao executar ação. Tente novamente mais tarde');
            this.carregandoinfo = false;
        }
    },
    async mostraModal(erro){
        this.mostraErro = true;
        this.textoPad = erro;
        this.carregando = false;
    },
    async pesquisa(pCampo, sCampo, pValor, sValor){
        try {
            if(!pCampo || pCampo == 'undefined'){
                document.getElementById('filtro_todos').checked = true;
            }
            this.carregando = true;
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
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?pedido=${this.pedido}&data_ent=${this.dataEnt}&vendedor=${this.vendedor}&filial=${this.filialFiltro}&pcampo=${pCampo}&scampo=${sCampo}&pvalor=${pValor}&svalor=${sValor}&clientenome=${this.clienteFiltro}`, config);
            const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.apis = response.data;
            this.setor = logado.data[0].setor;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            console.log(error);
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
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Expedido do pedido ${num}, filial ${filial}.`], config);                    
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XEXPEDI/F/${this.nome}/C5_XNEXPED/C5_XHEXPED`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Expedido Expedicao do pedido ${num}, filial ${filial}.`], config);
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
    async marcaNotaImp(filial, num, expedi, e){
        try {
            if(expedi === 'T'){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Expedido' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Logística"){
                this.mostraModal("Somente usuários do setor da Logística podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XNOTIMP/T/${this.nome}/C5_XNNOTIM/C5_XHNOTIM`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Nota Impressa do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XNOTIMP/F/${this.nome}/C5_XNNOTIM/C5_XHNOTIM`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Nota Impressa do pedido ${num}, filial ${filial}.`], config);
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
            if(expedi === 'T'){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Nota Impressa' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro" && this.userId != 259){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBEXP/T/${this.nome}/C5_XNLIBEX/C5_XHLIBEX`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Liberado Expedicao do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBEXP/F/${this.nome}/C5_XNLIBEX/C5_XHLIBEX`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Liberado Expedicao do pedido ${num}, filial ${filial}.`], config);
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
            if(lebxp === 'T'){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Liberado Expedicao' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro" && this.userId != 259){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XFATURD/T/${this.nome}/C5_XNFATUR/C5_XHFATUR`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Faturado do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XFATURD/F/${this.nome}/C5_XNFATUR/C5_XHFATUR`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Faturado do pedido ${num}, filial ${filial}.`], config);
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
    async marcaRetFis(filial, num, faturd, e){
        try {
            if(faturd === 'T'){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Faturado' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Logística" && this.userId != 441 && this.userId != 849 && this.userId != 654 && this.userId != 294 && this.userId != 259){ //Bruna, João Prestes, Mayara e Alex Lemes
                this.mostraModal("Somente usuários do setor Logística podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XRETFIS/T/${this.nome}/C5_XNRETFI/C5_XHRETFI`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Retorno Fiscal do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XRETFIS/F/${this.nome}/C5_XNRETFI/C5_XHRETFI`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Retorno Fiscal do pedido ${num}, filial ${filial}.`], config);
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
    async marcaLibFat(filial, num, xretfis, e){
        try {
            if(xretfis === "T"){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Retorno Fiscal' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Financeiro"){
                this.mostraModal("Somente usuários do setor Financeiro podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBFAT/T/${this.nome}/C5_XNLIBFA/C5_XHLIBFA`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Liberado Faturamento do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBFAT/F/${this.nome}/C5_XNLIBFA/C5_XHLIBFA`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Liberado Faturamento do pedido ${num}, filial ${filial}.`], config);
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
            if(libfat === 'T'){
                this.mostraModal("Não é permitido editar esse campo enquanto o campo 'Liberado Faturamento' estiver preenchido.");
                e.preventDefault();
            }else if(this.setor != "Comercial"){
                this.mostraModal("Somente usuários do setor Comercial podem editar esse campo.");
                e.preventDefault();
            }else{
                this.carregando = true;
                if(e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBCOM/T/${this.nome}/C5_XNLIBCO/C5_XHLIBCO`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado Liberado Comercial do pedido ${num}, filial ${filial}.`], config);
                }else if (!e.target.checked){
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_campo/${filial}/${num}/C5_XLIBCOM/F/${this.nome}/C5_XNLIBCO/C5_XHLIBCO`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado Liberado Comercial do pedido ${num}, filial ${filial}.`], config);
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
    async marcaSepC6(filial, num, item, produto, event, vendedor, cliente, marcado){
        try {
            if(this.libcom == 'T' || (this.setor != "Logística" && this.userId != 132)){
                this.itensModal = false;
                this.mostraModal("Não é permitido desmarcar itens se a opção 'Liberado Comercial' estiver marcada ou se o usuário não for da Logística.")
                event.preventDefault();
            }else{
                if(marcado === 'F'){
                    this.carregandoinfo = true;
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_c6xsepcd/${filial}/${num}/${item}/${produto}/${this.nome}?vendedor=${vendedor}&cliente=${cliente}&marcado=${false}`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Desmarcado item ${produto} (${item}), do pedido ${num}, filial ${filial} no track order.`], config);
                    this.refresh();
                    this.popup = true;
                    setTimeout(()=>{
                        this.popup = false;
                    }, 2000);
                    this.openItensModal(filial, num, vendedor, cliente)
                    this.carregandoinfo = false;
                }else if (this.setor != "Logística" && this.userId != 132){
                    this.mostraModal("Somente usuários do setor da Logística podem editar esse campo.")
                    event.preventDefault()
                }else{
                    this.carregandoinfo = true;
                    await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/update_c6xsepcd/${filial}/${num}/${item}/${produto}/${this.nome}?vendedor=${vendedor}&cliente=${cliente}&marcado=${true}`, config);
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/log`, [this.nome, `Marcado item ${produto} (${item}), do pedido ${num}, filial ${filial} no track order.`], config);
                    this.refresh();
                    this.popup = true;
                    setTimeout(()=>{
                        this.popup = false;
                    }, 2000);
                    this.openItensModal(filial, num, vendedor, cliente)
                    this.carregandoinfo = false;
                }   
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
                'Authorization': `jwt=${getCookie('jwt')}`,
                }
            }
            const decoded = jwtDecode(getCookie('jwt'));
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?pedido=${this.pedido}&data_ent=${this.dataEnt}&vendedor=${this.vendedor}&filial=${this.filialFiltro}&clientenome=${this.clienteFiltro}`, config);
            const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            this.apis = response.data;
            this.setor = logado.data[0].setor;
            this.resultados = response.data.length;
            this.carregando = false;
        } catch (error) {
            this.mostraModal("Falha ao recarregar página.")
        }
    },
async fecharClienteModal(){
            this.clienteModal = false;
            this.cliente = [];
        },
async openClienteModal(numped, loja){
            try {
                this.carregandoinfo = true;
                this.clienteModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/clientes/${numped}/${loja}`, config);
                this.cliente = response.data
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.')
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/track_order/get_all?pedido=&data_ent=&vendedor=&filial=&pcampo=&scampo=&pvalor=&svalor=&clientenome=`, config);
        const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        this.apis = response.data;
        this.setor = logado.data[0].setor;
        this.nome = logado.data[0].name;
        this.resultados = response.data.length;
        this.carregando = false;
        this.userId = logado.data[0].intranet_id
    } catch (error) {
        console.log(error)
        alert("Erro ao carregar página. Favor tentar mais tarde.");
        this.carregando = false;
    }
}
}
</script>

<style>
    .separa-radio{
        margin-left: 2%;
    }
</style>