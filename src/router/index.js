import { createRouter, createWebHashHistory } from "vue-router";
import Favorites from "@/views/Favorites.vue";
import Main from "@/views/Main.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
  {
    path: "/favorites",
    name: "about",
    component: Favorites,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
