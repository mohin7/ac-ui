<script setup lang="ts">
import { BookOpen } from "@lucide/vue";
import { AcAppSwitcher } from "@/lib";

const apps = [
  { name: "db", title: "KubeDB", subtitle: "Databases on Kubernetes", iconUrl: "/logos/kubedb-logo.png", url: "https://kubedb.com" },
  { name: "stash", title: "Stash", subtitle: "Backup and recovery", iconUrl: "/logos/stash-logo.png", url: "https://stash.run" },
  { name: "voyager", title: "Voyager", subtitle: "Ingress and gateway", iconUrl: "/logos/voyager-logo.png", url: "https://voyagermesh.com" },
  { name: "kubevault", title: "KubeVault", subtitle: "Secrets management", iconUrl: "/logos/kube-vault-logo.png", url: "https://kubevault.com" },
  { name: "docs", title: "Docs", subtitle: "Guides and references", icon: BookOpen, color: "blue" as const, url: "https://appscode.com/docs" },
];
</script>

<template>
  <div class="flex justify-center">
    <AcAppSwitcher :apps="apps" current-app="db" label="AppsCode products" align="start">
      <template #footer>
        <a
          href="https://appscode.com/products"
          class="flex h-8 items-center justify-center rounded-6 text-base font-medium text-heading no-underline hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          All products
        </a>
      </template>
    </AcAppSwitcher>
  </div>
</template>
