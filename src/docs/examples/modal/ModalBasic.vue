<script setup lang="ts">
import { ref } from "vue";
import { AcButton, AcInput, AcModal, AcSelect } from "@/lib";

const open = ref(false);
const name = ref("");
const role = ref<string | null>("viewer");
const roles = [
  { value: "admin", label: "Admin", description: "Full access, including billing" },
  { value: "editor", label: "Editor", description: "Create and change resources" },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
];
</script>

<template>
  <AcButton title="Invite Member" @click="open = true" />

  <AcModal v-model:open="open" title="Invite Member" description="They'll get an email with a link to join appscode.">
    <div class="space-y-5">
      <AcInput v-model="name" label="Email" type="email" required autofocus />
      <AcSelect v-model="role" :options="roles" label="Role" />
    </div>
    <template #footer>
      <AcButton title="Cancel" color="white" @click="open = false" />
      <AcButton title="Send Invite" @click="open = false" />
    </template>
  </AcModal>
</template>
