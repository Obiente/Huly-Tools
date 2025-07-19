<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div v-if="loading" class="loading-spinner"></div>
    <component 
      v-else-if="icon" 
      :is="iconComponent" 
      class="w-4 h-4" 
    />
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ArchiveBoxIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const iconMap = {
  plus: PlusIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  archive: ArchiveBoxIcon,
  refresh: ArrowPathIcon
}

const iconComponent = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon as keyof typeof iconMap]
})

const buttonClasses = computed(() => [
  'inline-flex items-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
  // Variants
  {
    'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500': props.variant === 'primary',
    'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500': props.variant === 'secondary',
    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500': props.variant === 'danger',
    'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300 focus:ring-gray-500': props.variant === 'ghost'
  },
  // Sizes
  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-sm': props.size === 'md',
    'px-6 py-3 text-base': props.size === 'lg'
  },
  // States
  {
    'opacity-50 cursor-not-allowed': props.disabled || props.loading
  }
])

function handleClick() {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
@reference "tailwindcss";
.loading-spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>
