<template>
  <div class="bg-secondary rounded-lg border border-primary overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-elevated border-b border-secondary">
          <tr>
            <slot name="header" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border-primary">
          <slot name="body" />
        </tbody>
      </table>
    </div>
  </div>
</template>
