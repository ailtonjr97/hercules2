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
      
      <p class="lead text-justify">
        <strong>
          A FIBRACEM garante seus produtos contra defeitos de fabricação pelo período de 12 meses a contar da data de emissão da nota fiscal
        </strong>
      </p>

      <table class="table table-bordered">
        <thead class="thead-dark">
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
        <p class="font-weight-bold">
          A FIBRACEM garante a reposição de materiais defeituosos, desde que as duas condições abaixo sejam respeitadas:
        </p>
        <ul>
          <li>
            Não será aceita devolução sem aprovação por escrito da FIBRACEM, sendo que o comprador deverá informar no ato da solicitação o número e data da nota fiscal de venda, bem como o código do produto e o motivo da devolução.
          </li>
          <li>
            Não serão aceitas devoluções de materiais fora da embalagem original, ou com alterações/depreciações da mesma.
          </li>
        </ul>
        <p>
          <strong>A FIBRACEM não se responsabiliza por danos ou perdas de qualquer natureza causados por imperícia ou inabilidade na utilização de seus produtos.</strong>
        </p>
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
    fetchItens() {
      const params = new URLSearchParams(window.location.search);
      const filial = params.get('filial'); 
      const cli = params.get('cli'); 
      const doc = params.get('doc'); 
      const loja = params.get('loja'); 

      axios.get(`${import.meta.env.VITE_BACKEND_IP}/nf/itens?filial=${filial}&cli=${cli}&doc=${doc}&loja=${loja}`)
        .then(response => {
          this.itens = response.data;
        })
        .catch(error => {
          console.error("Houve um erro ao buscar os itens: ", error);
        });
    },

    fetchCab() {
      const params = new URLSearchParams(window.location.search);
      const filial = params.get('filial'); 
      const cli = params.get('cli'); 
      const doc = params.get('doc'); 
      const loja = params.get('loja'); 

      axios.get(`${import.meta.env.VITE_BACKEND_IP}/nf/nota?filial=${filial}&cli=${cli}&doc=${doc}&loja=${loja}`)
        .then(response => {
          this.dados = response.data;
        })
        .catch(error => {
          console.error("Houve um erro ao buscar os itens: ", error);
        });
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
  margin-top: 30px;
}

.condicoes p,
.condicoes ul {
  font-size: 14px;
}

.condicoes ul {
  list-style-type: disc;
  padding-left: 20px;
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
