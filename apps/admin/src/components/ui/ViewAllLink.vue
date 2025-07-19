<template>
  <a 
    :href="to" 
    class="view-all-link"
  >
    View All
    <ArrowRightIcon class="w-4 h-4" />
  </a>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

interface Props {
  to: string
}

defineProps<Props>()
</script>

<style scoped>
@reference "tailwindcss";
.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--primary-button-default, #2c23d5);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.view-all-link:hover {
  opacity: 0.8;
}
</style>
