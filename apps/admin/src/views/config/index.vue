<template>
  <div class="config-view">
    <ConfigHeader />
    {{isLoading}}
    <div class="config-content">
      <ConfigForm
        :api-endpoint="apiEndpoint"
        :api-key="apiKey"
        :is-loading="isLoading"
        :can-submit="canSubmit"
        :can-test="canTest"
        @update:api-endpoint="val => apiEndpoint = val"
        @update:api-key="val => apiKey = val"
        @blurField="touchField"
        @submit="onSaveConfig"
        @test="onTestConnection"
      />
      {{connectionStatus}}
      <div v-if="connectionStatus" class="mt-4 flex items-center gap-2">
        <span v-if="connectionStatus === 'success'" class="text-green-600">✅ Connected</span>
        <span v-else class="text-red-600">❌ Connection Failed</span>
      </div>
    </div>
    <ConfigFooter />
  </div>
</template>

<script setup lang="ts">
import { useConfigPage } from '@/composables/useConfigPage'
import { useUI } from '@/composables/useUI'
import ConfigHeader from '@/components/config/ConfigHeader.vue'
import ConfigForm from '@/components/config/ConfigForm.vue'
import ConfigFooter from '@/components/config/ConfigFooter.vue'
import NotificationList from '@/components/ui/NotificationList.vue'

const {
  apiEndpoint,
  apiKey,
  canSubmit,
  canTest,
  isLoading,
  connectionStatus,
  touchField,
  testConnection,
  updateConfig,
  showSuccess,
  showError,
} = useConfigPage()
const { notifications, removeNotification } = useUI()

function onSaveConfig() {
  updateConfig({ endpoint: apiEndpoint.value, apiKey: apiKey.value })
  showSuccess('Configuration saved!')
}

async function onTestConnection() {
  const success = await testConnection()
  if (success) {
    showSuccess('Connection successful!')
  } else {
    showError('Connection failed. Please check your API endpoint and key.')
  }
}
</script>

<style scoped>
  @reference "tailwindcss";
  .config-view {
    @apply max-w-2xl mx-auto p-6 space-y-6;
  }

  .config-header {
    @apply text-center mb-8;
  }

  .config-content {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
  }
</style>
