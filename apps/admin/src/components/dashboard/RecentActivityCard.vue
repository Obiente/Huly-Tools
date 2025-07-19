<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Recent Activity</h3>
      <ViewAllLink to="/activity" />
    </div>
    
    <div v-if="!loading" class="space-y-3">
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
      />
      
      <div v-if="activities.length === 0" class="text-center py-8">
        <p class="text-gray-400">No recent activity</p>
      </div>
    </div>
    
    <div v-else class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecentActivity } from '@composables/useDashboard'
import ActivityItem from '../ui/ActivityItem.vue'
import ViewAllLink from '../ui/ViewAllLink.vue'

interface Props {
  activities: RecentActivity[]
  loading: boolean
}

defineProps<Props>()
</script>
