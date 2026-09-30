<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AcAvatar, AcButton, AcSkeleton } from "@/lib";

const loading = ref(true);

function reload() {
  loading.value = true;
  setTimeout(() => (loading.value = false), 1500);
}

onMounted(reload);
</script>

<template>
  <div class="flex max-w-md flex-col items-start gap-4">
    <div class="flex w-full items-center gap-3 rounded-10 border border-border bg-surface p-4" :aria-busy="loading">
      <template v-if="loading">
        <AcSkeleton shape="circle" height="48px" label="" />
        <AcSkeleton :lines="2" label="Loading owner" class="flex-1" />
      </template>
      <template v-else>
        <AcAvatar name="Nadia Islam" size="large" alt="" />
        <div>
          <p class="font-medium text-heading">Nadia Islam</p>
          <p class="text-xs text-muted">Owner of demo-postgres</p>
        </div>
      </template>
    </div>
    <AcButton title="Reload" color="white" size="small" :disabled="loading" @click="reload" />
  </div>
</template>
