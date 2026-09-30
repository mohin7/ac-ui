// Builds the publishable library into dist/lib (npm run build:lib). The docs site uses vite.config.ts.
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    lib: { entry: "src/lib/index.ts", formats: ["es"] },
    rollupOptions: {
      external: ["vue", "vue-router", "lucide-vue-next"],
      // One file per component keeps class names greppable for the consumer's Tailwind @source scan.
      output: { preserveModules: true, preserveModulesRoot: "src/lib", entryFileNames: "[name].js" },
    },
  },
});
