<template>
    <div class="row" style="max-width: 99%; padding: 1%;">
        <div class="col d-flex justify-content-start">
            <card :address="'/ti/chamados'" :title="'Chamados'" :body="'Chamados relacionados à TI.'" :src="'images/chamado.png'"></card>
        </div>
    </div>
</template>

<script>
import Card from '../ui/Card.vue';

export default{
    components: {
        Card,
    }
}
</script>