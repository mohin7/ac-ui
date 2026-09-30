<script setup lang="ts">
import { ref } from "vue";
import { AcButton, useToast } from "@/lib";

const { toast, warning } = useToast();
const namespaces = ref(["demo", "shop", "monitoring"]);

function removeNamespace() {
  const removed = namespaces.value.pop();
  if (!removed) return;
  toast(`Namespace ${removed} removed`, {
    action: { label: "Undo", onClick: () => namespaces.value.push(removed) },
  });
}

function showPersistent() {
  warning("License expired", {
    description: "KubeDB operators stop reconciling until you renew.",
    duration: 0,
    action: { label: "Renew", onClick: () => {} },
  });
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <AcButton title="Remove Namespace" color="white" :disabled="!namespaces.length" @click="removeNamespace" />
    <AcButton title="Show Persistent Toast" color="white" @click="showPersistent" />
    <span class="text-base text-muted">Namespaces: {{ namespaces.join(", ") || "none" }}</span>
  </div>
</template>
