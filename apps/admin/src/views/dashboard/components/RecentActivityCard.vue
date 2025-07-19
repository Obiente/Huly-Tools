<template>
  <div class="recent-activity-card">
    <header class="card-header">
      <h3 class="card-title">Recent Activity</h3>
      <RefreshButton @click="$emit('refresh')" :loading="loading" />
    </header>
    
    <div v-if="loading" class="loading-state">
      <div class="animate-pulse space-y-3">
        <div v-for="i in 3" :key="i" class="flex space-x-3">
          <div class="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="activities.length > 0" class="activity-list">
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
      />
    </div>
    
    <div v-else class="empty-state">
      <p class="text-gray-500 dark:text-gray-400">
        No recent activity
      </p>
    </div>
    
    <footer v-if="activities.length > 0" class="card-footer">
      <ViewAllLink to="/activity" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@composables/useDashboard'
import ActivityItem from '@components/ui/ActivityItem.vue'
import RefreshButton from '@components/ui/RefreshButton.vue'
import ViewAllLink from '@components/ui/ViewAllLink.vue'

interface Props {
  activities: Activity[]
  loading: boolean
}

defineProps<Props>()
defineEmits<{
  refresh: []
}>()
</script>

<style scoped>
@reference "tailwindcss";
.recent-activity-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
}

.card-header {
  @apply flex items-center justify-between mb-6;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.activity-list {
  @apply space-y-3 max-h-64 overflow-y-auto;
}

.loading-state,
.empty-state {
  @apply py-8 text-center;
}

.card-footer {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}
</style>
