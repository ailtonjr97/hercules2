<template>
    <div>
    <popup v-if="popup"></popup>
      <div class="row" style="width: 99.8%; height: 50vh;">
        <div class="col d-flex justify-content-center align-items-center">
          <img style="width: 80%;" src="/images/LOGO-FIBRACEM-5.webp" alt="Logo-Fibra">
        </div>
        <div class="col d-flex justify-content-center align-items-center">
          <img style="width: 80%;" src="/images/totvs_logo.jpg" alt="Logo-TOTVS">
        </div>
      </div>
      <div class="row justify-content-center" style="width: 99.8%; margin-top: 20px;">
        <div class="col-12 text-center">
          <h2>Bem-vindo ao sistema integrador entre a Fibracem e o TOTVS.</h2>
          <button class="button-8 mt-2" @click="copyToClipboard()">Clique aqui para copiar seu Token de acesso.</button>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Adicione qualquer estilo necessário aqui */
  </style>
  
  <script>
  const config = {
      headers: {
      'Authorization': document.cookie,
      }
  }
  
  import axios from 'axios';
  
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
        popup: false,
        token: '',
      }
  },
  methods: {
    copyToClipboard() {
        try {
            const el = document.createElement('textarea');
            el.value = this.token;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.popup = true;
            setTimeout(()=>{
                this.popup = false;
            }, 2000);   
        } catch (error) {
            alert("Falha ao executar")
            console.log(error)
        }
    },
  },
  async created(){
      try {
          function getCookieValue(name) {
              const cookies = document.cookie.split('; ');
              for (let cookie of cookies) {
                  const [cookieName, cookieValue] = cookie.split('=');
                  if (cookieName === name) {
                      return cookieValue;
                  }
              }
              return null;
          }
          this.token = getCookieValue('jwt');
      } catch (error) {
          console.log(error)
          alert("Erro ao carregar página. Favor tentar mais tarde.");
          this.carregando = false;
      }
  }
  }
  </script>