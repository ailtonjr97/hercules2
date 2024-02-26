<template>
    <div class="col">
        <div class="">
            <input :readonly="readonly" type="file" class="form-control" :id="id" :name="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
    </div>
    </div>
</template>


<script>
    export default {
        props: {
            id: {
                type: String,
                required: true,
                default: 'Inserir ID'
            },
            modelValue: {
                type: null,
                required: false,
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    }
</script>