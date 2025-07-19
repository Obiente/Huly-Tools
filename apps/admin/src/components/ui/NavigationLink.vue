<template>
  <a :href="to" :class="active ? 'sidebar-link active' : 'sidebar-link'">
    <component v-if="iconComponent" :is="iconComponent" class="w-5 h-5" />
    <span class="link-text">
      <slot />
    </span>
  </a>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import {
    ChartBarIcon,
    UsersIcon,
    BuildingOfficeIcon,
    ArchiveBoxIcon,
    CircleStackIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    AdjustmentsHorizontalIcon,
  } from "@heroicons/vue/24/outline";

  interface Props {
    to: string;
    icon?: string;
    active?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    to: "#",
    icon: undefined,
    active: false,
    //TODO: Handle active state properly
  });

  const iconMap = {
    "chart-bar": ChartBarIcon,
    users: UsersIcon,
    "building-office": BuildingOfficeIcon,
    "archive-box": ArchiveBoxIcon,
    "circle-stack": CircleStackIcon,
    "chart-pie": ChartPieIcon,
    "cog-6-tooth": Cog6ToothIcon,
    "adjustments-horizontal": AdjustmentsHorizontalIcon,
  };

  const iconComponent = computed(() => {
    if (!props.icon) return null;
    return iconMap[props.icon as keyof typeof iconMap] || null;
  });
</script>

<style scoped>
  @reference "tailwindcss";
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--small-BorderRadius, 0.5rem);
    color: var(--theme-content-color, rgba(255, 255, 255, 0.8));
    text-decoration: none;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .sidebar-link:hover {
    background-color: var(--theme-navpanel-hovered, rgba(255, 255, 255, 0.04));
    color: var(--theme-caption-color, #fff);
  }

  .sidebar-link.active {
    background-color: var(--primary-button-default, #2c23d5);
    color: #fff;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(44, 35, 213, 0.12);
    border-left: 4px solid var(--primary-button-default, #2c23d5);
    transition:
      background 0.2s,
      color 0.2s,
      border-left 0.2s;
    position: relative;
  }
  .sidebar-link.active .link-text {
    text-shadow: 0 1px 8px rgba(44, 35, 213, 0.15);
  }

  .link-text {
    flex: 1;
  }
</style>
