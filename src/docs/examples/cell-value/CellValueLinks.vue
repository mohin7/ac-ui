<script setup lang="ts">
import { AcCellValue } from "@/lib";

// In an app, fill the server's placeholders from the current route, e.g. route.params.user.
const params: Record<string, string> = { username: "appscode", clustername: "prod-eks-us-east" };
function resolveLink(link: string) {
  return link.replace(/\$\{(.*?)\}/g, (_, key: string) => params[key] ?? "");
}
</script>

<template>
  <div class="space-y-3 text-base">
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Database</span>
      <AcCellValue :cell="{ data: 'pg-orders', link: '/components/table?user=${username}&cluster=${clustername}' }" :resolve-link="resolveLink" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Docs</span>
      <AcCellValue value="Postgres guide" href="https://kubedb.com/docs/latest/guides/postgres/" />
    </div>
    <div class="flex items-center gap-4">
      <span class="w-28 shrink-0 text-muted">Provider</span>
      <AcCellValue value="KubeDB" icon="/logos/kubedb-logo.png" />
    </div>
  </div>
</template>
