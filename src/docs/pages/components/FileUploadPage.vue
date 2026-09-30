<script setup lang="ts">
import { AcFileUpload } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = 'import { ref } from "vue";\n\nconst files = ref<File[]>([]);';

const dos = [
  "Set `accept` and `max-size` so wrong files are caught before upload, with a clear message.",
  "Say what the file is in the label: “Kubeconfig”, “TLS certificates”, “Service account key”.",
  "Use the `small` variant in dense forms where a drop zone would dominate.",
];
const donts = [
  "Don't rely on the file check alone — validate the contents on the server too.",
  "Don't use a file upload for short text people can paste; a Textarea is quicker.",
  "Don't clear chosen files when another field fails validation.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a file upload when people need to hand over a file: a kubeconfig, certificates, a license or a service-account key. It checks type and size as files arrive and lists what was chosen, each with a remove button.</p>
  <ComponentPlayground
    tag="AcFileUpload"
    :component="AcFileUpload"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'accept', 'type': 'text'}, {'prop': 'multiple', 'type': 'boolean'}, {'prop': 'small', 'type': 'boolean'}, {'prop': 'required', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'errorMsg', 'type': 'text'}]"
    :initial="{'label': 'Kubeconfig', 'accept': '.yaml,.yml', 'multiple': false, 'small': false, 'required': false, 'disabled': false, 'errorMsg': ''}"
    :defaults="{'label': '', 'accept': '', 'multiple': false, 'small': false, 'required': false, 'disabled': false, 'errorMsg': ''}"
    :extra="{'modelValue': [], 'maxSize': 1048576, 'class': 'max-w-120'}"
    extra-code='v-model="files" :max-size="1024 * 1024"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Drop zone</DocHeading>
  <p>Drop a file on the zone or use <strong>Browse files</strong>. <code class="prose-code">v-model</code> is always a <code class="prose-code">File[]</code>; without <code class="prose-code">multiple</code> a new file replaces the old one. The line under the prompt is built from <code class="prose-code">accept</code> and <code class="prose-code">max-size</code> unless you pass <code class="prose-code">description</code>.</p>
  <ComponentExample name="file-upload/FileUploadBasic" />
  <DocHeading id="multiple" :level="3">Multiple files and validation</DocHeading>
  <p>With <code class="prose-code">multiple</code>, new files are added to the list and duplicates are skipped. Files that fail <code class="prose-code">accept</code> or <code class="prose-code">max-size</code> are left out, explained under the zone and emitted with <code class="prose-code">reject</code>. Try dropping a large file or a <code class="prose-code">.png</code>.</p>
  <ComponentExample name="file-upload/FileUploadMultiple" />
  <DocHeading id="small" :level="3">Small</DocHeading>
  <p><code class="prose-code">small</code> is a 36px single-line field that lines up with Input and Select. It still accepts drops.</p>
  <ComponentExample name="file-upload/FileUploadSmall" />
  <DocHeading id="states" :level="3">Error and disabled</DocHeading>
  <p><code class="prose-code">error-msg</code> shows an error from your own checks or the server. It takes priority over the type and size messages.</p>
  <ComponentExample name="file-upload/FileUploadStates" />
  <Callout type="note">The component doesn't upload anything. Read the files from <code class="prose-code">v-model</code> and send them with your API client, for example as <code class="prose-code">FormData</code>.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>Dragging is optional: the <strong>Browse files</strong> (or <strong>Choose file</strong>) button opens the native picker with Enter or Space, and is named after the label.</li>
    <li>Each file has a labelled remove button (“Remove tls.key”). After removing, focus moves to the next file, or back to the browse button.</li>
    <li>Added, removed and rejected files are announced through a polite live region. Errors are linked to the button with <code class="prose-code">aria-describedby</code>.</li>
  </ul>

  <ApiTables component="AcFileUpload" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-dashed border-border-dark</code></td><td class="px-4 py-3">Drop zone</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-primary bg-primary-97</code></td><td class="px-4 py-3">Zone while a file is dragged over it</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-8 divide-border-light</code></td><td class="px-4 py-3">File list</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 h-9 shadow-xs</code></td><td class="px-4 py-3"><code class="prose-code">small</code> field</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-red-60 text-red-30</code></td><td class="px-4 py-3">Error</td></tr>
      </tbody>
    </table>
  </div>
</template>
