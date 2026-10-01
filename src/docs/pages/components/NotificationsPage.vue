<script setup lang="ts">
import { AcNotificationMenu } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const now = Date.now();
const notifications = [
  { id: 1, time: now - 120_000, title: "Backup failed", msg: "demo-postgres · BackupSession hit the 2h timeout.", status: "Failed" },
  { id: 2, time: now - 540_000, title: "Upgrading orders-mongo", msg: "MongoDB 6.0.12 → 7.0.5 in namespace shop.", status: "Running" },
  { id: 3, time: now - 2_820_000, title: "Restore complete", msg: "billing-pg restored from last night's snapshot.", status: "Success", read: true },
];
const script =
  'const notifications = [\n  { id: 1, time: Date.now() - 120_000, title: "Backup failed", msg: "demo-postgres · BackupSession hit the 2h timeout.", status: "Failed" },\n  // …\n];';
const dos = [
  "Keep it to recent events (the last 20 or so) and link to a full page with `view-all-href`.",
  "Give each event a `status` so it gets the right icon and a status word, not just a colour.",
  "Set `read: true` on items when people open them or press Mark all as read.",
];
const donts = [
  "Don't use it for confirmations of what someone just did — that's a toast.",
  "Don't shake or pulse the bell for every new event.",
  "Don't put actions such as Retry inside rows; open the resource instead.",
];
const rows = [
  ["bg-danger text-white ring-surface", "Unread count on the bell"],
  ["rounded-10 border-border bg-surface shadow-lg", "Panel"],
  ["bg-primary-97", "Unread row"],
  ["bg-primary", "Unread dot"],
  ["bg-{green|red|yellow|blue}-95 text-{…}-40", "Status icon tile"],
  ["divide-border-light", "Row separators"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The notification menu is the bell in the navbar. It shows how many events are unread and opens a panel of recent ones — backups, upgrades, ops requests —
    each with its status, message and how long ago it happened.
  </p>
  <ComponentPlayground
    tag="AcNotificationMenu"
    :component="AcNotificationMenu"
    :controls="[
      { prop: 'loading', type: 'boolean' },
      { prop: 'label', type: 'text' },
      { prop: 'viewAllHref', type: 'text' },
      { prop: 'align', type: 'select', options: ['start', 'end'] },
    ]"
    :initial="{ loading: false, label: 'Notifications', viewAllHref: '/notifications', align: 'start' }"
    :defaults="{ loading: false, label: 'Notifications', viewAllHref: '', align: 'end' }"
    :extra="{ notifications }"
    extra-code=':notifications="notifications"'
    :script="script"
  />
  <Callout type="note">
    The count on the bell is the number of items without <code class="prose-code">read: true</code>. Pass <code class="prose-code">unread-count</code> to keep your own
    count, as the old NATS listener did.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="basic" :level="3">Basic</DocHeading>
  <p>
    Clicking a row emits <code class="prose-code">select</code>; give it <code class="prose-code">href</code> or <code class="prose-code">to</code> to make it a link.
    <code class="prose-code">mark-all-read</code> fires from the header button. Times update while the panel is open; hover one for the exact date.
  </p>
  <ComponentExample name="notifications/NotificationsBasic" />
  <DocHeading id="live" :level="3">Live events</DocHeading>
  <p>
    Events from NATS arrive as <code class="prose-code">{ msg, status }</code>. Bind <code class="prose-code">v-model:open</code> to clear your count when the panel opens,
    in place of the old <code class="prose-code">isActive</code> event.
  </p>
  <ComponentExample name="notifications/NotificationsLive" />
  <DocHeading id="states" :level="3">Empty and loading</DocHeading>
  <p>Open each bell to see the empty state and the skeleton rows. Counts above 999 read <code class="prose-code">999+</code>.</p>
  <ComponentExample name="notifications/NotificationsStates" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The bell's name includes the count, e.g. “Notifications (3)”; it has <code class="prose-code">aria-haspopup="dialog"</code> and <code class="prose-code">aria-expanded</code>.</li>
    <li>The panel is a non-modal <code class="prose-code">role="dialog"</code> labelled by its heading. Focus moves to the first event when it opens.</li>
    <li>Keyboard: ↓ on the bell opens it; ↑ ↓ Home End move between events; Tab reaches Mark all as read and View all; Esc closes and returns focus to the bell.</li>
    <li>Unread rows say “(unread)” to screen readers; times are <code class="prose-code">&lt;time&gt;</code> elements with the full date.</li>
  </ul>

  <ApiTables component="AcNotificationMenu" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr v-for="[c, u] in rows" :key="c" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3"><code class="prose-code">{{ c }}</code></td>
          <td class="px-4 py-3">{{ u }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
