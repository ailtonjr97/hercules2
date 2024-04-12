<template>
	<!--- Navbar --->
<nav class="navbar navbar-expand-lg" style="background-color: #3a619b;">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent" style="background-color: #3a619b; z-index: 99;">
    <ul class="navbar-nav mr-auto">
        <div class="row">
            <div class="col d-flex justify-content-start">
                <li class="nav-item" style="width: 90px;">
                    <router-link to="/home" class="nav-link" style="padding: 0 8px;">
                        <div class="item">
                            <img src="/images/logo_fibracem_F_1.png" alt="" style="width: 130%;">
                        </div>
                    </router-link>
                </li>
                <!-- <li class="nav-item" style="margin-left: 5%;">
                    <router-link to="/totvs" class="nav-link">
                        <div class="item">
                            <img src="/images/totvs_icon.png" alt="" style="width: 90%; border-radius: 5px;">
                        </div>
                    </router-link>
                </li> -->
                <!-- <li class="nav-item" style="margin-left: 1%;">
                    <router-link to="/korp" class="nav-link">
                        <div class="item">
                            <img src="/images/korp.png" alt="" style="width: 90%; border-radius: 5px;">
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" style="margin: 0 5% 0 0; width: 40px;">
                    <router-link to="/qualidade" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-file-circle-check" style="margin-left: 50%;"></i>
                            <span class="caption">Qualidade</span>
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" style="margin: 0 0 0 0; width: 50px;">
                    <router-link to="/rh" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-users"></i>
                            <span class="caption">RH</span>
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" style="margin: 0 0 0 0; width: 120px;">
                    <router-link to="/engenharia" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-gears" style="margin-left: 50%;"></i>
                            <span class="caption">Engenharia</span>
                        </div>
                    </router-link>
                </li> -->
                <li class="nav-item" style="margin: 0 0 0 0; width: 120px;">
                    <router-link to="/comercial" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-comments-dollar" style="margin-left: 50%;"></i>
                            <span class="caption">Comercial</span>
                        </div>
                    </router-link>
                </li>
                <!-- <li class="nav-item" style="margin: 0 0 0 0; width: 110px;">
                    <router-link to="/chamados" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-table-cells" style="margin-left: 50%;"></i>
                            <span class="caption">Chamados</span>
                        </div>
                    </router-link>
                </li> -->
                <li :style="[isAdmin != 0 ? {'display': 'block'} : {'display': 'none'}]" class="nav-item pl-1 bloqueados">
                    <router-link to="/usuarios" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-user" style="margin-left: 22%;"></i>
                            <span class="caption">Usuários</span>
                        </div>
                    </router-link>
                </li>
                <li class="nav-item" @click="logout">
                    <a href="#" class="nav-link">
                        <div class="item">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span class="caption">Sair</span>
                        </div>
                    </a>
                </li>
            </div>
        </div>
    </ul>
  </div>
  <h6 style="width: 20%; color: #fff; text-align: center;">{{ name }}</h6>
</nav>

<slot name="content"></slot>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default{
    data(){
        return{
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
            this.$router.push('/login')
        }
    },
    async created(){
        this.carregando = true;
        function getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        }
        const token = getCookie('jwt')
        let config = {
            headers: {
                'Authorization': token
            }
        };
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        this.isAdmin = response.data[0].admin;
        this.name = response.data[0].name;
    }
}
</script>

<style scoped>
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
    height: 65px;
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