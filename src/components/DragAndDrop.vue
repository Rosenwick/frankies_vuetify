<template>
  <v-container>
    <v-row justify="center" class="text-center">
      <v-col cols="12">
        <h2 class="mb-2">Objekte einfügen/entfernen per Drag & Drop</h2>
      </v-col>
      <v-col cols="12">
        <router-link to="/KlickToggleData" class="text-primary text-decoration-none mr-4">
          Objekte einfügen/entfernen per Klick
        </router-link>
        <router-link to="/RemoveAndInsert" class="text-primary text-decoration-none">
          Klick & Move Elemente
        </router-link>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-3">
      <!-- Quelle -->
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title class="bg-light-blue-accent-4">
            <h4 class="mb-0">Quelle</h4>
          </v-card-title>

          <div
            class="drag-drop-list"
            @drop="onDrop($event, 'source')"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="(item, index) in sortedArray(sourceList)"
              :key="item.id"
              class="drag-item"
              draggable="true"
              @dragstart="startDrag($event, item.id)"
            >
              <v-icon size="small" class="drag-handle mr-2">mdi-drag-vertical</v-icon>
              <span>{{ item.username }}</span>
            </div>
          </div>

          <v-card-actions class="bg-grey-lighten-3 justify-center">
            <v-btn variant="flat" color="primary" @click="reset()"> Zurücksetzen </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Spacer -->
      <v-col cols="12" md="1"></v-col>

      <!-- Meine Auswahl -->
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title class="bg-light-blue-accent-4">
            <h4 class="mb-0">Meine Auswahl</h4>
          </v-card-title>

          <div
            class="drag-drop-list"
            @drop="onDrop($event, 'target')"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="(item, index) in sortedArray(targetList)"
              :key="item.id"
              class="drag-item drag-item-selected"
              draggable="true"
              @dragstart="startDrag($event, item.id)"
            >
              <v-icon size="small" class="drag-handle mr-2">mdi-drag-vertical</v-icon>
              <span>{{ item.username }}</span>
            </div>
          </div>

          <v-card-actions class="bg-grey-lighten-3 justify-center">
            <v-btn variant="flat" color="primary" @click="doThis()"> Mach was! </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Result Section -->
    <v-row>
      <v-col cols="12" md="6" offset-md="3" class="text-center mt-2">
        <code class="text-grey">Quelle: /components/DragAndDrop1.vue</code>
      </v-col>
      <v-col cols="12" md="6" offset-md="3" v-if="result">
        <v-card class="mt-5">
          <v-card-text>
            <code class="d-block">{{ result }}</code>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ItemDragAndDrop',
  data() {
    return {
      basicList: [],
      sourceList: [],
      targetList: [],
      result: '',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(async (response) => {
          const data = await response.json()

          if (!response.ok) {
            const error = (data && data.message) || response.status
            return Promise.reject(error)
          }

          this.basicList = data
          this.sourceList = this.basicList.filter((item) => item.id >= 0)
        })
        .catch((error) => {
          this.result = error
        })
    },

    startDrag(evt, itemID) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', itemID.toString())
    },

    sortedArray(myArray) {
      return myArray.slice().sort(function (a, b) {
        return a.username > b.username ? 1 : -1
      })
    },

    onDrop(evt, list) {
      const itemID = parseInt(evt.dataTransfer.getData('itemID'))

      if (list === 'target') {
        this.sourceList = this.sourceList.filter((item) => item.id !== itemID)
        this.targetList = this.basicList.filter(
          (baseItem) => !this.sourceList.some((sourceItem) => baseItem.id === sourceItem.id),
        )
      } else if (list === 'source') {
        this.targetList = this.targetList.filter((item) => item.id !== itemID)
        this.sourceList = this.basicList.filter(
          (baseItem) => !this.targetList.some((targetItem) => baseItem.id === targetItem.id),
        )
      }
    },

    reset() {
      this.targetList = []
      this.fetchData()
      this.result = ''
    },

    doThis() {
      this.result = JSON.stringify(this.targetList)
    },
  },
}
</script>

<style lang="scss" scoped>
.drag-drop-list {
  height: 205px;
  overflow-y: auto;
  background-color: #e5e5f7;
  opacity: 0.8;
  background-image:
    repeating-linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee),
    repeating-linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee);
  background-position:
    0 0,
    10px 10px;
  background-size: 20px 20px;
}

.drag-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ddd;
  border-bottom: 1px solid #ccc;
  cursor: move;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5e92f3;
    color: #fff;
  }

  &:last-child {
    border-bottom: none;
  }
}

.drag-item-selected {
  background-color: #b2dfdb;

  &:hover {
    background-color: #5e92f3;
  }
}

.drag-handle {
  opacity: 0.5;
  flex-shrink: 0;
}
</style>
