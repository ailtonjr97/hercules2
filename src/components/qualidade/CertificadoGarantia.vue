<!-- src/components/CertificadoGarantia.vue -->
<template>
    <div class="container my-5 p-4 border rounded">
      <h1 class="text-center mb-4">CERTIFICADO DE GARANTIA FIBRACEM</h1>
      <p class="lead text-justify">
        A FIBRACEM garante seus produtos contra defeitos de fabricação pelo período de 12 meses a contar da data de emissão da nota fiscal
      </p>
      <div class="informacoes-cliente my-4">
        <p><strong>Cliente:</strong> CONECTJA TELECOMUNICACOES LTDA</p>
        <p><strong>Número NF:</strong> 127678</p>
        <p><strong>Data de Emissão NF:</strong> 09/05/2024</p>
      </div>
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">DESCRIÇÃO</th>
            <th scope="col">QUANTIDADE</th>
            <th scope="col">CÓDIGO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TUBO DE EMENDA OPTICA NG</td>
            <td>20,00</td>
            <td>AP0036S00000000</td>
          </tr>
          <tr>
            <td>BOX FTTA ADAPT FUSION MINI 1X8 SC APC CZ</td>
            <td>10,00</td>
            <td>DI0490S00001000</td>
          </tr>
          <tr>
            <td>MINI CAIXA EMENDA OPT 24F SVT</td>
            <td>20,00</td>
            <td>CE0082S0U010000</td>
          </tr>
          <tr>
            <td>CEO 24F BANDEJA</td>
            <td>20,00</td>
            <td>AC0002S00002000</td>
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
          A FIBRACEM não se responsabiliza por danos ou perdas de qualquer natureza causados por imperícia ou inabilidade na utilização de seus produtos.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CertificadoGarantia'
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
  