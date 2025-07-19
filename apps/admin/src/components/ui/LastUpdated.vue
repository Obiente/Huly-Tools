<template>
  <div class="last-updated">
    <span class="text-sm text-gray-400">
      Last updated: {{ formattedTime }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  timestamp?: Date
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
  if (!props.timestamp) return 'Never'
  
  return props.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})
</script>

<style scoped>
@reference "tailwindcss";
.last-updated {
  font-size: 0.875rem;
  color: var(--theme-content-color, rgba(255, 255, 255, 0.6));
}
</style>
