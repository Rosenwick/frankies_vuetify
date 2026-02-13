<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col cols="12">
        <h2 class="mb-2">Transfer List</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-3">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title class="bg-light-blue-accent-4">
            <h4 class="mb-0">Quelle</h4>
          </v-card-title>

          <v-list density="compact" class="py-0">
            <template v-for="(item, index) in sourceList" :key="item.id">
              <v-list-item @click="clickSourceItem(item.id)">
                <v-list-item-title>
                  <v-avatar size="x-small" class="mr-2" color="grey" variant="tonal">
                    {{ item.id }}.
                  </v-avatar>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="index < sourceList.length - 1"></v-divider>
            </template>
          </v-list>

          <v-card-actions class="bg-grey-lighten-3 justify-center">
            <v-btn variant="flat" color="primary" @click="reset()"> Zurücksetzen </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title class="bg-light-blue-accent-4">
            <h4 class="mb-0">Meine Auswahl</h4>
          </v-card-title>

          <v-list density="compact" class="py-0">
            <v-list-item v-if="targetList.length === 0" base-color="red">
              <v-list-item-title>Sie haben keine Auswahl getroffen</v-list-item-title>
            </v-list-item>

            <template v-else v-for="(item, index) in targetList" :key="item.id">
              <v-list-item @click="clickTargetItem(item.id)" class="bg-teal-lighten-5">
                <v-list-item-title>
                  <v-avatar size="x-small" class="mr-2" color="white" variant="flat">
                    {{ item.id }}.
                  </v-avatar>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="index < targetList.length - 1"></v-divider>
            </template>
          </v-list>

          <v-card-actions class="bg-grey-lighten-3 justify-center">
            <v-btn variant="flat" v-if="targetList.length > 0" color="primary" @click="doThis()">
              Mach was!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="tableData.length > 0">
      <v-col cols="12" md="6" offset-md="3">
        <v-card v-if="tableData.length > 0" class="mt-5">
          <v-card-title class="bg-grey-lighten-3">
            <h5>Ausgewählte Benutzer</h5>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tableData"
              density="compact"
              :items-per-page="5"
            >
              <template v-slot:[`item.address`]="{ item }">
                {{ item.address.city }}
              </template>
              <template v-slot:[`item.company`]="{ item }">
                {{ item.company.name }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TransferList',
  data() {
    return {
      basicList: [],
      sourceList: [],
      targetList: [],
      result: '',
      tableData: [],
      headers: [
        { title: 'Name', key: 'name' },
        { title: 'Username', key: 'username' },
        { title: 'Email', key: 'email' },
        { title: 'Stadt', key: 'address' },
        { title: 'Firma', key: 'company' },
      ],
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(async (response) => {
          const data = await response.json()

          // Prüft ob die Anwort fehlerhaft ist
          if (!response.ok) {
            // Fehlermeldung wird ausgegeben
            const error = (data && data.message) || response.status
            return Promise.reject(error)
          }

          this.basicList = data
          this.sourceList = this.basicList.filter((item) => item.id)
        })
        .catch((error) => {
          this.result = error
        })
    },

    clickSourceItem(itemID) {
      // Aus dem Quell-Array wird das verschobene Objekt herausgefiltert
      this.sourceList = this.sourceList.filter((item) => item.id !== itemID)
      // Das Ziel-Array wird gebildet, indem das Quell-Array mit dem Basis-Array abgeglichen wird.
      // Das bedeuted, die Objekte vom Basis-Array, die nicht im Quell-Array enthalten sind, bilden das Ziel-Array
      this.targetList = this.basicList.filter(
        (baseItem) => !this.sourceList.some((sourceItem) => baseItem.id === sourceItem.id),
      )
    },

    clickTargetItem(itemID) {
      // wie bei clickSourceItem() nur umgekehrt
      this.targetList = this.targetList.filter((item) => item.id !== itemID)
      this.sourceList = this.basicList.filter(
        (baseItem) => !this.targetList.some((targetItem) => baseItem.id === targetItem.id),
      )
    },

    reset() {
      this.targetList = []
      this.fetchData()
      this.result = ''
      this.tableData = []
    },

    doThis() {
      this.tableData = JSON.parse(JSON.stringify(this.targetList)) // Tiefe Kopie
    },
  },
}
</script>

<style lang="scss" scoped></style>
