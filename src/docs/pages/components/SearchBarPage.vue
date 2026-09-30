<script setup lang="ts">
import { AcSearchBar } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst query = ref(\"\");";

const dos = ["Say what's searched in the placeholder: “Search databases”."];
const donts = ["Don't add a Search button — results update as people type."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>A compact search field for filtering lists. It emits <code class="prose-code">search</code> after people stop typing (300ms by default), so you can call an API without firing on every key.</p>
  <ComponentPlayground
    tag="AcSearchBar"
    :component="AcSearchBar"
    :controls="[{'prop': 'placeholder', 'type': 'text'}, {'prop': 'size', 'type': 'select', 'options': ['small', 'normal']}]"
    :initial="{'placeholder': 'Search clusters', 'size': 'small'}"
    :defaults="{'placeholder': 'Search', 'size': 'small'}"
    :extra="{'modelValue': ''}"
    extra-code='v-model="query"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Debounced search</DocHeading>
  <p><code class="prose-code">v-model</code> updates on every key; <code class="prose-code">search</code> fires once typing pauses. Set <code class="prose-code">:debounce="0"</code> to emit immediately.</p>
  <ComponentExample name="search-bar/SearchBarBasic" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Escape clears the text; the clear button is labelled.</li>
  </ul>

  <ApiTables component="AcSearchBar" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">h-8 rounded-6 border-border shadow-xs</code></td><td class="px-4 py-3">Field</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">focus:focus-ring</code></td><td class="px-4 py-3">Focus</td></tr>
      </tbody>
    </table>
  </div>
</template>
