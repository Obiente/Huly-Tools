/**
 * Admin API client composable
 * Provides reactive state management for API communication
 */

import { computed, reactive, readonly, ref } from "vue";
import type { Ref } from "vue";
import type {
  Account,
  ApiResponse,
  Backup,
  DashboardResponse,
  DashboardStats,
  Stats,
  SystemHealth,
  Workspace,
} from "@huly-tools/types";

export interface ApiConfig {
  endpoint: string;
  apiKey: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  status?: number;
  data?: unknown;
}

// Storage utility functions
const STORAGE_KEYS = {
  API_ENDPOINT: "huly_admin_api_endpoint",
  API_KEY: "huly_admin_api_key",
} as const;

function getStoredValue(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

function setStoredValue(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}

function removeStoredValue(key: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(key);
}

// Main composable
export function useAdminApi() {
  // Reactive state
  const config = reactive<ApiConfig>({
    endpoint: getStoredValue(STORAGE_KEYS.API_ENDPOINT) || "",
    apiKey: getStoredValue(STORAGE_KEYS.API_KEY) || "",
  });
  console.log(config);
  const isLoading = ref(false);
  const error: Ref<ApiError | null> = ref(null);

  // Computed properties
  const isConfigured = computed(() =>
    Boolean(config.endpoint && config.apiKey)
  );

  const baseHeaders = computed(() => ({
    "Content-Type": "application/json",
    "X-API-Key": `${config.apiKey}`,
  }));

  // Error handling
  function clearError() {
    error.value = null;
  }

  function setError(
    message: string,
    status?: number,
    code?: string | number,
    data?: unknown,
  ) {
    error.value = { message, status, code, data };
  }

  // Configuration management
  function updateConfig(newConfig: Partial<ApiConfig>) {
    if (newConfig.endpoint !== undefined) {
      config.endpoint = newConfig.endpoint;
      setStoredValue(STORAGE_KEYS.API_ENDPOINT, newConfig.endpoint);
    }
    if (newConfig.apiKey !== undefined) {
      config.apiKey = newConfig.apiKey;
      setStoredValue(STORAGE_KEYS.API_KEY, newConfig.apiKey);
    }
  }

  function clearConfig() {
    config.endpoint = "";
    config.apiKey = "";
    removeStoredValue(STORAGE_KEYS.API_ENDPOINT);
    removeStoredValue(STORAGE_KEYS.API_KEY);
  }

  // HTTP request utility
  async function makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!config.endpoint || !config.apiKey) {
      throw new Error("API not configured. Please set endpoint and API key.");
    }

    clearError();
    isLoading.value = true;

    try {
      const url = `${config.endpoint}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...baseHeaders.value,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Unknown error",
        }));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Unknown error occurred";
      setError(message);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // API methods
  /**
   * Test API connection and return detailed info.
   */
  async function testConnection(): Promise<{
    success: boolean;
    status?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${config.endpoint}/stats`, {
        headers: baseHeaders.value,
      });
      const data = await response.json().catch(() => undefined);
      if (response.ok) {
        return { success: true, status: response.status };
      } else {
        return {
          success: false,
          status: response.status,
          error: data?.message || response.statusText,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  async function getDashboard(): Promise<DashboardResponse> {
    return makeRequest<DashboardResponse>("/dashboard");
  }

  async function getStats(): Promise<Stats> {
    return makeRequest<Stats>("/stats");
  }

  async function getSystemHealth(): Promise<SystemHealth> {
    return makeRequest<SystemHealth>("/stats/system");
  }

  async function getAccounts(): Promise<Account[]> {
    return makeRequest<Account[]>("/accounts");
  }

  async function createAccount(
    accountData: Partial<Account>,
  ): Promise<Account> {
    return makeRequest<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  async function updateAccount(
    id: string,
    accountData: Partial<Account>,
  ): Promise<Account> {
    return makeRequest<Account>(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(accountData),
    });
  }

  async function deleteAccount(id: string): Promise<void> {
    return makeRequest<void>(`/accounts/${id}`, {
      method: "DELETE",
    });
  }

  async function getWorkspaces(): Promise<Workspace[]> {
    return makeRequest<Workspace[]>("/workspaces");
  }

  async function createWorkspace(
    workspaceData: Partial<Workspace>,
  ): Promise<Workspace> {
    return makeRequest<Workspace>("/workspaces", {
      method: "POST",
      body: JSON.stringify(workspaceData),
    });
  }

  async function updateWorkspace(
    id: string,
    workspaceData: Partial<Workspace>,
  ): Promise<Workspace> {
    return makeRequest<Workspace>(`/workspaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(workspaceData),
    });
  }

  async function deleteWorkspace(id: string): Promise<void> {
    return makeRequest<void>(`/workspaces/${id}`, {
      method: "DELETE",
    });
  }

  async function getBackups(): Promise<Backup[]> {
    return makeRequest<Backup[]>("/backup");
  }

  async function createBackup(workspaceId: string): Promise<Backup> {
    return makeRequest<Backup>("/backup", {
      method: "POST",
      body: JSON.stringify({ workspaceId }),
    });
  }

  async function restoreBackup(backupId: string): Promise<void> {
    return makeRequest<void>(`/backup/${backupId}/restore`, {
      method: "POST",
    });
  }

  async function deleteBackup(backupId: string): Promise<void> {
    return makeRequest<void>(`/backup/${backupId}`, {
      method: "DELETE",
    });
  }

  return {
    // State
    config: readonly(config),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isConfigured,

    // Configuration
    updateConfig,
    clearConfig,
    clearError,

    // API methods
    testConnection,
    getDashboard,
    getStats,
    getSystemHealth,
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getBackups,
    createBackup,
    restoreBackup,
    deleteBackup,
  };
}
