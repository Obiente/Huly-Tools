<template>
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 mt-1">Overview of your Huly platform</p>
      </div>
      
      <div class="flex items-center gap-3">
        <RefreshButton @click="$emit('refresh')" :loading="refreshing" />
        <LastUpdated :timestamp="lastUpdated" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RefreshButton from '../ui/RefreshButton.vue'
import LastUpdated from '../ui/LastUpdated.vue'

interface Props {
  refreshing?: boolean
  lastUpdated?: Date
}

interface Emits {
  (e: 'refresh'): void
}

withDefaults(defineProps<Props>(), {
  refreshing: false
})

defineEmits<Emits>()
</script>
