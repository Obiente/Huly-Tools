<template>
  <div class="stats-card-skeleton">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="skeleton-title"></div>
        <div class="skeleton-value"></div>
      </div>
      
      <div class="skeleton-icon"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple skeleton loader for stats cards
</script>

<style scoped>
@reference "tailwindcss";
.stats-card-skeleton {
  background-color: var(--theme-panel-color, #1A1A28);
  border: 1px solid var(--theme-divider-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--medium-BorderRadius, 0.75rem);
  padding: 1.5rem;
}

.skeleton-title {
  height: 1rem;
  background-color: var(--theme-divider-color, rgba(255, 255, 255, 0.1));
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  width: 60%;
  animation: pulse 2s infinite;
}

.skeleton-value {
  height: 2rem;
  background-color: var(--theme-divider-color, rgba(255, 255, 255, 0.1));
  border-radius: 0.25rem;
  width: 80%;
  animation: pulse 2s infinite;
}

.skeleton-icon {
  width: 3rem;
  height: 3rem;
  background-color: var(--theme-divider-color, rgba(255, 255, 255, 0.1));
  border-radius: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
