<template>
    <div class="row" style="padding: 1%; border-radius: 5px; margin-right: 0;">
        <div class="table-wrapper table-responsive table-striped mb-5" style="padding: 0;">
            <table class="fl-table" id="myTable">
            <thead>
                <tr style="height: 25px">
                <th>Descritivo</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <div class="row" style="max-width: 99%;">
                        <div class="col mt-2" style="margin-left: 0.5%;">
                            <router-link class="button-8 mb-2" to="/comercial/cotacao-de-frete">Cotação de Frete</router-link>
                            <router-link class="button-8 mb-2" to="/comercial/track-order">Track Order</router-link>
                        </div>
                    </div>
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