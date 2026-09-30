<script setup lang="ts">
import { ref } from "vue";
import { AcSelect } from "@/lib";
import type { SelectOption } from "@/lib";

const all = ["appscode", "appscode-labs", "bytebuilders", "kubedb", "kubevault", "stashed", "voyagermesh"];
const org = ref<string | null>(null);
const options = ref<SelectOption<string>[]>([]);
const loading = ref(false);

// Pretend API: filter on the server after the user types.
async function search(query: string) {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 400));
  options.value = all.filter((o) => o.includes(query.toLowerCase())).map((o) => ({ value: o, label: o }));
  loading.value = false;
}
search("");
</script>

<template>
  <div class="max-w-80">
    <AcSelect v-model="org" :options="options" label="GitHub Organization" searchable @search="search" />
    <p class="mt-2 text-xs text-muted">{{ loading ? "Searching…" : `${options.length} results` }}</p>
  </div>
</template>
