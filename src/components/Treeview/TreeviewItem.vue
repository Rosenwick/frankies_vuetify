<template>
  <ul>
    <li v-for="item in data" :key="item.name">
      {{ item.name }}
      <ul v-if="item.children">
        <treeview :data="item.children"></treeview>
      </ul>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'TreeviewItem',
  props: {
    data: Array,
  },
}
</script>
