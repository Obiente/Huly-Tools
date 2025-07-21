<template>
  <div class="flex h-screen font-sans text-primary">
    <NotificationList
      :notifications="notifications.slice()"
      @remove="removeNotification"
    />
    <!-- Sidebar -->
    <aside
      class="w-60 flex flex-col flex-shrink-0 border-r border-primary shadow-lg"
    >
      <div
        class="flex items-center justify-center h-16 border-b border-primary px-4"
      >
        <h1 class="text-2xl font-bold drop-shadow-lg tracking-tight">
          Huly Admin
        </h1>
      </div>
      <nav class="flex-1 flex flex-col gap-2 py-6 px-4">
        <NavigationLink to="/dashboard" icon="chart-bar" class="mb-1"
          >Dashboard</NavigationLink
        >
        <NavigationLink to="/users" icon="users" class="mb-1"
          >Users</NavigationLink
        >
        <NavigationLink to="/workspaces" icon="building-office" class="mb-1"
          >Workspaces</NavigationLink
        >
        <NavigationLink to="/backups" icon="archive-box" class="mb-1"
          >Backups</NavigationLink
        >
        <NavigationLink to="/database" icon="circle-stack" class="mb-1"
          >Database</NavigationLink
        >
        <NavigationLink to="/stats" icon="chart-pie" class="mb-1"
          >Statistics</NavigationLink
        >
        <NavigationLink to="/tasks" icon="cog-6-tooth" class="mb-1"
          >Admin Tasks</NavigationLink
        >
        <div class="h-px bg-secondary my-4" />
        <NavigationLink to="/config" icon="adjustments-horizontal" class="mb-1"
          >Configuration</NavigationLink
        >
      </nav>
    </aside>
    <!-- Main content -->
    <main class="flex-1 flex flex-col bg-primary overflow-hidden">
      <div class="flex-1 p-8 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useUI } from "@composables/useUI";
  import NotificationList from "@components/ui/NotificationList.vue";
  import NavigationLink from "@components/ui/NavigationLink.vue";

  const { notifications, removeNotification } = useUI();
</script>

<style>
  @import "styles/global.css";
</style>
