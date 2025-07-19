<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">User Management</h1>
        <div class="flex items-center gap-3">
          <button 
            @click="loadUsers" 
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button 
            @click="showCreateModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Add User
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <!-- Users Table -->
      <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-750">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-white">{{ user.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="roleClasses(user.role)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusClasses(user.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <button 
                      @click="editUser(user)"
                      class="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteUser(user.id)"
                      class="text-red-400 hover:text-red-300 text-sm"
                      :disabled="user.role === 'admin'"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="users.length === 0 && !loading" class="text-center py-12 text-gray-500">
          No users found
        </div>
        
        <div v-if="loading" class="text-center py-12 text-gray-500">
          Loading users...
        </div>
      </div>
    </main>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h3 class="text-lg font-semibold mb-4">{{ editingUser ? 'Edit User' : 'Create User' }}</h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              v-model="userForm.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              v-model="userForm.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              v-model="userForm.role"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              v-model="userForm.password"
              type="password"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {{ submitting ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
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
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}

interface UserForm {
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  password?: string
}

// State
const users = ref<User[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const submitting = ref(false)

const userForm = ref<UserForm>({
  name: '',
  email: '',
  role: 'user',
  password: ''
})

// Methods
function roleClasses(role: string) {
  return {
    'bg-purple-500/20 text-purple-400': role === 'admin',
    'bg-blue-500/20 text-blue-400': role === 'user',
    'bg-green-500/20 text-green-400': role === 'moderator'
  }
}

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

async function loadUsers() {
  loading.value = true
  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const response = await fetch(`${config.endpoint}/api/accounts`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.map((user: any) => ({
        id: user._id,
        name: user.name || user.email,
        email: user.email,
        role: user.role || 'user',
        status: user.confirmed ? 'active' : 'inactive',
        createdAt: user.createdOn || new Date().toISOString()
      }))
    } else {
      showNotification('Failed to load users', 'error')
    }
  } catch (error) {
    console.error('Error loading users:', error)
    showNotification('Error loading users', 'error')
  } finally {
    loading.value = false
  }
}

function editUser(user: User) {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role
  }
}

function closeModal() {
  showCreateModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'user',
    password: ''
  }
}

async function saveUser() {
  submitting.value = true
  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const url = editingUser.value 
      ? `${config.endpoint}/api/accounts/${editingUser.value.id}`
      : `${config.endpoint}/api/accounts`
    
    const method = editingUser.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userForm.value)
    })

    if (response.ok) {
      showNotification(`User ${editingUser.value ? 'updated' : 'created'} successfully`, 'success')
      closeModal()
      await loadUsers()
    } else {
      showNotification(`Failed to ${editingUser.value ? 'update' : 'create'} user`, 'error')
    }
  } catch (error) {
    console.error('Error saving user:', error)
    showNotification('Error saving user', 'error')
  } finally {
    submitting.value = false
  }
}

async function deleteUser(userId: string) {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    const config = JSON.parse(localStorage.getItem('adminConfig') || '{}')
    if (!config.endpoint || !config.apiKey) {
      showNotification('Please configure API settings first', 'error')
      return
    }

    const response = await fetch(`${config.endpoint}/api/accounts/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      showNotification('User deleted successfully', 'success')
      await loadUsers()
    } else {
      showNotification('Failed to delete user', 'error')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    showNotification('Error deleting user', 'error')
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
  loadUsers()
})
</script>
