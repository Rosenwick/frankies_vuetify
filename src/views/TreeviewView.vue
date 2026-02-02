<template>
  <div></div>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <fraenkies-treeview2 :myData="myData" @update="onTreeUpdate"> </fraenkies-treeview2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FraenkiesTreeview2 from '@/components/Treeview/Treeview2.vue'
export default {
  name: 'TreeviewView',
  components: {
    FraenkiesTreeview2,
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
    }
  },
  created() {
    // fetch('https://fakestoreapi.com/products')
    //   .then((response) => response.json())
    //   .then((data) => this.users = data);
  },
  methods: {
    getTreeData: function (val) {
      if (val.length > 0) {
        this.selectedTreeValues = val
      } else {
        this.selectedTreeValues = null
      }
    },

    onTreeUpdate() {
      // Dieser Handler stellt sicher, dass Updates auch auf Root-Ebene funktionieren
      this.$forceUpdate()
    },
  },
}
</script>
