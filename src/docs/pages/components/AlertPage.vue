<script setup lang="ts">
import { AcAlert } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = ["Say what happened and what to do next.", "Write in sentence case with at most one exclamation mark.", "Put the alert near what it's about — top of the page or form."];
const donts = ["Don't use an alert for transient success feedback after a click; use a toast.", "Don't stack more than two or three alerts.", "Don't write “Oops!!” — be specific."];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use an alert for page- or form-level messages that stay until the situation changes: quota warnings, failed connections, read-only mode.</p>
  <ComponentPlayground
    tag="AcAlert"
    :component="AcAlert"
    :controls="[{'prop': 'color', 'type': 'select', 'options': ['primary', 'info', 'success', 'warning', 'danger', 'neutral']}, {'prop': 'title', 'type': 'text'}, {'prop': 'dismissible', 'type': 'boolean'}]"
    :initial="{'color': 'warning', 'title': '', 'dismissible': false}"
    :defaults="{'color': 'info', 'title': '', 'dismissible': false}"
    slot-text="You have used 90% of your monthly quota."
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="color" :level="3">Color</DocHeading>
  <p>Pick the colour from the message's meaning.</p>
  <ComponentExample name="alert/AlertColors" />
  <DocHeading id="title" :level="3">Title</DocHeading>
  <p>Add a <code class="prose-code">title</code> when the message needs a headline and a detail line.</p>
  <ComponentExample name="alert/AlertTitle" />
  <DocHeading id="dismissible" :level="3">Dismissible</DocHeading>
  <p><code class="prose-code">dismissible</code> shows a close button that emits <code class="prose-code">close</code>. You control visibility.</p>
  <ComponentExample name="alert/AlertDismissible" />
  <DocHeading id="link" :level="3">With a link</DocHeading>
  <p>Links inside the message are underlined in primary. Link to the fix.</p>
  <ComponentExample name="alert/AlertLink" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li><code class="prose-code">danger</code> and <code class="prose-code">warning</code> use <code class="prose-code">role="alert"</code> (announced immediately); others use <code class="prose-code">role="status"</code>.</li>
    <li>The icon is decorative; the text carries the meaning.</li>
    <li>The close button has <code class="prose-code">aria-label="Dismiss"</code>.</li>
  </ul>

  <ApiTables component="AcAlert" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-white shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-yellow-80 bg-yellow-97 text-yellow-20</code></td><td class="px-4 py-3">Warning</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">border-red-90 bg-red-97 text-red-20</code></td><td class="px-4 py-3">Danger</td></tr>
        <tr class="border-t border-border-light"><td class="px-4 py-3"><code class="prose-code">rounded-10 px-4 py-3</code></td><td class="px-4 py-3">Shape and padding</td></tr>
      </tbody>
    </table>
  </div>
</template>
