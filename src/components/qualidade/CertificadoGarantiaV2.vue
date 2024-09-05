<template>
    <div>
      <div class="container my-5 p-4 border rounded" ref="printContainer">
        <img data-v-c4be3a62="" src="/images/LOGO-FIBRACEM-5.webp" alt="" class="logo"><br><br>
        <h1 class="titulo">CERTIFICADO DE GARANTIA FIBRACEM</h1>
  
        <div class="informacoes-cliente my-4" v-for="dado in dados" :key="dado.codigo">
          <p><strong>Data de Emissão NF:</strong> {{ formatDate(dado.F2_EMISSAO) }}</p>
          <p><strong>Cliente:</strong> {{ dado.CLIENTE }}</p>
          <p><strong>Número NF:</strong> {{ dado.F2_DOC }}</p>
        </div>
        
  
  
        <table class="table table-bordered">
          <thead  style="background-color: #01135d; color: white;">
            <tr>
              <th scope="col" class="codigo-col">CÓDIGO</th>
              <th scope="col" class="descricao-col">DESCRIÇÃO</th>
              <th scope="col" class="quantidade-col">QUANTIDADE</th>
              <th scope="col" class="unidade-col">UN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itens" :key="item.D2_COD">
              <td class="codigo-col">{{ item.D2_COD }}</td>
              <td class="descricao-col">{{ item.DESCRI }}</td>
              <td class="quantidade-col">{{ item.D2_QUANT }}</td>          
              <td class="unidade-col">{{ item.D2_UM }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="condicoes my-4">
              <p class="lead text-justify">
                <strong>Termo de Garantia de 1 Ano para Produtos de Telecomunicações - FIBRACEM</strong><br>
              </p>
              <h4>1. Condições Gerais</h4>
              <ul>
                <li>A FIBRACEM, líder no mercado de soluções de infraestrutura para telecomunicações, garante ao cliente que os produtos adquiridos e	starão livres de defeitos de fabricação e material pelo período de 1 (um) ano, a contar da data de compra, conforme especificado na nota fiscal.</li>
              </ul>
              <h4>2. Cobertura da Garantia</h4>
              <ul>
                <li>Defeitos de fabricação.</li>
                <li>Problemas decorrentes de falhas no material utilizado na produção do produto.</li>
                <li>Mal funcionamento que comprometa o desempenho esperado do produto.</li>
              </ul>
  
              <h4>3. Procedimentos para Requisição da Garantia</h4>
              <ul>
                <li>Contatar o Serviço de Atendimento ao Cliente da FIBRACEM pelo telefone ou e-mail fornecidos em nosso site oficial.</li>
                <li>Fornecer uma cópia da nota fiscal de compra e uma descrição detalhada do defeito apresentado.</li>
                <li>Enviar o produto defeituoso para a FIBRACEM, acompanhado da documentação solicitada, após receber autorização do nosso atendimento.</li>
              </ul>
  
              <h4>4. Exclusões da Garantia</h4>
              <ul>
                <li>Danos causados por uso inadequado, negligência, modificações ou reparos feitos por terceiros não autorizados pela FIBRACEM.</li>
                <li>Desgaste natural do produto devido ao uso normal.</li>
                <li>Danos decorrentes de acidentes, intempéries ou quaisquer outros eventos fora do controle da FIBRACEM.</li>
                <li>Produtos cujo número de série ou lacre de garantia tenham sido alterados ou removidos.</li>
              </ul>
  
              <h4>5. Responsabilidades da FIBRACEM</h4>
              <p>
                A FIBRACEM compromete-se a reparar ou substituir, a seu critério, qualquer produto que apresente defeitos cobertos por esta garantia.
              </p>
              <p>
                O prazo para reparo ou substituição será comunicado ao cliente após a avaliação do produto defeituoso.
              </p>
              <p>
                Os custos de envio do produto defeituoso para a FIBRACEM serão de responsabilidade do cliente, enquanto os custos de devolução do produto reparado ou substituído serão arcados pela FIBRACEM.
              </p>
  
              <h4>6. Limitações da Garantia</h4>
              <p>
                Esta garantia é válida exclusivamente para o comprador original do produto e não é transferível. A FIBRACEM não se responsabiliza por quaisquer danos indiretos, consequenciais ou incidentais decorrentes do uso ou da incapacidade de uso dos produtos.
              </p>
  
              <h4>7. Disposições Finais</h4>
              <p>
                Esta garantia constitui o único e exclusivo recurso do cliente contra a FIBRACEM no caso de defeitos no produto. Nenhuma outra garantia, expressa ou implícita, incluindo garantias de comercialização ou adequação a um propósito específico, será aplicável.
              </p>
  
              <h4>8. Contato</h4>
              <p>
                Telefone: (41) 99946-0613<br>
                E-mail: reclamacao@fibracem.com<br>
                Site: www.fibracem.com.br
              </p>
  
              <p>
                Este Termo de Garantia é parte integrante do compromisso da FIBRACEM em fornecer produtos de alta qualidade e confiabilidade aos nossos clientes.
              </p>
              <br>
              <br>
              <center>
               <img data-v-c4be3a62="" src="/images/iso certificado.png" alt="" style="height: 120px; width: 340px;">
               <img data-v-c4be3a62="" src="/images/qr anatel.png" alt=""  style="height: 200px; width: 150px;">
              </center>
        </div>
      </div>
      <button @click="printContent" class="btn btn-primary mt-3">Imprimir</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CertificadoGarantia',
    data() {
      return {
        itens: [],
        dados: []
      };
    },
    mounted() {
      this.fetchItens();
      this.fetchCab();
    },
    methods: {
  
      async fetchItens() {
  
        const params = new URLSearchParams(window.location.search);
        const filial = params.get('filial'); 
        const cli = params.get('cli'); 
        const doc = params.get('doc'); 
        const loja = params.get('loja'); 
        
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
  
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/nf/itens?filial=${filial}&cli=${cli}&doc=${doc}&loja=${loja}`,config)
        this.itens = response.data
      },
  
      async fetchCab() {
  
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
  
                  
        const params = new URLSearchParams(window.location.search);
        const filial = params.get('filial'); 
        const cli = params.get('cli'); 
        const doc = params.get('doc'); 
        const loja = params.get('loja'); 
  
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/nf/nota?filial=${filial}&cli=${cli}&doc=${doc}&loja=${loja}`,config)
        this.dados = response.data
      },
      
      formatDate(dateStr) {
        const [year, month, day] = dateStr.split('/');
        return `${day}/${month}/${year}`;
      },
  
      printContent() {
        const printContents = this.$refs.printContainer.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();  // Para garantir que a página original seja restaurada corretamente
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
  }
  
  .logo {
    float: left;
    width: 150px;
    height: 30px;
  }
  
  h1 {
    font-size: 24px;
    font-weight: bold;
  }
  
  .informacoes-cliente p {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .titulo {
    font-size: 22px;
    font-weight: bold;
    text-align: center; 
    margin-top: 20px;
  }
  .lead {
    font-size: 16px;
    font-weight: bold;
    text-align: left; 
    margin-top: 20px;
  }
  
  .table th,
  .table td {
    vertical-align: middle;
    font-size: 12px;
  }
  
  .thead-dark th {
    background-color: #343a40;
    color: #fff;
  }
  .codigo-col {
    width: 25%;
  }
  
  .descricao-col {
    width: 55%;
  }
  
  .quantidade-col {
    width: 10%;
  }
  
  .unidade-col {
    width: 10%;
  }
  .condicoes {
    margin-top: 15px;
  }
  
  .condicoes p,
  .condicoes ul {
    font-size: 14px;
    font-family: Calibri;
  }
  
  .condicoes ul {
    list-style-type: disc;
    padding-left: 15px;
    font-family: Calibri;
  }
  
  .btn-primary {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  </style>
  