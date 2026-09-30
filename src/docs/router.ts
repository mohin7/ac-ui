import { createRouter, createWebHashHistory } from "vue-router";
import { pages } from "./nav";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: pages[0]!.path },
    ...pages.map((p) => ({ path: p.path, component: p.load, meta: { page: p } })),
    { path: "/:pathMatch(.*)*", redirect: pages[0]!.path },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 80, behavior: "smooth" };
    return { top: 0 };
  },
});
