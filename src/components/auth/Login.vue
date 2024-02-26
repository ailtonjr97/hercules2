<template>
<div id="cabecalho">
    <div class="row"  style="width: 99.8%; margin-left: 0.2%; height: 100vh;">
      <div class="col-md-6 offset-md-3" style="width: 40%; margin-left: 30%;">
        <form v-on:submit.prevent="submit">
        <div class="card my-5" style="margin-top: 29% !important; ">
          <span class="card-body cardbody-color p-lg-5">
            <div class="mb-3">
              <input type="email" class="form-control" id="Username" aria-describedby="emailHelp" placeholder="Email" name="email" v-model="form.email">
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" id="password" placeholder="Senha" v-model="form.password" name="password">
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-color px-5 mb-2 w-100">Login</button>
              <div id="loading" v-if="logador" style="margin-bottom: 50%;"></div>
            </div>
            <h5 style="text-align: center;" class="mt-2">Favor pedir acesso por Spark.</h5>
          </span>
        </div>
      </form>
      </div>
    </div>
  </div>
  <modal v-if="error" :title="'Erro:'">
    <template v-slot:body>
      <h5>Credenciais incorretas</h5>
    </template>
    <template v-slot:buttons><button class="button-8" @click="close">Fechar</button></template>
  </modal>
</template>

<script>
import Modal from '../ui/Modal.vue';

import axios from 'axios';
export default{
  components: {
    Modal
  },
    data(){
        return {
          reload: 1,
          error: false,
          logador: false,
            form: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        close(){
          this.error = false
        },
        async submit(){
            try {
              this.logador = true;
              function delete_cookie(name) {
                document.cookie = name +'=; Path=/qualidade; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              }
              delete_cookie('jwt')
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/auth/login`, this.form);
                if(response && response.status == 200){
                  document.cookie = `jwt=${response.data};path=/`
                  window.location.href = `${import.meta.env.VITE_LOGIN_IP}/home`;
                }else{
                  console.log(error)
                  this.logador = false;
                  throw new Error();
                }
                }catch (error) {
                  console.log(error)
                  this.logador = false;
                  this.error = true;
            }
        }
    },
}
</script>

<style scoped>
#cabecalho{
  background-image: url('../../../images/bg.jpg');
}
.btn-color{
  background-color: #0e1c36;
  color: #fff;
  
}

.profile-image-pic{
  height: 200px;
  width: 200px;
  object-fit: cover;
}



.cardbody-color{
  background-color: #ebf2fa;
}

a{
  text-decoration: none;
}
</style>