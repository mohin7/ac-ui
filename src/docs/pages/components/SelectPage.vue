<script setup lang="ts">
import { AcSelect } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst storageClass = ref(\"gp3\");\nconst options = [\n  { value: \"standard\", label: \"standard\", description: \"HDD, default class\" },\n  { value: \"gp3\", label: \"gp3\", description: \"SSD, 3000 IOPS\" },\n  { value: \"io2\", label: \"io2\", description: \"Provisioned IOPS\" },\n];";

const dos = ["Label the field with the thing chosen: “Namespace”, “Storage Class”.", "Turn on `searchable` for lists longer than about 8 items.", "Pre-select a sensible default when there is one."];
const donts = ["Don't use a select for 2–5 options people should compare — use CheckRadio.", "Don't put actions (“Create new…”) in the option list; place a button next to the field.", "Don't disable a select without saying why nearby."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a select to pick from a list of known values: versions, namespaces, storage classes, machine types. It supports search, groups, multiple values, async options and a refresh button. For two to five options that should all be visible, use CheckRadio instead.</p>
  <ComponentPlayground
    tag="AcSelect"
    :component="AcSelect"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'size', 'type': 'select', 'options': ['compact', 'small', 'normal']}, {'prop': 'searchable', 'type': 'boolean'}, {'prop': 'clearable', 'type': 'boolean'}, {'prop': 'loading', 'type': 'boolean'}, {'prop': 'refreshable', 'type': 'boolean'}, {'prop': 'required', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'errorMsg', 'type': 'text'}]"
    :initial="{'label': 'Storage Class', 'size': 'small', 'searchable': false, 'clearable': true, 'loading': false, 'refreshable': false, 'required': false, 'disabled': false, 'errorMsg': ''}"
    :defaults="{'label': '', 'size': 'small', 'searchable': false, 'clearable': false, 'loading': false, 'refreshable': false, 'required': false, 'disabled': false, 'errorMsg': ''}"
    :extra="{'modelValue': 'gp3', 'options': [{'value': 'standard', 'label': 'standard', 'description': 'HDD, default class'}, {'value': 'gp3', 'label': 'gp3', 'description': 'SSD, 3000 IOPS'}, {'value': 'io2', 'label': 'io2', 'description': 'Provisioned IOPS'}]}"
    extra-code='v-model="storageClass" :options="options"'
    :script="script"
  />
  <Callout type="tip">The list is attached to <code class="prose-code">&lt;body&gt;</code> and positioned under the field, so it's never clipped by a modal or a scrolling container. It opens upward when there isn't room below.</Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p><code class="prose-code">v-model</code> holds the selected <code class="prose-code">value</code>. Options can be <code class="prose-code">disabled</code>.</p>
  <ComponentExample name="select/SelectBasic" />
  <DocHeading id="searchable" :level="3">Searchable and clearable</DocHeading>
  <p><code class="prose-code">searchable</code> adds a search box — use it once a list passes about 8 items. <code class="prose-code">clearable</code> adds an ✕ to reset.</p>
  <ComponentExample name="select/SelectSearchable" />
  <DocHeading id="multiple" :level="3">Multiple</DocHeading>
  <p><code class="prose-code">multiple</code> makes <code class="prose-code">v-model</code> an array and shows the choices as removable chips. Backspace removes the last chip.</p>
  <ComponentExample name="select/SelectMultiple" />
  <DocHeading id="creatable" :level="3">Creatable</DocHeading>
  <p>With <code class="prose-code">searchable</code>, <code class="prose-code">creatable</code> lets people add a value that isn't in the list, such as a custom role or label. Text that matches no option adds an "Add “text”" row at the end of the list; click it or press Enter to take it. The text becomes the value in <code class="prose-code">v-model</code> and <code class="prose-code">@create</code> fires, so you can save it. Change the row's wording with <code class="prose-code">create-text</code>. Use it with string values.</p>
  <ComponentExample name="select/SelectCreatable" />
  <DocHeading id="objects" :level="3">Object values</DocHeading>
  <p>Option values can be objects, such as a cluster or a user, so <code class="prose-code">v-model</code> hands back the whole record. Tell the select how to match them with <code class="prose-code">by</code>: a property name (<code class="prose-code">by="id"</code>) or a function <code class="prose-code">(a, b) =&gt; boolean</code>. Without it, values are compared with <code class="prose-code">===</code>, which fits strings and numbers but not objects that were fetched again. <code class="prose-code">creatable</code> still needs string values.</p>
  <ComponentExample name="select/SelectObjects" />

  <DocHeading id="groups" :level="3">Groups and descriptions</DocHeading>
  <p>Give options a <code class="prose-code">group</code> to list them under headings, and a <code class="prose-code">description</code> for a second line.</p>
  <ComponentExample name="select/SelectGrouped" />
  <DocHeading id="states" :level="3">Loading, refresh, error, disabled</DocHeading>
  <p><code class="prose-code">refreshable</code> shows a refresh button that emits <code class="prose-code">refresh</code>; set <code class="prose-code">loading</code> while you reload.</p>
  <ComponentExample name="select/SelectStates" />
  <DocHeading id="async" :level="3">Async search</DocHeading>
  <p>With <code class="prose-code">searchable</code>, the <code class="prose-code">search</code> event fires as people type, so you can fetch matching options from an API.</p>
  <ComponentExample name="select/SelectAsync" />
  <DocHeading id="custom-option" :level="3">Custom option</DocHeading>
  <p>The <code class="prose-code">option</code> slot renders each row — here with a status badge.</p>
  <ComponentExample name="select/SelectCustomOption" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The field is a <code class="prose-code">role="combobox"</code> linked to a <code class="prose-code">role="listbox"</code> with <code class="prose-code">aria-expanded</code>, <code class="prose-code">aria-controls</code> and <code class="prose-code">aria-activedescendant</code>.</li>
    <li>Keyboard: Enter, Space or ↓ opens; ↑ ↓ Home End move; Enter selects, or adds the typed text with <code class="prose-code">creatable</code>; Esc closes; typing jumps to a matching option when there's no search box.</li>
    <li>In <code class="prose-code">multiple</code> mode the listbox is <code class="prose-code">aria-multiselectable</code> and each chip has a labelled remove button.</li>
  </ul>

  <ApiTables component="AcSelect" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-6 border-border shadow-xs</code></td><td class="px-4 py-3">Field</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">focus-ring</code></td><td class="px-4 py-3">Open / focused</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-8 shadow-lg</code></td><td class="px-4 py-3">List panel</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted</code></td><td class="px-4 py-3">Highlighted option</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-surface-sunken ring-border</code></td><td class="px-4 py-3">Chip in multiple mode</td></tr>
      </tbody>
    </table>
  </div>
</template>
