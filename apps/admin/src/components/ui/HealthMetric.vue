<template>
  <div class="health-metric">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <component 
          v-if="iconComponent" 
          :is="iconComponent" 
          class="w-4 h-4 text-gray-400" 
        />
        <span class="text-sm font-medium text-gray-300">{{ label }}</span>
      </div>
      <span class="text-sm text-white">{{ value }}</span>
    </div>
    
    <div v-if="progress !== undefined" class="progress-bar">
      <div 
        class="progress-fill"
        :style="{ width: `${Math.min(progress, 100)}%` }"
        :class="progressClasses"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ClockIcon,
  CpuChipIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'

interface Props {
  label: string
  value: string
  icon?: string
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  value: '',
  icon: undefined,
  progress: undefined
})

const iconMap = {
  'clock': ClockIcon,
  'cpu': CpuChipIcon,
  'hard-drive': CircleStackIcon
}

const iconComponent = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon as keyof typeof iconMap] || null
})

const progressClasses = computed(() => {
  if (props.progress === undefined) return ''
  
  if (props.progress < 70) return 'bg-green-500'
  if (props.progress < 85) return 'bg-yellow-500'
  return 'bg-red-500'
})
</script>

<style scoped>
@reference "tailwindcss";
.health-metric {
  padding: 0.75rem 0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--theme-divider-color, rgba(255, 255, 255, 0.1));
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 2px;
}
</style>
