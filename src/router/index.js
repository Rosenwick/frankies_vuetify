import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import TreeviewView from '@/views/TreeviewView.vue'
import TransferList from '@/views/TransferList.vue'
import DragAndDrop from '@/components/DragAndDrop.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/kontakt', name: 'kontakt', component: ContactView },
    { path: '/projekte/treeview', name: 'treeview', component: TreeviewView },
    { path: '/projekte/transfer-list', name: 'transferlist', component: TransferList },
    { path: '/projekte/drag-and-drop', name: 'draganddrop', component: DragAndDrop },
  ],
})

export default router
