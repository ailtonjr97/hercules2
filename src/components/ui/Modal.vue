<template>
<!-- Modal -->
<div class="modal mb-5" id="modal-name" :style="[close ? {'display': 'none'} : {'display': 'block'}]">
  <div class="modal-sandbox"></div>
  <div class="modal-box">
    <div class="modal-header">
      <h3>{{ title }}</h3>
      <slot name="close"></slot>
    </div>
    <div class="modal-body">
      <slot name="carregando">
        </slot>
      <slot name="body"></slot>
      <br />
      <div style="text-align: center;">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</div>

<!-- Aditional Styles -->
<link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet">

</template>

<script>
 export default {
    data(){
        return{
            close: false
        }
    },
    props: {
        title: {
            type: String,
            required: true,
            default: "User title."
        },
    },
    methods: {
        closeModal(){
            this.close = true;
        }
    }
 }
</script>

<style scoped>
    .modal,
.modal-box {
  z-index: 900;
}

.modal-sandbox {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: transparent;
}

.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgb(0,0,0);
  background: rgba(0,0,0,.8);
  overflow: auto;
}

.modal-box {
  position: relative;
  width: 100%;
  max-width: 95%;
  margin-top: 1%;
  margin-bottom: 2%;
  margin-left: 2%;
  animation-name: modalbox;
  animation-duration: .4s;
  animation-timing-function: cubic-bezier(0,0,.3,1.6);
}

.modal-header {
  padding: 10px 20px;
  background: #546E7A;
  color: #ffffff;
}

.modal-body {
  background: #ECEFF1;
  padding: 30px 20px;
}

/* Close Button */
.close-modal {
    margin-left: 85%;
    cursor: pointer;
}

/* Animation */
@-webkit-keyframes modalbox {
  0% {
    top: -250px; 
    opacity: 0;
  }
  100% {
    top: 0; 
    opacity: 1;
  }
}

@keyframes modalbox {
  0% {
    top: -250px; 
    opacity: 0;
  }
  100% {
    top: 0; 
    opacity: 1;
  }
}

/* Aditional Styles */
* {
  font-family: "Roboto", sans-serif;
  font-weight: normal;
}

p {
  line-height: 1.4em;
}

body {
  background: #B0BEC5;
}

.modal-trigger, button {
  top: 50%;
  left: 50%;
  padding: 10px 20px;
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  text-decoration: none;
}

.modal-trigger {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  transition: ease .2s;
}

button {
  border: 1px solid #333333;
  outline: none;
  color: #333333;
}

.modal-trigger:hover {
  padding: 20px 60px;
}
</style>