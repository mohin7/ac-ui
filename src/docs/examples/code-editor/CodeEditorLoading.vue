<script setup lang="ts">
import { defineAsyncComponent, h, ref } from "vue";
import { AcSkeleton } from "@/lib";

// The editor chunk (CodeMirror, ~135 KB gzipped) downloads the first time this renders.
const AcCodeEditor = defineAsyncComponent({
  loader: () => import("@/lib/editor").then((m) => m.AcCodeEditor),
  loadingComponent: () => h(AcSkeleton, { shape: "editor", height: "200px", label: "Loading editor" }),
  delay: 0,
});

const config = ref(`server:
  port: 8080
  logLevel: info
`);
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <AcSkeleton shape="editor" height="200px" label="" />
    <AcCodeEditor v-model="config" height="200px" label="Server config" />
  </div>
</template>
