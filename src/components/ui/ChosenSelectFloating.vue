<template>
    <div class="col">
        <div class="form-floating">
        <select class="form-select" :id="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" >
            <option v-for="option in options" :value="option.valor">{{ option.descri }}</option>
        </select>
        <label :for="id">{{ placeholder }}</label>
        </div>
    </div>
</template>


<script>
    export default{
        props: {
            descritivoEscolhido:{
                type: String,
                required: true,
                default: ''
            },
            valorEscolhido:{
                type: Number,
                required: true,
                default: null
            },
            id: {
                type: String,
                required: true,
                default: 'Inserir ID'
            },
            placeholder: {
                type: String,
                required: true,
                default: 'Inserir Placeholder'
            },
            options: {
                type: Array,
                required: true,
                default: 'Inserir Value'
            },
            modelValue: {
                type: null,
                required: false,
            }
        }
    }
</script>