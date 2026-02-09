<template>
  <ul class="tree">
    <li v-for="(item, idx) in myData" :key="item.name + idx">
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
      </div>
      <ul v-if="item.expanded && item.children" class="ml-1">
        <tree-node
          :myData="item.children"
          :allChecked="allChecked"
          @update="onChildUpdate"
        ></tree-node>
      </ul>
    </li>
  </ul>
</template>

<script>
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
    }
  },
  methods: {
    toggleNode(node) {
      if (!node.children) return
      node.expanded = !node.expanded
    },

    onCheckChange(node, value) {
      this.setNodeChecked(node, value)

      // Wenn gecheckt und hat Kinder, dann öffnen
      if (value && node.children && node.children.length > 0) {
        node.expanded = true
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

      // Rekursiv alle Kinder erst aktualisieren
      node.children.forEach((child) => this.updateParentState(child))

      // Zähle checked und indeterminate Kinder
      const totalChildren = node.children.length
      const checkedCount = node.children.filter(
        (child) => child.checked && !child.indeterminate,
      ).length
      const hasIndeterminate = node.children.some((child) => child.indeterminate)

      // Bestimme Status basierend auf Kindern
      if (checkedCount === totalChildren) {
        // Alle checked
        node.checked = true
        node.indeterminate = false
      } else if (checkedCount > 0 || hasIndeterminate) {
        // Teilweise checked
        node.checked = false
        node.indeterminate = true
      } else {
        // Nichts checked
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

    // Alle Nodes auf einmal setzen
    setAllChecked(checked) {
      this.myData.forEach((item) => this.setNodeChecked(item, checked))
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

    // Initial-Wert setzen, falls vorhanden
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
