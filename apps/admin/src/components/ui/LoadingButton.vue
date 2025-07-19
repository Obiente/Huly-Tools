<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <div v-if="loading" class="flex items-center gap-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      <span>{{ loadingText || 'Loading...' }}</span>
    </div>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  loadingText?: string
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

defineEmits<Emits>()

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-md transition-colors',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  // Size variations
  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-sm': props.size === 'md',
    'px-6 py-3 text-base': props.size === 'lg'
  },
  
  // Variant variations
  {
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': props.variant === 'primary',
    'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': props.variant === 'secondary',
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': props.variant === 'danger'
  },
  
  // State variations
  {
    'opacity-50 cursor-not-allowed': props.disabled || props.loading,
    'cursor-pointer': !props.disabled && !props.loading
  }
])
</script>
