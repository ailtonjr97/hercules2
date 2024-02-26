<template>
    <div class="col">
        <div class="form-floating">
            <textarea :style="`height: ${altura}px`" class="form-control" :placeholder="placeholder" :id="id" @input="$emit('update:modelValue', $event.target.value)" :readonly="readonly">{{ modelValue }}</textarea>
            <label :for="id">{{ placeholder }}</label>
        </div>
    </div>
</template>

<script>
    export default{
        props: {
            altura: {
                type: String,
                default: '80',
                required: false
            },
            id: {
                type: String,
                required: true,
                default: 'Inserir ID.'
            },
            placeholder: {
                type: String,
                required: true,
                default: 'Inserir Placeholder.'
            },
            modelValue: {
                type: String,
                required: true,
                default: ''
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    }
</script>