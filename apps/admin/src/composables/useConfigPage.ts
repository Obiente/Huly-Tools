/**
 * Configuration page specific logic
 */
import { computed, onMounted, ref } from "vue";
import { useAdminApi } from "./useAdminApi";
import { useUI } from "./useUI";
import { useFormValidation, validationRules } from "./useFormValidation";

export interface ConfigPageState {
  connectionStatus: "success" | "error" | null;
}

export function useConfigPage() {
  const { config, isConfigured, updateConfig, testConnection } = useAdminApi();
  const { showSuccess, showError, isLoading, setLoading } = useUI();
  const {
    form,
    addField,
    getFieldValue,
    setFieldValue,
    touchField,
    validateForm,
    isFormValid,
  } = useFormValidation();
  function getStoredValue(key: string): string | null {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  }
  // State
  const connectionStatus = ref<ConfigPageState["connectionStatus"]>(null);

  // Computed properties
  const apiEndpoint = computed({
    get: () =>
      getFieldValue("apiEndpoint") || getStoredValue("apiEndpoint") || "",
    set: (value: string) => setFieldValue("apiEndpoint", value),
  });

  const apiKey = computed<string>({
    get: () => getFieldValue("apiKey") || getStoredValue("apiKey") || "",
    set: (value: string) => setFieldValue("apiKey", value),
  });

  const canSubmit = computed(() => isFormValid.value && !isLoading("config"));
  const canTest = computed(() =>
    Boolean(apiEndpoint.value && apiKey.value && !isLoading("test"))
  );

  // Initialize form fields
  function initializeForm() {
    addField("apiEndpoint", config.endpoint, [
      validationRules.required,
      validationRules.url,
    ]);

    addField("apiKey", config.apiKey, [
      validationRules.required,
      validationRules.apiKey,
    ]);
  }

  onMounted(initializeForm);

  return {
    // State
    connectionStatus,

    // Form fields
    apiEndpoint,
    apiKey,

    // Computed
    canSubmit,
    canTest,
    isConfigured,

    // Form methods
    touchField,
    validateForm,
    isFormValid,
    form,
    testConnection,
    updateConfig,
    showSuccess,
    showError,
    setLoading,

    // Loading states
    isLoading,
  };
}
