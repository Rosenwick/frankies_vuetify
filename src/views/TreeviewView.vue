<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <v-row class="mb-8">
          <v-col class="d-flex justify-center ga-2">
            <v-btn
              variant="flat"
              color="secondary"
              @click="toggleAll"
              :prepend-icon="allNodesChecked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
            >
              {{ allNodesChecked ? 'Alle abwählen' : 'Alle auswählen' }}
            </v-btn>
            <v-btn variant="flat" color="primary" @click="loadData">Neu laden</v-btn>
          </v-col>
        </v-row>
        <v-card class="py-6" elevation="0" rounded="xl" color="brown-lighten-5">
          <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
          <tree-node
            v-else
            :myData="treeData"
            :allChecked="allChecked"
            @update="handleUpdate"
            @node-created="handleNodeCreated"
            @node-updated="handleNodeUpdated"
            @node-deleted="handleNodeDeleted"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TreeNode from '@/components/Treeview/TreeNode.vue'
import treeApi from '@/services/treeApi'

export default {
  name: 'App',
  components: {
    TreeNode,
  },
  data() {
    return {
      treeData: [],
      allChecked: null,
      loading: false,
      allNodesChecked: false,
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        this.treeData = await treeApi.getAll()
      } catch (error) {
        console.error('Fehler beim Laden:', error)
      } finally {
        this.loading = false
      }
    },

    // Alte Methoden ersetzen durch:
    toggleAll() {
      this.allNodesChecked = !this.allNodesChecked
      this.allChecked = this.allNodesChecked
      setTimeout(() => {
        this.allChecked = null
      }, 100)
    },

    // Optional: Status aktualisieren wenn Tree sich ändert
    handleUpdate() {
      console.log('Tree updated')
      // Prüfe ob alle Nodes gecheckt sind
      this.checkIfAllNodesChecked()
    },

    checkIfAllNodesChecked() {
      const allChecked = this.areAllNodesChecked(this.treeData)
      this.allNodesChecked = allChecked
    },

    areAllNodesChecked(nodes) {
      if (!nodes || nodes.length === 0) return false

      return nodes.every((node) => {
        if (node.children && node.children.length > 0) {
          return node.checked && !node.indeterminate && this.areAllNodesChecked(node.children)
        }
        return node.checked
      })
    },

    handleNodeCreated(data) {
      console.log('Node created:', data)
    },

    handleNodeUpdated(data) {
      console.log('Node updated:', data)
    },

    handleNodeDeleted(data) {
      console.log('Node deleted:', data)
    },
  },

  mounted() {
    this.loadData()
  },
}
</script>
