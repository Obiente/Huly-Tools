<template>
  <div class="dashboard-container">
    <NotificationList :notifications="notifications.slice()" @remove="removeNotification" />
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="p-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          Huly Admin
        </h1>
      </div>

      <nav class="sidebar-nav">
        <NavigationLink to="/dashboard" icon="chart-bar">
          Dashboard
        </NavigationLink>

        <NavigationLink to="/users" icon="users"> Users </NavigationLink>

        <NavigationLink to="/workspaces" icon="building-office">
          Workspaces
        </NavigationLink>

        <NavigationLink to="/backups" icon="archive-box">
          Backups
        </NavigationLink>

        <NavigationLink to="/database" icon="circle-stack">
          Database
        </NavigationLink>

        <NavigationLink to="/stats" icon="chart-pie">
          Statistics
        </NavigationLink>

        <NavigationLink to="/tasks" icon="cog-6-tooth">
          Admin Tasks
        </NavigationLink>

        <div class="sidebar-divider" />

        <NavigationLink to="/config" icon="adjustments-horizontal">
          Configuration
        </NavigationLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUI } from '@/composables/useUI'
import NotificationList from '@/components/ui/NotificationList.vue'
import NavigationLink from "@/components/ui/NavigationLink.vue";

const { notifications, removeNotification } = useUI()
</script>

<style>
  @import "styles/global.css";
  @reference "tailwindcss";

  .dashboard-container {
    display: flex;
    height: 100vh;
    background-color: var(--theme-bg-color, #f1f1f4);
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
      Cantarell, sans-serif;
    color: var(--theme-content-color, #374151);
  }

  .sidebar {
    width: 16rem;
    background-color: var(--theme-navpanel-color, #14141f);
    border-right: 1px solid
      var(--theme-navpanel-divider, rgba(255, 255, 255, 0.1));
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    border-bottom: 1px solid
      var(--theme-navpanel-divider, rgba(255, 255, 255, 0.1));
    padding: 0 1rem;
  }

  .sidebar-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-button-default, #2c23d5);
    text-shadow: 0 0 20px rgba(44, 35, 213, 0.3);
    margin: 0;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sidebar-divider {
    height: 1px;
    background-color: var(--theme-navpanel-divider, rgba(255, 255, 255, 0.1));
    margin: 1rem 0;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--theme-panel-color, #1a1a28);
  }

  .content-wrapper {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
</style>
