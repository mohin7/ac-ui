<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { AcButton, AcProgress } from "@/lib";

const done = ref(0);
const total = 48;
let timer: ReturnType<typeof setInterval> | undefined;

function start() {
  done.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    done.value = Math.min(total, done.value + 3);
    if (done.value === total) clearInterval(timer);
  }, 250);
}

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="flex max-w-md flex-col items-start gap-4">
    <AcProgress
      :value="done"
      :max="total"
      label="Restoring snapshot to demo-mongo"
      :value-text="`${done} of ${total} GiB`"
      :color="done === total ? 'success' : 'primary'"
      show-value
    />
    <AcButton title="Start restore" color="white" size="small" @click="start" />
  </div>
</template>
