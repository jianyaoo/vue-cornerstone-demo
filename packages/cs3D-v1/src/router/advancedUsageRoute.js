export default {
  name: "高级工具示例",
  path: "/advancedUsage",
  component: () => import("../views/advancedUsage/PageDefault.vue"),
  icon: "el-icon-set-up",
  children: [
    {
      path: "reconColorBar",
      name: "高级colorBar",
      component: () => import("../views/advancedUsage/ReconColorBar.vue"),
    },
  ],
};
