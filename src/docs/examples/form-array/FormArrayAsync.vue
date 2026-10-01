<script setup lang="ts">
import { ref } from "vue";
import { AcDeleteModal, AcFormArray, AcInput, AcSelect } from "@/lib";

type Permission = { cluster: string | null; role: string | null; namespaces: string };

const permissions = ref<Permission[]>([{ cluster: "prod-eks-us-east", role: "admin", namespaces: "demo, shop" }]);
const columns = [
  { key: "cluster", label: "Cluster" },
  { key: "role", label: "Role" },
  { key: "namespaces", label: "Namespaces", format: (v: unknown) => String(v || "All") },
];
const clusters = ["prod-eks-us-east", "staging-gke", "dev-kind"].map((c) => ({ value: c, label: c }));
const roles = ["admin", "editor", "viewer"].map((r) => ({ value: r, label: r }));

const confirmOpen = ref(false);
const pendingName = ref("");
let answer: (ok: boolean) => void = () => {};

// Stands in for a PATCH to the API; fails for dev-kind to show the error path.
async function save(item: Permission) {
  await new Promise((r) => setTimeout(r, 800));
  if (item.cluster === "dev-kind") throw new Error("dev-kind is unreachable. Try again when it's back online.");
}

function confirmRemove(item: Permission) {
  pendingName.value = item.cluster ?? "";
  confirmOpen.value = true;
  return new Promise<boolean>((resolve) => (answer = resolve));
}

function settle(ok: boolean) {
  confirmOpen.value = false;
  answer(ok);
}
</script>

<template>
  <AcFormArray
    v-model="permissions"
    label="Permissions"
    item-name="permission"
    :columns="columns"
    :new-item="() => ({ cluster: null, role: 'viewer', namespaces: '' })"
    :validate="(p) => (p.cluster ? undefined : { cluster: 'Choose a cluster.' })"
    :before-save="save"
    :before-remove="confirmRemove"
    collapsible
  >
    <template #form="{ item, errors }">
      <AcSelect v-model="item.cluster" :options="clusters" label="Cluster" required :error-msg="errors.cluster" />
      <AcSelect v-model="item.role" :options="roles" label="Role" />
      <AcInput v-model="item.namespaces" label="Namespaces" hint="Comma separated. Leave empty for all namespaces." />
    </template>
  </AcFormArray>

  <AcDeleteModal
    v-model:open="confirmOpen"
    title="Remove Permission"
    message="Remove access to"
    :item-name="pendingName"
    confirm-text="Remove"
    @confirm="settle(true)"
    @cancel="settle(false)"
  />
</template>
