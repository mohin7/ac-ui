<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DoDont from "../../components/DoDont.vue";
import DocHeading from "../../components/DocHeading.vue";
import install from "../../snippets/existing-apps/install.txt?raw";
import nuxtConfig from "../../snippets/existing-apps/nuxt-config.txt?raw";
import phaseTwo from "../../snippets/existing-apps/phase-two.txt?raw";
import use from "../../snippets/existing-apps/use.txt?raw";
import viteMain from "../../snippets/existing-apps/vite-main.txt?raw";
import wrap from "../../snippets/existing-apps/wrap.txt?raw";

const requirements = [
  ["Vue", "3.5 or later", "kubedb-ui 3.5.40, platform-ui 3.5.27"],
  ["Bundler", "Vite 5+ or Nuxt 3+", "kubedb-ui Vite 7, platform-ui Nuxt 4"],
  ["TypeScript", 'moduleResolution "bundler"', "Both apps already use it, so /editor types resolve"],
  ["Peer dependency", "@lucide/vue ^1.0", "Install it alongside the package"],
  ["Server rendering", "Supported", "All 74 components render on the server, so Nuxt needs no <ClientOnly>"],
];

const dos = [
  "Load `compat.css` after the old styles, so it's the last stylesheet in the list.",
  "Wrap a new component in your own element when it needs spacing or width, and use the classes your app already uses on that element.",
  "Replace a whole widget at a time, such as a table, a card row or a form, using the Migration page for the props.",
  "Load the editor with `defineAsyncComponent`, so pages without an editor don't download CodeMirror.",
];
const donts = [
  "Don't put utility classes on a new component. Under `compat.css` a class there only works if the library uses it too.",
  "Don't put old Bulma markup inside a new component's slots and expect it to look old: inside a new component, the new base styles apply.",
  "Don't add Tailwind to the app while it still loads the old styles. Both define `mt-4`, `p-2` and `gap-2` with different meanings.",
  "Don't remount components on theme change. New components follow `.is-dark-theme` by themselves.",
];
</script>

<template>
  <DocHeading id="usage">Usage</DocHeading>
  <p>
    The AppsCode consoles load the old Bulma/SCSS design system globally. This page is how to use the new components in those apps today,
    without restyling the old pages, and how to finish the move later.
  </p>
  <p>
    There are two ways to load the styles. Until an app stops loading the old styles, use <strong>compat.css</strong>. After that, switch to the
    normal <strong>theme.css</strong> setup from <RouterLink to="/getting-started/installation">Installation</RouterLink>.
  </p>

  <DocHeading id="requirements">Requirements</DocHeading>
  <div class="mt-4 overflow-x-auto rounded-10 border border-border bg-surface shadow-xs">
    <table class="w-full text-left text-base">
      <thead class="border-b border-border bg-surface-muted text-xs text-label">
        <tr><th class="h-9 px-4 font-medium">Needs</th><th class="h-9 px-4 font-medium">Version</th><th class="h-9 px-4 font-medium">AppsCode apps today</th></tr>
      </thead>
      <tbody>
        <tr v-for="[need, version, apps] in requirements" :key="need" class="border-t border-border-light first:border-0">
          <td class="px-4 py-3 font-medium text-heading">{{ need }}</td>
          <td class="px-4 py-3">{{ version }}</td>
          <td class="px-4 py-3 text-muted">{{ apps }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <DocHeading id="install">1. Install it next to the old package</DocHeading>
  <p>
    The old and new packages share the name <code class="prose-code">@appscode/design-system</code>, and the apps import the old one by deep
    path in hundreds of files. So install the new one under a second name. The old imports keep working while you move pages over.
  </p>
  <CodeBlock :code="install" lang="bash" />

  <DocHeading id="styles">2. Load the styles</DocHeading>
  <p>Add the fonts and <code class="prose-code">compat.css</code> after the old styles. No Tailwind setup is needed in the app.</p>
  <CodeBlock :code="viteMain" lang="ts" filename="Vite apps (kubedb-ui)" />
  <CodeBlock :code="nuxtConfig" lang="ts" filename="Nuxt apps (platform-ui)" />

  <DocHeading id="use">3. Use the components</DocHeading>
  <CodeBlock :code="use" lang="vue" />
  <p>
    Dark mode needs nothing extra: the apps already toggle <code class="prose-code">.is-dark-theme</code> on <code class="prose-code">&lt;html&gt;</code>,
    and new components follow it. The brand hue is shared too, so the old <code class="prose-code">setThemeHSL</code> re-hues old and new
    components together.
  </p>

  <DocHeading id="how-it-works">How compat.css keeps old pages unchanged</DocHeading>
  <p>
    Both systems use class names like <code class="prose-code">mt-4</code>. In the old library that's <code class="prose-code">4px !important</code>;
    here it's 16px. So <code class="prose-code">compat.css</code> is the library's styles precompiled and fenced in:
  </p>
  <ul>
    <li>Its styles apply only inside new components, meaning elements under a root marked <code class="prose-code">data-ac-ds</code>, and their menus and dialogs.</li>
    <li>Its utilities are <code class="prose-code">!important</code> inside a cascade layer, which beats the old unlayered <code class="prose-code">!important</code> rules.</li>
    <li>It sets new components in Geist with a 20px line height, and leaves the rest of the page alone.</li>
    <li>Its sizes are in px, so the old apps' 13px root font size doesn't shrink anything. Its keyframes are renamed <code class="prose-code">ac-*</code>, so the old <code class="prose-code">spin</code> and <code class="prose-code">pulse</code> animations keep working.</li>
  </ul>
  <Callout type="note">
    Checked in kubedb-ui with its real stylesheet. The old markup was pixel-identical with and without <code class="prose-code">compat.css</code>.
    Every component example on this site was also compared, property by property, with and without the old styles.
  </Callout>

  <DocHeading id="rules">Rules while both are loaded</DocHeading>
  <DoDont :dos="dos" :donts="donts" />
  <CodeBlock :code="wrap" lang="vue" />

  <DocHeading id="finish">4. Finish the move</DocHeading>
  <p>
    When no page uses the old components or the old utility classes, remove the old SCSS and Bulma. Then replace
    <code class="prose-code">compat.css</code> with the normal setup, and Tailwind classes work everywhere in the app:
  </p>
  <CodeBlock :code="phaseTwo" lang="css" />
</template>
