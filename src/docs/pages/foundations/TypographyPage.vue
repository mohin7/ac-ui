<script setup lang="ts">
import CopyChip from "../../components/CopyChip.vue";
import Callout from "../../components/Callout.vue";
import DocHeading from "../../components/DocHeading.vue";

const headings = [
  { tag: "h1", size: "32px", weight: 600, use: "Page hero titles", sample: "Deploy databases on Kubernetes" },
  { tag: "h2", size: "26px", weight: 600, use: "Section titles", sample: "Managed Postgres" },
  { tag: "h3", size: "22px", weight: 600, use: "Card group and dialog titles", sample: "Backup Configuration" },
  { tag: "h4", size: "18px", weight: 600, use: "Page header titles", sample: "demo-postgres" },
  { tag: "h5", size: "15px", weight: 600, use: "Card and step titles", sample: "Select Cluster" },
  { tag: "h6", size: "13px", weight: 500, use: "Field group labels", sample: "Storage Class" },
] as const;

const scale = [
  { cls: "text-xm", px: 10, use: "Micro captions, chart axes" },
  { cls: "text-sm", px: 11, use: "Helper and error text under fields" },
  { cls: "text-xs", px: 12, use: "Badges, table meta, timestamps" },
  { cls: "text-base", px: 13, use: "Body — the default" },
  { cls: "text-lg", px: 14, use: "Emphasised paragraphs, docs prose" },
  { cls: "text-xl", px: 16, use: "Lead paragraphs" },
  { cls: "text-2xl", px: 18, use: "Small display" },
  { cls: "text-3xl", px: 24, use: "Stat numbers" },
  { cls: "text-4xl", px: 30, use: "Display" },
  { cls: "text-5xl", px: 36, use: "Display" },
  { cls: "text-6xl", px: 42, use: "Marketing numerals" },
];

const weights = [
  { cls: "font-light", w: 300 },
  { cls: "font-normal", w: 400 },
  { cls: "font-medium", w: 500 },
  { cls: "font-semibold", w: 600 },
  { cls: "font-bold", w: 700 },
];
</script>

<template>
  <Callout type="note">
    Sizes and line heights are shown at interface scale 1. They are multiples of <code class="prose-code">--ac-scale</code>, so they grow or shrink
    together when the viewer picks a text size. See <RouterLink to="/getting-started/theming#interface-scale">Interface scale</RouterLink>.
  </Callout>

  <DocHeading id="families">Families</DocHeading>
  <p>Geist for all UI text, Geist Mono for code, resource names and commands. Both are self-hosted variable fonts. The Bulma version used Roboto and Inconsolata.</p>
  <div class="my-4 grid gap-4 md:grid-cols-2">
    <div class="rounded-10 border border-border bg-surface shadow-xs p-6">
      <CopyChip text="font-sans" />
      <p class="mt-2 text-5xl leading-tight text-heading">Aa Bb Cc 123</p>
      <p class="mt-2">Your cluster is ready. Import it to start managing databases.</p>
    </div>
    <div class="rounded-10 border border-border bg-surface shadow-xs p-6">
      <CopyChip text="font-mono" /> · <CopyChip text="text-code" />
      <p class="mt-2 font-mono text-5xl leading-tight text-heading">{ } 0O 1lI</p>
      <p class="mt-2 text-code">kubectl get postgres -n demo</p>
    </div>
  </div>

  <DocHeading id="headings">Headings</DocHeading>
  <p>Plain <code class="prose-code">h1</code>–<code class="prose-code">h6</code> elements are styled by the theme, in heading colour, with tighter tracking as they grow.</p>
  <div class="my-4 overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
    <div
      v-for="h in headings"
      :key="h.tag"
      class="flex flex-col gap-1 border-b border-border-light px-6 py-4 last:border-0 sm:flex-row sm:items-baseline sm:gap-6"
    >
      <span class="w-32 shrink-0 text-xs text-label">{{ h.tag }} · {{ h.size }} · {{ h.weight }}</span>
      <component :is="h.tag" class="min-w-0 flex-1 truncate">{{ h.sample }}</component>
      <span class="text-xs text-label">{{ h.use }}</span>
    </div>
  </div>

  <DocHeading id="size-scale">Size scale</DocHeading>
  <p>Sizes are px, independent of the root font size, each with a fixed line height on a 2px rhythm. Sizes from 24px up get negative tracking.</p>
  <Callout type="warning">
    In this system <code class="prose-code">text-sm</code> (11px) is smaller than
    <code class="prose-code">text-xs</code> (12px). It's kept from the source so existing class names mean the same size.
  </Callout>
  <div class="my-4 overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
    <div v-for="s in scale" :key="s.cls" class="flex items-baseline gap-6 border-b border-border-light px-6 py-3 last:border-0">
      <span class="w-24 shrink-0"><CopyChip :text="s.cls" /></span>
      <span class="w-10 shrink-0 text-xs text-label">{{ s.px }}px</span>
      <span class="min-w-0 flex-1 truncate text-heading" :class="s.cls">Monitor your resources</span>
      <span class="hidden text-xs text-label md:inline">{{ s.use }}</span>
    </div>
  </div>

  <DocHeading id="weights">Weights</DocHeading>
  <div class="my-4 flex flex-wrap gap-3">
    <div v-for="w in weights" :key="w.w" class="rounded-10 border border-border bg-surface shadow-xs px-5 py-4">
      <p class="text-3xl text-heading" :class="w.cls">Aa</p>
      <CopyChip :text="w.cls" /> <span class="text-xs text-label">{{ w.w }}</span>
    </div>
  </div>

  <DocHeading id="writing">Writing style</DocHeading>
  <ul>
    <li>Buttons, dialog and card titles in Title Case: “Create Database”, “Update Gravatar Email”.</li>
    <li>Body, hints and messages in sentence case, addressed to “you”.</li>
    <li>Keep Kubernetes names exact: Postgres, MongoDB, StorageClass. Put resource names and commands in <code class="prose-code">text-code</code>.</li>
    <li>Units as Kubernetes writes them: GiB, MiB, vCPU.</li>
  </ul>
</template>
