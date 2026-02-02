<template>
  <v-app-bar color="primary">
    <v-container>
      <v-row>
        <v-col cols="12" xl="9" class="d-flex justify-start">
          <!-- Logo / Titel -->
          <v-app-bar-title class="d-flex">
            <v-img src="@/assets/logo.svg" max-height="40" max-width="40" class="mr-4" />
          </v-app-bar-title>

          <!-- Navigation -->
          <v-btn variant="text" to="/">Home</v-btn>

          <v-menu open-on-hover>
            <template #activator="{ props }">
              <v-btn variant="text" v-bind="props">Projekte</v-btn>
            </template>

            <v-list>
              <v-list-item title="Treeview" to="/projekte/treeview" />
              <v-list-item title="Drag and Drop" to="/projekte/drag-drop" />
            </v-list>
          </v-menu>

          <v-spacer />

          <v-btn variant="text" to="/kontakt">Kontakt</v-btn>
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
