export default {
  name: "工具基础使用示例",
  path: "/basicTool",
  component: () => import("@/views/basicTools/BaseTool.vue"),
  icon: "el-icon-set-up",
  children: [
    {
      path: "basicUse",
      name: "基础工具使用",
      component: () => import("@/views/basicTools/BasicToolUse.vue"),
    },
    {
      path: "windowLevelTool",
      name: "窗宽窗位演示",
      component: () => import("@/views/basicTools/WindowLevel.vue"),
    },
    {
      path: "basicSegmentation",
      name: "刷子工具演示",
      component: () => import("@/views/basicTools/BasicSegmentation.vue"),
    },
    // {
    //   path: "basicPETTools",
    //   name: "PET模式下调整窗框窗位",
    //   component: () => import("@/views/basicTools/BasicPETUseTool.vue"),
    // },
  ],
};
