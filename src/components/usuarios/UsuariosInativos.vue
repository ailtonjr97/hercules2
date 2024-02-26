<template>
    <div style="padding-top: 1.5%">
  <div class="row" style="width: 99.8%; margin-left: 0.2%;">
    <div class="col-md-4">
        <router-link class="button-8 mb-2" to="/usuarios">Ativos</router-link>
    </div>
    <div class="col-lg-6">
    </div>
    <div class="col-sm-2">
      <button type="button" class="button-8 mb-2" id="result" style="float: right;">
        <span class="counter-value">{{ resultados }}</span>
        resultados
      </button>
    </div>
  </div>
  <div class="row mb-2" style="width: 99.8%; margin-left: 0.2%;">
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn0" onkeyup="procura(0, 'procuraBtn0')"/>
        <label for="procuraBtn0">ID:</label>
      </div>
    </div>
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="procuraBtn1" onkeyup="procura(1, 'procuraBtn1')"/>
        <label for="procuraBtn1">Nome:</label>
      </div>
    </div>
  </div>
  <div class="table-wrapper table-responsive table-striped">
    <table class="fl-table" id="myTable">
      <thead>
        <tr style="height: 25px">
          <th>ID</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <div v-if="carregando" id="loading"></div>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>
            <p>{{ usuario.id }}</p>
          </td>
          <td>
            <p>{{ usuario.name }}</p>
          </td>
          <td>
            <p>{{ usuario.email }}</p>
          </td>
          <td style="padding-bottom: 15px;">
            <a class="button-8" @click="ativar(usuario.id)">Ativar</a>
          </td>
        </tr>
      </tbody>
      <tbody></tbody>
    </table>
  </div>
</div>
</template>

<script>
import axios from 'axios'

let config = {
  headers: {
    'Authorization': document.cookie.replace('jwt=', ''),
  }
}

 export default{
  data(){
    return{
      carregando: true,
      usuarios: [],
      resultados: null
    }
  },
  methods: {
    async ativar(id){
      try {
        this.carregando = true;
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/reactivate/${id}`, config);
          if(response.status == 200){
            this.atualizarUsuarios();
          }
      } catch (error) {
        console.log(error)
        alert("Erro ao reativar usuário.")
      }

    },
    async atualizarUsuarios(){
      try {
        let config = {
          headers: {
            'Authorization': document.cookie.replace('jwt=', ''),
          }
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/get_all/inactive`, config);
        this.usuarios = response.data;
        this.resultados = response.data.length;
        this.carregando = false;
      } catch (error) {
        console.log(error)
        alert("Erro ao consultar usuários usuário.")
      }
    }
  },
  async created(){
    this.atualizarUsuarios();
  }
 }
</script>