<template>
    <div class="col">
        <div class="form-floating">
            <input :maxlength="maxlength" :readonly="readonly" :type="type" class="form-control input-pequeno" :id="id" :placeholder="placeholder" :name="id" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
        <label :for="id">{{ placeholder }}</label>
    </div>
    </div>
</template>


<script>
    export default {
        props: {
            maxlength:{
                type: Number,
                required: false,
            },
            placeholder: {
                type: String,
                required: false,
                default: ''
            },
            id: {
                type: String,
                required: true,
                default: 'Inserir ID'
            },
            type: {
                type: String,
                required: true,
                default: "Inserir tipo do input"
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