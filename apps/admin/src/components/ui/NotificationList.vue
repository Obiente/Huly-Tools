<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-[260px]">
    <transition-group name="fade" tag="div">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="[
          'rounded-lg shadow-lg px-4 py-3 flex items-start gap-3',
          n.type === 'success' ? 'bg-green-600 text-white' : '',
          n.type === 'error' ? 'bg-red-600 text-white' : '',
          n.type === 'warning' ? 'bg-yellow-500 text-white' : '',
          n.type === 'info' ? 'bg-blue-600 text-white' : ''
        ]"
      >
        <span class="font-bold capitalize">{{ n.type }}</span>
        <div class="flex-1">
          <div v-if="n.title">{{ n.title }}</div>
          <div v-if="n.message" class="text-sm opacity-80">{{ n.message }}</div>
        </div>
        <button class="ml-2 text-white/70 hover:text-white" @click="$emit('remove', n.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '@/composables/useUI'

defineProps<{ notifications: Notification[] }>()
defineEmits(['remove'])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
