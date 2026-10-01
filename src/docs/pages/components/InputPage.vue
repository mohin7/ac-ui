<script setup lang="ts">
import { AcInput } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const script = "import { ref } from \"vue\";\n\nconst value = ref(\"\");";

const dos = ["Use short Title Case labels: “Database Name”, “Namespace”.", "Put format rules in `hint`, not in the label.", "Show one clear error message per field.", "Use a suffix for a fixed unit (`Gi`, `%`) so people type only the number."];
const donts = ["Don't use the label as instructions.", "Don't disable a field without saying why.", "Don't show errors before the user has typed or submitted.", "Don't attach more than one button; move extra actions next to the field."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an input for single-line text, numbers, emails and passwords. The label floats above the value, so no separate placeholder is needed.</p>
  <ComponentPlayground
    tag="AcInput"
    :component="AcInput"
    :controls="[{'prop': 'label', 'type': 'text'}, {'prop': 'type', 'type': 'select', 'options': ['text', 'password', 'email', 'number', 'url', 'search']}, {'prop': 'size', 'type': 'select', 'options': ['small', 'normal']}, {'prop': 'required', 'type': 'boolean'}, {'prop': 'disabled', 'type': 'boolean'}, {'prop': 'readonly', 'type': 'boolean'}, {'prop': 'hint', 'type': 'text'}, {'prop': 'errorMsg', 'type': 'text'}]"
    :initial="{'label': 'Database Name', 'type': 'text', 'size': 'small', 'required': false, 'disabled': false, 'readonly': false, 'hint': '', 'errorMsg': ''}"
    :defaults="{'type': 'text', 'size': 'small', 'required': false, 'disabled': false, 'readonly': false, 'hint': '', 'errorMsg': ''}"
    :extra="{'modelValue':''}"
    extra-code='v-model="value"'
    :script="script"
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>Bind with <code class="prose-code">v-model</code>.</p>
  <ComponentExample name="input/InputBasic" />
  <DocHeading id="types" :level="3">Types</DocHeading>
  <p><code class="prose-code">type="password"</code> adds a show/hide toggle. Numbers bind as numbers.</p>
  <ComponentExample name="input/InputTypes" />
  <DocHeading id="hint" :level="3">Hint and required</DocHeading>
  <p><code class="prose-code">hint</code> explains the format; <code class="prose-code">required</code> adds a red asterisk.</p>
  <ComponentExample name="input/InputHint" />
  <DocHeading id="error" :level="3">Error</DocHeading>
  <p>Pass <code class="prose-code">error-msg</code> to show a validation error. Validate on blur or submit, not on every key.</p>
  <ComponentExample name="input/InputError" />
  <DocHeading id="states" :level="3">Read-only and disabled</DocHeading>
  <p>Use <code class="prose-code">readonly</code> for values people can see and copy but not change.</p>
  <ComponentExample name="input/InputStates" />
  <DocHeading id="sizes" :level="3">Size</DocHeading>
  <p><code class="prose-code">small</code> (36px) is the default in forms; <code class="prose-code">normal</code> (44px) for spacious layouts.</p>
  <ComponentExample name="input/InputSizes" />
  <DocHeading id="prefix-suffix" :level="3">Prefix and suffix</DocHeading>
  <p>
    The <code class="prose-code">#prefix</code> and <code class="prose-code">#suffix</code> slots put fixed text or a
    16px icon inside the field. With a prefix, the label stays raised so it never covers the prefix.
  </p>
  <ComponentExample name="input/InputPrefixSuffix" />
  <DocHeading id="addon" :level="3">Attached button</DocHeading>
  <p>
    <code class="prose-code">addon-label</code> attaches a button to the right edge that emits
    <code class="prose-code">addon</code>: Generate, Copy, Browse. Add <code class="prose-code">addon-icon</code> for an
    icon and <code class="prose-code">addon-icon-only</code> to hide the text. The button stays active on read-only
    fields, so Copy works there.
  </p>
  <ComponentExample name="input/InputAddon" />
  <DocHeading id="form" :level="3">In a form</DocHeading>
  <p>A complete form with validation on submit.</p>
  <ComponentExample name="input/InputForm" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The label is a real <code class="prose-code">&lt;label for&gt;</code>, so clicking it focuses the input.</li>
    <li><code class="prose-code">error-msg</code> sets <code class="prose-code">aria-invalid</code> and links the message with <code class="prose-code">aria-describedby</code>.</li>
    <li>The password toggle is a button with an <code class="prose-code">aria-label</code>.</li>
    <li>Prefix and suffix content is not part of the accessible name. If the unit matters, say it in the label or hint too.</li>
    <li>The attached button is a real <code class="prose-code">&lt;button&gt;</code> after the input in tab order. With <code class="prose-code">addon-icon-only</code>, <code class="prose-code">addon-label</code> becomes its <code class="prose-code">aria-label</code>.</li>
  </ul>

  <ApiTables component="AcInput" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-border / focus-within:focus-ring</code></td><td class="px-4 py-3">Resting / focused edge (primary border + soft halo)</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-red-60 text-red-30</code></td><td class="px-4 py-3">Error</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">read-only:bg-surface-muted</code></td><td class="px-4 py-3">Read-only</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">h-9 rounded-6 text-base</code></td><td class="px-4 py-3">Small size</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">text-muted [&amp;_svg]:size-4</code></td><td class="px-4 py-3">Prefix and suffix</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">bg-surface-muted border-border rounded-r-6</code></td><td class="px-4 py-3">Attached button</td></tr>
      </tbody>
    </table>
  </div>
</template>
