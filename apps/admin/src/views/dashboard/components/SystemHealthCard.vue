<template>
  <div class="system-health-card">
    <header class="card-header">
      <h3 class="card-title">System Health</h3>
      <StatusIndicator :status="health?.status || 'error'" />
    </header>
    
    <div v-if="loading" class="loading-state">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
    
    <div v-else-if="health" class="health-metrics">
      <HealthMetric
        label="Uptime"
        :value="health.uptime"
        icon="clock"
      />
      <HealthMetric
        label="Memory Usage"
        :value="`${health.memoryUsage}%`"
        :progress="health.memoryUsage"
        icon="cpu"
      />
      <HealthMetric
        label="Storage Usage"
        :value="`${health.storageUsage}%`"
        :progress="health.storageUsage"
        icon="storage"
      />
      <HealthMetric
        label="Active Connections"
        :value="health.activeConnections.toString()"
        icon="network"
      />
    </div>
    
    <div v-else class="error-state">
      <p class="text-gray-500 dark:text-gray-400">
        Unable to load system health data
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemHealth } from '@/composables/useDashboard'
import StatusIndicator from '@/components/ui/StatusIndicator.vue'
import HealthMetric from '@/components/ui/HealthMetric.vue'

interface Props {
  health: SystemHealth | null
  loading: boolean
}

defineProps<Props>()
</script>

<style scoped>
@reference "tailwindcss";
.system-health-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
}

.card-header {
  @apply flex items-center justify-between mb-6;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.health-metrics {
  @apply space-y-4;
}

.loading-state,
.error-state {
  @apply py-8;
}
</style>
