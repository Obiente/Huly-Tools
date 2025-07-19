<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div class="flex items-center">
      <div :class="iconClasses">
        <component :is="iconComponent" class="h-6 w-6" />
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold text-white">
          {{ isString ? value : formatNumber(value) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ArchiveBoxIcon, 
  ServerIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  title: string
  value: string | number
  icon: 'users' | 'building' | 'archive' | 'server'
  color: 'blue' | 'green' | 'purple' | 'orange'
  isString?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  value: 0,
  icon: 'server',
  color: 'blue',
  isString: false
})

const iconComponent = computed(() => {
  const icons = {
    users: UsersIcon,
    building: BuildingOfficeIcon,
    archive: ArchiveBoxIcon,
    server: ServerIcon
  }
  return icons[props.icon]
})

const iconClasses = computed(() => [
  'flex items-center justify-center w-12 h-12 rounded-lg',
  {
    'bg-blue-500/20 text-blue-400': props.color === 'blue',
    'bg-green-500/20 text-green-400': props.color === 'green',
    'bg-purple-500/20 text-purple-400': props.color === 'purple',
    'bg-orange-500/20 text-orange-400': props.color === 'orange'
  }
])

function formatNumber(value: string | number): string {
  if (typeof value === 'string') return value
  return value.toLocaleString()
}
</script>
