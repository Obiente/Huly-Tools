<template>
  <th scope="col" :class="cellClass">
    <slot />
  </th>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ align?: 'left' | 'right' | 'center' }>()
const cellClass = computed(() => {
  let base = 'px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider';
  if (props.align === 'right') return base + ' text-right';
  if (props.align === 'center') return base + ' text-center';
  return base + ' text-left';
})
</script>
