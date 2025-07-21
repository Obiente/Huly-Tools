<template>
  <span :class="badgeClass" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
    <slot />
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ role: string }>()
const badgeClass = computed(() => {
  if (props.role === "admin") return "bg-purple-500/20 text-purple-400"
  if (props.role === "user") return "bg-blue-500/20 text-blue-400"
  if (props.role === "moderator") return "bg-green-500/20 text-green-400"
  return "bg-gray-500/20 text-gray-400"
})
</script>
