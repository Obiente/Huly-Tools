<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Admin Dashboard</h1>
        <button 
          @click="refreshData" 
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Users</p>
              <p class="text-2xl font-bold">{{ stats.users }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Workspaces</p>
              <p class="text-2xl font-bold">{{ stats.workspaces }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Backups</p>
              <p class="text-2xl font-bold">{{ stats.backups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Storage</p>
              <p class="text-2xl font-bold">{{ stats.storage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- System Health -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-4">System Health</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">Uptime</span>
              <span class="text-sm">{{ systemHealth.uptime }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">Memory Usage</span>
              <span class="text-sm">{{ systemHealth.memoryUsage }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">Storage Usage</span>
              <span class="text-sm">{{ systemHealth.storageUsage }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">Status</span>
              <span :class="statusClasses">{{ systemHealth.status }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
          
          <div class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3">
              <div :class="activityIconClasses(activity.status)">
                <div class="w-2 h-2 rounded-full"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white">{{ activity.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="recentActivity.length === 0" class="text-center text-gray-500 py-8">
            No recent activity
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Types
interface Stats {
  users: number
  workspaces: number
  backups: number
  storage: string
}

interface SystemHealth {
  uptime: string
  memoryUsage: string
  storageUsage: string
  status: 'healthy' | 'warning' | 'error'
}

interface Activity {
  id: string
  type: string
  message: string
  timestamp: Date
  status: 'success' | 'warning' | 'error'
}

// State
const loading = ref(false)
const stats = ref<Stats>({
  users: 0,
  workspaces: 0,
  backups: 0,
  storage: '0 GB'
})

const systemHealth = ref<SystemHealth>({
  uptime: '0 minutes',
  memoryUsage: '0%',
  storageUsage: '0%',
  status: 'healthy'
})

const recentActivity = ref<Activity[]>([])

// Computed
const statusClasses = computed(() => [
  'text-xs px-2 py-1 rounded-full',
  {
    'bg-green-500/20 text-green-400': systemHealth.value.status === 'healthy',
    'bg-yellow-500/20 text-yellow-400': systemHealth.value.status === 'warning',
    'bg-red-500/20 text-red-400': systemHealth.value.status === 'error'
  }
])

// Methods
function activityIconClasses(status: string) {
  return [
    'flex items-center justify-center w-6 h-6 rounded-full mt-0.5',
    {
      'bg-green-500/20': status === 'success',
      'bg-yellow-500/20': status === 'warning',
      'bg-red-500/20': status === 'error'
    }
  ]
}

function formatTime(timestamp: Date): string {
  return new Date(timestamp).toLocaleTimeString()
}

async function loadStats() {
  try {
    const response = await fetch('/api/stats')
    if (response.ok) {
      const data = await response.json()
      stats.value = {
        users: data.accounts || 0,
        workspaces: data.workspaces || 0,
        backups: data.backups || 0,
        storage: data.storage || '0 GB'
      }
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

async function loadSystemHealth() {
  try {
    const response = await fetch('/api/stats/system')
    if (response.ok) {
      const data = await response.json()
      systemHealth.value = {
        uptime: data.uptime || '0 minutes',
        memoryUsage: data.memoryUsage || '0%',
        storageUsage: data.storageUsage || '0%',
        status: data.status || 'healthy'
      }
    }
  } catch (error) {
    console.error('Failed to load system health:', error)
  }
}

async function loadActivity() {
  // Mock data for now
  recentActivity.value = [
    {
      id: '1',
      type: 'user',
      message: 'New user registered',
      timestamp: new Date(Date.now() - 300000),
      status: 'success'
    },
    {
      id: '2',
      type: 'backup',
      message: 'Backup completed successfully',
      timestamp: new Date(Date.now() - 600000),
      status: 'success'
    },
    {
      id: '3',
      type: 'system',
      message: 'System maintenance scheduled',
      timestamp: new Date(Date.now() - 900000),
      status: 'warning'
    }
  ]
}

async function refreshData() {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadSystemHealth(),
      loadActivity()
    ])
  } finally {
    loading.value = false
  }
}

// Auto-refresh
let refreshInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  refreshData()
  refreshInterval = setInterval(refreshData, 30000) // Refresh every 30 seconds
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
