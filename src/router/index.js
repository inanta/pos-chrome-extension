import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/access-token",
    name: "AccessToken",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "access-token" */ "../views/AccessToken.vue")
  },
  {
    path: "/file-manager",
    name: "FileManager",
    component: () => import("../views/FileManager.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
