<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
    <table-top :resultados="resultados">
        <template v-slot:tableButtons>
            <button class="button-8 mb-2" @click="novaCotacao()" v-if="setor == 'Comercial'">Nova Cotação</button>
            <button class="button-8 mb-2" @click="refresh()">Atualizar</button>
            <button class="button-8 mb-2" @click="showAllRev()">Mostrar todas revisões</button>
            <button class="button-8 mb-2" @click="exportarModal = true">Exportar</button>
        </template>
    </table-top>
    <div class="row mb-2">
        <form-floating :placeholder="'Orçamento:'" :id="'pedido'" :type="'text'" v-model="pedido" v-if="!pedidoAllRev" v-on:keyup.enter="pesquisa(pedido, cotador_id, results, vendedor)"></form-floating>
        <form-floating :placeholder="'Vendedor:'" :id="'vendedor'" :type="'text'" v-model="vendedor" v-if="!pedidoAllRev" v-on:keyup.enter="pesquisa(pedido, cotador_id, results, vendedor)"></form-floating>
        <form-floating :placeholder="'Orçamento todas revisões:'" :id="'pedido'" :type="'text'" v-if="pedidoAllRev" v-model="pedido" v-on:keyup.enter="pesquisaAllRev(pedido, cotador_id, results, vendedor)"></form-floating>
        <form-floating :placeholder="'Resultados:'" :id="'resultado'" :type="'number'" v-model="results" v-on:keyup.enter="pesquisa(pedido, cotador_id, results, vendedor)"></form-floating>
    </div>
    <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>ID</th>
            <th>Filial</th>
            <th>Nº Orçamento</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Vendedor</th>
            <th>Status</th>
            <th>Data Solicitação</th>
            <th>Data Resposta</th>
            <th>Revisão</th>
            <th>Valor</th>
            <th>Transportadora</th>
            <th>Cotação Transp.</th>
            <th>Prazo</th>
            <th>Cotador</th>
            <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="resposta in respostas" :key="resposta.id">
            <td>
                <p>{{ resposta.id }}</p>
            </td>
            <td>
                <p>{{ resposta.filial }}</p>
            </td>
            <td>
                <p>{{ resposta.pedido }}</p>
            </td>
            <td>
                <button title="Editar" class="button-8" @click="openClienteModal(resposta.cliente)">{{ resposta.cliente }}</button>
            </td>
            <td>
                <p>CONSULTAR TOTVS</p>
            </td>
<!--             <td>
                <p>{{ resposta.valor_pedido }}</p>
            </td> -->
            <td>
                <p>{{ resposta.vendedor }}</p>
            </td>
            <td>
                <p>{{ resposta.status }}</p>
            </td>
            <td>
                <p>{{ resposta.data_solicit }}</p>
            </td>
            <td>
                <p>{{ resposta.data_resp }}</p>
            </td>
            <td>
                <p>{{ resposta.revisao }}</p>
            </td>
            <td>
                <p>{{ resposta.valor }}</p>
            </td>
            <td>
                <p>{{ resposta.nome_transportadora }}</p>
            </td>
            <td>
                <p>{{ resposta.cod_cot }}</p>
            </td>
            <td>
                <p>{{ resposta.prazo }} <span v-if="resposta.prazo">dias</span></p>
            </td>
            <td>
                <p>{{ resposta.cotador }}</p>
            </td>
            <td>
                <div class="row" style="width: 80%; margin-left: 15%;">
                    <div class="col d-flex justify-content-evenly">
                        <div><button title="Cotar" class="button-8" v-if="!resposta.cotador_id_2 && setor == 'Logística'" @click="openEditarModal(resposta.id)"><i style="font-size: 14px;" class="fa-solid fa-pen"></i></button></div>
                        <div><button title="Escolher" class="button-8" v-if="resposta.cotador_id_2 && setor == 'Comercial'" @click="updateFreteCot(resposta.pedido, resposta.id, resposta.valor, resposta.id_transportadora, resposta.revisao)"><i style="font-size: 14px;" class="fa-solid fa-check"></i></button></div>
                        <div><button title="Arquivar" class="button-8" v-if="resposta.arquivar != 0" @click="arquivaFreteCot(resposta.id)"><i style="font-size: 14px;" class="fa-solid fa-box-archive"></i></button></div>
                        <div><button title="Itens" class="button-8" @click="openItensModal(resposta.pedido)"><i style="font-size: 14px;" class="fa-solid fa-list"></i></button></div>
                    </div>
                </div>
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
                <img v-if="!pedidoAllRev" src="/images/excel.png" alt="" style="width: 10%; cursor: pointer;" @click="exportarExcel">
                <img v-if="!pedidoAllRev" src="/images/pdf.png" alt="" style="width: 10%; cursor: pointer; margin-left: 2%;" @click="exportarPdf">
                <img v-if="pedidoAllRev" src="/images/excel.png" alt="" style="width: 10%; cursor: pointer;" @click="exportarExcelAllRev">
                <img v-if="pedidoAllRev" src="/images/pdf.png" alt="" style="width: 10%; cursor: pointer; margin-left: 2%;" @click="exportarPdfAllRev">
            </div>
        </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="exportarModal = false">Fechar</button> 
    </template>
</modal>

<modal v-if="modalInfo" :title="`Pedido ${proposta.pedido}:`">
    <template v-slot:close><button class="button-8" @click="fecharModalInfo()">Fechar</button></template>
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col">
                <form-floating :placeholder="'Cód. Transportadora:'" :id="'id_transportadora'" :type="'text'" v-model="editar.transp_nome_select" readonly></form-floating>
            </div>
            <div class="col">
                <form-floating :placeholder="'Nome Transportadora:'" :id="'nome_transportadora'" :type="'text'" v-model="editar.transp_nome2_select" readonly></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Valor:'" :id="'valor'" :type="'number'" v-model="editar.valor" ></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Prazo (Dias):'" :id="'prazo'" :type="'number'" v-model="editar.prazo" ></form-floating>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'Filial:'" :id="'filial'" :type="'text'" v-model="proposta.filial" readonly></form-floating>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Código Cotação:'" :id="'codcot'" :type="'text'" v-model="editar.codcot"></form-floating>
            </div>
        </div>
        <div class="row mt-2">
            <div class="row mb-2">
                <form-floating :placeholder="'Nome:'" :id="'nome_transp'" :type="'text'" v-model="transp_nome" v-on:keyup.enter="pesquisaTransp()"></form-floating>
                <p style="color: red;" v-if="erroBuscaTransp">Transportadora não encontrada</p>
            </div>
            <loading v-if="carregandoInfoTransp"></loading>
            <div class="table-wrapper table-responsive table-striped mb-5" v-if="!carregandoInfoTransp">
                <table class="fl-table" id="myTable">
                <thead>
                    <tr style="height: 25px">
                    <th>Código:</th>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Bairro</th>
                    <th>Estado</th>
                    <th>CNPJ</th>
                    <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transportadora in transportadoras" :key="transportadora.cod">
                    <td><p>{{ transportadora.cod }}</p></td>
                    <td><p>{{ transportadora.nome }}</p></td>
                    <td><p>{{ transportadora.end }}</p></td>
                    <td><p>{{ transportadora.bairro }}</p></td>
                    <td><p>{{ transportadora.est }}</p></td>
                    <td><p>{{ transportadora.cgc }}</p></td>
                    <td><button title="Escolher" class="button-8" @click="selecionarTrans(transportadora.cod, transportadora.nome)"><i class="fa-solid fa-check" style="font-size: 14px;"></i></button></td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons>
        <button class="button-8 mt-2" @click="fecharModalInfo()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarModalInfo(proposta.id)">Salvar</button>
    </template>
</modal>

<modal v-if="novaCotacaoModal" :title="`Nova Cotação`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <select-floating :placeholder="'Filial'" :id="'user-setor'" :options="optionsFiliais" v-model="filial"></select-floating>
            <form-floating :placeholder="'Número do Orçamento:'" :id="'numped'" :type="'number'" v-model="numped" ></form-floating><br>
            <p style="color: red;" v-if="alertaPedido">Orçamento não encontrado no Protheus. Verificar se esse orçamento pertence a filial.</p>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharNovaCotacaoModal()">Fechar</button>
        <button class="button-8 mt-2" @click="salvarModalCotacao(numped, filial)">Salvar</button>
    </template>
</modal>

<modal v-if="itensModal" :title="`Itens:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
        <thead>
            <tr style="height: 25px">
            <th>Produto</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Loja</th>
            <th>Observação</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in itens" :key="item.id">
            <td><p>{{ item.produto }}</p></td>
            <td><p>{{ item.descri }}</p></td>
            <td><p>{{ item.qtdven }}</p></td>
            <td><p>{{ item.loja }}</p></td>
            <td><p>{{ item.obs }}</p></td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharItensModal()">Fechar</button>
    </template>
</modal>

<modal v-if="clienteModal" :title="`Cliente:`">
    <template v-slot:body>
    <loading v-if="carregandoinfo"></loading>
    <div v-if="!carregandoinfo">
        <div class="row">
            <div class="col-sm-2">
                <form-floating :placeholder="'Código:'" :id="'cod'" :type="'text'" v-model="cliente.cod" readonly></form-floating><br>
            </div>
            <div class="col">
                <form-floating :placeholder="'Nome:'" :id="'nome'" :type="'text'" v-model="cliente.nome" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'CNPJ:'" :id="'cnpj'" :type="'text'" v-model="cliente.cgc" readonly></form-floating><br>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <form-floating :placeholder="'Endereço:'" :id="'end'" :type="'text'" v-model="cliente.end" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'Código Município:'" :id="'cod_mun'" :type="'text'" v-model="cliente.cod_mun" readonly></form-floating><br>
            </div>
            <div class="col-md-3">
                <form-floating :placeholder="'Município:'" :id="'mun'" :type="'text'" v-model="cliente.mun" readonly></form-floating><br>
            </div>
            <div class="col-sm-1">
                <form-floating :placeholder="'Estado:'" :id="'est'" :type="'text'" v-model="cliente.est" readonly></form-floating><br>
            </div>
            <div class="col-sm-2">
                <form-floating :placeholder="'CEP:'" :id="'cep'" :type="'text'" v-model="cliente.cep" readonly></form-floating><br>
            </div>
        </div>
    </div>
    </template>
    <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8 mt-2" @click="fecharClienteModal()">Fechar</button>
    </template>
</modal>

</template>
    
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
            vendedor: '',
            filial: '',
            setor: '',
            pedidoAllRev: false,
            cliente: [],
            clienteModal: false,
            carregandoInfoTransp: false,
            erroBuscaTransp: false,
            transp_nome: '',
            transportadoras : [],
            itens: [],
            itensModal: false,
            alertaPedido: false,
            values: [],
            numped: '',
            novaCotacaoModal: false,
            proposta: {},
            modalInfo: false,
            exportarModal: false,
            pedido: '',
            cotador_id: null,
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
        async arquivaFreteCot(id){
            try {
                this.carregando = true;
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/arquiva-frete`, [id], config);
                this.refresh()
            } catch (error) {
                this.carregando = false;
                alert("Erro ao realizar ação. Favor tentar novamente mais tarde.")
            }
        },
        async updateFreteCot(numped, id, valor, transp, revisao){
            try {
                this.carregando = true;
                await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/update-frete-cot?cj_num=${numped}&cj_cst_fts=${id}&valor=${valor}&transp=${transp}&revisao=${revisao}`, config);
                this.popup = true;
                setTimeout(()=>{
                    this.popup = false;
                }, 2000);
                this.carregando = false;
            } catch (error) {
                this.carregando = false;
                alert("Erro ao realizar ação. Favor tentar novamente mais tarde.")
            }
        },
        async showAllRev(){
            try {
                this.pedidoAllRev = true;
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete-semrev`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                this.carregando = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.')
            }
        },
        async fecharClienteModal(){
            this.clienteModal = false;
            this.cliente = [];
        },
        async openClienteModal(numped){
            try {
                this.carregandoinfo = true;
                this.clienteModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/clientes/${numped}`, config);
                this.cliente = response.data
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert('Falha ao buscar informações. Favor tentar novamente mais tarde.')
            }
        },
        async selecionarTrans(cod, nome){
            this.editar.transp_nome_select = cod
            this.editar.transp_nome2_select = nome
        },
        async pesquisaTransp(){
            try {
                this.erroBuscaTransp = false;
                this.carregandoInfoTransp = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/transportadoras/${this.transp_nome}`, config);
                this.transportadoras = response.data
                this.carregandoInfoTransp = false;
            } catch (error) {
                this.carregandoInfoTransp = false;
                this.erroBuscaTransp = true;
            }
        },
        async fecharItensModal(){
            this.itensModal = false;
            this.carregandoinfo = false;
            this.itens = [];
        },
        async openItensModal(numped){
            try {
                this.carregandoinfo = true;
                this.itensModal = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-frete-itens/${numped}`, config);
                this.itens = response.data;
                this.carregandoinfo = false;
            } catch (error) {
                alert("Falha ao buscar informações. Tente novamente mais tarde.")
            }
        },
        async salvarModalCotacao(numped, filial){
            try {
                this.carregandoinfo = true;
                if(numped && filial){
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/sck/${numped}/${filial}`, config);
                    if(response){
                        const itens = []
                        response.data.objects.forEach(element => {
                            itens.push({produto: element.produto, qtdven: element.qtdven, loja: element.loja, descri: element.descri, obs: element.obs, valor: element.valor})
                        });
                        const token = document.cookie.replace('jwt=', '');
                        const decoded = jwtDecode(getCookie('jwt'));
                        const respostaScj = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/nova-proposta-de-frete/${numped}/${decoded.id}/${filial}`, itens, config);
                        this.fecharNovaCotacaoModal();
                        this.carregando = true;
                        this.refresh();
                    }
                }else{
                    alert("Favor preencher o número do pedido e filial.");
                    this.carregandoinfo = false;
                }
            } catch (error) {
                this.alertaPedido = true;
                this.carregandoinfo = false;
            }
        },
        async fecharNovaCotacaoModal(){
            this.novaCotacaoModal = false;
            this.carregandoinfo = false;
            this.numped = '';
            this.alertaPedido = false;
        },
        async novaCotacao(){
            try {
                this.carregandoinfo = true;
                this.novaCotacaoModal = true;
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao salvar informações. Tente novamente mais tarde.")
            }
        },
        async salvarModalInfo(id){
            try {
                if(!this.editar.transp_nome_select || this.editar.transp_nome_select == '' || 
                !this.editar.valor || this.editar.valor == '' || 
                !this.editar.prazo || this.editar.prazo == ''){
                    alert('Favor preencher todos os campos.');
                }else{
                    this.modalInfo = false;
                    this.carregando = true;
                    const token = document.cookie.replace('jwt=', '');
                    const decoded = jwtDecode(getCookie('jwt'));
                    this.editar.cotador_id_2 = decoded.id
                    this.erroBuscaTransp = false;
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/${id}`, [this.editar, this.proposta.filial], config);
                    this.refresh();
                    this.editar = {};
                };
            } catch (error) {
                alert("Falha ao salvar informações. Tente novamente mais tarde.")
            }
        },
        async openEditarModal(id){
            try {
                this.modalInfo = true;
                this.carregandoinfo = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/${id}`, config);
                this.proposta = response.data[0];
                const transp = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/transportadoras`, config);
                this.transportadoras = transp.data;
                this.carregandoinfo = false;
            } catch (error) {
                this.carregandoinfo = false;
                alert("Falha ao mostrar mais informações.");
            }
        },
        async fecharModalInfo(){
            this.editar.transp_nome_select = '';
            this.editar.transp_nome2_select = '';
            this.erroBuscaTransp = false;
            this.transportadoras = [];
            this.modalInfo = false;
            this.carregandoinfo = false;
        },
        async exportarExcel(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/excel?pedido=${this.pedido}&resultados=${this.results}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': getCookie('jwt'),
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
                console.log(error)
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async exportarExcelAllRev(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete-semrev/excel?pedido=${this.pedido}&resultados=${this.results}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': getCookie('jwt'),
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
                console.log(error)
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async exportarPdf(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/pdf?pedido=${this.pedido}&resultados=${this.results}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': getCookie('jwt'),
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
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async exportarPdfAllRev(){
            try {
                this.carregando = true;
                axios({
                    url: `${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete-semrev/pdf?pedido=${this.pedido}&resultados=${this.results}`,
                    method: 'GET',
                    responseType: 'blob', // important
                    headers: {
                        'Authorization': getCookie('jwt'),
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
                alert("Falha ao baixar arquivo. Tentar novamente mais tarde.");
                this.carregando = false;
            }
        },
        async pesquisa(pedido, cotador_id, results, vendedor){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete/pesquisa?pedido=${pedido}&resultados=${results}&cotador_id=${cotador_id}&vendedor=${vendedor}`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                alert("Falha ao pesquisar. Favor tentar mais tarde.");
                this.carregando = false;
            }
        },
        async pesquisaAllRev(pedido, cotador_id, results, vendedor){
            try {
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete-semrev/pesquisa?pedido=${pedido}&resultados=${results}&cotador_id=${cotador_id}&vendedor=${vendedor}`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.carregando = false;
            } catch (error) {
                console.log(error)
                alert("Falha ao pesquisar. Favor tentar mais tarde.");
                this.carregando = false; 
            }
        },
        async refresh(){
            try {
                this.pedidoAllRev = false;
                this.carregando = true;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete`, config);
                this.respostas = response.data;
                this.resultados = response.data.length;
                this.fullLoad = true;
                this.carregando = false;
            } catch (error) {
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/comercial/proposta-de-frete`, config);
                this.respostas = response.data;
                const logado = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
                this.setor = logado.data[0].setor;
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