const API_URL = 'http://localhost:3000/treeNodes'

export default {
  // Alle Nodes holen
  async getAll() {
    const response = await fetch(API_URL)
    return await response.json()
  },

  // Einzelnen Node holen
  async getById(id) {
    const response = await fetch(`${API_URL}/${id}`)
    return await response.json()
  },

  // Neuen Node erstellen
  async create(node) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node),
    })
    return await response.json()
  },

  // Node aktualisieren
  async update(id, node) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(node),
    })
    return await response.json()
  },

  // Node teilweise aktualisieren
  async patch(id, updates) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    return await response.json()
  },

  // Node löschen
  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },

  // Rekursiv Node und alle Kinder löschen
  async deleteWithChildren(node) {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        await this.deleteWithChildren(child)
      }
    }
    await this.delete(node.id)
  },

  // Rekursiv Node und alle Kinder aktualisieren
  async updateWithChildren(node) {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        await this.updateWithChildren(child)
      }
    }
    await this.update(node.id, node)
  },
}
