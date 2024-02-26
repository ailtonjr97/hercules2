<template>
<div class="row" style="position: relative;">
    <div class="col-md-4 mt-2">
        <slot name="tableButtons"></slot>
    </div>
    <div class="col-lg-6 mt-2">
    </div>
    <div class="col-sm-2 mt-2">
        <button type="button" class="button-8" id="result" style="float: right; margin-right: 0;">
        <span class="counter-value">{{ resultados }}</span>
        resultados
        </button>
    </div>
    </div>
</template>

<script>
    export default {
        props: {
            resultados: {
                type: Number,
                required: true,
                default: 0
            }
        }
    }
</script>