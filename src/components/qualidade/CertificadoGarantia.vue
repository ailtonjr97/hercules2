<template>
  
  <div class="container my-5 p-4 border rounded">
    <img data-v-c4be3a62="" src="/images/LOGO-FIBRACEM-5.webp" alt="" style="width: 175px; height: 50px;">
    <h1 class="text-center mb-4">CERTIFICADO DE GARANTIA FIBRACEM</h1>

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
          <th scope="col">CÓDIGO</th>
          <th scope="col">DESCRIÇÃO</th>
          <th scope="col">QUANTIDADE</th>
          <th scope="col">UN</th>
   
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itens" :key="item.D2_COD">
          <td>{{ item.D2_COD }}</td>
          <td>{{ item.DESCRI }}</td>
          <td>{{ item.D2_QUANT }}</td>          
          <td>{{ item.D2_UM }}</td>

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
      axios.get('http://192.168.0.88:5000/nf/itens')
        .then(response => {
          this.itens = response.data;
        })
        .catch(error => {
          console.error("Houve um erro ao buscar os itens: ", error);
        });
    },

    fetchCab() {
      axios.get('http://192.168.0.88:5000/nf/nota')
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
    }
  }
  
}

</script>

<style scoped>

.container {
  background-color: #f9f9f9;
}

.lead {
  font-size: 1.25rem;
}

.table th,
.table td {
  vertical-align: middle;
}

.thead-dark th {
  background-color: #343a40;
  color: #fff;
}

.condicoes ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
