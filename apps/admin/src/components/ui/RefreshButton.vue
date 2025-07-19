<template>
  <button
    :disabled="loading"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <ArrowPathIcon 
      :class="iconClasses"
      class="w-4 h-4" 
    />
    Refresh
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<Emits>()

const buttonClasses = computed(() => [
  'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
  'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
  'disabled:opacity-50 disabled:cursor-not-allowed'
])

const iconClasses = computed(() => [
  props.loading && 'animate-spin'
])
</script>
