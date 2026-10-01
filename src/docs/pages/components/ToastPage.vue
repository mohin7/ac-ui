<script setup lang="ts">
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";
import setup from "../../snippets/toast/setup.txt?raw";
import usage from "../../snippets/toast/usage.txt?raw";

const api = `const { toast, success, error, warning, info, dismiss, clear } = useToast();

// every call: (title: string, options?: ToastOptions) => id: string
interface ToastOptions {
  description?: string;   // second line
  duration?: number;      // ms, default 5000; 0 stays until dismissed
  action?: { label: string; onClick: () => void }; // one button; clicking it also closes the toast
  dismissible?: boolean;  // close button, default true
  id?: string;            // reuse an id to replace a toast in place
}

dismiss(id);  // close one
clear();      // close all`;

const migration = `// before: vue-toastification through the app's useToaster()
toast.success("Success: Database created", { timeout: 2000 });
toast.error(parse(err), { timeout: 10000 });

// after
const { success, error } = useToast();
success("Database created", { duration: 2000 });
error(parse(err), { duration: 10000 });`;

const dos = [
  "Confirm an action that finished in the background: “Backup complete”, “Database created”.",
  "Offer Undo through `action` instead of a confirmation dialog for reversible actions.",
  "Keep the title short; put the detail in `description`.",
  "Use `duration: 0` for errors people need to read or act on.",
];
const donts = [
  "Don't use a toast for errors in a form — show them next to the field.",
  "Don't put the only copy of important information in a toast; it disappears.",
  "Don't raise several toasts for one action; update one with the same `id`.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    Use a toast to confirm something that happened — a save, a deletion, a finished backup — without interrupting people. Raise it from any component or
    module with <code class="prose-code">useToast()</code>.
  </p>
  <ComponentExample name="toast/ToastBasic" center />

  <DocHeading id="setup" :level="3">Setup</DocHeading>
  <p>
    Mount <code class="prose-code">&lt;AcToaster /&gt;</code> once, in the app root. The queue lives at module level, so every
    <code class="prose-code">useToast()</code> call in the app, including in plain <code class="prose-code">.ts</code> files, shares it.
  </p>
  <div class="my-4 space-y-3">
    <CodeBlock :code="setup" lang="vue" filename="App.vue" />
    <CodeBlock :code="usage" lang="ts" filename="useCreateDatabase.ts" />
  </div>
  <Callout type="note">
    Toasts stack in the bottom-right corner, newest nearest the edge. On phones (under 640px) they span the screen width at the bottom, at most three at a time, where they
    don't cover the page header and are in thumb reach. Change the corner with <code class="prose-code">position</code>.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="action" :level="3">Action and persistent toasts</DocHeading>
  <p>
    <code class="prose-code">action</code> adds one button, such as Undo. <code class="prose-code">duration: 0</code> keeps the toast until it's dismissed.
    Hovering or focusing the stack pauses every timer.
  </p>
  <ComponentExample name="toast/ToastAction" />
  <DocHeading id="update" :level="3">Updating a toast</DocHeading>
  <p>
    Every call returns an id. Pass it back as <code class="prose-code">{ id }</code> to replace that toast in place — here a progress message becomes the
    result — or to <code class="prose-code">dismiss(id)</code> it.
  </p>
  <ComponentExample name="toast/ToastUpdate" center />

  <DocHeading id="api-reference" :level="3">useToast()</DocHeading>
  <div class="my-4"><CodeBlock :code="api" lang="ts" /></div>

  <DocHeading id="migration" :level="3">Migrating</DocHeading>
  <p>
    The old apps raised toasts with vue-toastification behind a <code class="prose-code">useToaster()</code> composable, and showed inline messages with
    <code class="prose-code">AlertBox</code>. Replace the plugin with <code class="prose-code">&lt;AcToaster /&gt;</code> in the root and call
    <code class="prose-code">useToast()</code>: <code class="prose-code">timeout</code> becomes <code class="prose-code">duration</code> and
    <code class="prose-code">toast.clear()</code> becomes <code class="prose-code">clear()</code>. Inline, persistent messages move to
    <RouterLink to="/components/alert">Alert</RouterLink>.
  </p>
  <div class="my-4"><CodeBlock :code="migration" lang="ts" /></div>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>
      Each new toast is read out once through live regions that are always on the page: <code class="prose-code">aria-live="polite"</code> for most, and
      <code class="prose-code">assertive</code> for <code class="prose-code">error()</code>.
    </li>
    <li>The stack is a labelled region (“Notifications”). Action and close buttons are in the Tab order and every close button names its toast.</li>
    <li>Timers pause while the pointer or keyboard focus is in the stack, so there's time to read and act (WCAG 2.2.1).</li>
    <li>Toasts slide in with motion only when <code class="prose-code">prefers-reduced-motion</code> allows; otherwise they fade.</li>
  </ul>

  <ApiTables component="AcToaster" heading="Toaster API" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">rounded-10 border-border bg-surface shadow-lg</code></td><td class="px-4 py-3">Toast</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-success text-danger text-warning text-info</code></td><td class="px-4 py-3">Status icon</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">text-heading · text-muted</code></td><td class="px-4 py-3">Title · description</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">fixed z-[100] sm:w-89 gap-2</code></td><td class="px-4 py-3">Stack</td></tr>
      </tbody>
    </table>
  </div>
</template>
