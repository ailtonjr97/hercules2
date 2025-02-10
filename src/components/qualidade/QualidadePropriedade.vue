<template>
    <popup v-if="popup"></popup>
    <div v-if="carregando" id="loading"></div>
    <div v-if="fullLoad" style="overflow: hidden; padding: 0.5%;">
      <table-top :resultados="resultados">
        <template v-slot:tableButtons>
          <button class="button-8 mb-2" @click="abrirModalNovo">Novo</button>
          <button class="button-8 mb-2" @click="pageRefresh">Vigentes</button>
          <button class="button-8 mb-2" @click="mostraArquivados">Arquivadas</button>
        </template>
      </table-top>
      <div class="row mb-2">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'ID:'"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Nome Solicit.:'"></table-search>
        <table-search :id="'procuraBtn2'" :num="2" :placeholder="'Código Cliente:'"></table-search>
      </div>
      <div class="table-wrapper table-responsive table-striped mb-5">
        <table class="fl-table" id="myTable">
          <thead>
            <tr style="height: 25px">
              <th>ID</th>
              <th>Nome Solicit.</th>
              <th>Código Cliente</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="itens in list" :key="itens.id" @dblclick="abrirModalVisu(itens.id)">
              <td><p>{{ itens.id }}</p></td>
              <td><p>{{ itens.nome }}</p></td>
              <td><p>{{ itens.cliente_cod }}</p></td>

              <td>
                <p v-if="itens.status == 0">Em andamento</p>
                <p v-if="itens.status == 1">Aprovado</p>
                <p v-if="itens.status == 2">Reprovado</p>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <modal v-if="chaveModalNovo" :title="'Nova Propriedade do Cliente:'">
      <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <!-- Botões para alternar entre Campos e Mercadorias -->
        <div class="row mb-2" v-if="!carregandoinfo">
          <div class="col">
            <button class="button-8" @click="mudarNovoVisao('novoCampos')">Geral</button>
            <button class="button-8" @click="mudarNovoVisao('novoMercadorias')">Mercadorias</button>
          </div>
        </div>
        <!-- Se a visualização de Campos estiver ativa -->
        <div v-if="!carregandoinfo && novoCampos">
          <div class="row">
            <form-floating :placeholder="'Nome do solicitante:'" :id="'nome'" :type="'text'" v-model="novo.nome"></form-floating> <form-floating :placeholder="'Código do Cliente:'" :id="'cliente_cod'" :type="'text'" v-model="novo.cliente_cod"></form-floating> <form-floating :placeholder="'Nome do Cliente:'" :id="'cliente_nome'" :type="'text'" v-model="novo.cliente_nome"></form-floating>
          </div>
          <div class="row mt-2">
            <form-floating :placeholder="'Número da Nota Fiscal:'" :id="'numero_nf'" :type="'number'" v-model="novo.numero_nf"></form-floating> <form-floating :placeholder="'Transportadora:'" :id="'transportadora'" :type="'text'" v-model="novo.transportadora"></form-floating> <form-floating :placeholder="'Número RRC:'" :id="'rrc'" :type="'text'" v-model="novo.rrc"></form-floating>
          </div>
          <div class="row mt-2">
            <select-floating :placeholder="'Frete'" :id="'frete'" :options="optionsFrete" v-model="novo.frete"></select-floating> <select-floating :placeholder="'Motivo da Devolução'" :id="'mot_dev'" :options="optionsMotDev" v-model="novo.mot_dev"></select-floating>
          </div>
          <div class="row mt-2">
            <textarea-floating :placeholder="'Observações:'" :id="'obs'" v-model="novo.obs"></textarea-floating>
          </div>
          <div class="row mt-2">
            <input type="file" name="anexo-inicio" id="anexo-inicio" multiple @change="handleFileUpload">
          </div>
        </div>
        <!-- Se a visualização de Mercadorias estiver ativa -->
        <div v-if="!carregandoinfo && novoMercadorias">
          <div class="row mt-2">
            <div class="table-wrapper table-responsive">
              <table class="fl-table" id="produtosTable">
                <thead>
                  <tr style="height: 25px">
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(produto, index) in novo.produtos" :key="index">
                    <td><form-floating :placeholder="'Código:'" :id="'cod_prod_' + index" type="text" v-model="produto.cod_prod"></form-floating></td>
                    <td><form-floating :placeholder="'Descrição:'" :id="'nome_' + index" type="text" v-model="produto.nome"></form-floating></td>
                    <td><form-floating :placeholder="'Quantidade:'" :id="'quantidade_' + index" type="text" v-model="produto.quantidade"></form-floating></td>
                    <td><button class="button-8" @click="removerProduto(index)">Remover</button></td>
                  </tr>
                </tbody>
              </table>
              <!-- Botão de Adicionar -->
              <button class="button-8 mt-2 mb-2" @click="adicionarProduto">Adicionar</button>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharModalNovo">Fechar</button> <button class="button-8" @click="enviarNovo">Salvar</button>
      </template>
    </modal>
  
    <modal v-if="chaveModalVisu" :title="'Propriedade do Cliente:'">
      <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <!-- Botões para alternar entre seções -->
        <div class="row" v-if="!carregandoinfo">
          <div class="col">
            <button class="button-8" @click="mudaChave('chaveGeral')">Geral</button>
            <button class="button-8" @click="mudaChave('chaveMercadorias')">Mercadorias</button>
            <button class="button-8" @click="mudaChave('chaveCheckList')" v-if="visu.status == 1">Check List</button>
            <button class="button-8" @click="mudaChave('chaveAnexo')">Anexos</button>
          </div>
        </div>
        <!-- Seção Geral -->
        <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
          <form-floating :placeholder="'Nome do solicitante:'" :id="'nome'" :type="'text'" v-model="visu.nome"></form-floating> 
          <form-floating :placeholder="'Código do Cliente:'" :id="'cliente_cod'" :type="'text'" v-model="visu.cliente_cod"></form-floating> 
          <form-floating :placeholder="'Nome do Cliente:'" :id="'cliente_nome'" :type="'text'" v-model="visu.cliente_nome"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
          <form-floating :placeholder="'Número da Nota Fiscal:'" :id="'numero_nf'" :type="'number'" v-model="visu.numero_nf"></form-floating> <form-floating :placeholder="'Transportadora:'" :id="'transportadora'" :type="'text'" v-model="visu.transportadora"></form-floating> <form-floating :placeholder="'Número RRC:'" :id="'rrc'" :type="'text'" v-model="visu.rrc"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
          <select-floating :placeholder="'Frete'" :id="'frete'" :options="optionsFrete" v-model="visu.frete"></select-floating> <select-floating :placeholder="'Motivo da Devolução'" :id="'mot_dev'" :options="optionsMotDev" v-model="visu.motivo_devolucao"></select-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveGeral">
            <textarea-floating :placeholder="'Observações:'" :id="'obs'" v-model="visu.obs"></textarea-floating>
        </div>
        <!-- Seção Mercadorias -->
        <div class="row mt-2" v-if="!carregandoinfo && chaveMercadorias">
          <div class="table-wrapper table-responsive">
            <table class="fl-table" id="produtosTable">
              <thead>
                <tr style="height: 25px">
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(produto, index) in visu.produtos" :key="index">
                  <td>{{ produto.codigo }}</td>
                  <td>{{ produto.descricao }}</td>
                  <td>{{ produto.quantidade }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Seção Anexos -->
        <div class="row mt-2" v-if="!carregandoinfo && chaveAnexo">
          <div class="table-wrapper table-responsive">
            <table class="fl-table">
              <thead>
                <tr style="height: 25px"><th>Arquivo</th></tr>
              </thead>
              <tbody>
                <tr v-for="anexo in listaAnexos" :key="anexo.ID">
                  <td><a :href="`${ip}/files/${anexo.FILENAME}`" target="_blank">{{ anexo.ORIGINAL_NAME }}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Seção Check List -->
        <div class="row mt-2" v-if="!carregandoinfo && chaveCheckList && visu.status == 1">
          <form-floating :placeholder="'Setor que o produto foi entregue:'" :id="'cliente_nome'" :type="'text'" v-model="visu.entregue_setor"></form-floating>
          <form-floating :placeholder="'Dia da entrega:'" :id="'dia_entrega'" :type="'date'" v-model="visu.no_dia"></form-floating>
          <form-floating :placeholder="'Data da chegada:'" :id="'cliente_nome'" :type="'date'" v-model="visu.data_chegada"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveCheckList && visu.status == 1">
          <textarea-floating :placeholder="'Análise da mercadoria e descrião dos problemas:'" :id="'anali_mer'" v-model="visu.anali_mer"></textarea-floating>
          <textarea-floating :placeholder="'Material necessário para conserto:'" :id="'mat_nece'" v-model="visu.mat_nece"></textarea-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveCheckList && visu.status == 1">
          <form-floating :placeholder="'Data de saída:'" :id="'data_saida'" :type="'date'" v-model="visu.data_saida"></form-floating>
          <form-floating :placeholder="'Inspeção final'" :id="'insp_final'" :type="'text'" v-model="visu.insp_final"></form-floating>
        </div>
        <div class="row mt-2" v-if="!carregandoinfo && chaveCheckList && visu.status == 1">
          <div class="table-wrapper table-responsive">
            <table class="fl-table">
              <thead>
                <tr style="height: 25px">
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label for="pergunta_1">As informações da nota fiscal e material recebido estão corretas?</label>
                  </td>
                  <td>
                    <input type="radio" id="pergunta_1" name="pergunta_1" value="Sim" v-model="visu.pergunta_1"><span>Sim</span>
                    <input type="radio" id="pergunta_1" name="pergunta_1" value="Não" v-model="visu.pergunta_1" style="margin-left: 2%;"><span>Não</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label for="pergunta_2">As informações do cliente, contidas na nota fiscal, estão corretas?</label>
                  </td>
                  <td>
                    <input type="radio" id="pergunta_2" name="pergunta_2" value="Sim" v-model="visu.pergunta_2"><span>Sim</span>
                    <input type="radio" id="pergunta_2" name="pergunta_2" value="Não" v-model="visu.pergunta_2" style="margin-left: 2%;"><span>Não</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label for="pergunta_3">O modelo dos produtos está correto?</label>
                  </td>
                  <td>
                    <input type="radio" id="pergunta_3" name="pergunta_3" value="Sim" v-model="visu.pergunta_3"><span>Sim</span>
                    <input type="radio" id="pergunta_3" name="pergunta_3" value="Não" v-model="visu.pergunta_3" style="margin-left: 2%;"><span>Não</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label for="pergunta_4">A embalagem e o produto estão sem avarias ou sinais de utilização?</label>
                  </td>
                  <td>
                    <input type="radio" id="pergunta_4" name="pergunta_4" value="Sim" v-model="visu.pergunta_4"><span>Sim</span>
                    <input type="radio" id="pergunta_4" name="pergunta_4" value="Não" v-model="visu.pergunta_4" style="margin-left: 2%;"><span>Não</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharModalVisu">Fechar</button>
        <button class="button-8" @click="enviarCheckList" v-if="chaveCheckList && visu.arquiva == 0">Salvar Check List</button>
        <button class="button-8" @click="arquivarPropriedade()" v-if="visu.arquiva == 1 && visu.arquivado == 0">Arquivar</button>
        <button class="button-8" @click="abrirModalConfirmaStatus('reprovar')" v-if="visu.status == 0 && (intranetId == 1 || intranetId == 545 || intranetId == 199 || intranetId == 439)">Reprovar</button>
        <button class="button-8" @click="abrirModalConfirmaStatus('aprovar')" v-if="visu.status == 0 && (intranetId == 1 || intranetId == 545 || intranetId == 199 || intranetId == 439)">Aprovar</button>
      </template>
    </modal>

    <modal v-if="chaveModalConfirmaStatus" :title="'Propriedade do Cliente:'">
      <template v-slot:body>
        <loading v-if="carregandoinfo"></loading>
        <h4>Deseja {{ textoConfirmaStatus }} essa propriedade do cliente?</h4>
      </template>
      <template v-slot:buttons v-if="!carregandoinfo">
        <button class="button-8" @click="fecharModalConfirmaStatus">Fechar</button>
        <button class="button-8" @click="confirmaStatus">Sim</button>
      </template>
    </modal>
  </template>
  

<script>
    import axios from 'axios';
    
    import TableTop from '../ui/TableTop.vue';
    import TableSearch from '../ui/TableSearch.vue';
    import Modal from '../ui/Modal.vue';
    import Loading from '../ui/Loading.vue';
    import FormFloating from '../ui/FormFloating.vue';
    import SelectFloating from '../ui/SelectFloating.vue';
    import TextareaFloating from '../ui/TextareaFloating.vue';
    import AnexFloating from '../ui/AnexFloating.vue';
    import { getAuthConfig } from '../auth/authToken';
    import Popup from '../ui/Popup.vue';
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

    const config2 = getAuthConfig();
    
    export default {
        components: {
            Popup,
            TableTop,
            TableSearch,
            Modal,
            FormFloating,
            SelectFloating,
            TextareaFloating,
            AnexFloating,
            Loading,
            SpanSelect
        },
        data(){
            return{
                chaveModalConfirmaStatus: false,
                textoConfirmaStatus: '',
                novoCampos: true,
                novoMercadorias: false,
                ip: import.meta.env.VITE_BACKEND_IP,
                listaAnexos: null,
                selectedFile: null,
                selectedFiles: [],
                visu: {
                    nome: null,
                    cliente_cod: null,
                    cliente_nome: null,
                    numero_nf: null,
                    transportadora: null,
                    rrc: null,
                    frete: null,
                    motivo_devolucao: null,
                    produtos: [],
                    status: null,
                    pergunta_1: null,
                    pergunta_2: null,
                    pergunta_3: null,
                    pergunta_4: null,
                    entregue_setor: null,
                    no_dia: null,
                    data_chegada: null,
                    anali_mer: null,
                    mat_nece: null,
                    data_saida: null,
                    insp_final: null
                },
                novo: {
                    nome: null,
                    cliente_cod: null,
                    cliente_nome: null,
                    numero_nf: null,
                    transportadora: null,
                    rrc: null,
                    frete: null,
                    mot_dev: null,
                    produtos: [],
                    visu: null
                },
                chaveModalNovo: false,
                chaveModalVisu: false,
                chaveAnexo: false,
                chaveGeral: true,
                chaveMercadorias: false,
                chaveCheckList: false,
                userSetor: null,
                intranetId: null,
                resultados: null,
                fullLoad: false,
                carregandoinfo: false,
                carregando: true,
                list: null,
                popup: false
            }
        },
        computed: {
            optionsFrete(){
                return [
                    {valor: "Fibracem", descri: 'Fibracem'},
                    {valor: "Cliente", descri: 'Cliente'}
                ];
            },
            optionsMotDev(){
                return [
                    {valor: "CLIENTE COMPROU ERRADO", descri: 'CLIENTE COMPROU ERRADO'},
                    {valor: "DEVOLUÇÃO", descri: 'DEVOLUÇÃO'},
                    {valor: "MATERIAL FALTANTE / ACERTO FISCAL", descri: 'MATERIAL FALTANTE / ACERTO FISCAL'},
                    {valor: "REMESSA PARA CONSERTO", descri: 'REMESSA PARA CONSERTO'},
                    {valor: "REMESSA PARA INDUSTRIALIZAÇÃO", descri: 'REMESSA PARA INDUSTRIALIZAÇÃO'},
                    {valor: "TROCA DE MATERIAL EM GARANTIA", descri: 'TROCA DE MATERIAL EM GARANTIA'},
                    {valor: "DEVOLUÇÃO DE RECLAMAÇÃO", descri: 'DEVOLUÇÃO DE RECLAMAÇÃO'},
                    {valor: "OUTRO", descri: 'OUTRO'}
                ];
            },
        },
        methods: {
            async enviarCheckList(){
              try {
                await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades/checklist/${this.visu.id}`, this.visu, config);
                this.popup = true;
                setTimeout(() => {
                  this.popup = false; 
                }, 2000);
                this.fecharModalVisu();
              } catch (error) {
                  console.log(error)
                  alert("Falha ao carregar página.");
                  this.carregando = false;
              }
            },
            async mostraArquivados(){
              try {
                    this.carregando = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades/arquivados`, config);
                    this.list = response.data;
                    this.resultados = response.data.length;
                    this.fullLoad = true;
                    this.carregando = false;
                } catch (error) {
                   console.log(error)
                   alert("Falha ao carregar página.");
                   this.carregando = false;
                }
            },
            async arquivarPropriedade(){
              try {
                  await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedade/arquivar`, {'id': this.visu.id}, config);
                  this.fecharModalVisu();
                  this.pageRefresh();
                  this.popup = true;
                  setTimeout(() => {
                    this.popup = false; 
                  }, 2000);
                } catch (error) {
                  console.log(error);
                  alert("Falha ao executar. Favor tente novamente mais tarde.");
                  this.carregando = false;
                }
            },
            async confirmaStatus(){
                try {
                  if(this.textoConfirmaStatus == 'aprovar'){
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedade/status`, {'id': this.visu.id, 'status': 1, 'arquiva': 0}, config);
                  }else{
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedade/status`, {'id': this.visu.id, 'status': 2, 'arquiva': 1}, config);
                  };
                  this.fecharModalConfirmaStatus();
                  this.fecharModalVisu();
                  this.pageRefresh();
                  this.popup = true;
                  setTimeout(() => {
                    this.popup = false; 
                  }, 2000);
                } catch (error) {
                  console.log(error);
                  alert("Falha ao executar. Favor tente novamente mais tarde.");
                  this.carregando = false;
                }
            },
            fecharModalConfirmaStatus(){
              this.textoConfirmaStatus = '';
              this.chaveModalConfirmaStatus = false;
            },
            abrirModalConfirmaStatus(status){
              try {
                this.textoConfirmaStatus = status;
                this.chaveModalConfirmaStatus = true;
              } catch (error) {
                console.log(error);
                alert("Falha ao executar. Favor tente novamente mais tarde.");
                this.carregando = false;
              }
            },
            mudarNovoVisao(chave) {
                // Reseta ambas as visões e ativa apenas a selecionada
                this.novoCampos = false;
                this.novoMercadorias = false;
                this[chave] = true;
            },
            adicionarProduto() {
                // Adiciona um novo objeto de produto com os campos vazios
                this.novo.produtos.push({ cod_prod: '', nome: '', quantidade: '' });
            },
            removerProduto(index) {
                // Remove o produto no índice especificado
                this.novo.produtos.splice(index, 1);
            },
            mudaChave(chave) {
                try {
                    // Reseta todas as seções
                    this.chaveGeral = false;
                    this.chaveMercadorias = false;
                    this.chaveAnexo = false;
                    this.chaveCheckList = false;
                    // Ativa a seção selecionada
                    this[chave] = true;
                } catch (error) {
                    console.log(error);
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            handleFileUpload(event) {
                // event.target.files é um FileList; converta para array se necessário
                this.selectedFiles = Array.from(event.target.files);
            },
            async fecharModalVisu(){
                try {
                    Object.keys(this.visu).forEach(key => {
                        this.visu[key] = null;
                    });
                    this.chaveModalVisu = false;
                    this.chaveAnexo = false;
                    this.chaveGeral = true;
                    this.chaveCheckList = false;
                    this.chaveMercadorias = false;
                    this.selectedFiles = [];
                } catch (error) {
                    console.log(error)
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            async abrirModalVisu(id) {
                try {
                    this.chaveModalVisu = true;
                    this.carregandoinfo = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedade/${id}`, config);
                    const anexos = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades-arquivo/${id}`, config);
                    const produtos = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades-produtos/${id}`, config);
                    
                    this.listaAnexos = anexos.data;
                    this.visu = response.data[0];
                    this.visu.produtos = produtos.data || [];

                    // Formatar as datas para o input date
                    if (this.visu.no_dia) {
                        this.visu.no_dia = this.visu.no_dia.split("T")[0]; // "YYYY-MM-DD"
                    }

                    if (this.visu.data_chegada) {
                        this.visu.data_chegada = this.visu.data_chegada.split("T")[0]; // "YYYY-MM-DD"
                    }

                    if (this.visu.data_saida) {
                        this.visu.data_saida = this.visu.data_saida.split("T")[0]; // "YYYY-MM-DD"
                    }

                    this.carregandoinfo = false;   
                } catch (error) {
                    console.log(error);
                    alert("Falha ao carregar página.");
                    this.carregando = false;
                }
            },
            async pageRefresh(){
                try {
                    this.carregando = true;
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, config);
                    this.list = response.data;
                    this.resultados = response.data.length;
                    this.fullLoad = true;
                    this.carregando = false;
                } catch (error) {
                   console.log(error)
                   alert("Falha ao carregar página.");
                   this.carregando = false;
                }
            },
            async enviarNovo(){
                try {
                    // Envia os dados da nova propriedade
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, this.novo, config);
                    const id = response.data.id;
                    
                    // Se houver arquivos selecionados, faça o upload de todos
                    if(this.selectedFiles && this.selectedFiles.length > 0) {
                    const formData = new FormData();
                    // Anexa cada arquivo com o mesmo nome de campo (por exemplo, 'files')
                    this.selectedFiles.forEach(file => {
                        formData.append('files', file);
                    });
                    // Envie o id para relacionar os arquivos à propriedade
                    formData.append('id', id); 
                    
                    await axios.post(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades-arquivo`, formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `jwt=${getCookie('jwt')}`
                        }
                    });
                    }
                    
                    // Fechar modal, exibir popup e atualizar a lista
                    await this.fecharModalNovo();
                    this.popup = true;
                    setTimeout(() => { this.popup = false; }, 2000);
                    await this.pageRefresh();
                } catch (error) {
                    console.error(error);
                    alert("Erro ao executar. Favor tentar novamente mais tarde.");
                    this.carregando = false;
                }
            },
            async fecharModalNovo() {
                try {
                    // Reconfigura o objeto novo com os valores padrão, garantindo que produtos seja um array vazio
                    this.novo = {
                    nome: null,
                    cliente_cod: null,
                    cliente_nome: null,
                    numero_nf: null,
                    transportadora: null,
                    rrc: null,
                    frete: null,
                    mot_dev: null,
                    produtos: []
                    };
                    this.chave
                    this.chaveModalNovo = false;
                    this.mudarNovoVisao('novoCampos')
                } catch (error) {
                    console.log(error);
                    alert("Erro ao carregar página. Favor tentar mais tarde.");
                    this.carregando = false;
                }
            },
            async abrirModalNovo(){
                try {
                    this.chaveModalNovo = true;
                } catch (error) {
                    console.log(error)
                    alert("Erro ao carregar página. Favor tentar mais tarde.");
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
                const loggedIn = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config);
                this.userSetor = loggedIn.data[0].setor;
                this.intranetId = loggedIn.data[0].intranet_id;
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/qualidade/propriedades`, config);
                this.list = response.data;
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

<style scoped>
  .fl-table tbody tr:hover {
    background-color: #e0e0e0; /* Altere para a cor desejada */
  }
</style>