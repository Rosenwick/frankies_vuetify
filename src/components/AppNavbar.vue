<template>
  <v-app-bar color="primary">
    <v-container>
      <v-row class="ma-0" justify="center" align="center" style="height: 100%">
        <v-col cols="12" lg="12" xl="8" class="pa-0">
          <div class="d-flex align-center">
            <!-- Logo / Titel -->
            <img src="@/assets/fr_logo_weiss.png" class="fr-logo" />
            <v-spacer />
            <!-- Navigation -->
            <v-btn variant="text" to="/">Home</v-btn>

            <v-menu open-on-hover>
              <template #activator="{ props }">
                <v-btn variant="text" v-bind="props">Projekte</v-btn>
              </template>

              <v-list>
                <v-list-item title="Treeview" to="/projekte/treeview" />
                <v-list-item title="Transfer List" to="/projekte/transfer-list" />
              </v-list>
            </v-menu>

            <v-spacer />

            <v-btn variant="text" to="/kontakt">Kontakt</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavbar',
}
</script>
<style scoped>
.fr-logo {
  max-height: 80px;
  max-width: 100%;
  display: block;
}
</style>
