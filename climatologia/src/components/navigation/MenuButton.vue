<template>
    <a class="nav-button">
         <v-icon icon color="white">mdi-menu</v-icon>
    </a>
</template>
<script>
export default {

    data(){
        return{
            menu:false
        }
    }
}
</script>
<style scoped>
.nav-button{
    width: 100%;
    height:10%;
    display:flex;
    justify-content: center;
    align-items: center;
}
a:hover{
    background:#2c2f3371;
}
</style>