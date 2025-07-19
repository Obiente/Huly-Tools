<template>
  <div class="status-indicator">
    <div :class="dotClasses"></div>
    <span :class="textClasses">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'healthy' | 'warning' | 'error'
}

const props = defineProps<Props>()

const statusText = computed(() => {
  switch (props.status) {
    case 'healthy': return 'Healthy'
    case 'warning': return 'Warning'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})

const dotClasses = computed(() => [
  'w-2 h-2 rounded-full mr-2',
  {
    'bg-green-400': props.status === 'healthy',
    'bg-yellow-400': props.status === 'warning',
    'bg-red-400': props.status === 'error'
  }
])

const textClasses = computed(() => [
  'text-sm font-medium',
  {
    'text-green-600 dark:text-green-400': props.status === 'healthy',
    'text-yellow-600 dark:text-yellow-400': props.status === 'warning',
    'text-red-600 dark:text-red-400': props.status === 'error'
  }
])
</script>

<style scoped>
@reference "tailwindcss";
.status-indicator {
  @apply flex items-center;
}
</style>
