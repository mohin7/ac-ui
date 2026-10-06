<script setup lang="ts">
import { AcKbd } from "@/lib";
import { AcFileEditor } from "@/lib/editor";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const sampleFiles = [
  {
    name: "demo-mongodb.yaml",
    kind: "MongoDB",
    description: "demo",
    content: "apiVersion: kubedb.com/v1\nkind: MongoDB\nmetadata:\n  name: demo-mongodb\n  namespace: demo\nspec:\n  version: \"8.0.4\"\n  replicaSet:\n    name: rs0\n  replicas: 3\n  storage:\n    resources:\n      requests:\n        storage: 10Gi\n",
  },
  {
    name: "demo-mongodb-auth.yaml",
    kind: "Secret",
    description: "demo",
    content: "apiVersion: v1\nkind: Secret\nmetadata:\n  name: demo-mongodb-auth\n  namespace: demo\ntype: kubernetes.io/basic-auth\nstringData:\n  username: root\n",
  },
  {
    name: "values.json",
    kind: "Helm values",
    content: '{\n  "monitoring": {\n    "agent": "prometheus.io/operator",\n    "interval": "30s"\n  }\n}\n',
  },
];
const script = 'import { ref } from "vue";\n\nconst files = ref([\n  { name: "demo-mongodb.yaml", kind: "MongoDB", description: "demo", content: "apiVersion: kubedb.com/v1\\n…" },\n  …\n]);';

const fields: [string, string, string][] = [
  ["name", "string", "Unique within the list. Shown in the list and the editor header, and used by `v-model:active`."],
  ["content", "string", "The text. With `encoding: \"base64\"`, the base64 value as a Secret stores it."],
  ["original", "string", "The saved version, in the same encoding. Marks the file as changed and adds Edit / Changes."],
  ["language", "\"yaml\" | \"json\" | \"shell\" | \"text\"", "Guessed from the extension when left out: .yaml/.yml, .json, .sh; anything else is text."],
  ["schema", "object", "JSON Schema this file is checked against, e.g. its CRD's openAPIV3Schema."],
  ["secret", "boolean", "Hides the value until someone chooses Show value; hidden again on the next file."],
  ["encoding", "\"base64\"", "The editor shows decoded UTF-8 text and encodes edits back."],
  ["readonly", "boolean", "This file can't be edited."],
  ["kind", "string", "Shown under the name, e.g. Postgres or Secret."],
  ["description", "string", "More detail after the kind, e.g. the namespace."],
];

const dos = [
  "Disable Deploy or Save while `@validate` reports problems, and say how many files need fixing next to the button.",
  "Give each manifest a `kind` and its namespace as `description`, so people can tell files with similar names apart.",
  "Set `original` when editing what's already in the cluster, so changed files are marked and people can review them.",
  "Mark Secret values `secret` and pass them as `encoding: \"base64\"` straight from the API, instead of decoding them yourself.",
];
const donts = [
  "Don't use it for a single file. Use Code Editor.",
  "Don't decode a Secret's values into `content` and then hide them with CSS. Use `secret`, which keeps hidden values out of the page.",
  "Don't turn on `format-switch` for hand-written YAML with comments people want to keep. Edits in JSON rewrite the YAML.",
  "Don't make it shorter than about 320px. The list and the editor both need room.",
];

const keys: [string[], string][] = [
  [["up"], "Opens the previous file in the list. From the first file, moves to the search box."],
  [["down"], "Opens the next file. From the search box, moves into the list."],
  [["Home"], "Opens the first file. End opens the last."],
  [["enter"], "Moves focus into the open file's editor."],
  [["a"], "Typing a letter opens the next file whose name starts with it."],
  [["esc"], "In the search box, clears the search."],
];

const migration: [string, string][] = [
  ["<ResourceKeyValueEditor :preview-yamls>", '<AcContentTable> with <AcFileEditor v-model:files> inside'],
  ["<FilteredFileEditor> / <PreviewYamlEditor> :preview-yamls", "<AcFileEditor v-model:files>"],
  ["<MultiFileEditor :files>", "<AcFileEditor v-model:files format-switch>"],
  ["PreviewYamlType { uid, name, content, initContent, type, isSecret }", "{ name, content, original, language, secret }"],
  ["{ format: 'yaml', initContent, gvr }", "{ language: 'yaml', original, gvr } (extra fields are kept)"],
  [':schemas="[s0, s1]" (by index)', "schema on each file"],
  [":is-preview-loading", "loading"],
  [":is-editor-read-only", "readonly"],
  [":is-searchable / :search-text", "searchable / v-model:search"],
  [":show-hide-btn + :toggle-hide-value", "secret: true on the file (a Show value button per file)"],
  ["atob(value) before, btoa(value) on save", "encoding: 'base64' on the file"],
  ['@active-key / @set-active-key', 'v-model:active'],
  ['#content-action slot', '#actions="{ file }" in the editor header'],
  [":editor-height=\"40\" (vh)", 'height="40vh" (now the whole editor)'],
  [":show-minimap / :word-wrap", "Dropped / :wrap"],
  ["@previous-clicked / @submit-clicked(files)", "Your own buttons under the editor; read v-model:files"],
  ["Validation panel + hasValidationErrors", "@validate gives every file's problems; the list marks them"],
  ["<EditorTabs> Edit / Preview Changes", "Built in: Edit / Changes when a file has original"],
  ["SidebarLoader + ResourceLoader", "loading"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The file editor edits several YAML or JSON files side by side: the manifests a wizard is about to deploy, a ConfigMap's or Secret's keys, or a Helm
    release's templates. It lists the files with their kind, marks the changed ones and the ones with problems, and opens the selected file in a
    <RouterLink to="/components/code-editor">Code Editor</RouterLink>. For a single file, use the Code Editor directly.
  </p>
  <ComponentPlayground
    tag="AcFileEditor"
    :component="AcFileEditor"
    :controls="[{'prop': 'height', 'type': 'select', 'options': ['360px', '480px']}, {'prop': 'loading', 'type': 'boolean'}, {'prop': 'readonly', 'type': 'boolean'}, {'prop': 'formatSwitch', 'type': 'boolean'}, {'prop': 'searchable', 'type': 'boolean'}, {'prop': 'copyable', 'type': 'boolean'}, {'prop': 'downloadable', 'type': 'boolean'}, {'prop': 'validate', 'type': 'boolean'}, {'prop': 'label', 'type': 'text'}]"
    :initial="{'height': '360px', 'loading': false, 'readonly': false, 'formatSwitch': true, 'searchable': false, 'copyable': true, 'downloadable': false, 'validate': true, 'label': 'Files'}"
    :defaults="{'height': '480px', 'loading': false, 'readonly': false, 'formatSwitch': false, 'searchable': 'auto', 'copyable': true, 'downloadable': false, 'validate': true, 'label': 'Files'}"
    :extra="{'files': sampleFiles, 'class': 'w-full'}"
    extra-code='v-model:files="files"'
    :script="script"
    import-from="@/lib/editor"
  />
  <Callout type="note">
    It comes from the editor entry, <code class="prose-code">@appscode/design-system/editor</code>, like the Code Editor. See
    <RouterLink to="/components/code-editor#importing">Importing</RouterLink> for loading it on demand.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>
    <code class="prose-code">v-model:files</code> holds an array of <code class="prose-code">{ name, content }</code> objects; an edit replaces that file with
    a copy, so other fields such as a <code class="prose-code">gvr</code> are kept. <code class="prose-code">v-model:active</code> is the open file's name. When
    it's empty, the first file opens. <code class="prose-code">kind</code> and <code class="prose-code">description</code> show under the name.
  </p>
  <ComponentExample name="file-editor/FileEditorBasic" />

  <DocHeading id="file-fields" :level="3">File fields</DocHeading>
  <div class="mt-4 mb-8 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Field</th><th class="h-9 px-4 font-medium">Type</th><th class="h-9 px-4 font-medium">Description</th></tr>
      </thead>
      <tbody>
        <tr v-for="[field, type, text] in fields" :key="field" class="border-t border-border-light align-top first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ field }}</code></td>
          <td class="px-4 py-3"><code class="font-mono text-[12.5px] text-blue-20">{{ type }}</code></td>
          <td class="px-4 py-3">{{ text }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="review" :level="3">Reviewing before deploy</DocHeading>
  <p>
    Give each file a <code class="prose-code">schema</code> and every file is checked as you type, not only the open one.
    <code class="prose-code">@validate</code> sends each file's problems keyed by name; the list shows a count beside each file with problems. Here
    Deploy stays disabled until <code class="prose-code">demo-postgres.yaml</code> is fixed. <code class="prose-code">format-switch</code> adds a YAML / JSON
    switch; edits made in JSON are written back as YAML.
  </p>
  <ComponentExample name="file-editor/FileEditorReview" />
  <Callout type="warning">
    Converting rewrites the file, so YAML comments and quoting are lost once someone edits in the other format. Switching back and forth without editing
    changes nothing. Multi-document YAML can't be shown as JSON, so the JSON option is disabled for it, as it is while a file doesn't parse.
  </Callout>

  <DocHeading id="changes" :level="3">Changes</DocHeading>
  <p>
    Set <code class="prose-code">original</code> and changed files get a dot in the list, and the header an <strong>Edit / Changes</strong> switch.
    <code class="prose-code">v-model:view</code> keeps the same pane as people move between files. The <code class="prose-code">#actions</code> slot gets the
    open file, for buttons like Reset or Save.
  </p>
  <ComponentExample name="file-editor/FileEditorChanges" />

  <DocHeading id="secrets" :level="3">Secrets</DocHeading>
  <p>
    <code class="prose-code">secret</code> keeps a value out of the page until someone chooses <strong>Show value</strong>, and hides it again when they open
    another key. Secret values aren't searched. With <code class="prose-code">encoding: "base64"</code> you can pass a Secret's
    <code class="prose-code">data</code> as the API returns it: the editor shows the decoded text and writes base64 back, so
    <code class="prose-code">content</code> is ready to patch. A value that isn't UTF-8 text, such as a keystore, is shown as stored and can't be edited.
  </p>
  <ComponentExample name="file-editor/FileEditorSecrets" />

  <DocHeading id="download" :level="3">Download</DocHeading>
  <p><code class="prose-code">downloadable</code> adds a download button to the header. It saves the open file as shown, in YAML or JSON, under the file's name; a name without an extension gets <code class="prose-code">.yaml</code>, <code class="prose-code">.json</code> or <code class="prose-code">.txt</code>. The button is hidden while a secret is masked, and <code class="prose-code">@download</code> fires with the file.</p>
  <ComponentExample name="file-editor/FileEditorDownload" />

  <DocHeading id="search" :level="3">Many files</DocHeading>
  <p>
    Past 8 files the list gets a search box that matches names, kinds, descriptions and text; set <code class="prose-code">searchable</code> to always or never
    show it, or bind <code class="prose-code">v-model:search</code> to your own box. <code class="prose-code">readonly</code> makes every file read-only, as for
    a release's rendered templates.
  </p>
  <ComponentExample name="file-editor/FileEditorSearch" />

  <DocHeading id="states" :level="3">Loading and empty</DocHeading>
  <p>
    <code class="prose-code">loading</code> shows a skeleton list and editor. With no files it shows <code class="prose-code">empty-text</code>, or your own
    content in the <code class="prose-code">#empty</code> slot.
  </p>
  <ComponentExample name="file-editor/FileEditorStates" />

  <DocHeading id="narrow" :level="3">Narrow spaces</DocHeading>
  <p>
    When the editor is narrower than 672px, on a phone or in a side panel, the list becomes a select above the editor. It follows the editor's own width,
    not the window's.
  </p>
  <ComponentExample name="file-editor/FileEditorNarrow" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>
      The file list is a <code class="prose-code">role="listbox"</code> named by <code class="prose-code">label</code>. Selection follows focus: moving to a
      file opens it. Only the open file is in the Tab order, so Tab goes from the list straight to the editor.
    </li>
    <li>Each option's name includes whether the file changed and how many problems it has; the dot and count are not the only signal.</li>
    <li>The editor area is a region named after the open file. Inside it, the Code Editor's keys apply: Escape then Tab leaves the text.</li>
    <li>Show value moves focus into the revealed text, and Hide value moves it back to the Show value button.</li>
    <li>In the narrow layout the list is an <code class="prose-code">AcSelect</code>, with its keyboard support.</li>
  </ul>
  <div class="mt-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Keys</th><th class="h-9 px-4 font-medium">Action</th></tr>
      </thead>
      <tbody>
        <tr v-for="[combo, action] in keys" :key="action" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3 whitespace-nowrap"><AcKbd :keys="combo" /></td>
          <td class="px-4 py-3">{{ action }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="migration">Migrating</DocHeading>
  <p>
    <code class="prose-code">AcFileEditor</code> replaces the library's <code class="prose-code">ResourceKeyValueEditor</code>,
    <code class="prose-code">FilteredFileEditor</code> and <code class="prose-code">EditorTabs</code>, and the
    <code class="prose-code">MultiFileEditor</code> and <code class="prose-code">PreviewYamlEditor</code> copies kept in cluster-ui, kubedb-ui and ui-modules.
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

  <ApiTables component="AcFileEditor" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>
    The editor pane is a Code Editor, so its <RouterLink to="/components/code-editor#theme">tokens</RouterLink> apply. The list uses these classes. See
    <RouterLink to="/getting-started/theming">Theming</RouterLink>.
  </p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border shadow-xs</code></td><td class="px-4 py-3">Frame</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted border-border-light</code></td><td class="px-4 py-3">File list</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface ring-border shadow-xs</code></td><td class="px-4 py-3">Open file</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-primary</code></td><td class="px-4 py-3">Changed dot</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-red-40 / text-yellow-30</code></td><td class="px-4 py-3">Problem count: errors, warnings only</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">@container @2xl:</code></td><td class="px-4 py-3">Side-by-side layout from 672px wide</td></tr>
      </tbody>
    </table>
  </div>
</template>
