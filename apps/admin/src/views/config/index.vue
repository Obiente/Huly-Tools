<template>
  <div class="config-view">
    <ConfigHeader />
    <div class="config-content">
      <ConfigForm
        :api-endpoint="apiEndpoint"
        :api-key="apiKey"
        :is-loading="isLoading"
        :can-submit="canSubmit"
        :can-test="canTest"
        @update:api-endpoint="(val) => (apiEndpoint = val)"
        @update:api-key="(val) => (apiKey = val)"
        @blurField="touchField"
        @submit="onSaveConfig"
        @test="onTestConnection"
      />

      <ConfigFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useConfigPage } from "@/composables/useConfigPage";
  import ConfigHeader from "@/components/config/ConfigHeader.vue";
  import ConfigForm from "@/components/config/ConfigForm.vue";
  import ConfigFooter from "@/components/config/ConfigFooter.vue";
  import { useConfigActions } from "@/composables/useConfigActions";

  const {
    apiEndpoint,
    apiKey,
    canSubmit,
    canTest,
    isLoading,
    connectionStatus,
    touchField,
    updateConfig,
    showSuccess,
  } = useConfigPage();
  const { testConnectionOnly } = useConfigActions();

  async function onSaveConfig() {
    await testConnectionOnly(apiEndpoint.value, apiKey.value, connectionStatus);
    if (connectionStatus.value === "error") return;

    updateConfig({ endpoint: apiEndpoint.value, apiKey: apiKey.value });
    showSuccess("Configuration saved!");
  }

  async function onTestConnection() {
    await testConnectionOnly(apiEndpoint.value, apiKey.value, connectionStatus);
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
