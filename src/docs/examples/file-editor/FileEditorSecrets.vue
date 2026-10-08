<script setup lang="ts">
import { computed, ref } from "vue";
import { Save, Trash2 } from "@lucide/vue";
import { AcButton } from "@/lib";
import { AcFileEditor } from "@/lib/editor";

// Secret.data as the API returns it: every value base64-encoded.
const data: Record<string, string> = {
  username: "cG9zdGdyZXM=",
  password: "bjBULWEtcjNhbC1wYXNzd29yZA==",
  "ca.crt": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUREekNDQWZlZ0F3SUJBZ0lVQzNrUlpGYzVmSm5hVkhZU2VqUEY1Yk1hM2c4d0RRWUoKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
  "config.json": "ewogICJob3N0IjogImRlbW8tcG9zdGdyZXMuZGVtby5zdmMiLAogICJwb3J0IjogNTQzMiwKICAic3NsbW9kZSI6ICJ2ZXJpZnktZnVsbCIKfQo=",
};

const files = ref(
  Object.entries(data).map(([key, value]) => ({
    name: key,
    content: value,
    original: value,
    secret: true,
    encoding: "base64" as const,
  })),
);
const active = ref("");
const changed = computed(() => files.value.some((f) => f.content !== f.original));

function save(name: string) {
  // Send { data: { [name]: file.content } } in a patch; content is already base64.
  files.value = files.value.map((f) => (f.name === name ? { ...f, original: f.content } : f));
}
</script>

<template>
  <AcFileEditor v-model:files="files" v-model:active="active" label="Secret keys" height="360px">
    <template #actions="{ file }">
      <AcButton title="Save" size="small" :disabled="!changed || file.content === file.original" @click="save(file.name)">
        <template #icon><Save /></template>
      </AcButton>
      <AcButton title="Delete" size="small" color="white" @click="files = files.filter((f) => f.name !== file.name)">
        <template #icon><Trash2 /></template>
      </AcButton>
    </template>
  </AcFileEditor>
</template>
