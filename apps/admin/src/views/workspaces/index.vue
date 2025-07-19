<template>
  <div class="workspaces-view">
    <header class="workspaces-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Workspaces
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Manage workspaces and team organization
        </p>
      </div>

      <div class="header-actions">
        <FilterDropdown v-model="statusFilter" :options="statusOptions" />
        <SearchInput v-model="searchQuery" placeholder="Search workspaces..." />
        <ActionButton
          @click="openCreateWorkspaceModal"
          variant="primary"
          icon="plus"
        >
          Create Workspace
        </ActionButton>
      </div>
    </header>

    <div class="workspaces-content">
      <WorkspacesGrid
        :workspaces="filteredWorkspaces"
        :loading="isLoading"
        :view-mode="viewMode"
        @edit="openEditWorkspaceModal"
        @delete="handleDeleteWorkspace"
        @toggle-status="handleToggleStatus"
      />
    </div>

    <!-- Create/Edit Workspace Modal -->
    <WorkspaceModal
      v-if="showWorkspaceModal"
      :workspace="selectedWorkspace"
      :loading="modalLoading"
      @close="closeWorkspaceModal"
      @save="handleSaveWorkspace"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import WorkspacesGrid from "@/components/Workspaces.vue";
  import SearchInput from "@/components/ui/SearchInput.vue";
  import ActionButton from "@/components/ui/ActionButton.vue";
  import { useAdminApi } from "@/composables/useAdminApi";
  import type { Workspace } from "@huly-tools/types";

  const {
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } = useAdminApi();

  const workspaces = ref<Workspace[]>([]);
  const isLoading = ref(false);
  const searchQuery = ref("");
  const statusFilter = ref("all");
  const viewMode = ref("grid");
  const showWorkspaceModal = ref(false);
  const selectedWorkspace = ref<Workspace | null>(null);
  const modalLoading = ref(false);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
  ];

  const filteredWorkspaces = computed(() => {
    let filtered = workspaces.value;
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (workspace) =>
          (workspace.workspaceName || "").toLowerCase().includes(query) ||
          (workspace.workspaceUrl || "").toLowerCase().includes(query)
      );
    }
    // If you have a status field, filter by it here
    // if (statusFilter.value !== "all") {
    //   filtered = filtered.filter(
    //     (workspace) => workspace.status === statusFilter.value
    //   );
    // }
    return filtered;
  });

  async function refreshWorkspaces() {
    isLoading.value = true;
    try {
      workspaces.value = await getWorkspaces();
    } finally {
      isLoading.value = false;
    }
  }

  function openCreateWorkspaceModal() {
    selectedWorkspace.value = null;
    showWorkspaceModal.value = true;
  }

  function openEditWorkspaceModal(workspace: Workspace) {
    selectedWorkspace.value = workspace;
    showWorkspaceModal.value = true;
  }

  function closeWorkspaceModal() {
    showWorkspaceModal.value = false;
    selectedWorkspace.value = null;
  }

  async function handleSaveWorkspace(workspaceData: Partial<Workspace>) {
    modalLoading.value = true;
    try {
      if (selectedWorkspace.value) {
        await updateWorkspace(selectedWorkspace.value._id, workspaceData);
      } else {
        await createWorkspace(workspaceData);
      }
      await refreshWorkspaces();
      closeWorkspaceModal();
    } finally {
      modalLoading.value = false;
    }
  }

  async function handleDeleteWorkspace(workspaceId: string) {
    await deleteWorkspace(workspaceId);
    await refreshWorkspaces();
  }

  async function handleToggleStatus(workspace: Workspace) {
    // Example: Toggle between "active" and "inactive"
    const newStatus = workspace.status === "active" ? "inactive" : "active";
    await updateWorkspace(workspace._id, { status: newStatus });
    await refreshWorkspaces();
  }

  onMounted(refreshWorkspaces);
</script>

<style scoped>
  @reference "tailwindcss";
  .workspaces-view {
    @apply p-6 space-y-6;
  }

  .workspaces-header {
    @apply flex justify-between items-start gap-4;
  }

  .header-actions {
    @apply flex items-center gap-3;
  }

  .workspaces-content {
    @apply min-h-96;
  }
</style>
