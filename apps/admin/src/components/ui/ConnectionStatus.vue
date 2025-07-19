<template>
  <div :class="containerClasses">
    <div class="flex items-center gap-3">
      <div :class="iconClasses">
        <CheckIcon v-if="status === 'success'" class="h-5 w-5" />
        <XMarkIcon v-else class="h-5 w-5" />
      </div>
      
      <div class="flex-1">
        <p :class="titleClasses">
          {{ title }}
        </p>
        <p v-if="message" :class="messageClasses">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'

interface Props {
  status: 'success' | 'error'
  title?: string
  message?: string
}

const props = defineProps<Props>()

const title = computed(() => {
  if (props.title) return props.title
  return props.status === 'success' ? 'Success' : 'Error'
})

const containerClasses = computed(() => [
  'p-4 rounded-lg border',
  props.status === 'success' 
    ? 'bg-green-900/20 border-green-500/50' 
    : 'bg-red-900/20 border-red-500/50'
])

const iconClasses = computed(() => [
  'flex-shrink-0 rounded-full p-1',
  props.status === 'success' 
    ? 'bg-green-500/20 text-green-400' 
    : 'bg-red-500/20 text-red-400'
])

const titleClasses = computed(() => [
  'font-medium text-sm',
  props.status === 'success' ? 'text-green-300' : 'text-red-300'
])

const messageClasses = computed(() => [
  'text-sm mt-1',
  props.status === 'success' ? 'text-green-400' : 'text-red-400'
])
</script>
