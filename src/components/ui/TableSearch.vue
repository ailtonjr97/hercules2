<template>
<div class="col">
    <div class="form-floating">
      <input type="text" class="form-control" :id="id" v-on:keyup="procura(num, id)"/>
      <label :for="id">{{ placeholder }}</label>
    </div>
</div>   
</template>

<script>
    export default{
        props: {
            id: {
                type: String,
                required: true,
                default: 'Inserir ID'
            },
            num: {
                type: Number,
                required: true,
                default: 0
            },
            placeholder:{
                type: String,
                required: true,
                default: 'Inserir Placeholder'
            }
        },
        methods: {
            async procura(coluna, nomeBotao){
                // Declare variables
                var input, filter, table, tr, td, i, txtValue;
                input = document.getElementById(nomeBotao);
                filter = input.value.toUpperCase();
                table = document.getElementById("myTable");
                tr = table.getElementsByTagName("tr");

                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[coluna];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        } else {
                        tr[i].style.display = "none";
                        }
                    }
                }
            }
        }
    }
</script>