<template>
  <div class="app-container">
    <!-- Barra lateral esquerda -->
    <div class="sidebar">
      <ul class="sidebar-menu">
        <li>
          <a href="#">
            <i class="icon home-icon"></i>
            <span>Home</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon wifi-icon"></i>
            <span>Wifi</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon settings-icon"></i>
            <span>Settings</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon options-icon"></i>
            <span>Options</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon search-icon"></i>
            <span>Search</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon cloud-icon"></i>
            <span>Cloud</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="icon stopwatch-icon"></i>
            <span>Stopwatch</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
      </ul>
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
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
          <h2>Bem-vindo ao sistema ruim do integrador entre a Fibracem e o TOTVS.</h2>
          <button class="button-8 mt-2" @click="copyToClipboard()">Clique aqui para copiar seu Token de acesso.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  height: 100vh;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 20px;
}

.sidebar-menu a {
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
}

.sidebar-menu a i {
  font-size: 24px;
  margin-right: 15px;
}

.sidebar-menu a span {
  font-weight: bold;
}

.sidebar-menu a p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.main-content {
  margin-left: 250px; /* Tamanho da barra lateral */
  padding: 20px;
  width: calc(100% - 250px);
  height: 100vh;
  overflow-y: auto;
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}

.home-icon {
  background-image: url('/path/to/home-icon.png');
}

.wifi-icon {
  background-image: url('/path/to/wifi-icon.png');
}

.settings-icon {
  background-image: url('/path/to/settings-icon.png');
}

.options-icon {
  background-image: url('/path/to/options-icon.png');
}

.search-icon {
  background-image: url('/path/to/search-icon.png');
}

.cloud-icon {
  background-image: url('/path/to/cloud-icon.png');
}

.stopwatch-icon {
  background-image: url('/path/to/stopwatch-icon.png');
}

.button-8 {
  /* Estilos do botão */
}

/* Outros estilos adicionais */
</style>

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
