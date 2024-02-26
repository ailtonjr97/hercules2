<template>
    <div class="row" style="padding: 1%; border-radius: 5px; margin-right: 0;">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'Nome:'" class="mb-2"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Descritivo:'"></table-search>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>Descritivo</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>
                    <p>Lista de APIs</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Grupos de venda</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/grupos-de-venda">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Movimentos serviços WMS</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/movimentos-servicos-wms">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Saldo por endereço WMS</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Ordem de serviço</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Condições de pagamento</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Descrição genérica do produto</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Descrição genérica do produto</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Consulta clientes.</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Pedidos de venda</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Itens dos pedidos de venda</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Pedidos liberados</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Cabeçalho das NF de saída</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Consulta tabelas</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/totvs/apis">Acessar</router-link>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import TableSearch from '../ui/TableSearch.vue';

export default {
    components: {
        TableSearch
    }
}

</script>