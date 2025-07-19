/**
 * Dashboard data management composable
 */
import { onMounted, ref } from "vue";
import { useAdminApi } from "./useAdminApi";
import { useUI } from "./useUI";

import type {
  DashboardStats,
  RecentActivity,
  SystemHealth,
  Stats
} from "@huly-tools/types";

export async function useDashboard() {
  const api = useAdminApi();
  const { showError, setLoading, isLoading } = useUI();

  // State
  const stats = ref<Stats>(await api.getStats());

  const systemHealth = ref<SystemHealth>(await api.getSystemHealth());

  const recentActivity = ref<RecentActivity[]>([]);

  // Loading states
  const statsLoading = ref(false);
  const healthLoading = ref(false);
  const activityLoading = ref(false);

  // Fetch dashboard stats
  async function fetchStats() {
    statsLoading.value = true;
    try {
      const response = await api.getStats();
    } catch (error) {
      showError("Failed to load stats", "Unable to fetch dashboard statistics");
    } finally {
      statsLoading.value = false;
    }
  }

  // Fetch system health
  async function fetchSystemHealth() {
    healthLoading.value = true;
    try {
      const response = await api.getSystemHealth();
      systemHealth.value = {
        uptime: response.uptime || "0 minutes",
        memoryUsage: response.memoryUsage || "0%",
        storageUsage: response.storageUsage || "0%",
        status: response.status || "healthy",
      };
    } catch (error) {
      showError(
        "Failed to load system health",
        "Unable to fetch system health data",
      );
    } finally {
      healthLoading.value = false;
    }
  }

  // Fetch recent activity
  async function fetchRecentActivity() {
    activityLoading.value = true;
    try {
      // This would be replaced with actual API call
      recentActivity.value = [
        {
          id: "1",
          type: "user",
          message: "New user registered",
          timestamp: new Date(),
          status: "success",
        },
        {
          id: "2",
          type: "backup",
          message: "Backup completed successfully",
          timestamp: new Date(Date.now() - 300000),
          status: "success",
        },
      ];
    } catch (error) {
      showError("Failed to load activity", "Unable to fetch recent activity");
    } finally {
      activityLoading.value = false;
    }
  }

  // Refresh all dashboard data
  async function refreshDashboard() {
    await Promise.all([
      fetchStats(),
      fetchSystemHealth(),
      fetchRecentActivity(),
    ]);
  }

  // Initialize on mount
  onMounted(refreshDashboard);

  return {
    // State
    stats,
    systemHealth,
    recentActivity,

    // Loading states
    statsLoading,
    healthLoading,
    activityLoading,

    // Methods
    refreshDashboard,
    fetchStats,
    fetchSystemHealth,
    fetchRecentActivity,
  };
}
