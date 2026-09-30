<script setup lang="ts">
import { computed } from "vue";
import meta from "../generated/component-meta.json";
import DocHeading from "./DocHeading.vue";
import InlineMd from "./InlineMd.vue";

interface Prop {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}
interface Slot {
  name: string;
  type: string;
  description: string;
}
interface Event {
  name: string;
  type: string;
  signature: string;
}
type Meta = Record<string, { props: Prop[]; slots: Slot[]; events: Event[] }>;

const props = withDefaults(defineProps<{ component: string; extraSlots?: Slot[]; heading?: string; idPrefix?: string }>(), {
  extraSlots: () => [],
  heading: "API",
  idPrefix: "",
});

const m = computed(() => (meta as Meta)[props.component]);
const tidy = (t: string) => t.replace(/ \| undefined/g, "");
const propsRows = computed(() =>
  (m.value?.props ?? []).map((p) =>
    p.name === "modelValue"
      ? { ...p, name: "v-model", description: p.description || "The bound value." }
      : m.value?.events.some((e) => e.name === `update:${p.name}`)
        ? { ...p, name: `v-model:${kebab(p.name)}` }
        : p,
  ),
);
const slots = computed(() => [...(m.value?.slots ?? []), ...props.extraSlots]);
const events = computed(() => (m.value?.events ?? []).filter((e) => !e.name.startsWith("update:")));
const kebab = (s: string) => (s.startsWith("v-model") ? s : s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
</script>

<template>
  <DocHeading :id="`${idPrefix}api`" :level="2">{{ heading }}</DocHeading>
  <p class="mb-5 text-base text-muted">
    Generated from the TypeScript types in <code class="prose-code">src/lib/components/{{ component }}.vue</code>.
  </p>

  <DocHeading :id="`${idPrefix}props`" :level="3">Props</DocHeading>
  <div class="mb-10 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr>
          <th class="h-9 w-44 px-4 font-medium">Prop</th>
          <th class="h-9 w-32 px-4 font-medium">Default</th>
          <th class="h-9 px-4 font-medium">Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in propsRows" :key="p.name" class="border-t border-border-light align-top first:border-0">
          <td class="px-4 py-3.5">
            <code class="rounded-4 bg-primary-97 px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-primary-10 ring-1 ring-primary-90 ring-inset">{{ kebab(p.name) }}</code>
            <span v-if="p.required" class="ml-1 text-xs text-danger" title="Required">*</span>
          </td>
          <td class="px-4 py-3.5">
            <code v-if="p.default && p.default !== 'undefined'" class="prose-code">{{ p.default }}</code>
            <span v-else class="text-slate-70">—</span>
          </td>
          <td class="px-4 py-3.5">
            <code class="font-mono text-[12.5px] leading-5 text-blue-20">{{ tidy(p.type) }}</code>
            <p v-if="p.description" class="mt-1.5 text-base leading-5 text-label"><InlineMd :text="p.description" /></p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <template v-if="slots.length">
    <DocHeading :id="`${idPrefix}slots`" :level="3">Slots</DocHeading>
    <div class="mb-10 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
      <table class="w-full text-left text-base">
        <thead class="border-b border-border bg-surface-muted text-xs text-label">
          <tr>
            <th class="h-9 w-44 px-4 font-medium">Slot</th>
            <th class="h-9 px-4 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in slots" :key="s.name" class="border-t border-border-light align-top first:border-0">
            <td class="px-4 py-3.5"><code class="rounded-4 bg-primary-97 px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-primary-10 ring-1 ring-primary-90 ring-inset">#{{ s.name }}</code></td>
            <td class="px-4 py-3.5">
              <InlineMd v-if="s.description" :text="s.description" />
              <code v-if="s.type && s.type !== '{}' && s.type !== 'any'" class="mt-1 block font-mono text-xs text-label"
                >props: {{ s.type }}</code
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <template v-if="events.length">
    <DocHeading :id="`${idPrefix}emits`" :level="3">Emits</DocHeading>
    <div class="mb-10 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
      <table class="w-full text-left text-base">
        <thead class="border-b border-border bg-surface-muted text-xs text-label">
          <tr>
            <th class="h-9 w-44 px-4 font-medium">Event</th>
            <th class="h-9 px-4 font-medium">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in events" :key="e.name" class="border-t border-border-light first:border-0">
            <td class="px-4 py-3.5"><code class="rounded-4 bg-primary-97 px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-primary-10 ring-1 ring-primary-90 ring-inset">@{{ e.name }}</code></td>
            <td class="px-4 py-3.5"><code class="font-mono text-[12.5px] text-blue-20">{{ e.type }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
