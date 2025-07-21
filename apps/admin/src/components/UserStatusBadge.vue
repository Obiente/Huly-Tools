<template>
  <span :class="badgeClass" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
    <slot />
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>()
const badgeClass = computed(() => {
  if (props.status === "active") return "bg-green-500/20 text-green-400"
  if (props.status === "inactive") return "bg-gray-500/20 text-gray-400"
  if (props.status === "suspended") return "bg-red-500/20 text-red-400"
  return "bg-gray-500/20 text-gray-400"
})
</script>
