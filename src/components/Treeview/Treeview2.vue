<template>
  <ul class="tree">
    <li v-for="(item, idx) in myData" :key="item.name + idx">
      <div class="d-flex align-center">
        <v-icon
          v-if="item.children && item.children.length > 0"
          :icon="item.expanded ? openClass : iconClass"
          @click="toggleNode(item)"
        ></v-icon>

        <v-checkbox
          class="d-inline-block"
          :model-value="item.checked"
          :indeterminate="item.indeterminate"
          density="compact"
          hide-details
          :label="item.name"
          @update:modelValue="(val) => onCheckChange(item, val)"
        />
      </div>
      <ul v-if="item.expanded && item.children" class="ml-1">
        <tree-node :myData="item.children" @update="onChildUpdate"></tree-node>
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
  },

  created() {
    this.myData.forEach((item) => this.initializeNode(item))
  },
}
</script>

<style scoped>
.toggle-icon {
  cursor: pointer;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  user-select: none;
}

.toggle-icon::before {
  content: '▶';
  transition: transform 0.2s ease;
}

.toggle-icon.open::before {
  content: '▼';
}

.tree {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}

.tree > li {
  margin: 4px 0;
}

.tree > li > span > ul {
  list-style: none;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

/* Indeterminate Checkbox Styling */
input[type='checkbox']:indeterminate {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

input[type='checkbox']:indeterminate::after {
  content: '';
  display: block;
  width: 10px;
  height: 2px;
  background: white;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
