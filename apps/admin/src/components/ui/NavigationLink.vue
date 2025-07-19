<template>
  <a
    :href="to"
    :class="linkClasses"
    @click="handleClick"
  >
    <component 
      v-if="iconComponent" 
      :is="iconComponent" 
      class="w-5 h-5" 
    />
    <span class="link-text">
      <slot />
    </span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  CircleStackIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'

interface Props {
  to: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: '#',
  icon: undefined
})

const iconMap = {
  'chart-bar': ChartBarIcon,
  'users': UsersIcon,
  'building-office': BuildingOfficeIcon,
  'archive-box': ArchiveBoxIcon,
  'circle-stack': CircleStackIcon,
  'chart-pie': ChartPieIcon,
  'cog-6-tooth': Cog6ToothIcon,
  'adjustments-horizontal': AdjustmentsHorizontalIcon
}

const iconComponent = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon as keyof typeof iconMap] || null
})

const isActive = computed(() => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname
    return currentPath === props.to || (currentPath === '/' && props.to === '/dashboard')
  }
  return false
})

const linkClasses = computed(() => [
  'sidebar-link',
  {
    'active': isActive.value
  }
])

function handleClick(event: Event) {
  // Simple navigation - let the browser handle the link
  // No special handling needed for SPA navigation
}
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
  color: var(--theme-caption-color, #FFF);
}

.sidebar-link.active {
  background-color: var(--theme-navpanel-selected, rgba(255, 255, 255, 0.08));
  color: var(--primary-button-default, #2c23d5);
  font-weight: 600;
}

.link-text {
  flex: 1;
}
</style>

