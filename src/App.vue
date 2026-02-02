<template>
  <v-app>
    <AppNavbar />
    <v-main class="pa-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
  },
}
</script>
