<template>
  <div class="users-view">
    <header class="users-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Manage user accounts and permissions
        </p>
      </div>
      
      <div class="header-actions">
        <SearchInput v-model="searchQuery" placeholder="Search users..." />
        <ActionButton 
          @click="openCreateUserModal"
          variant="primary"
          icon="plus"
        >
          Create User
        </ActionButton>
      </div>
    </header>

    <div class="users-content">
      <UsersTable
        :users="filteredUsers"
        :loading="isLoading"
        @edit="openEditUserModal"
        @delete="handleDeleteUser"
        @refresh="refreshUsers"
      />
    </div>

    <!-- Create/Edit User Modal -->
    <UserModal
      v-if="showUserModal"
      :user="selectedUser"
      :loading="modalLoading"
      @close="closeUserModal"
      @save="handleSaveUser"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUsers } from './composables/useUsers'
import { useUserModal } from './composables/useUserModal'
import UsersTable from '@/components/UsersTable.vue'
import UserModal from '@/components/UserModal.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import ActionButton from '@/components/ui/ActionButton.vue'

const {
  users,
  searchQuery,
  isLoading,
  refreshUsers,
  deleteUser
} = useUsers()

const {
  showUserModal,
  selectedUser,
  modalLoading,
  openCreateUserModal,
  openEditUserModal,
  closeUserModal,
  saveUser
} = useUserModal()

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

async function handleDeleteUser(userId: string) {
  await deleteUser(userId)
  await refreshUsers()
}

async function handleSaveUser(userData: any) {
  await saveUser(userData)
  await refreshUsers()
  closeUserModal()
}
</script>

<style scoped>
@reference "tailwindcss";
.users-view {
  @apply p-6 space-y-6;
}

.users-header {
  @apply flex justify-between items-start gap-4;
}

.header-actions {
  @apply flex items-center gap-3;
}

.users-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}
</style>
