<script setup lang="ts">
import { ref } from "vue";
import { AcBadge, AcButton, AcSwitch } from "@/lib";
import DocHeading from "../../components/DocHeading.vue";
import { pages } from "../../nav";

const components = pages.filter((p) => p.section === "Components");
const tls = ref(true);
const backups = ref(false);

const principles = [
  {
    title: "One green",
    body: "Primary marks the main action, links, active and checked states. One solid primary button per view.",
    icon: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
  },
  {
    title: "Slate for everything else",
    body: "Headings in heading, copy in body, labels in label, hairline borders. Status always comes with a word.",
    icon: "M3 5h14M3 10h10M3 15h6",
  },
  {
    title: "Dense and exact",
    body: "A 13px base, spacing in 4s and 8s, 6px controls on 10px surfaces. Calm screens for operators who scan a lot.",
    icon: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z",
  },
];

const layers = [
  { name: "Tokens", path: "src/lib/theme.css", body: "Colour scales, Geist type, spacing, radius and elevation as a Tailwind v4 theme." },
  { name: "Components", path: "src/lib/components", body: "Typed Vue 3 components — AcButton, AcInput, AcTable and more." },
  { name: "Guidelines", path: "this site", body: "When to use each component, do's and don'ts, accessibility and generated API tables." },
];
</script>

<template>
  <!-- Hero -->
  <section class="relative mb-20 pt-6">
    <div class="relative grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,440px)]">
      <div>
        <span class="inline-flex h-6.5 items-center gap-2 rounded-50 border border-border bg-white/80 pr-3 pl-1 text-xs font-medium text-label shadow-xs">
          <span class="rounded-50 bg-primary px-2 py-0.5 text-[11px] text-white">v0.2</span>
          Geist, softer elevation, refined controls
        </span>
        <h1 class="mt-6 text-[38px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[46px]">
          The design system for <span class="text-primary-20">AppsCode&nbsp;consoles</span>
        </h1>
        <p class="mt-5 max-w-130 text-[17px] leading-[28px] text-label">
          Tokens, a Tailwind CSS v4 theme and typed Vue 3 components behind cluster-ui, deploy-ui, billing-ui and
          kubedb-ui. Copy an example, and it works.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <AcButton href="#/getting-started/installation" title="Get Started" size="medium" />
          <AcButton href="#/components/button" title="Browse Components" color="white" size="medium" />
        </div>
      </div>

      <!-- A live composition made from the real components -->
      <div class="preview-canvas relative rounded-16 border border-border-light p-5" aria-label="Component preview">
        <div class="relative space-y-3">
          <div class="rounded-12 border border-border bg-white p-4 shadow-lg">
            <div class="flex items-center gap-3">
              <img src="/logos/kubedb-logo.png" alt="" class="size-9 rounded-8 bg-surface-muted p-1" />
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-heading">demo-postgres</p>
                <p class="text-xs text-muted">Postgres 16.1 · 3 replicas · demo</p>
              </div>
              <AcBadge label="Ready" color="success" variant="light" rounded dot />
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2">
              <div v-for="m in [['CPU', '38%'], ['Memory', '2.1 GiB'], ['Storage', '14 GiB']]" :key="m[0]" class="rounded-8 bg-surface-muted px-3 py-2">
                <p class="text-[11px] text-muted">{{ m[0] }}</p>
                <p class="font-medium text-heading tabular-nums">{{ m[1] }}</p>
              </div>
            </div>
          </div>
          <div class="ml-8 rounded-12 border border-border bg-white p-4 shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-heading">Enable TLS</p>
                <p class="text-xs text-muted">Certificates from cert-manager</p>
              </div>
              <AcSwitch v-model="tls" />
            </div>
            <div class="mt-3 flex items-center justify-between border-t border-border-light pt-3">
              <div>
                <p class="font-medium text-heading">Scheduled backups</p>
                <p class="text-xs text-muted">Stash, every 6 hours</p>
              </div>
              <AcSwitch v-model="backups" />
            </div>
          </div>
          <div class="mr-10 flex items-center justify-end gap-2">
            <AcButton title="Cancel" color="white" />
            <AcButton title="Save Changes" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <DocHeading id="principles">Principles</DocHeading>
  <div class="my-5 grid gap-4 md:grid-cols-3">
    <div v-for="p in principles" :key="p.title" class="rounded-10 border border-border bg-white p-5 shadow-xs">
      <span class="mb-4 inline-flex size-8 items-center justify-center rounded-8 bg-primary-95 text-primary-20 ring-1 ring-primary-90 ring-inset">
        <svg class="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path :d="p.icon" /></svg>
      </span>
      <h5 class="mb-1.5">{{ p.title }}</h5>
      <p class="text-base leading-[21px] text-label">{{ p.body }}</p>
    </div>
  </div>

  <DocHeading id="whats-inside">What's inside</DocHeading>
  <div class="my-5 grid gap-4 md:grid-cols-3">
    <div v-for="l in layers" :key="l.name" class="rounded-10 border border-border bg-white p-5 shadow-xs">
      <h5>{{ l.name }}</h5>
      <p class="mt-1 font-mono text-[11.5px] text-muted">{{ l.path }}</p>
      <p class="mt-3 text-base leading-[21px] text-label">{{ l.body }}</p>
    </div>
  </div>

  <DocHeading id="components">Components</DocHeading>
  <p>Every page has a live playground, copyable examples, guidelines and the full API.</p>
  <div class="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <RouterLink
      v-for="c in components"
      :key="c.path"
      :to="c.path"
      class="group rounded-10 border border-border bg-white p-4 shadow-xs transition hover:-translate-y-px hover:border-border-dark hover:shadow-md"
    >
      <span class="flex items-center justify-between gap-2">
        <span class="font-semibold text-heading">{{ c.title }}</span>
        <span class="text-[11px] font-medium text-muted">{{ c.group }}</span>
      </span>
      <span class="mt-1 block text-xs leading-[18px] text-label">{{ c.description }}</span>
      <span class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-20 opacity-0 transition group-hover:opacity-100">
        View docs
        <svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 6h7M6.5 3l3 3-3 3" /></svg>
      </span>
    </RouterLink>
  </div>
</template>
