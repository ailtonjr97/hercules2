<template>
    <div class="col">
        <div class="form-group">
            <span>{{span}}</span>
            <textarea :style="`height: ${altura}px`" class="form-field" @input="$emit('update:modelValue', $event.target.value)" :readonly="readonly">{{ modelValue }}</textarea>
        </div>
    </div>
</template>

<script>
    export default{
        props: {
            span: {
                type: String,
                required: true,
                default: 'Não preenchido'
            },
            altura: {
                type: String,
                default: '80',
                required: false
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


<style>
    :root {
	 --input-color: black;
	 --input-border: #cdd9ed;
	 --input-background: #fff;
	 --input-placeholder: #cbd1dc;
	 --input-border-focus: #275efe;
	 --group-color: var(--input-color);
	 --group-border: var(--input-border);
	 --group-background: #eef4ff;
	 --group-color-focus: #fff;
	 --group-border-focus: var(--input-border-focus);
	 --group-background-focus: #678efe;
}
 .form-field {
	 display: block;
	 width: 100%;
	 padding: 8px 16px;
	 line-height: 25px;
	 font-size: 14px;
	 font-weight: 500;
	 font-family: inherit;
	 border-radius: 6px;
	 -webkit-appearance: none;
	 color: var(--input-color);
	 border: 1px solid var(--input-border);
	 background: var(--input-background);
	 transition: border 0.3s ease;
}
 .form-field::placeholder {
	 color: var(--input-placeholder);
}
 .form-field:focus {
	 outline: none;
	 border-color: var(--input-border-focus);
}
 .form-group {
	 position: relative;
	 display: flex;
	 width: 100%;
}
 .form-group > span, .form-group .form-field {
	 white-space: nowrap;
	 display: block;
}
 .form-group > span:not(:first-child):not(:last-child), .form-group .form-field:not(:first-child):not(:last-child) {
	 border-radius: 0;
}
 .form-group > span:first-child, .form-group .form-field:first-child {
	 border-radius: 6px 0 0 6px;
}
 .form-group > span:last-child, .form-group .form-field:last-child {
	 border-radius: 0 6px 6px 0;
}
 .form-group > span:not(:first-child), .form-group .form-field:not(:first-child) {
	 margin-left: -1px;
}
 .form-group .form-field {
	 position: relative;
	 z-index: 1;
	 flex: 1 1 auto;
	 width: 1%;
	 margin-top: 0;
	 margin-bottom: 0;
}
 .form-group > span {
	font-family: 'Mukta Malar', Arial;
	 text-align: center;
	 padding: 8px 10px;
	 font-size: 14px;
	 line-height: 25px;
	 color: black;
	 background: var(--group-background);
	 border: 1px solid var(--group-border);
	 transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
}
 .form-group:focus-within > span {
	 color: var(--group-color-focus);
	 background: var(--group-background-focus);
	 border-color: var(--group-border-focus);
}
 html {
	 box-sizing: border-box;
	 -webkit-font-smoothing: antialiased;
}
 * {
	 box-sizing: inherit;
}
 *:before, *:after {
	 box-sizing: inherit;
}
</style>