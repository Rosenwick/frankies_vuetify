<template>
  <ul class="tree">
    <li v-for="(item, idx) in myData" :key="item.id">
      <div class="d-flex align-center">
        <v-icon
          v-if="item.children && item.children.length > 0"
          :icon="item.expanded ? openClass : iconClass"
          @click="toggleNode(item)"
        ></v-icon>
        <div v-else style="width: 24px"></div>

        <v-checkbox
          class="d-inline-block"
          color="primary"
          :model-value="item.checked"
          :indeterminate="item.indeterminate"
          density="compact"
          hide-details
          :label="item.name"
          @update:modelValue="(val) => onCheckChange(item, val)"
        />

        <!-- CRUD Buttons -->
        <div class="ml-2 d-flex align-center ga-1">
          <v-btn
            icon="mdi-plus"
            size="x-small"
            variant="text"
            color="success"
            @click="addChild(item)"
            title="Kind hinzufügen"
            :loading="loading"
          ></v-btn>

          <v-btn
            icon="mdi-pencil"
            size="x-small"
            variant="text"
            color="primary"
            @click="editNode(item)"
            title="Bearbeiten"
            :loading="loading"
          ></v-btn>

          <v-btn
            icon="mdi-delete"
            size="x-small"
            variant="text"
            color="error"
            @click="deleteNode(item, idx)"
            title="Löschen"
            :loading="loading"
          ></v-btn>
        </div>
      </div>

      <ul v-if="item.expanded && item.children" class="ml-1">
        <tree-node
          :myData="item.children"
          :allChecked="allChecked"
          @update="onChildUpdate"
          @node-created="$emit('node-created', $event)"
          @node-updated="$emit('node-updated', $event)"
          @node-deleted="$emit('node-deleted', $event)"
        ></tree-node>
      </ul>
    </li>
  </ul>
</template>

<script>
import treeApi from '@/services/treeApi'

export default {
  name: 'TreeNode',
  props: {
    myData: {
      type: Array,
      required: true,
    },
    allChecked: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      iconClass: 'mdi-chevron-right',
      openClass: 'mdi-chevron-down',
      loading: false,
    }
  },
  methods: {
    toggleNode(node) {
      if (!node.children) return
      node.expanded = !node.expanded
    },

    async onCheckChange(node, value) {
      this.setNodeCheckedAndExpanded(node, value)

      // Speichere Änderungen im Backend
      this.loading = true
      try {
        await treeApi.updateWithChildren(node)
      } catch (error) {
        console.error('Fehler beim Speichern:', error)
      } finally {
        this.loading = false
      }

      this.updateAllParents()
      this.$emit('update')
    },

    setNodeChecked(node, checked) {
      node.checked = checked
      node.indeterminate = false

      if (node.children && node.children.length) {
        node.children.forEach((child) => this.setNodeChecked(child, checked))
      }
    },

    onChildUpdate() {
      this.updateAllParents()
      this.$emit('update')
    },

    updateAllParents() {
      this.myData.forEach((item) => this.updateParentState(item))
    },

    updateParentState(node) {
      if (!node.children || !node.children.length) return

      node.children.forEach((child) => this.updateParentState(child))

      const totalChildren = node.children.length
      const checkedCount = node.children.filter(
        (child) => child.checked && !child.indeterminate,
      ).length
      const hasIndeterminate = node.children.some((child) => child.indeterminate)

      if (checkedCount === totalChildren) {
        node.checked = true
        node.indeterminate = false
      } else if (checkedCount > 0 || hasIndeterminate) {
        node.checked = false
        node.indeterminate = true
      } else {
        node.checked = false
        node.indeterminate = false
      }
    },

    initializeNode(item) {
      if (!Object.prototype.hasOwnProperty.call(item, 'expanded')) {
        item.expanded = false
      }

      if (!Object.prototype.hasOwnProperty.call(item, 'checked')) {
        item.checked = false
      }

      if (!Object.prototype.hasOwnProperty.call(item, 'indeterminate')) {
        item.indeterminate = false
      }

      if (item.children && item.children.length) {
        item.children.forEach((child) => this.initializeNode(child))
      }
    },

    setAllChecked(checked) {
      this.myData.forEach((item) => this.setNodeCheckedAndExpanded(item, checked))
    },

    setNodeCheckedAndExpanded(node, checked) {
      node.checked = checked
      node.indeterminate = false

      if (node.children && node.children.length > 0) {
        node.expanded = checked
      }

      if (node.children && node.children.length) {
        node.children.forEach((child) => this.setNodeCheckedAndExpanded(child, checked))
      }
    },

    // CRUD Funktionen mit API
    async addChild(parentNode) {
      const newNodeName = prompt('Name des neuen Knotens:')
      if (!newNodeName) return

      this.loading = true
      try {
        // Generiere temporäre ID (wird vom Server überschrieben)
        const maxId = this.getMaxId(this.myData)

        const newNode = {
          id: maxId + 1,
          name: newNodeName,
          checked: false,
          indeterminate: false,
          expanded: false,
          parentId: parentNode.id,
          children: [],
        }

        if (!parentNode.children) {
          parentNode.children = []
        }

        parentNode.children.push(newNode)
        parentNode.expanded = true

        // Speichere Parent mit neuem Kind
        await treeApi.update(parentNode.id, parentNode)

        this.$emit('node-created', { parent: parentNode, node: newNode })
        this.$emit('update')
      } catch (error) {
        console.error('Fehler beim Erstellen:', error)
      } finally {
        this.loading = false
      }
    },

    async editNode(node) {
      const newName = prompt('Neuer Name:', node.name)
      if (!newName || newName === node.name) return

      this.loading = true
      try {
        const oldName = node.name
        node.name = newName

        await treeApi.patch(node.id, { name: newName })

        this.$emit('node-updated', { node, oldName, newName })
        this.$emit('update')
      } catch (error) {
        console.error('Fehler beim Bearbeiten:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteNode(node, index) {
      const confirmed = confirm(`Möchten Sie "${node.name}" wirklich löschen?`)
      if (!confirmed) return

      this.loading = true
      try {
        // Lösche rekursiv alle Kinder
        await treeApi.deleteWithChildren(node)

        this.myData.splice(index, 1)

        this.$emit('node-deleted', { node })
        this.$emit('update')
        this.updateAllParents()
      } catch (error) {
        console.error('Fehler beim Löschen:', error)
      } finally {
        this.loading = false
      }
    },

    getMaxId(nodes) {
      let maxId = 0
      nodes.forEach((node) => {
        if (node.id > maxId) maxId = node.id
        if (node.children && node.children.length) {
          const childMaxId = this.getMaxId(node.children)
          if (childMaxId > maxId) maxId = childMaxId
        }
      })
      return maxId
    },
  },

  watch: {
    allChecked(newVal) {
      if (newVal !== null) {
        this.setAllChecked(newVal)
      }
    },
  },

  created() {
    this.myData.forEach((item) => this.initializeNode(item))

    if (this.allChecked !== null) {
      this.setAllChecked(this.allChecked)
    }
  },
}
</script>

<style scoped>
.tree {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}
</style>
