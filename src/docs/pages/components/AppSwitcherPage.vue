<script setup lang="ts">
import { AcAppSwitcher } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Put it in the navbar's actions, just before the user menu.",
  "Pass the same `currentApp`, `baseUrl` and org props as the old Appdrawer, so URLs keep working across hosted, self-hosted and dev setups.",
  "Use `apps` for a product list outside the AppsCode console family, with a logo per product.",
];
const donts = [
  "Don't put in-app navigation here — it's only for jumping between products.",
  "Don't load app icons from a CDN on offline installers; the built-in list uses bundled icons for that reason.",
  "Don't show more than about nine apps; three rows is the comfortable limit.",
];
const rows = [
  ["size-8 rounded-6 hover:bg-surface-sunken", "Grid button (AcNavbarItem)"],
  ["rounded-10 border-border bg-surface shadow-lg", "Panel"],
  ["rounded-8 hover:bg-surface-muted", "App tile"],
  ["bg-primary-97", "Current app tile"],
  ["size-10 rounded-10 bg-{color}-95 text-{color}-40", "Icon tile"],
  ["bg-primary text-white", "Current-app check"],
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The app switcher is the grid button in the navbar that moves people between AppsCode products: Platform, Console, KubeDB, Grafana, Observe, SelfHost,
    Billing and Learn. It builds each URL the same way the old <code class="prose-code">Appdrawer</code> did and marks the app you're in.
  </p>
  <ComponentPlayground
    tag="AcAppSwitcher"
    :component="AcAppSwitcher"
    :controls="[
      { prop: 'currentApp', type: 'select', options: ['platform', 'console', 'db', 'grafana', 'observe', 'selfhost', 'billing', 'learn'] },
      { prop: 'baseUrl', type: 'select', options: ['https://appscode.com', 'https://ace.example.internal', 'http://localhost:5990', 'http://bb.test:8080'] },
      { prop: 'activeOrgType', type: 'select', options: [0, 3, 6] },
      { prop: 'isOfflineInstaller', type: 'boolean' },
      { prop: 'hideCurrent', type: 'boolean' },
      { prop: 'align', type: 'select', options: ['start', 'end'] },
    ]"
    :initial="{ currentApp: 'db', baseUrl: 'https://appscode.com', activeOrgType: 0, isOfflineInstaller: false, hideCurrent: false, align: 'start' }"
    :defaults="{ currentApp: 'platform', baseUrl: 'https://appscode.com', activeOrgType: 0, isOfflineInstaller: false, hideCurrent: false, align: 'end' }"
  />
  <Callout type="note">
    URLs: on <code class="prose-code">localhost</code> or <code class="prose-code">bb.test</code> each app opens on its dev port (<code class="prose-code">http://localhost:5996/db/</code>);
    anywhere else it's <code class="prose-code">${baseUrl}/${name}/</code>. Clicking Grafana writes the <code class="prose-code">gorg</code> cookie on
    <code class="prose-code">rootDomain</code>, as before.
  </Callout>

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="navbar" :level="3">In the navbar</DocHeading>
  <p>Place it with the other icon actions. The panel lines up with the button's right edge and flips up when there's no room below.</p>
  <ComponentExample name="app-switcher/AppSwitcherBasic" />
  <DocHeading id="self-hosted" :level="3">Self-hosted and offline installers</DocHeading>
  <p>
    Any <code class="prose-code">baseUrl</code> other than appscode.com, appscode.ninja or bb.test counts as self-hosted, which hides Billing, SelfHost and Learn.
    With <code class="prose-code">is-offline-installer</code> and org type <code class="prose-code">6</code>, Billing stays. Org type <code class="prose-code">3</code> has no Console.
  </p>
  <ComponentExample name="app-switcher/AppSwitcherSelfHosted" />
  <DocHeading id="custom" :level="3">Custom apps and logos</DocHeading>
  <p>
    <code class="prose-code">apps</code> replaces the built-in list. Give each app an <code class="prose-code">iconUrl</code> (a product logo) or a Lucide
    <code class="prose-code">icon</code> with a <code class="prose-code">color</code>. The <code class="prose-code">footer</code> slot adds a link under the grid.
  </p>
  <ComponentExample name="app-switcher/AppSwitcherCustom" />

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li>The button has an accessible name (<code class="prose-code">label</code>), <code class="prose-code">aria-haspopup="dialog"</code> and <code class="prose-code">aria-expanded</code>.</li>
    <li>The panel is a non-modal <code class="prose-code">role="dialog"</code> labelled by its heading. Focus moves to the current app when it opens.</li>
    <li>Keyboard: ↓ on the button opens it; arrow keys move around the grid, Home and End jump to the ends; Tab out of the panel or Esc closes it and returns focus to the button.</li>
    <li>The current app has <code class="prose-code">aria-current="page"</code>; each tile's subtitle is read with its name.</li>
  </ul>

  <ApiTables component="AcAppSwitcher" />

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
