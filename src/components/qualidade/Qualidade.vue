<template>
    <div class="row" style="max-width: 99%; padding: 1%;">
        <div class="col d-flex justify-content-start">
            <card :address="'/qualidade/documentos'" :title="'Documentos'" :body="'Documentos relacionados à Qualidade.'" :src="'images/documento-quali.png'"></card>
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