<script setup lang="ts">
import Callout from "../../components/Callout.vue";
import CodeBlock from "../../components/CodeBlock.vue";
import DocHeading from "../../components/DocHeading.vue";

const deps = `npm install vue
npm install -D tailwindcss @tailwindcss/vite`;

const vite = `import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});`;

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

const fonts = `import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";`;

const main = `import { createApp } from "vue";
import App from "./App.vue";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./main.css";

createApp(App).mount("#app");`;

const use = `<script setup lang="ts">
import { AcButton, AcBadge } from "@/lib";
<\/script>

<template>
  <div class="flex items-center gap-3 p-6">
    <h4>demo-postgres</h4>
    <AcBadge label="Ready" color="success" variant="light" rounded dot />
    <AcButton title="Open Console" class="ml-auto" />
  </div>
</template>`;
</script>

<template>
  <DocHeading id="requirements">Requirements</DocHeading>
  <ul>
    <li>Vue 3.5+ with <code class="prose-code">&lt;script setup lang="ts"&gt;</code></li>
    <li>Tailwind CSS v4 (the theme uses <code class="prose-code">@theme</code>)</li>
    <li>Vite, or any bundler with Tailwind v4 support</li>
  </ul>

  <DocHeading id="steps">Steps</DocHeading>

  <DocHeading id="install-tailwind" :level="3">1. Install Tailwind CSS v4</DocHeading>
  <CodeBlock :code="deps" lang="bash" filename="Terminal" />

  <DocHeading id="configure-vite" :level="3">2. Add the Tailwind plugin and the @ alias</DocHeading>
  <p>Examples import from <code class="prose-code">@/lib</code>, so point <code class="prose-code">@</code> at <code class="prose-code">src</code>.</p>
  <CodeBlock :code="vite" lang="typescript" filename="vite.config.ts" />
  <CodeBlock :code="tsconfig" lang="json" filename="tsconfig.app.json" />

  <DocHeading id="copy-lib" :level="3">3. Add the library</DocHeading>
  <p>
    Copy <code class="prose-code">src/lib</code> (the theme and components) into your app. It has no dependencies
    besides Vue.
  </p>
  <CodeBlock :code="copy" lang="bash" filename="Terminal" />
  <Callout type="note">
    The library isn't published to npm yet. Once it is, this step becomes a package install and the import path
    changes from <code class="prose-code">@/lib</code> to the package name.
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
</template>
