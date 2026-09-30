import { createApp } from "vue";
import App from "./docs/App.vue";
import { router } from "./docs/router";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./docs/docs.css";

createApp(App).use(router).mount("#app");
