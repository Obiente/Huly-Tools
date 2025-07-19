<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <InputField
      :model-value="apiEndpoint"
      label="API Endpoint"
      type="url"
      placeholder="http://localhost:3001/api"
      :loading="isLoading && isLoading('config')"
      @update:model-value="$emit('update:apiEndpoint', $event)"
      @blur="$emit('blurField', 'apiEndpoint')"
      required
    />

    <InputField
      :model-value="apiKey"
      label="API Key"
      type="password"
      placeholder="Enter your admin API key"
      :loading="isLoading && isLoading('config')"
      @update:model-value="$emit('update:apiKey', $event)"
      @blur="$emit('blurField', 'apiKey')"
      required
    />

    <div class="flex gap-3">
      <LoadingButton
        type="submit"
        :loading="isLoading && isLoading('config')"
        :disabled="!canSubmit"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Save Configuration
      </LoadingButton>

      <LoadingButton
        type="button"
        :loading="isLoading && isLoading('test')"
        :disabled="!canTest"
        @click="$emit('test')"
        variant="secondary"
      >
        Test Connection
      </LoadingButton>
    </div>
  </form>
</template>

<script setup lang="ts">
  import InputField from "../ui/InputField.vue";
  import LoadingButton from "../ui/LoadingButton.vue";
  interface Props {
    apiEndpoint: string;
    apiKey: string;
    canSubmit?: boolean;
    canTest?: boolean;
    isLoading?: (key: string) => boolean;
  }

  interface Emits {
    (e: 'submit'): void;
    (e: 'test'): void;
    (e: 'update:apiEndpoint', value: string): void;
    (e: 'update:apiKey', value: string): void;
    (e: 'blurField', field: string): void;
  }

  withDefaults(defineProps<Props>(), {
    apiEndpoint: '',
    apiKey: '',
    canSubmit: true,
    canTest: true,
    isLoading: undefined,
  })

  defineEmits<Emits>()
</script>
