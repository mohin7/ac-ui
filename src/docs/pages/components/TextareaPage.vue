<script setup lang="ts">
import { AcTextarea } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { ref } from "vue";\n\nconst notes = ref("");';

const dos = [
  "Use it for text that runs past one line: descriptions, reasons, notes, pasted certificates or YAML.",
  "Set `maxlength` when the server has a limit, so people see the count before they hit it.",
  "Use `mono` for certificates, keys and config, so columns and indentation line up.",
];
const donts = [
  "Don't use a textarea for a single value like a name or URL — use Input.",
  "Don't turn on `autoResize` without `max-rows` in a short form; a long paste would push the footer off screen.",
  "Don't use it as a code editor for large YAML; use the editor component for syntax highlighting and validation.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a textarea for free text that can span several lines. It shares Input's floating label, hint and error, and adds a live character count, auto-resize and a monospace mode for pasted config.</p>
  <ComponentPlayground
    tag="AcTextarea"
    :component="AcTextarea"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'rows', 'type': 'select', 'options': [2, 3, 4, 6]}, {'prop': 'autoResize', 'type': 'boolean'}, {'prop': 'mono', 'type': 'boolean'}, {'prop': 'required', 'type': 'boolean'}, {'prop': 'readonly', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'hint', 'type': 'text'}, {'prop': 'errorMsg', 'type': 'text'}]"
    :initial="{'label': 'Notes', 'rows': 4, 'autoResize': false, 'mono': false, 'required': false, 'readonly': false, 'disabled': false, 'hint': '', 'errorMsg': ''}"
    :defaults="{'label': '', 'rows': 4, 'autoResize': false, 'mono': false, 'required': false, 'readonly': false, 'disabled': false, 'hint': '', 'errorMsg': ''}"
    :extra="{'modelValue': '', 'maxlength': 200, 'class': 'max-w-100'}"
    extra-code='v-model="notes" :maxlength="200"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p><code class="prose-code">v-model</code> holds the text. The label rests on the first line and rises on focus, like Input.</p>
  <ComponentExample name="textarea/TextareaBasic" />
  <DocHeading id="count" :level="3">Character count</DocHeading>
  <p><code class="prose-code">maxlength</code> caps the length and shows a live <code class="prose-code">12 / 120</code> count, which turns red at the limit. The count sits next to the hint or error.</p>
  <ComponentExample name="textarea/TextareaCount" />
  <DocHeading id="auto-resize" :level="3">Auto-resize and monospace</DocHeading>
  <p><code class="prose-code">auto-resize</code> grows the field with its content, starting at <code class="prose-code">rows</code> lines. <code class="prose-code">max-rows</code> sets where it stops growing and scrolls. <code class="prose-code">mono</code> switches to Geist Mono for YAML, certificates and keys.</p>
  <ComponentExample name="textarea/TextareaAutoResize" />
  <DocHeading id="states" :level="3">Error, read-only, disabled</DocHeading>
  <p><code class="prose-code">error-msg</code> turns the field red and sets <code class="prose-code">aria-invalid</code>. Read-only fields keep their text selectable and copyable.</p>
  <ComponentExample name="textarea/TextareaStates" />
  <Callout type="note">Without <code class="prose-code">auto-resize</code> people can drag the corner to make the field taller. With it, the handle is hidden because the height follows the text.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The visible label is a real <code class="prose-code">&lt;label for&gt;</code>, so clicking it focuses the field and screen readers announce it.</li>
    <li>The hint or error and the character count are linked with <code class="prose-code">aria-describedby</code>; the count reads as “Characters used: 12 / 120”.</li>
    <li><code class="prose-code">required</code> sets the native attribute; the red asterisk is hidden from screen readers so it isn't read twice.</li>
  </ul>

  <ApiTables component="AcTextarea" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 border-border shadow-xs</code></td><td class="px-4 py-3">Field</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">focus:focus-ring</code></td><td class="px-4 py-3">Focused field</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-primary-20</code></td><td class="px-4 py-3">Floating label while focused</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-red-60 text-red-30</code></td><td class="px-4 py-3">Error border, label and message</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted</code></td><td class="px-4 py-3">Read-only and disabled</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-mono text-xs</code></td><td class="px-4 py-3"><code class="prose-code">mono</code></td></tr>
      </tbody>
    </table>
  </div>
</template>
