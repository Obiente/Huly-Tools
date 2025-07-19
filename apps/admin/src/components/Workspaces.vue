<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Workspace Management</h1>
        <div class="flex items-center gap-3">
          <button 
            @click="loadWorkspaces" 
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button 
            @click="showCreateModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Create Workspace
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <!-- Workspaces Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="workspace in workspaces" :key="workspace.id" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white mb-1">{{ workspace.name }}</h3>
              <p class="text-sm text-gray-400">{{ workspace.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="statusClasses(workspace.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ workspace.status }}
              </span>
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Members:</span>
              <span class="text-white">{{ workspace.memberCount || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Created:</span>
              <span class="text-white">{{ formatDate(workspace.createdAt) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Storage:</span>
              <span class="text-white">{{ workspace.storageUsed || '0 MB' }}</span>
            </div>
          </div>
          
          <div class="flex justify-end gap-2">
            <button 
              @click="editWorkspace(workspace)"
              class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
            >
              Edit
            </button>
            <button 
              @click="deleteWorkspace(workspace.id)"
              class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="workspaces.length === 0 && !loading" class="text-center py-12 text-gray-500">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <p>No workspaces found</p>
      </div>
      
      <div v-if="loading" class="text-center py-12 text-gray-500">
        Loading workspaces...
      </div>
    </main>

    <!-- Create/Edit Workspace Modal -->
    <div v-if="showCreateModal || editingWorkspace" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h3 class="text-lg font-semibold mb-4">{{ editingWorkspace ? 'Edit Workspace' : 'Create Workspace' }}</h3>
        
        <form @submit.prevent="saveWorkspace" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              v-model="workspaceForm.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              v-model="workspaceForm.description"
              rows="3"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              v-model="workspaceForm.status"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              {{ submitting ? 'Saving...' : (editingWorkspace ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Types
interface Workspace {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive' | 'suspended'
  memberCount?: number
  storageUsed?: string
  createdAt: string
}

interface WorkspaceForm {
  name: string
  description: string
  status: 'active' | 'inactive' | 'suspended'
}

// State
const workspaces = ref<Workspace[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const editingWorkspace = ref<Workspace | null>(null)
const submitting = ref(false)

const workspaceForm = ref<WorkspaceForm>({
  name: '',
  description: '',
  status: 'active'
})

// Methods
function statusClasses(status: string) {
  return {
    'bg-green-500/20 text-green-400': status === 'active',
    'bg-gray-500/20 text-gray-400': status === 'inactive',
    'bg-red-500/20 text-red-400': status === 'suspended'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

async function loadWorkspaces() {
  loading.value = true
  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const response = await fetch(`${config.endpoint}/api/workspaces`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      workspaces.value = data.map((workspace: any) => ({
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        status: workspace.disabled ? 'inactive' : 'active',
        memberCount: workspace.accounts?.length || 0,
        storageUsed: workspace.storageUsed || '0 MB',
        createdAt: workspace.createdOn || new Date().toISOString()
      }))
    } else {
      showNotification('Failed to load workspaces', 'error')
    }
  } catch (error) {
    console.error('Error loading workspaces:', error)
    showNotification('Error loading workspaces', 'error')
  } finally {
    loading.value = false
  }
}

function editWorkspace(workspace: Workspace) {
  editingWorkspace.value = workspace
  workspaceForm.value = {
    name: workspace.name,
    description: workspace.description || '',
    status: workspace.status
  }
}

function closeModal() {
  showCreateModal.value = false
  editingWorkspace.value = null
  workspaceForm.value = {
    name: '',
    description: '',
    status: 'active'
  }
}

async function saveWorkspace() {
  submitting.value = true
  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const url = editingWorkspace.value 
      ? `${config.endpoint}/api/workspaces/${editingWorkspace.value.id}`
      : `${config.endpoint}/api/workspaces`
    
    const method = editingWorkspace.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: workspaceForm.value.name,
        description: workspaceForm.value.description,
        disabled: workspaceForm.value.status !== 'active'
      })
    })

    if (response.ok) {
      showNotification(`Workspace ${editingWorkspace.value ? 'updated' : 'created'} successfully`, 'success')
      closeModal()
      await loadWorkspaces()
    } else {
      showNotification(`Failed to ${editingWorkspace.value ? 'update' : 'create'} workspace`, 'error')
    }
  } catch (error) {
    console.error('Error saving workspace:', error)
    showNotification('Error saving workspace', 'error')
  } finally {
    submitting.value = false
  }
}

async function deleteWorkspace(workspaceId: string) {
  if (!confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) return

  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const response = await fetch(`${config.endpoint}/api/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      showNotification('Workspace deleted successfully', 'success')
      await loadWorkspaces()
    } else {
      showNotification('Failed to delete workspace', 'error')
    }
  } catch (error) {
    console.error('Error deleting workspace:', error)
    showNotification('Error deleting workspace', 'error')
  }
}

function showNotification(message: string, type: 'success' | 'error') {
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadWorkspaces()
})
</script>
