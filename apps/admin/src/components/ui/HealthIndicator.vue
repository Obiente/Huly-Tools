<template>
  <div :class="indicatorClasses">
    <div :class="dotClasses"></div>
    <span class="text-xs font-medium">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'healthy' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'healthy'
})

const statusText = computed(() => {
  switch (props.status) {
    case 'healthy':
      return 'Healthy'
    case 'warning':
      return 'Warning'
    case 'error':
      return 'Error'
    default:
      return 'Unknown'
  }
})

const indicatorClasses = computed(() => [
  'flex items-center gap-2 px-2 py-1 rounded-full',
  {
    'bg-green-900/20 text-green-400': props.status === 'healthy',
    'bg-yellow-900/20 text-yellow-400': props.status === 'warning',
    'bg-red-900/20 text-red-400': props.status === 'error'
  }
])

const dotClasses = computed(() => [
  'w-2 h-2 rounded-full',
  {
    'bg-green-400': props.status === 'healthy',
    'bg-yellow-400': props.status === 'warning',
    'bg-red-400': props.status === 'error'
  }
])
</script>
