<template>
<body id="body-pd">
    <header class="header" id="header">
    </header>
  <div class="l-navbar" id="nav-bar">
      <nav class="nav" style="overflow-y: auto;">
          <div>
              <div class="nav_list">
                  <a href="#" class="nav_link">
                    <div class="header_toggle">
                      <i class='bx bx-menu' id="header-toggle">
                      </i>
                    </div>
                  </a>
                  <router-link to="/home" class="nav_link">
                    <i class="fa-solid fa-house"></i>
                    <span class="nav_name">
                      Home
                    </span>
                  </router-link>
                  <router-link to="/qualidade" class="nav_link">
                    <i class="fa-solid fa-file-circle-check" style="margin-left: 10%;"></i>
                    <span class="nav_name">
                      Qualidade
                    </span>
                  </router-link>
                  <router-link to="/usuarios" class="nav_link" v-if="isAdmin != 0">
                    <i class="fa-solid fa-user" style="margin-left: 15%;"></i>
                    <span class="nav_name">
                      Usuário
                    </span>
                  </router-link>
                  <div class="nav_link" style="cursor: pointer;" @click="logout">
                    <i class="fa-solid fa-arrow-right-from-bracket fa-rotate-180" style="margin-right: 5%;"></i>
                    <span class="nav_name">
                      Home
                    </span>
                  </div>
              </div>
          </div>
      </nav>
  </div>
  <slot name="content"></slot>
</body>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default{
    data(){
        return{
            isAdmin: 0
        }
    },
    methods: {
        async logout(){
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            this.$router.push('/login');
        }
    },
    async created(){
        const config = {
            headers: {
            'Authorization': document.cookie,
            }
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/logado`, config)
        this.isAdmin = response.data[0].admin;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
   
   const showNavbar = (toggleId, navId, bodyId, headerId) =>{
   const toggle = document.getElementById(toggleId),
   nav = document.getElementById(navId),
   bodypd = document.getElementById(bodyId),
   headerpd = document.getElementById(headerId)
   
   // Validate that all variables exist
   if(toggle && nav && bodypd && headerpd){
       toggle.addEventListener('click', ()=>{
       // show navbar
       nav.classList.add('show')
       // change icon
       toggle.classList.add('bx-x')
       // add padding to body
       bodypd.classList.add('body-pd')
       // add padding to header
       headerpd.classList.add('body-pd')
       })
   }

       if(toggle && nav && bodypd && headerpd){
           document.getElementsByClassName('l-navbar')[0].addEventListener('mouseleave', ()=>{
           // show navbar
           nav.classList.remove('show')
           // change icon
           toggle.classList.remove('bx-x')
           // add padding to body
           bodypd.classList.remove('body-pd')
           // add padding to header
           headerpd.classList.remove('body-pd')
           })
       }
   }
   
   showNavbar('header-toggle','nav-bar','body-pd','header')
   
   /*===== LINK ACTIVE =====*/
   // const linkColor = document.querySelectorAll('.nav_link')
   
   // function colorLink(){
   // if(linkColor){
   // linkColor.forEach(l=> l.classList.remove('active'))
   // this.classList.add('active')
   // }
   // }
   // linkColor.forEach(l=> l.addEventListener('click', colorLink))
   });
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300&family=Roboto+Mono:wght@400;600&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
:root{--header-height: 3rem;--nav-width: 68px;--first-color: #4723D9;
--first-color-light: #AFA5D9;
--white-color: #F7F6FB;
--body-font: 'Nunito', sans-serif;
--normal-font-size: 1rem;
--z-fixed: 100}*,::before,::after
{box-sizing: border-box}

h1 {
    font-size: 24px;
    font-weight: 400;
}

.span-title{
    font-family: 'Libre Bodoni', serif;
    color: #ffffff;
    font-size: 24px;
    font-weight: 200;
}

body {
    position: relative;
    padding: 0 1rem;
    font-family: var(--body-font);
    font-size: var(--normal-font-size);
    transition: .5s;
}

a {
    text-decoration: none
}

.header {
    width: 100%;
    height: var(--header-height);
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    background-color: #363636;
}

.header_toggle {
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer
}

.header_img {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden
} 

.header_img img {
    width: 40px
} 

.l-navbar {
    position: fixed;
    top: 0;
    left: -30%;
    width: var(--nav-width);
    height: 100vh;
    background-color: #161616;;
    padding: .5rem 1rem 0 0;
    transition: .5s;
    z-index: var(--z-fixed)
}

.nav {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden
}

.nav_close{
    
    font-family: var(--body-font);
    font-size: var(--normal-font-size);
    margin-bottom: 1.5rem;
}

.nav::-webkit-scrollbar {
    display: none;
}

.nav_logo, .nav_link {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    column-gap: 1rem;
    padding: .1rem 0 .1rem 1.5rem
}

.nav_logo {
    margin-bottom: 2rem
}

.nav_logo-icon {
    font-size: 1.25rem;
    color: var(--white-color)
} 

.nav_logo-name {
    color: var(--white-color);
    font-weight: 700
} 

.nav_link {
    position: relative;
    color: #ffffff;
    margin-bottom: 1.5rem;
    transition: .3s
} 

.nav_link:hover {
    color: var(--white-color)
}

.nav_icon {
    font-size: 1.25rem
} 

.show {
    left: 0
} 

.body-pd {
    padding-left: calc(var(--nav-width) + 0.5rem)
} 

.active {
    color: var(--white-color)
} 

.active::before {
    content: '';
    position: absolute;
    left: 0;
    width: 2px;
    height: 32px;
    background-color: var(--white-color)
}

.height-100 {
    height:100vh
}

@media screen and (min-width: 768px)
    {
        body {
            padding-left: calc(var(--nav-width) + 0.4rem)
        }
        
        .header{
            height: calc(var(--header-height) + 1rem);
            padding: 0 2rem 0 calc(var(--nav-width) + 1rem)
        }
        
        .header_img{
            width: 40px;
            height: 40px
        }
        
        .header_img img{
            width: 45px
        }
        
        .l-navbar{
            left: 0;
            padding: 1rem 1rem 0 0
        }
        
        .show{
            width: calc(var(--nav-width) + 156px)
        }
        
        .body-pd{
            padding-left: calc(var(--nav-width) + 130px)
        }
    }
</style>