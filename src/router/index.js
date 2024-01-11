import Vue from "vue";
import VueRouter from "vue-router";
import BaseVolume from "../views/BaseVolume.vue";
import BaseStack from "@/views/BaseStack.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "渲染栈图片",
    component: BaseStack,
  },
  {
    path: "/baseVolume",
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
