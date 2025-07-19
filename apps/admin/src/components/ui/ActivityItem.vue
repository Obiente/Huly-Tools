<template>
  <div class="activity-item">
    <div class="flex items-start gap-3">
      <div :class="iconClasses">
        <component 
          v-if="iconComponent" 
          :is="iconComponent" 
          class="w-4 h-4" 
        />
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm text-white">{{ activity.message }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formattedTime }}</p>
      </div>
      
      <div :class="statusClasses">
        <div class="w-2 h-2 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  UserIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import type { RecentActivity } from '../@/composables/useDashboard'

interface Props {
  activity: RecentActivity
}

const props = defineProps<Props>()

const iconMap = {
  'user': UserIcon,
  'workspace': BuildingOfficeIcon,
  'backup': ArchiveBoxIcon,
  'system': Cog6ToothIcon
}

const iconComponent = computed(() => {
  return iconMap[props.activity.type as keyof typeof iconMap] || UserIcon
})

const iconClasses = computed(() => [
  'flex items-center justify-center w-8 h-8 rounded-full',
  {
    'bg-blue-500/20 text-blue-400': props.activity.type === 'user',
    'bg-green-500/20 text-green-400': props.activity.type === 'workspace',
    'bg-purple-500/20 text-purple-400': props.activity.type === 'backup',
    'bg-gray-500/20 text-gray-400': props.activity.type === 'system'
  }
])

const statusClasses = computed(() => [
  'flex items-center justify-center',
  {
    'text-green-400': props.activity.status === 'success',
    'text-yellow-400': props.activity.status === 'warning',
    'text-red-400': props.activity.status === 'error'
  }
])

const formattedTime = computed(() => {
  const now = new Date()
  const diff = now.getTime() - props.activity.timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
})
</script>

<style scoped>
@reference "tailwindcss";
.activity-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--theme-divider-color, rgba(255, 255, 255, 0.05));
}

.activity-item:last-child {
  border-bottom: none;
}
</style>
