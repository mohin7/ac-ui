// Builds the publishable library into dist/lib (npm run build:lib). The docs site uses vite.config.ts.
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    lib: { entry: { index: "src/lib/index.ts", "editor/index": "src/lib/editor/index.ts" }, formats: ["es"] },
    rollupOptions: {
      // Dependencies stay imports so the app dedupes them; CodeMirror breaks with two copies of @codemirror/state.
      external: ["vue", "vue-router", "@lucide/vue", "ajv", "yaml", /^@codemirror\//, /^@lezer\//],
      // One file per component keeps class names greppable for the consumer's Tailwind @source scan.
      output: { preserveModules: true, preserveModulesRoot: "src/lib", entryFileNames: "[name].js" },
    },
  },
});
