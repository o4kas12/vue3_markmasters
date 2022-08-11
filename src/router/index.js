import { createRouter, createWebHistory } from "vue-router";
import Bottling from "@/views/Bottling";
import statistics from "@/views/statistics";
import dashboard from "@/views/dashboard";
import Manage from "@/views/Manage";
import Protected from "@/components/Protected";
import storageHelper from "storage-helper";

const routes = [
  {
    path: "/",
    name: "Bottling",
    component: Bottling,
  },
  {
    path: "/manage",
    name: "Manage",
    component: Manage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: statistics,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
  },
  {
    path: "/protected",
    name: "protected",
    component: Protected,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!storageHelper.getItem("user-password")) next("/protected");
    else next();
  } else next();
});
