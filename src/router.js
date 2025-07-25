import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

import Usuarios from './components/usuarios/Usuarios.vue';
import Home from './components/home/Home.vue';
import Login from './components/auth/Login.vue';
import UsuariosInativos from './components/usuarios/UsuariosInativos.vue';
import Controladoria from './components/controladoria/Controladoria.vue';
import Qualidade from './components/qualidade/Qualidade.vue';
import QualidadeCertificadoGarantia from './components/qualidade/CertificadoGarantia.vue';
import QualidadeDocumentos from './components/qualidade/QualidadeDocumentos.vue';
import QualidadeArquivosHome from './components/qualidade/QualidadeArquivosHome.vue';
import QualidadePropriedade from './components/qualidade/QualidadePropriedade.vue';
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
import ComercialOrcamentos from './components/comercial/ComercialOrcamentos.vue';
import ComercialPedidos from './components/comercial/ComercialPedidos.vue';
import FinanceiroAnalise from './components/financeiro/FinanceiroAnalise.vue';
import NfCte from './components/financeiro/NfCte.vue';
import NfCteEntrada from './components/financeiro/NfCteEntrada.vue';
import TabelasSql from './components/sql/Tabelas.vue';
import GraficosOrcamentos from './components/graficos/Orcamentos.vue';
import GraficosPedidos from './components/graficos/Pedidos.vue';

import FinanceiroCte from './components/financeiro/FinanceiroCte.vue';
import FinanceiroPdfNf from './components/financeiro/FinanceiroPdfNf.vue';
import FinanceiroGuia from './components/financeiro/FinanceiroGuia.vue';
import LogisticaProdutos from './components/logistica/LogisticaProdutos.vue';
import DashboardsRelatorios from './components/relatorios/Dashboard.vue';

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login, meta: { hideNavbar: true, requiresAuth: false } },
    { path: '/home', component: Home },
    { path: '/usuarios', component: Usuarios },
    { path: '/usuarios/inativos', component: UsuariosInativos },
    { path: '/controladoria', component: Controladoria, meta: { carregando: true } },
    { path: '/qualidade', component: Qualidade, meta: { carregando: true } },
    { path: '/qualidade/certificado-garantia', component: QualidadeCertificadoGarantia, meta: { carregando: true } },
    { path: '/qualidade/minuta-retrabalho', component: QualidadeDocumentos, meta: { carregando: true } },
    { path: '/qualidade/minuta-retrabalho/arquivados', component: DocumentosArquivados, meta: { carregando: true } },
    { path: '/qualidade/arquivos-home', component: QualidadeArquivosHome, meta: { carregando: true } },
    { path: '/qualidade/propriedade-do-cliente', component: QualidadePropriedade, meta: { carregando: true } },
    { path: '/rh', component: Rh },
    { path: '/rh/documentos', component: RhDocumentos },
    { path: '/chamados', component: ChamadosTi },
    { path: '/totvs', component: Totvs },
    { path: '/totvs/apis', component: TotvsApis },
    { path: '/totvs/grupos-de-venda', component: TotvsGruposDeVenda },
    { path: '/totvs/movimentos-servicos-wms', component: TotvsMovimentosServicosWms },
    { path: '/arquivos', component: AnexPage },
    { path: '/korp', component: KorpLanding, meta: { hideNavbar: true } },
    { path: '/korp/produtos', component: KorpProdutos, meta: { hideNavbar: true } },
    { path: '/korp/produto/:id', component: KorpProduto, meta: { hideNavbar: true } },
    { path: '/korp/pedidos-de-compra', component: KorpPedsComp },
    { path: '/korp/pedido-de-compra/:id', component: KorpPedComp },
    { path: '/engenharia', component: EngenhariaLanding },
    { path: '/engenharia/moldes', component: EngenhariaMoldes },
    { path: '/engenharia/moldes/:id', component: EngenhariaMolde },
    { path: '/comercial', component: ComercialLanding },
    { path: '/comercial/cotacao-de-frete', component: ComercialCotacaoFrete },
    { path: '/comercial/cotacao-de-frete-arquivadas', component: ComercialCotacaoFreteArquivados },
    { path: '/comercial/track-order', component: ComercialTrack },
    { path: '/comercial/orcamentos', component: ComercialOrcamentos },
    { path: '/comercial/pedidos', component: ComercialPedidos },
    { path: '/financeiro/analise-de-credito', component: FinanceiroAnalise },
    { path: '/financeiro/nf-cte', component: NfCte },
    { path: '/financeiro/nf-cte-entrada', component: NfCteEntrada },
    { path: '/financeiro/cte', component: FinanceiroCte },
    { path: '/financeiro/pdf-nf', component: FinanceiroPdfNf },
    { path: '/financeiro/guia-nf', component: FinanceiroGuia },
    { path: '/logistica/produtos', component: LogisticaProdutos },
    { path: '/relatorios/Dashboard', component: DashboardsRelatorios },    
    { path: '/tabelas', component: TabelasSql },
    { path: '/graficos-orcamentos', component: GraficosOrcamentos },
    { path: '/graficos-pedidos', component: GraficosPedidos },
    { path: '/:notFound(.*)', redirect: '/home' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const verifyJwt = async () => {
    if (!document.cookie) return false;

    const config = {
        headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
    };

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/auth/verify-jwt`, config);
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

const checkAdmin = async (userId) => {
    const config = {
        headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
    };

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${userId}`, config);
        return response.data[0].admin !== 0;
    } catch (error) {
        return false;
    }
};

router.beforeEach(async (to, from, next) => {
    if (to.path === '/login') {
        return next();
    }

    const loggedIn = await verifyJwt();

    if (!loggedIn) {
        return next('/login');
    }

    const token = getCookie('jwt');
    const decoded = jwtDecode(token);
    const isAdmin = await checkAdmin(decoded.id);

    if (['/usuarios', '/totvs', '/tabelas'].includes(to.path)) {
        const token = getCookie('jwt');
        const decoded = jwtDecode(token);
        const isAdmin = await checkAdmin(decoded.id);

        if (!isAdmin) {
            return next('/home');
        }
    }

    if (['/qualidade/propriedade-do-cliente'].includes(to.path)) {
      const config = {
        headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
      };
      const token = getCookie('jwt');
      const decoded = jwtDecode(token);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
      const qualidade = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Qualidade`, config);
      const comercial = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Comercial`, config);
      const allowedIds = [1, 157]; //Ailton, Everson
      
      qualidade.data.forEach(element => {
        allowedIds.push(element.intranet_id)
      });

      comercial.data.forEach(element => {
        allowedIds.push(element.intranet_id)
      });

      if (!allowedIds.includes(response.data[0].intranet_id)) {
        return next('/home');
      }
    }

    if (['/financeiro/analise-de-credito'].includes(to.path)) {
      const config = {
        headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
      };
      const token = getCookie('jwt');
      const decoded = jwtDecode(token);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
      const vendedores = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Comercial`, config);
      const allowedIds = [705, 193, 189, 431, 157, 823, 545, 1, 294, 894, 452, 931]; //Paloma, Ailton, Natali, Everson, Sthefany, Kesley, Elaine, Alex, Yago, Rosangela.
      vendedores.data.forEach(element => {
        allowedIds.push(element.intranet_id)
      });

      if (!allowedIds.includes(response.data[0].intranet_id)) {
        return next('/home');
    }
    }

    if (['/financeiro/pdf-nf'].includes(to.path)) {
        const config = {
          headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
        };
        const token = getCookie('jwt');
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        const financeiro = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Financeiro`, config);
        const vendedores = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Comercial`, config);
        const qualidade = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Qualidade`, config);

        //Ailton, Everson, Jefferson, Juliana, Juliana, Rafael, Wesley, Carlos, Mathias Summer, Jean Koxne, Yuri, Julia Fiedler
        const allowedIds = [431, 157, 839, 385, 400, 298, 494, 1, 680, 894, 10, 180]; 
        
        vendedores.data.forEach(element => {
          allowedIds.push(element.intranet_id)
        });

        financeiro.data.forEach(element => {
            allowedIds.push(element.intranet_id)
        });

        qualidade.data.forEach(element => {
            allowedIds.push(element.intranet_id)
        });
  
        if (!allowedIds.includes(response.data[0].intranet_id)) {
          return next('/home');
        }
    }

    if (['/comercial/pedidos'].includes(to.path)) {
        const config = {
          headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
        };
        const token = getCookie('jwt');
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        const isAdmin = await checkAdmin(decoded.id);
        const financeiro = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Financeiro`, config);
        const vendedores = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Comercial`, config);
        const allowedIds = [431, 157, 1, 839, 545]; //Ailton, Everson, Carlos, Jefferson Santos e Elaine
        
        vendedores.data.forEach(element => {
          allowedIds.push(element.intranet_id)
        });

        financeiro.data.forEach(element => {
            allowedIds.push(element.intranet_id)
        });
  
        if (!allowedIds.includes(response.data[0].intranet_id)) {
          return next('/home');
        }
    }

    if (['/qualidade/arquivos-home'].includes(to.path)) {
        const config = {
          headers: { 'Authorization': `jwt=${getCookie('jwt')}` }
        };
        const token = getCookie('jwt');
        const decoded = jwtDecode(token);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/${decoded.id}`, config);
        const qualidade = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/users/buscar-por-setor/Qualidade`, config);
        const allowedIds = [431, 157, 1]; //Ailton, Everson, Carlos
        
        qualidade.data.forEach(element => {
          allowedIds.push(element.intranet_id)
        });
  
        if (!allowedIds.includes(response.data[0].intranet_id)) {
          return next('/home');
        }
    }

    next();
});

export default router;
