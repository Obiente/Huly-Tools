<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">System Health</h3>
      <HealthIndicator :status="health.status" />
    </div>
    
    <div v-if="!loading" class="space-y-4">
      <HealthMetric 
        label="Uptime"
        :value="health.uptime"
        icon="clock"
      />
      
      <HealthMetric 
        label="Memory Usage"
        :value="health.memoryUsage"
        icon="cpu"
        :progress="parsePercentage(health.memoryUsage)"
      />
      
      <HealthMetric 
        label="Storage Usage"
        :value="health.storageUsage"
        icon="hard-drive"
        :progress="parsePercentage(health.storageUsage)"
      />
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemHealth } from '@composables/useDashboard'
import HealthIndicator from '../ui/HealthIndicator.vue'
import HealthMetric from '../ui/HealthMetric.vue'

interface Props {
  health: SystemHealth
  loading: boolean
}

defineProps<Props>()

function parsePercentage(value: string): number {
  const match = value.match(/(\d+)%/)
  return match ? parseInt(match[1]) : 0
}
</script>
