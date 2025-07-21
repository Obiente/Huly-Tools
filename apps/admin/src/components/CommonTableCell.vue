<template>
  <td :class="cellClass">
    <slot />
  </td>
</template>
<script setup lang="ts">
const props = defineProps<{ align?: 'left' | 'right' | 'center', class?: string }>()
const cellClass = [
  'px-6 py-4 whitespace-nowrap',
  props.align === 'right' ? 'text-right' : props.align === 'center' ? 'text-center' : 'text-left',
  props.class || ''
]
</script>
