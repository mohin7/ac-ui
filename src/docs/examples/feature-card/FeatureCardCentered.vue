<script setup lang="ts">
import { AcFeatureCard, useToast } from "@/lib";

const { toast } = useToast();

const products = [
  { name: "KubeDB", logo: "/logos/kubedb-logo.png", description: "Databases" },
  { name: "Stash", logo: "/logos/stash-logo.png", description: "Backup & recovery" },
  { name: "Voyager", logo: "/logos/voyager-logo.png", description: "Ingress & gateway" },
  { name: "KubeVault", logo: "/logos/kube-vault-logo.png", description: "Secrets" },
];
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(160px,100%),1fr))] gap-3">
    <AcFeatureCard
      v-for="p in products"
      :key="p.name"
      centered
      :title="p.name"
      :description="p.description"
      :logo="p.logo"
      @click="toast(`Install ${p.name}`)"
    />
  </div>
</template>
