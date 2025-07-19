<template>
  <div class="users-view">
    <Users ></Users>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import Users from "@components/Users.vue";
  import { useAdminApi } from "@/composables/useAdminApi";

  const { getAccounts } = useAdminApi();
  const users = await getAccounts();
  // const filteredUsers = computed(() => {
  //   if (!searchQuery.value) return users.value;

  //   const query = searchQuery.value.toLowerCase();
  //   return users.value.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(query) ||
  //       user.email.toLowerCase().includes(query)
  //   );
  // });

  // async function handleDeleteUser(userId: string) {
  //   await deleteUser(userId);
  //   await refreshUsers();
  // }

  // async function handleSaveUser(userData: any) {
  //   await saveUser(userData);
  //   await refreshUsers();
  //   closeUserModal();
  // }
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
