import { computed, ref } from "vue";
import type { Ref } from "vue";

export interface DashboardStats {
  id: string;
  title: string;
  value: number | string;
  icon: "users" | "building" | "archive" | "server";
  trend?: {
    value: number;
    direction: "up" | "down";
    isPositive: boolean;
  };
}

export interface SystemHealth {
  status: "healthy" | "warning" | "error";
  uptime: string;
  memoryUsage: number;
  storageUsage: number;
  activeConnections: number;
}

export interface Activity {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: Date;
  user?: string;
}

export function useDashboard() {
  const stats: Ref<DashboardStats[]> = ref([]);
  const systemHealth: Ref<SystemHealth | null> = ref(null);
  const recentActivity: Ref<Activity[]> = ref([]);

  const statsLoading = ref(false);
  const healthLoading = ref(false);
  const activityLoading = ref(false);

  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  // Mock data for now - replace with API calls

  const mockStats: DashboardStats[] = [
    {
      id: "users",
      title: "Total Users",
      value: 1234,
      icon: "users",
      trend: { value: 12, direction: "up", isPositive: true },
    },
    {
      id: "workspaces",
      title: "Active Workspaces",
      value: 56,
      icon: "building",
      trend: { value: 3, direction: "up", isPositive: true },
    },
    {
      id: "storage",
      title: "Storage Used",
      value: "45.2 GB",
      icon: "archive",
    },
    {
      id: "uptime",
      title: "System Uptime",
      value: "99.9%",
      icon: "server",
      trend: { value: 0.1, direction: "up", isPositive: true },
    },
  ];

  const mockHealth: SystemHealth = {
    status: "healthy",
    uptime: "15 days, 4 hours",
    memoryUsage: 65,
    storageUsage: 45,
    activeConnections: 128,
  };

  const mockActivities: Activity[] = [
    {
      id: "1",
      type: "success",
      message: "User john.doe@example.com created successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: "admin",
    },
    {
      id: "2",
      type: "info",
      message: 'Workspace "Marketing Team" updated',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      user: "admin",
    },
    {
      id: "3",
      type: "warning",
      message: "High memory usage detected (85%)",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  async function fetchStats() {
    statsLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      stats.value = mockStats;
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      statsLoading.value = false;
    }
  }

  async function fetchSystemHealth() {
    healthLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      systemHealth.value = mockHealth;
    } catch (error) {
      console.error("Failed to fetch system health:", error);
    } finally {
      healthLoading.value = false;
    }
  }

  async function fetchRecentActivity() {
    activityLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      recentActivity.value = mockActivities;
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
    } finally {
      activityLoading.value = false;
    }
  }

  async function refreshDashboard() {
    await Promise.all([
      fetchStats(),
      fetchSystemHealth(),
      fetchRecentActivity(),
    ]);
  }

  function startAutoRefresh(interval: number) {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    refreshInterval = setInterval(refreshDashboard, interval);
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  const isLoading = computed(() =>
    statsLoading.value || healthLoading.value || activityLoading.value
  );

  return {
    // State
    stats,
    systemHealth,
    recentActivity,

    // Loading states
    statsLoading,
    healthLoading,
    activityLoading,
    isLoading,

    // Methods
    refreshDashboard,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
