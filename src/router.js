import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue';
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue';
import Controladoria from './components/controladoria/Controladoria.vue';
import Qualidade from './components/qualidade/Qualidade.vue';
import QualidadeDocumentos from './components/qualidade/QualidadeDocumentos.vue';
import AnexPage from './components/ui/AnexPage.vue';
import DocumentosArquivados from './components/qualidade/DocumentosArquivados.vue';
import Totvs from './components/totvs/Totvs.vue';
import TotvsApis from './components/totvs/TotvsApis.vue';
import TotvsGruposDeVenda from './components/totvs/TotvsGruposDeVenda.vue';
import TotvsMovimentosServicosWms from './components/totvs/TotvsMovimentosServicosWms.vue';

import ChamadosTi from './components/ti/Chamados.vue';
import Rh from './components/rh/Rh.vue';
import RhDocumentos from './components/rh/Documentos.vue';
import KorpLanding from './components/korp/KorpLanding.vue';
import KorpProdutos from './components/korp/KorpProdutos.vue';
import KorpProduto from './components/korp/KorpProduto.vue';
import KorpPedsComp from './components/korp/KorpPedsComp.vue';
import KorpPedComp from './components/korp/KorpPedComp.vue';
import EngenhariaLanding from './components/engenharia/EngenhariaLanding.vue';
import EngenhariaMoldes from './components/engenharia/EngenhariaMoldes.vue';
import EngenhariaMolde from './components/engenharia/EngenhariaMolde.vue';
import ComercialLanding from './components/comercial/ComercialLanding.vue';
import ComercialCotacaoFrete from './components/comercial/ComercialCotacaoFrete.vue';
import ComercialCotacaoFreteArquivados from './components/comercial/ComercialCotacaoFreteArquivados.vue';
import ComercialTrack from './components/comercial/ComercialTrack.vue';

import FinanceiroAnalise from './components/financeiro/FinanceiroAnalise.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {path: '/', redirect: '/home' },
      {path: '/login', component: Login, meta: {hideNavbar: true, requiresAuth: false }},
      {path: '/home', component: Home},
      {path: '/usuarios', component: Usuarios},
      {path: '/usuarios/inativos', component: UsuariosInativos },
      {path: '/controladoria', component: Controladoria, meta: {carregando: true}},
      {path: '/qualidade', component: Qualidade, meta: {carregando: true}},
      {path: '/qualidade/documentos', component: QualidadeDocumentos, meta: {carregando: true}},
      {path: '/qualidade/documentos/arquivados', component: DocumentosArquivados, meta: {carregando: true}},
      {path: '/rh', component: Rh},
      {path: '/rh/documentos', component: RhDocumentos},
      {path: '/chamados', component: ChamadosTi},
      {path: '/totvs', component: Totvs},
      {path: '/totvs/apis', component: TotvsApis},
      {path: '/totvs/grupos-de-venda', component: TotvsGruposDeVenda},
      {path: '/totvs/movimentos-servicos-wms', component: TotvsMovimentosServicosWms},
      {path: '/arquivos', component: AnexPage},
      {path: '/korp', component: KorpLanding, meta: {hideNavbar: true}},
      {path: '/korp/produtos', component: KorpProdutos, meta: {hideNavbar: true}},
      {path: '/korp/produto/:id', component: KorpProduto, meta: {hideNavbar: true}},
      {path: '/korp/pedidos-de-compra', component: KorpPedsComp},
      {path: '/korp/pedido-de-compra/:id', component: KorpPedComp},
      {path: '/engenharia', component: EngenhariaLanding},
      {path: '/engenharia/moldes', component: EngenhariaMoldes},
      {path: '/engenharia/moldes/:id', component: EngenhariaMolde},
      {path: '/comercial', component: ComercialLanding},
      {path: '/comercial/cotacao-de-frete', component: ComercialCotacaoFrete},
      {path: '/comercial/cotacao-de-frete-arquivadas', component: ComercialCotacaoFreteArquivados},
      {path: '/comercial/track-order', component: ComercialTrack},
      {path: '/financeiro/analise-de-credito', component: FinanceiroAnalise},
      { path: '/:notFound(.*)', redirect: '/home' }
    ]
  });


router.beforeEach(async function(to, from, next) {
  let loggedIn = false;
  if(to.path == '/login'){
    next();
  }else{
      if(document.cookie){
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
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/verify-jwt`, config);
        if(response.status == 200){
          loggedIn = true;
        }else{
          loggedIn = false;
        }
      }else{
        return next('/login')
      }

      if (!loggedIn) {
        return next('/login');
      } else if (loggedIn) {
        function getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        }
        if(to.path == '/usuarios' || to.path == '/totvs'){
          const token = getCookie('jwt')
          let config = {
              headers: {
                  'Authorization': token
              }
          }
          const decoded = jwtDecode(token);
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config)
          const isAdmin = response.data[0].admin
          if(isAdmin != 0){
            return next();
          }else{
            return next('/home');
          }
        }
        return next();
      } else{
        next()
      }
  }
});

export default router;