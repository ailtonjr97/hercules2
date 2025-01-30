<template>
	<!--- Navbar --->
<nav class="navbar navbar-expand-lg" style="background-color: #3a619b;">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"><i class="fa-solid fa-bars" style="color: white;"></i></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="background-color: #3a619b; z-index: 99;">
    <div class="row">
        <div class="col d-flex justify-content-evenly">
            <router-link to="/home" class="nav-link" style="padding: 0 8px;">
                <div class="item">
                    <img src="/images/logo_fibracem_F_1.png" alt="" style="width: 90%;">
                </div>
            </router-link>

            <div class="dropdown" style="margin-left: 15%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Comercial</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Comercial</h6>
                    <router-link to="/comercial/cotacao-de-frete" class="nav-link" style="padding: 0 8px;">Cotação de Frete</router-link>
                    <router-link to="/comercial/track-order" class="nav-link" style="padding: 0 8px;">Track Order</router-link>
                    <router-link to="/comercial/orcamentos" class="nav-link" style="padding: 0 8px;">Orçamentos</router-link>
                    <router-link to="/comercial/pedidos" class="nav-link" style="padding: 0 8px;">Pedidos</router-link>
                    <a href="http://integrador.fibracem.com/clientes" class="nav-link" style="padding: 0 8px;">Clientes</a>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Financeiro</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Financeiro</h6>
                    <router-link to="/financeiro/analise-de-credito" class="nav-link" style="padding: 0 8px;">Análise de Crédito</router-link>
                    <router-link to="/financeiro/nf-cte" class="nav-link" style="padding: 0 8px;">Frete NF/Pedido</router-link>
                    <router-link to="/financeiro/cte" class="nav-link" style="padding: 0 8px;">CTE</router-link>
                    <router-link to="/financeiro/pdf-nf" class="nav-link" style="padding: 0 8px;">NF Saída PDF</router-link>
                    <router-link to="/financeiro/guia-nf" class="nav-link" style="padding: 0 8px;">Guia NF</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Qualidade</p>
                <div class="dropdown-menu" style="width: 200px">
                    <h6 class="dropdown-header">Qualidade</h6>
                    <router-link to="/qualidade/minuta-retrabalho" class="nav-link" style="padding: 0 8px;">Minuta de Retrabalho</router-link>
                    <router-link to="/qualidade/arquivos-home" class="nav-link" style="padding: 0 8px;">Arquivos Home</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Logística</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Logística</h6>
                    <router-link to="/logistica/produtos" class="nav-link" style="padding: 0 8px;">Produtos</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Tabelas</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Banco de dados</h6>
                    <router-link to="/tabelas" class="nav-link" style="padding: 0 8px;">Tabelas</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Gráficos</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">Gráficos</h6>
                    <router-link to="/graficos-orcamentos" class="nav-link" style="padding: 0 8px;">Orçamentos</router-link>
                    <router-link to="/graficos-pedidos" class="nav-link" style="padding: 0 8px;">Pedidos</router-link>
                </div>
            </div>

            <div class="dropdown" style="margin-left: 20%;">
                <p class="falta_icone" data-bs-toggle="dropdown" style="margin-top: 10%; color: white;">Usuários</p>
                <div class="dropdown-menu">
                    <h6 class="dropdown-header">{{ name }}</h6>
                    <router-link to="/usuarios" class="nav-link" style="padding: 0 8px;" :style="[isAdmin != 0 ? {'display': 'block'} : {'display': 'none'}]">Usuários</router-link>
                    <router-link to="#" @click="logout()" class="nav-link" style="padding: 0 8px;">Sair</router-link>
                </div>
            </div>

        </div>
    </div>
    <!-- <h6 style="width: 5%; color: #fff; text-align: center; margin-left: 30%;" v-if="mostraStatus">SISTEMA INDISPONÍVEL</h6> -->
  </div>
</nav>

<slot name="content"></slot>
</template>

<style>
    /* .falta_icone{
        display: none;
    } */
</style>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default{
    data(){
        return{
            mostraStatus: false,
            isAdmin: 0,
            name: '',
        }
    },
    methods: {
        async logout(){
            function deleteAllCookies() {
                    const cookies = document.cookie.split(";");

                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                }
            deleteAllCookies();
            function delete_cookie(name) {
                document.cookie = name +'=; Path=/qualidade; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              }
              delete_cookie('jwt')
              window.location.href = 'http://intranet.fibracem.com/logout';
        }
    },
    async created(){
        try {
            this.carregando = true;
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
                }
                const token = getCookie('jwt')
                let config = {
                    headers: {
                        'Authorization': `jwt=${token}`
                    }
            };
            const decoded = jwtDecode(token);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
            await axios.get(`${import.meta.env.VITE_BACKEND_IP}/totvs/companies`, config);
            this.isAdmin = response.data[0].admin;
            this.name = response.data[0].name;
        } catch (error) {
            if(error.response.status == 401){
                function deleteAllCookies() {
                    const cookies = document.cookie.split(";");

                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                }
            deleteAllCookies();
            function delete_cookie(name) {
                document.cookie = name +'=; Path=/qualidade; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              }
              delete_cookie('jwt')
              window.location.href = 'http://intranet.fibracem.com/logout';
            }
            this.mostraStatus = true;
        }
    }
}
</script>

<style scoped>
a{
    color: inherit;
}

a:hover{
    color: white;
    background-color: #22577A;
}

.bloqueados{
    display: none;
}

.fa-solid{
    font-size: 18px;
}

div.item {
    vertical-align: top;
    display: inline-block;
    text-align: center;
    width: 50px;
}
.caption {
    display: block;
}

.navbar{
    height: 45px;
}

.navbar {
    background-color: #3a619b;
}
.navbar .navbar-nav .nav-link {
    color: #fff;
}
.navbar .navbar-nav .nav-link:hover {
    color: #fbc531;
}
.navbar .navbar-nav .active > .nav-link {
    color: #fbc531;
    }
</style>