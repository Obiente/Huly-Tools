<template>
  <DashboardLayout>
    <div class="page-header">
      <h1 class="text-3xl font-bold text-white">Backup Management</h1>
      <p class="text-gray-400 mt-1">Monitor and manage system backups</p>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Recent Backups</h2>
        <div class="flex gap-2">
          <LoadingButton @click="createBackup" :loading="creating" variant="primary">
            Create Backup
          </LoadingButton>
          <LoadingButton @click="refreshBackups" :loading="loading">
            Refresh
          </LoadingButton>
        </div>
      </div>
      
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="h-14 bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div v-else-if="backups.length === 0" class="text-center py-12">
        <p class="text-gray-400">No backups found</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="backup in backups" 
          :key="backup.id"
          class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg">📦</span>
            </div>
            <div>
              <p class="text-white font-medium">{{ backup.name }}</p>
              <p class="text-gray-400 text-sm">
                {{ formatDate(backup.createdAt) }} • {{ backup.size }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="statusClasses(backup.status)">
              {{ backup.status }}
            </span>
            <LoadingButton size="sm" variant="secondary">
              Restore
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import LoadingButton from './ui/LoadingButton.vue'

interface Backup {
  id: string
  name: string
  createdAt: Date
  size: string
  status: 'completed' | 'failed' | 'in-progress'
}

const backups = ref<Backup[]>([])
const loading = ref(false)
const creating = ref(false)

async function refreshBackups() {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    backups.value = [
      { 
        id: '1', 
        name: 'Daily Backup - Main DB', 
        createdAt: new Date(), 
        size: '2.4 GB', 
        status: 'completed' 
      },
      { 
        id: '2', 
        name: 'Weekly Full Backup', 
        createdAt: new Date(Date.now() - 86400000), 
        size: '8.1 GB', 
        status: 'completed' 
      }
    ]
  } catch (error) {
    console.error('Failed to load backups:', error)
  } finally {
    loading.value = false
  }
}

async function createBackup() {
  creating.value = true
  try {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000))
    await refreshBackups()
  } catch (error) {
    console.error('Failed to create backup:', error)
  } finally {
    creating.value = false
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function statusClasses(status: string): string {
  const baseClasses = 'px-2 py-1 text-xs rounded font-medium'
  switch (status) {
    case 'completed':
      return `${baseClasses} bg-green-600 text-white`
    case 'failed':
      return `${baseClasses} bg-red-600 text-white`
    case 'in-progress':
      return `${baseClasses} bg-yellow-600 text-white`
    default:
      return `${baseClasses} bg-gray-600 text-white`
  }
}

onMounted(refreshBackups)
</script>

<style scoped>
@reference "tailwindcss";
.page-header {
  margin-bottom: 2rem;
}
</style>
