<template>
    <div id="cbwrap">
        <div class="speech right">
          {{ mensagem }}
        </div>
    </div>
</template>

<script>
    export default{
        props: {
            mensagem: {
                type: String,
                default: 'Inserir chat chamado',
                required: true
            }
        }
    }
</script>

<style scoped>
/* (A) SPEECH BOX */
.speech {
  /* (A1) FONT & COLORS */
  font-size: 1em;
  color: #fff;
  background: rgb(58, 97, 155);

  /* (A2) DIMENSIONS */
  padding: 10px;
  border-radius: 10px;
  max-width: 600px;
}

/* (B) USE ::AFTER TO CREATE THE "CALLOUT" */
.speech::after {
  display: block; width: 0; content: "";
  border: 15px solid transparent;
}
 
/* (C) "CALLOUT" DIRECTIONS */
.speech.up::after {
  border-bottom-color: #a53d38;
  border-top: 0;
}
.speech.down::after {
  border-top-color: #a53d38;
  border-bottom: 0;
}
.speech.left::after {
  border-right-color: #a53d38;
  border-left: 0;
}
.speech.right::after {
  border-left-color: rgb(58, 97, 155);
  border-right: 0;
  margin-right: 0.5%;
}

/* (D) POSITION THE CALLOUT */
.speech {
  position: relative;
  margin: 10px;
}
.speech::after { position: absolute; }
.speech.up::after {
  top: -15px; left: calc(50% - 15px);
}
.speech.down::after {
  bottom: -15px; left: calc(50% - 15px);
}
.speech.left::after {
  left: -15px; top: calc(50% - 15px);
}
.speech.right::after {
  right: -15px; top: calc(50% - 15px);
}
</style>