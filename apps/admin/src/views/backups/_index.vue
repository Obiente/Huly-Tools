<template>
  <div class="backups-view">
    <header class="backups-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Backups
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Manage system backups and data recovery
        </p>
      </div>
      
      <div class="header-actions">
        <BackupStatusIndicator :status="backupStatus" />
        <ActionButton 
          @click="handleCreateBackup"
          variant="primary"
          icon="archive"
          :loading="isCreatingBackup"
        >
          Create Backup
        </ActionButton>
      </div>
    </header>

    <div class="backups-content">
      <!-- Backup Schedule Settings -->
      <section class="backup-settings">
        <h2 class="section-title">Backup Schedule</h2>
        <BackupScheduleSettings
          :schedule="backupSchedule"
          :loading="isUpdatingSchedule"
          @update="handleUpdateSchedule"
        />
      </section>

      <!-- Backup History -->
      <section class="backup-history">
        <div class="section-header">
          <h2 class="section-title">Backup History</h2>
          <RefreshButton @click="refreshBackups" :loading="isLoading" />
        </div>
        
        <BackupsTable
          :backups="backups"
          :loading="isLoading"
          @download="handleDownload"
          @restore="handleRestore"
          @delete="handleDeleteBackup"
        />
      </section>
    </div>

    <!-- Restore Confirmation Modal -->
    <RestoreModal
      v-if="showRestoreModal"
      :backup="selectedBackup"
      :loading="isRestoring"
      @close="closeRestoreModal"
      @confirm="handleConfirmRestore"
    />
  </div>
</template>

<script setup lang="ts">
import { useBackups } from './composables/useBackups'
import { useBackupSchedule } from './composables/useBackupSchedule'
import { useRestoreModal } from './composables/useRestoreModal'
import BackupsTable from '@/components/BackupsTable.vue'
import BackupScheduleSettings from '@/components/BackupScheduleSettings.vue'
import BackupStatusIndicator from '@/components/BackupStatusIndicator.vue'
import RestoreModal from '@/components/RestoreModal.vue'
import ActionButton from '@/components/ui/ActionButton.vue'
import RefreshButton from '@/components/ui/RefreshButton.vue'

const {
  backups,
  backupStatus,
  isLoading,
  isCreatingBackup,
  refreshBackups,
  createBackup,
  deleteBackup,
  downloadBackup
} = useBackups()

const {
  backupSchedule,
  isUpdatingSchedule,
  updateSchedule
} = useBackupSchedule()

const {
  showRestoreModal,
  selectedBackup,
  isRestoring,
  openRestoreModal,
  closeRestoreModal,
  restoreBackup
} = useRestoreModal()

async function handleCreateBackup() {
  await createBackup()
  await refreshBackups()
}

async function handleUpdateSchedule(schedule: any) {
  await updateSchedule(schedule)
}

async function handleDownload(backupId: string) {
  await downloadBackup(backupId)
}

async function handleRestore(backup: any) {
  openRestoreModal(backup)
}

async function handleConfirmRestore() {
  if (selectedBackup.value) {
    await restoreBackup(selectedBackup.value.id)
    closeRestoreModal()
    await refreshBackups()
  }
}

async function handleDeleteBackup(backupId: string) {
  await deleteBackup(backupId)
  await refreshBackups()
}
</script>

<style scoped>
@reference "tailwindcss";
.backups-view {
  @apply p-6 space-y-8;
}

.backups-header {
  @apply flex justify-between items-start gap-4;
}

.header-actions {
  @apply flex items-center gap-3;
}

.backup-settings,
.backup-history {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6;
}

.section-header {
  @apply flex justify-between items-center mb-6;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}
</style>
