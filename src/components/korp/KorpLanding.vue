<template>
    <div class="row" style="padding: 1%; border-radius: 5px; margin-right: 0;">
        <table-search :id="'procuraBtn0'" :num="0" :placeholder="'Nome:'" class="mb-2"></table-search>
        <table-search :id="'procuraBtn1'" :num="1" :placeholder="'Descritivo:'"></table-search>
        <div class="table-wrapper table-responsive table-striped mb-5">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>Nome</th>
                <th>Descritivo</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>
                    <p>Produtos</p>
                </td>
                <td>
                    <p>Acesso a todos os produtos.</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/korp/produtos">Acessar</router-link>
                </td>
                </tr>
                <tr>
                <td>
                    <p>Pedidos de Compra</p>
                </td>
                <td>
                    <p>Acesso a todos os pedidos de compra.</p>
                </td>
                <td>
                    <router-link class="button-8 mb-2" to="/korp/pedidos-de-compra">Acessar</router-link>
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