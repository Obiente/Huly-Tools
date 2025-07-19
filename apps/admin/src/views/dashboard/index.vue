<template>
  <div class="dashboard-view">
    <header class="dashboard-header flex flex-row justify-between">
      <span>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Welcome to the Huly Admin Dashboard
        </p>
      </span>
      <LastUpdated class="self-end" />
    </header>
    <!-- Stats Overview -->
    <section class="stats-section">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          v-for="stat in stats"
          :key="stat.id"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :trend="stat.trend"
          :loading="statsLoading"
          :color="stat.color"
        />
      </div>
    </section>

    <!-- System Health & Activity -->
    <section class="content-section">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard :health="systemHealth" :loading="healthLoading" />
        <RecentActivityCard
          :activities="recentActivity"
          :loading="activityLoading"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import { useDashboard } from "@/composables/useDashboard";
  import StatsCard from "@/components/ui/StatsCard.vue";
  import SystemHealthCard from "./components/SystemHealthCard.vue";
  import RecentActivityCard from "./components/RecentActivityCard.vue";
  import LastUpdated from "@/components/ui/LastUpdated.vue";

  const {
    stats,
    systemHealth,
    recentActivity,
    statsLoading,
    healthLoading,
    activityLoading,
    refreshDashboard,
    startAutoRefresh,
    stopAutoRefresh,
  } = await useDashboard();

  onMounted(() => {
    refreshDashboard();
    startAutoRefresh(30000); // Refresh every 30 seconds
  });

  onUnmounted(() => {
    stopAutoRefresh();
  });
</script>

<style scoped>
  @reference "tailwindcss";
  .dashboard-view {
    @apply p-6 space-y-6;
  }

  .dashboard-header {
    @apply mb-8;
  }

  .stats-section {
    @apply mb-8;
  }

  .content-section {
    @apply space-y-6;
  }
</style>
