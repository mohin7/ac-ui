<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcButton, AcFormFooter } from "@/lib";

const saving = ref(false);
const dirty = ref(true);

function save() {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    dirty.value = false;
  }, 1000);
}
</script>

<template>
  <div class="rounded-10 border border-border bg-surface px-5 pb-0">
    <p class="pt-5 text-base text-muted">Resource definition editor…</p>
    <!-- Outside a <form>, the primary button emits `save`. -->
    <AcFormFooter submit-label="Save Changes" :loading="saving" :disabled="!dirty" sticky="none" @save="save" @cancel="dirty = false">
      <template #left>
        <AcBadge v-if="dirty" label="Unsaved changes" color="warning" variant="light" dot rounded />
        <span v-else>All changes saved</span>
      </template>
    </AcFormFooter>
    <div class="flex justify-end pb-4">
      <AcButton title="Make a change" color="ghost" size="small" @click="dirty = true" />
    </div>
  </div>
</template>
