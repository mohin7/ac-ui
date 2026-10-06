<script setup lang="ts">
import { ref } from "vue";
import { AcSelect, useToast } from "@/lib";

const { toast } = useToast();

const roles = ref<string[]>(["viewer"]);
const options = ref([
  { value: "viewer", label: "viewer" },
  { value: "editor", label: "editor" },
  { value: "db-admin", label: "db-admin" },
]);

function onCreate(role: string) {
  options.value.push({ value: role, label: role });
  toast(`Added role ${role}`);
}
</script>

<template>
  <div class="max-w-100">
    <AcSelect v-model="roles" :options="options" label="Roles" multiple searchable creatable clearable @create="onCreate" />
    <p class="mt-3 text-xs text-muted">v-model: {{ roles }}</p>
  </div>
</template>
