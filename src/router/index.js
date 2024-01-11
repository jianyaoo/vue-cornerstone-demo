import Vue from "vue";
import VueRouter from "vue-router";
import BaseVolume from "../views/BaseVolume.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: BaseVolume,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
