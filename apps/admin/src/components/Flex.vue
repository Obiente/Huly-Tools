<template>
  <component :is="props.is || 'div'" :class="flexClass">
    <slot />
  </component>
</template>
<script setup lang="ts">
  import { computed } from "vue";
  const props = defineProps<{
    is?: string;
    direction?: "row" | "col";
    align?: string;
    justify?: string;
    gap?: string;
  }>();
  const flexClass = computed(() => {
    let base = "flex";
    if (props.direction === "col") base += " flex-col";
    if (props.align) base += ` items-${props.align}`;
    if (props.justify) base += ` justify-${props.justify}`;
    if (props.gap) base += ` gap-${props.gap}`;
    return base;
  });
</script>
