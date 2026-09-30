<script setup lang="ts">
import CopyChip from "../../components/CopyChip.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";

const spacing = [
  { n: 1, px: 4, use: "Badge padding, tight icon gaps" },
  { n: 2, px: 8, use: "Button vertical padding, inline gaps" },
  { n: 3, px: 12, use: "Compact card padding" },
  { n: 4, px: 16, use: "Button horizontal padding, alerts, form rows" },
  { n: 5, px: 20, use: "Between form fields" },
  { n: 6, px: 24, use: "Card body padding" },
  { n: 8, px: 32, use: "Page gutters, between sections" },
  { n: 10, px: 40, use: "Empty-state padding" },
  { n: 12, px: 48, use: "Large section gaps" },
  { n: 16, px: 64, use: "Hero spacing" },
];

const layout = `<!-- A typical console page section -->
<section class="space-y-4">
  <header class="flex items-center justify-between gap-4">
    <h4>Databases</h4>
    <AcButton title="Create Database" />
  </header>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">…stat cards…</div>
  <AcCard :padded="false"><AcTable … /></AcCard>
</section>`;
</script>

<template>
  <DocHeading id="scale">Scale</DocHeading>
  <p>
    One Tailwind unit is 4px (<code class="prose-code">--spacing: 4px</code>), so any spacing utility is
    <code class="prose-code">N × 4px</code>. Components step in 4s and 8s; stay on the steps below.
  </p>
  <div class="my-4 overflow-hidden rounded-10 border border-border bg-surface shadow-xs">
    <div v-for="s in spacing" :key="s.n" class="flex items-center gap-4 border-b border-border-light px-6 py-2.5 last:border-0">
      <span class="w-14 shrink-0"><CopyChip :text="`p-${s.n}`" /></span>
      <span class="w-12 shrink-0 text-xs text-label">{{ s.px }}px</span>
      <span class="h-4 shrink-0 rounded-2 bg-primary" :style="{ width: `${s.px * 2}px` }" aria-hidden="true" />
      <span class="text-xs text-label">{{ s.use }}</span>
    </div>
  </div>

  <DocHeading id="from-old">From the old utilities</DocHeading>
  <p>
    The Bulma version's utilities were in px (<code class="prose-code">.p-16</code>, <code class="prose-code">.mt-24</code>).
    Divide by 4: <code class="prose-code">.p-16</code> → <code class="prose-code">p-4</code>,
    <code class="prose-code">.mt-24</code> → <code class="prose-code">mt-6</code>,
    <code class="prose-code">.gap-8</code> → <code class="prose-code">gap-2</code>.
  </p>

  <DocHeading id="layout">Layout patterns</DocHeading>
  <ul>
    <li>Page content sits on a light gray background with white cards.</li>
    <li>16px (<code class="prose-code">gap-4</code>) between cards, 24px (<code class="prose-code">p-6</code>) inside them.</li>
    <li>Forms: 20px (<code class="prose-code">space-y-5</code>) between fields, actions right-aligned at the bottom.</li>
  </ul>
  <CodeBlock :code="layout" lang="vue" />
</template>
