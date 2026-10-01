<script setup lang="ts">
import { ref } from "vue";
import { AcDatePicker } from "@/lib";

const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const expiry = ref<string | null>(null);
</script>

<template>
  <div class="max-w-80 space-y-2">
    <AcDatePicker v-model="expiry" label="Token Expiry Date" :min-date="tomorrow" required clearable hint="The token stops working at the start of this day." />
    <p class="text-xs text-muted">v-model: <code class="prose-code">{{ JSON.stringify(expiry) }}</code></p>
  </div>
</template>
