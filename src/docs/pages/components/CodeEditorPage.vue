<script setup lang="ts">
import { AcKbd } from "@/lib";
import { AcCodeEditor } from "@/lib/editor";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";
import importCode from "../../snippets/code-editor/import-code.txt?raw";
import asyncCode from "../../snippets/code-editor/async-code.txt?raw";

const sample = `apiVersion: v1
kind: Service
metadata:
  name: demo-postgres
  namespace: demo
spec:
  type: ClusterIP
  ports:
    - name: primary
      port: 5432
      targetPort: 5432
`;
const script = 'import { ref } from "vue";\n\nconst manifest = ref(`apiVersion: v1\\nkind: Service\\n…`);';

const dos = [
  "Pass the CRD's `openAPIV3Schema` as `schema` so people see a wrong field or type before the API server rejects it.",
  "Disable Save or Apply while `@validate` reports problems, and say why next to the button.",
  "Set `original` when editing something that already exists, so people can review their changes before saving.",
  "Use `readonly` with `copyable` for install scripts and generated config people paste elsewhere.",
];
const donts = [
  "Don't use it for a short value or a one-line command. Use Input, or a code block with a copy button.",
  "Don't turn `validate` off just to hide errors. Only turn it off for templates that aren't valid until rendered.",
  "Don't put the editor in a card that's only a few lines tall. Give it at least 200px, or `height=\"auto\"` with a `max-height`.",
  "Don't remount the editor with `:key=\"theme\"` when the theme changes. It picks up dark mode by itself.",
];

// Each entry is a sequence of chords: [["esc"], ["tab"]] means Escape, then Tab.
const keys: [string[][], string][] = [
  [[["tab"]], "Indents the line or selection by 2 spaces. Shift-Tab outdents."],
  [[["esc"], ["tab"]], "Leaves the editor and moves focus to the next control."],
  [[["mod", "f"]], "Opens search and replace."],
  [[["mod", "z"]], "Undo. Mod-Shift-Z redoes."],
  [[["mod", "/"]], "Comments or uncomments the line."],
  [[["ctrl", "shift", "["]], "Folds the block at the cursor, and Ctrl-Shift-] unfolds it. On macOS: Cmd-Alt-[ and Cmd-Alt-]."],
  [[["mod", "shift", "m"]], "Opens the list of problems. F8 jumps to the next one."],
];

const migration: [string, string][] = [
  ['<Editor v-model :original-value>', '<AcCodeEditor v-model :original> (Edit / Changes switch)'],
  [':read-only="true"', "readonly"],
  [':editor-height="40" (vh units)', 'height="40vh"'],
  ['editor-height="calc(100vh - 290px)"', 'height="calc(100vh - 290px)"'],
  ['word-wrap="on" / "off"', ':wrap="true" (default) / :wrap="false"'],
  [':show-minimap', "Dropped. Search (Mod-F) and folding replace it."],
  [':validation="{ schema, uri }"', ':schema="schema" (no uri needed)'],
  [':needs-update-on-change', "Dropped. v-model always updates as you type."],
  [':key="theme"', "Dropped. The editor follows dark mode."],
  ['<LightweightEditor :schema @validation-error>', '<AcCodeEditor :schema @validate>'],
  ['<MonacoEditor :diff-editor="true" :original>', '<AcCodeEditor readonly :original diff-layout="split">'],
  ['<JsonShowModal :editor-content>', '<AcModal> with <AcCodeEditor language="json" readonly>'],
  ["EditorLoader", '<AcSkeleton shape="editor">'],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The code editor edits Kubernetes manifests, Helm values, JSON and scripts. It highlights syntax, checks YAML and JSON as you type, validates against a JSON
    Schema, and can show what changed since the saved version. It's built on CodeMirror 6 and follows the light and dark theme.
  </p>
  <ComponentPlayground
    tag="AcCodeEditor"
    :component="AcCodeEditor"
    :controls="[{'prop': 'language', 'type': 'select', 'options': ['yaml', 'json', 'shell', 'text']}, {'prop': 'title', 'type': 'text'}, {'prop': 'height', 'type': 'select', 'options': ['240px', '320px', 'auto']}, {'prop': 'readonly', 'type': 'boolean'}, {'prop': 'copyable', 'type': 'boolean'}, {'prop': 'wrap', 'type': 'boolean'}, {'prop': 'lineNumbers', 'type': 'boolean'}, {'prop': 'validate', 'type': 'boolean'}, {'prop': 'bordered', 'type': 'boolean'}]"
    :initial="{'language': 'yaml', 'title': 'service.yaml', 'height': '240px', 'readonly': false, 'copyable': true, 'wrap': true, 'lineNumbers': true, 'validate': true, 'bordered': true}"
    :defaults="{'language': 'yaml', 'title': '', 'height': '320px', 'readonly': false, 'copyable': false, 'wrap': true, 'lineNumbers': true, 'validate': true, 'bordered': true}"
    :extra="{'modelValue': sample, 'class': 'w-full'}"
    extra-code='v-model="manifest"'
    :script="script"
    import-from="@/lib/editor"
  />

  <DocHeading id="importing">Importing</DocHeading>
  <p>
    The editor has its own entry point, so apps that never show an editor don't bundle CodeMirror. Import it from
    <code class="prose-code">@appscode/design-system/editor</code>:
  </p>
  <CodeBlock :code="importCode" lang="ts" />
  <p>
    The editor adds about 135 KB gzipped. The YAML checker (30 KB), the schema validator (35 KB) and the diff view load separately, the first time
    they're needed. On pages where the editor isn't visible straight away, such as in a tab, modal or wizard step, load it on demand and show
    <code class="prose-code">AcSkeleton shape="editor"</code> while it downloads:
  </p>
  <CodeBlock :code="asyncCode" lang="ts" />
  <ComponentExample name="code-editor/CodeEditorLoading" />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>
    <code class="prose-code">v-model</code> holds the text and updates as you type. <code class="prose-code">title</code> names the file in the header, and
    <code class="prose-code">copyable</code> adds a copy button. YAML is the default language.
  </p>
  <ComponentExample name="code-editor/CodeEditorBasic" />

  <DocHeading id="schema" :level="3">Schema validation</DocHeading>
  <p>
    With <code class="prose-code">schema</code>, the YAML or JSON is checked against a JSON Schema, such as a CRD's
    <code class="prose-code">openAPIV3Schema</code>. Each problem is underlined at the right field and listed under the editor; click one to jump to it.
    <code class="prose-code">@validate</code> sends the full list after every check, so you can disable Apply until it's empty.
  </p>
  <ComponentExample name="code-editor/CodeEditorSchema" />
  <Callout type="note">
    Syntax is always checked for YAML and JSON. Schema problems only appear once the text parses. Multi-document YAML (<code class="prose-code">---</code>)
    checks each document against the schema.
  </Callout>

  <DocHeading id="changes" :level="3">Reviewing changes</DocHeading>
  <p>
    Pass the saved version as <code class="prose-code">original</code> and the header gets an <strong>Edit / Changes</strong> switch with a count of changed
    blocks. Changes shows a diff with unchanged lines collapsed. <code class="prose-code">v-model:view</code> controls which pane shows, and
    <code class="prose-code">diff-layout="split"</code> puts the saved version on the left. Use the <code class="prose-code">#actions</code> slot for buttons
    like Reset.
  </p>
  <ComponentExample name="code-editor/CodeEditorChanges" />

  <DocHeading id="compare" :level="3">Comparing two versions</DocHeading>
  <p>
    With <code class="prose-code">readonly</code> and <code class="prose-code">original</code>, the editor shows only the diff. Use it to compare presets or
    show what an upgrade will change.
  </p>
  <ComponentExample name="code-editor/CodeEditorCompare" />

  <DocHeading id="read-only" :level="3">Read-only scripts</DocHeading>
  <p>
    <code class="prose-code">readonly</code> keeps the text selectable, searchable and copyable. <code class="prose-code">language="shell"</code> highlights
    install scripts, and <code class="prose-code">height="auto"</code> fits the editor to its content.
  </p>
  <ComponentExample name="code-editor/CodeEditorReadonly" />

  <DocHeading id="formats" :level="3">YAML and JSON</DocHeading>
  <p>Changing <code class="prose-code">language</code> doesn't convert the text; convert it yourself, as this YAML/JSON switch does. It stays disabled while the text has problems, because it can't be parsed.</p>
  <ComponentExample name="code-editor/CodeEditorFormats" />

  <DocHeading id="in-a-modal" :level="3">In a modal</DocHeading>
  <p>
    To show JSON in a modal, as the old <code class="prose-code">JsonShowModal</code> did, put a read-only editor in <code class="prose-code">AcModal</code>
    with <code class="prose-code">height="auto"</code> and a <code class="prose-code">max-height</code>. Escape inside the editor doesn't close the modal;
    pressing it again does.
  </p>
  <ComponentExample name="code-editor/CodeEditorModal" center />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>
      The text area is named by <code class="prose-code">label</code>, then <code class="prose-code">title</code>, then the language ("YAML editor"). Read-only
      editors set <code class="prose-code">aria-readonly</code>.
    </li>
    <li>
      When there are errors the text area gets <code class="prose-code">aria-invalid</code> and is described by the problem list. The number of problems is
      announced politely as it changes.
    </li>
    <li>Every problem in the list is a button that selects the problem in the text.</li>
    <li>Tab indents, so it doesn't trap keyboard users: Escape then Tab moves focus on.</li>
  </ul>
  <div class="mt-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Keys</th><th class="h-9 px-4 font-medium">Action</th></tr>
      </thead>
      <tbody>
        <tr v-for="[combo, action] in keys" :key="action" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 text-xs text-muted">
              <template v-for="(chord, i) in combo" :key="i"><span v-if="i">then</span><AcKbd :keys="chord" /></template>
            </span>
          </td>
          <td class="px-4 py-3">{{ action }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="text-xs text-muted">Mod is Ctrl on Windows and Linux, and Cmd on macOS.</p>

  <DocHeading id="migration">Migrating from Editor</DocHeading>
  <p>
    <code class="prose-code">AcCodeEditor</code> replaces the old <code class="prose-code">Editor</code>, <code class="prose-code">MonacoEditor</code> and
    <code class="prose-code">LightweightEditor</code>. It drops Monaco, which was the largest dependency in the old library.
  </p>
  <div class="mt-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Old</th><th class="h-9 px-4 font-medium">New</th></tr>
      </thead>
      <tbody>
        <tr v-for="[before, after] in migration" :key="before" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ before }}</code></td>
          <td class="px-4 py-3">{{ after }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ApiTables component="AcCodeEditor" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>
    The editor's colours are the theme's CSS variables, so dark mode and a custom brand hue apply without extra code. See
    <RouterLink to="/getting-started/theming">Theming</RouterLink>.
  </p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Tokens</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">surface / surface-muted / border-light</code></td><td class="px-4 py-3">Text area, gutter and header</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">focus-ring</code></td><td class="px-4 py-3">Frame while the text area has focus</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">blue-40 / green-30 / purple-50 / slate-60</code></td><td class="px-4 py-3">Keys, strings, numbers and booleans, comments</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">green-97 / red-97</code></td><td class="px-4 py-3">Added and removed lines in Changes</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">red-50 / yellow-50</code></td><td class="px-4 py-3">Error and warning underlines</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">font-mono</code> 12px / 20px</td><td class="px-4 py-3">Code</td></tr>
      </tbody>
    </table>
  </div>
</template>
