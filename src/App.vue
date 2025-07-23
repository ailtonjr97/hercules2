<template>
    <template v-slot:content><router-view></router-view></template>
  <router-view v-if="$route.meta.hideNavbar"></router-view>
</template>

<script>
import Topbar from './components/navbar/Topbar.vue';
import Navbar from './components/navbar/Navbar.vue';

export default{
  components: {
    Topbar,
    Navbar,
  }
}

</script>