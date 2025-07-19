<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <StatsCard
      title="Accounts"
      :value="stats.accounts"
      icon="users"
      color="blue"
    />
    
    <StatsCard
      title="Workspaces"
      :value="stats.workspaces"
      icon="building"
      color="green"
    />
    
    <StatsCard
      title="Backups"
      :value="stats.backups"
      icon="archive"
      color="purple"
    />
    
    <StatsCard
      title="Storage"
      :value="stats.storage"
      icon="server"
      color="orange"
      :is-string="true"
    />
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats } from '@composables/useDashboard'
import StatsCard from '../ui/StatsCard.vue'

interface Props {
  stats: DashboardStats
}

defineProps<Props>()
</script>
