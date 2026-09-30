<script setup lang="ts">
import { AcBanner } from "@/lib";
import ApiTables from "../../components/ApiTables.vue";
import Callout from "../../components/Callout.vue";
import ComponentExample from "../../components/ComponentExample.vue";
import ComponentPlayground from "../../components/ComponentPlayground.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";

const dos = [
  "Use a banner for news or a condition that affects the whole app: maintenance, an expiring license, a new release.",
  "Keep it to one sentence and at most one action.",
  "Let people dismiss announcements, and remember that they did.",
];
const donts = [
  "Don't stack more than one banner; show the most important.",
  "Don't use a banner for feedback on one action — use a Toast — or for a message about one section — use an Alert.",
  "Don't make danger or warning banners dismissible while the problem is still there.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>Use a banner for a full-width announcement at the top of the app or a page: a release, scheduled maintenance, an expiring trial or a lost connection. For a message about one part of a page, use an <RouterLink to="/components/alert">Alert</RouterLink>.</p>
  <ComponentPlayground
    tag="AcBanner"
    :component="AcBanner"
    :controls="[{'prop': 'color', 'type': 'select', 'options': ['info', 'warning', 'danger', 'primary', 'neutral']}, {'prop': 'variant', 'type': 'select', 'options': ['subtle', 'solid']}, {'prop': 'title', 'type': 'text'}, {'prop': 'actionLabel', 'type': 'text'}, {'prop': 'hideIcon', 'type': 'boolean'}]"
    :initial="{'color': 'info', 'variant': 'subtle', 'title': 'Scheduled maintenance', 'actionLabel': 'Details', 'hideIcon': false}"
    :defaults="{'color': 'info', 'variant': 'subtle', 'title': '', 'actionLabel': '', 'hideIcon': false}"
    :extra="{'class': 'rounded-10 border'}"
    slot-text="The console is read-only on Oct 4, 01:00–02:00 UTC."
  />

  <DocHeading id="examples">Examples</DocHeading>
  <DocHeading id="colors" :level="3">Colors</DocHeading>
  <p><code class="prose-code">info</code> for news, <code class="prose-code">warning</code> for something coming up, <code class="prose-code">danger</code> for something broken now, <code class="prose-code">primary</code> for product announcements and <code class="prose-code">neutral</code> for context like “viewing as guest”. <code class="prose-code">title</code> adds a bold lead-in.</p>
  <ComponentExample name="banner/BannerColors" />
  <DocHeading id="solid" :level="3">Solid, with an action</DocHeading>
  <p><code class="prose-code">variant="solid"</code> is a full-colour strip for the top of the app. <code class="prose-code">action-label</code> with <code class="prose-code">action-href</code> renders a link; without the href it's a button that emits <code class="prose-code">action</code>.</p>
  <ComponentExample name="banner/BannerSolid" />
  <DocHeading id="dismissible" :level="3">Dismissible and custom action</DocHeading>
  <p><code class="prose-code">dismissible</code> adds a close button that sets <code class="prose-code">v-model:open</code> to <code class="prose-code">false</code> and emits <code class="prose-code">close</code>. The <code class="prose-code">action</code> slot takes your own button.</p>
  <ComponentExample name="banner/BannerDismissible" />
  <Callout type="note">The old <code class="prose-code">Banner</code> was mostly used as a centred error block (“Database List Error”). Use <RouterLink to="/components/empty-state">Empty State</RouterLink> with <code class="prose-code">variant="error"</code> for those.</Callout>

  <DocHeading id="guidelines">Guidelines</DocHeading>
  <DoDont :dos="dos" :donts="donts" />

  <DocHeading id="accessibility">Accessibility</DocHeading>
  <ul>
    <li><code class="prose-code">danger</code> and <code class="prose-code">warning</code> banners are <code class="prose-code">role="alert"</code> so they're announced right away; the rest are <code class="prose-code">role="status"</code>.</li>
    <li>The close button is labelled “Dismiss”. The icon is decorative; the colour is never the only signal, so write the message to stand on its own.</li>
    <li>Solid banners use white (or dark on yellow) text on the full-strength status colour for at least 4.5:1 contrast.</li>
  </ul>

  <ApiTables component="AcBanner" />

  <DocHeading id="theme">Theme</DocHeading>
  <p>The Tailwind classes this component uses, all from the AppsCode theme. See <RouterLink to="/getting-started/theming">Theming</RouterLink>.</p>
  <div class="overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Classes</th><th class="h-9 px-4 font-medium">Used for</th></tr>
      </thead>
      <tbody>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-blue-97 border-blue-90 text-blue-20</code></td><td class="px-4 py-3">Subtle strip (same pattern per colour)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-info · bg-warning text-on-warning · bg-danger · bg-primary</code></td><td class="px-4 py-3">Solid strip</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">bg-heading text-surface</code></td><td class="px-4 py-3">Solid neutral (inverts in dark mode)</td></tr>
        <tr class="border-t border-border-light first:border-0"><td class="px-4 py-3"><code class="prose-code">border-b px-4 sm:px-6 py-2.5</code></td><td class="px-4 py-3">Strip layout</td></tr>
      </tbody>
    </table>
  </div>
</template>
