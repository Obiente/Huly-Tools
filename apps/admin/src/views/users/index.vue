<template>
  <Flex align="start" justify="between" gap="4">
    <CommonSectionHeader size="md">User Management</CommonSectionHeader>
    <div class="flex gap-2 mb-4">
      <ActionButton variant="secondary" @click="refreshUsers"
        >Refresh</ActionButton
      >
      <ActionButton variant="primary" @click="addUser">Add User</ActionButton>
    </div>
  </Flex>

  <CommonTable>
    <template #header>
      <CommonTableHeaderCell class="w-2"></CommonTableHeaderCell>
      <CommonTableHeaderCell>Name</CommonTableHeaderCell>
      <CommonTableHeaderCell>Email</CommonTableHeaderCell>
      <CommonTableHeaderCell>Status</CommonTableHeaderCell>
      <CommonTableHeaderCell>Created</CommonTableHeaderCell>
      <CommonTableHeaderCell>Actions</CommonTableHeaderCell>
    </template>
    <template #body>
      <CommonTableRow v-for="user in users" :key="user._id">
        <CommonTableCell>
          <CommonFlex align="center">
            <div
              class="size-8 bg-accent-primary text-inverse rounded-full flex items-center justify-center text-sm font-medium"
            >
              {{ user.first.charAt(0).toUpperCase()
              }}{{ user.last.charAt(0).toUpperCase() }}
            </div>
          </CommonFlex>
        </CommonTableCell>
        <CommonTableCell>
          <CommonFlex align="center">
            {{ user.first }} {{ user.last }}
          </CommonFlex>
        </CommonTableCell>
        <CommonTableCell class="text-sm text-gray-300">
          {{ user.email }}
        </CommonTableCell>
        <CommonTableCell>
          <UserStatusBadge :status="user.confirmed ? 'active' : 'inactive'">
            {{ user.confirmed ? "Confirmed" : "Unconfirmed" }}
          </UserStatusBadge>
        </CommonTableCell>
        <CommonTableCell class="text-sm text-gray-300">
          {{ formatDate(user.createdOn) }}
        </CommonTableCell>
        <CommonTableCell align="right">
          <CommonFlex gap="2">
            <ActionButton
              icon="edit"
              type="edit"
              @click="$emit('edit', user)"
            />
            <ActionButton
              icon="delete"
              variant="danger"
              @click="$emit('delete', user._id)"
            />
          </CommonFlex>
        </CommonTableCell>
      </CommonTableRow>
    </template>
  </CommonTable>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useAdminApi } from "@/composables/useAdminApi";
  import CommonTable from "@components/CommonTable.vue";
  import CommonTableRow from "@components/CommonTableRow.vue";
  import UserStatusBadge from "@components/UserStatusBadge.vue";
  import ActionButton from "@/components/ui/ActionButton.vue";
  import CommonTableCell from "@/components/CommonTableCell.vue";
  import CommonFlex from "@/components/Flex.vue";
  import CommonTableHeaderCell from "@components/CommonTableHeaderCell.vue";
  import CommonSectionHeader from "@components/CommonSectionHeader.vue";
  import Flex from "@/components/Flex.vue";
  function formatDate(dateString: string | number): string {
    return new Date(dateString).toLocaleDateString();
  }
  const { getAccounts } = useAdminApi();
  const users = ref(await getAccounts());

  function editUser(user: any) {
    // open edit modal logic here
  }
  function deleteUser(userId: string) {
    // delete logic here
  }
  function refreshUsers() {
    // refresh logic here
  }
  function addUser() {
    // add user logic here
  }
</script>
