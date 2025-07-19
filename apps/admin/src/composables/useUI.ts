/**
 * UI state management composable
 * Handles notifications, loading states, and UI interactions
 */

import { reactive, readonly, ref } from "vue";
import type { Ref } from "vue";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

export interface LoadingState {
  [key: string]: boolean;
}

const notifications: Ref<Notification[]> = ref([]);
const loadingStates = reactive<LoadingState>({});
const modals = reactive<Record<string, boolean>>({});

export function useUI() {

  function showNotification(
    type: NotificationType,
    title: string,
    message?: string,
    options: { duration?: number; persistent?: boolean } = {},
  ) {
    const id = `notification-${Date.now()}-${
      Math.random().toString(36).substr(2, 9)
    }`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options.duration ?? (type === "error" ? 8000 : 5000),
      persistent: options.persistent ?? false,
    };

    notifications.value.push(notification);

    // Auto-remove notification if not persistent
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearNotifications() {
    notifications.value = [];
  }

  // Convenience methods for different notification types
  function showSuccess(
    title: string,
    message?: string,
    options?: { duration?: number },
  ) {
    return showNotification("success", title, message, options);
  }

  function showError(
    title: string,
    message?: string,
    options?: { duration?: number; persistent?: boolean },
  ) {
    return showNotification("error", title, message, options);
  }

  function showWarning(
    title: string,
    message?: string,
    options?: { duration?: number },
  ) {
    return showNotification("warning", title, message, options);
  }

  function showInfo(
    title: string,
    message?: string,
    options?: { duration?: number },
  ) {
    return showNotification("info", title, message, options);
  }

  // Loading state management
  function setLoading(key: string, loading: boolean) {
    loadingStates[key] = loading;
  }

  function isLoading(key: string): boolean {
    return loadingStates[key] ?? false;
  }

  function toggleLoading(key: string): boolean {
    loadingStates[key] = !loadingStates[key];
    return loadingStates[key];
  }

  // Modal management
  function openModal(modalId: string) {
    modals[modalId] = true;
  }

  function closeModal(modalId: string) {
    modals[modalId] = false;
  }

  function toggleModal(modalId: string) {
    modals[modalId] = !modals[modalId];
  }

  function isModalOpen(modalId: string): boolean {
    return modals[modalId] ?? false;
  }

  function closeAllModals() {
    Object.keys(modals).forEach((key) => {
      modals[key] = false;
    });
  }

  // Async operation wrapper with loading state and error handling
  async function withLoading<T>(
    key: string,
    operation: () => Promise<T>,
    options: {
      successMessage?: string;
      errorMessage?: string;
      showSuccessNotification?: boolean;
      showErrorNotification?: boolean;
    } = {},
  ): Promise<T | null> {
    const {
      successMessage = "Operation completed successfully",
      errorMessage = "Operation failed",
      showSuccessNotification = false,
      showErrorNotification = true,
    } = options;

    setLoading(key, true);

    try {
      const result = await operation();

      if (showSuccessNotification) {
        showSuccess(successMessage);
      }

      return result;
    } catch (error) {
      if (showErrorNotification) {
        const message = error instanceof Error
          ? error.message
          : "Unknown error occurred";
        showError(errorMessage, message);
      }
      return null;
    } finally {
      setLoading(key, false);
    }
  }

  return {
    // Notifications
    notifications: readonly(notifications),
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Loading states
    setLoading,
    isLoading,
    toggleLoading,

    // Modals
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    closeAllModals,

    // Utilities
    withLoading,
  };
}
