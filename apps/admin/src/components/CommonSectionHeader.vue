<template>
  <h1 :class="headerClass">
    <slot />
  </h1>
</template>
<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps<{ size?: "lg" | "md" | "sm" }>();
  const headerClass = computed(() => {
    if (props.size === "lg") return "text-3xl font-bold mb-4";
    if (props.size === "md") return "text-2xl font-bold mb-2";
    return "text-xl font-bold mb-2";
  });
</script>
