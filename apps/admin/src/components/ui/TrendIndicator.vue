<template>
  <div class="trend-indicator">
    <component :is="iconComponent" :class="iconClasses" />
    <span :class="textClasses">
      {{ formattedValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  trend: {
    value: number
    direction: 'up' | 'down'
    isPositive: boolean
  }
}

const props = defineProps<Props>()

const iconComponent = computed(() => {
  return props.trend.direction === 'up' ? ArrowUpIcon : ArrowDownIcon
})

const iconClasses = computed(() => [
  'w-3 h-3',
  {
    'text-green-500': props.trend.isPositive,
    'text-red-500': !props.trend.isPositive
  }
])

const textClasses = computed(() => [
  'text-xs font-medium',
  {
    'text-green-600 dark:text-green-400': props.trend.isPositive,
    'text-red-600 dark:text-red-400': !props.trend.isPositive
  }
])

const formattedValue = computed(() => {
  const sign = props.trend.direction === 'up' ? '+' : '-'
  return `${sign}${Math.abs(props.trend.value)}%`
})
</script>

<style scoped>
@reference "tailwindcss";
.trend-indicator {
  @apply flex items-center gap-1;
}
</style>
