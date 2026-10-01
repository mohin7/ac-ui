<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";
import vite from "../../snippets/installation/vite.txt?raw";
import fonts from "../../snippets/installation/fonts.txt?raw";
import main from "../../snippets/installation/main.txt?raw";
import use from "../../snippets/installation/use.txt?raw";

const deps = `npm install vue lucide-vue-next
npm install -D tailwindcss @tailwindcss/vite`;

const tsconfig = `{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}`;

const copy = `# from the root of this repository, into your app
cp -r src/lib /path/to/your-app/src/lib`;

const css = `@import "tailwindcss";
@import "./lib/theme.css";`;

const fontsInstall = `npm install @fontsource-variable/geist @fontsource-variable/geist-mono`;
</script>

<template>
  <DocHeading id="requirements">Requirements</DocHeading>
  <ul>
    <li>Vue 3.5+ with <code class="prose-code">&lt;script setup lang="ts"&gt;</code></li>
    <li>Tailwind CSS v4 (the theme uses <code class="prose-code">@theme</code>)</li>
    <li>Vite, or any bundler with Tailwind v4 support</li>
  </ul>

  <Callout type="note">
    These steps are for an app that doesn't load the old Bulma design system. For cluster-ui, kubedb-ui, platform-ui and the other apps that
    still do, follow <RouterLink to="/getting-started/existing-apps">Existing Apps</RouterLink> instead.
  </Callout>

  <DocHeading id="steps">Steps</DocHeading>

  <DocHeading id="install-tailwind" :level="3">1. Install Tailwind CSS v4</DocHeading>
  <CodeBlock :code="deps" lang="bash" filename="Terminal" />

  <DocHeading id="configure-vite" :level="3">2. Add the Tailwind plugin and the @ alias</DocHeading>
  <p>Examples import from <code class="prose-code">@/lib</code>, so point <code class="prose-code">@</code> at <code class="prose-code">src</code>.</p>
  <CodeBlock :code="vite" lang="typescript" filename="vite.config.ts" />
  <CodeBlock :code="tsconfig" lang="json" filename="tsconfig.app.json" />

  <DocHeading id="copy-lib" :level="3">3. Add the library</DocHeading>
  <p>
    Copy <code class="prose-code">src/lib</code> (the theme, components and composables) into your app. Its only
    dependencies are Vue and <code class="prose-code">lucide-vue-next</code>.
  </p>
  <CodeBlock :code="copy" lang="bash" filename="Terminal" />
  <Callout type="note">
    The library isn't published to npm yet. <code class="prose-code">npm run build:lib</code> already produces the
    package (<code class="prose-code">@appscode/design-system</code> 3.0.0-alpha) in <code class="prose-code">dist/lib</code>.
    Once it's published, this step becomes a package install, and imports change from <code class="prose-code">@/lib</code>
    to <code class="prose-code">@appscode/design-system</code> and <code class="prose-code">@appscode/design-system/theme.css</code>.
  </Callout>

  <DocHeading id="import-css" :level="3">4. Import the theme</DocHeading>
  <p>
    Import Tailwind first, then the theme. The theme also registers the components folder as a Tailwind source,
    so their classes are generated.
  </p>
  <CodeBlock :code="css" lang="css" filename="src/main.css" />
  <CodeBlock :code="main" lang="typescript" filename="src/main.ts" />

  <DocHeading id="fonts" :level="3">5. Load the fonts</DocHeading>
  <p>Geist and Geist Mono are self-hosted from npm, so there's no external font request.</p>
  <CodeBlock :code="fontsInstall" lang="bash" filename="Terminal" />
  <CodeBlock :code="fonts" lang="typescript" filename="src/main.ts" />

  <DocHeading id="use" :level="3">6. Use a component</DocHeading>
  <CodeBlock :code="use" lang="vue" filename="src/App.vue" />
  <Callout type="tip">
    Every example on this site is a real file under <code class="prose-code">src/docs/examples</code>, so the code you
    copy is exactly what runs.
  </Callout>

  <DocHeading id="next" :level="3">7. Optional: dark mode and toasts</DocHeading>
  <ul>
    <li>Add <RouterLink to="/components/theme-mode">AcThemeMode</RouterLink> and the no-flash snippet from <RouterLink to="/getting-started/dark-mode">Dark Mode</RouterLink>.</li>
    <li>Mount <code class="prose-code">&lt;AcToaster /&gt;</code> once in your root component to use <RouterLink to="/components/toast">useToast()</RouterLink>.</li>
    <li>Icons come from <code class="prose-code">lucide-vue-next</code> — see <RouterLink to="/foundations/icons">Icons</RouterLink>.</li>
  </ul>
</template>
