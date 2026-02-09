<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-btn @click="checkAll">Alle auswählen</v-btn>
        <v-btn @click="uncheckAll">Alle abwählen</v-btn>
        <v-card class="py-6" elevation="0" rounded="xl" color="brown-lighten-5">
          <fraenkies-treeview :myData="myData" @update="onTreeUpdate" :allChecked="allCheckedState">
          </fraenkies-treeview>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="col-lg-12 pt-3 text-center">
          <code>&nbsp;</code>
        </div>
        <div class="col-md-6 offset-md-3 mt-5">
          <h4>Eigenschaften</h4>
          <table class="table table-sm table-striped table-bordered">
            <thead>
              <tr>
                <th>Eigenschaften</th>
                <th>Typ</th>
                <th>Standard</th>
                <th>Beschreibung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>showbyChecked</code></td>
                <td><code>Boolean</code></td>
                <td><code>false</code></td>
                <td>
                  Öffnet den Zweig beim anklicken der Checkbox, wenn die Checkbox ist "checked"
                </td>
              </tr>
              <tr>
                <td><code>autoDisablingSaveBtn</code></td>
                <td><code>Boolean</code></td>
                <td><code>true</code></td>
                <td>
                  Der Speicher-Button ist nur sichtbart, wenn eine Checkbox ausgewält wurde oder er
                  ist immer sichtbar.
                </td>
              </tr>
              <tr>
                <td><code>allCheckedOnStart</code></td>
                <td><code>Boolean</code></td>
                <td><code>false</code></td>
                <td>Alle Checkbox sind "checked"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FraenkiesTreeview from '@/components/Treeview/Treeview.vue'
export default {
  name: 'TreeviewView',
  components: {
    FraenkiesTreeview,
  },
  data() {
    return {
      myData: [
        {
          name: 'Type A',
          children: [
            {
              name: 'A1',
              children: [
                { name: 'Sub A1' },
                { name: 'Sub A2' },
                { name: 'Sub A3' },
                { name: 'Sub A4' },
                { name: 'Sub A5' },
              ],
            },
            { name: 'A2' },
            { name: 'A3' },
            { name: 'A4' },
            { name: 'A5' },
          ],
        },
        {
          name: 'Type B',
          children: [
            { name: 'B1' },
            { name: 'B2' },
            { name: 'B3' },
            { name: 'B4' },
            { name: 'B5' },
          ],
        },
        {
          name: 'Type C',
          children: [
            { name: 'C1' },
            { name: 'C2' },
            { name: 'C3' },
            { name: 'C4' },
            { name: 'C5' },
          ],
        },
        {
          name: 'Type D',
          children: [
            { name: 'D1' },
            { name: 'D2' },
            { name: 'D3' },
            { name: 'D4' },
            { name: 'D5' },
          ],
        },
      ],
      allCheckedState: null,
    }
  },
  created() {
    // fetch('https://fakestoreapi.com/products')
    //   .then((response) => response.json())
    //   .then((data) => this.users = data);
  },
  methods: {
    checkAll() {
      this.allCheckedState = true
      this.$nextTick(() => {
        this.allCheckedState = null // Reset für nächste Änderung
      })
    },
    uncheckAll() {
      this.allCheckedState = false
      this.$nextTick(() => {
        this.allCheckedState = null
      })
    },

    onTreeUpdate() {
      // Dieser Handler stellt sicher, dass Updates auch auf Root-Ebene funktionieren
      this.$forceUpdate()
    },
  },
}
</script>
