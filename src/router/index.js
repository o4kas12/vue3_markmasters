import { createRouter, createWebHashHistory } from "vue-router";
import Bottling from "@/views/Bottling";
import history from "@/views/history";
import products from "@/views/products";

const routes = [
  {
    path: "/",
    name: "Bottling",
    component: Bottling,
  },
  {
    path: "/history",
    name: "History",
    component: history,
  },
  {
    path: "/products",
    name: "products",
    component: products,
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
  history: createWebHashHistory(),
  routes,
});

export default router;
