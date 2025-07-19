<template>
  <div class="search-input">
    <div class="relative">
      <div class="search-icon">
        <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
      </div>
      <input
        :value="modelValue"
        @input="handleInput"
        type="text"
        :placeholder="placeholder"
        class="search-field"
      />
      <button
        v-if="modelValue"
        @click="handleClear"
        class="clear-button"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleClear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
@reference "tailwindcss";
.search-input {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none;
}

.search-field {
  @apply w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
         placeholder-gray-500 dark:placeholder-gray-400
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
         transition-colors;
}

.clear-button {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2
         text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
         transition-colors;
}
</style>
