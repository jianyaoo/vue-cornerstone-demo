export default {
  name: "工具基础使用示例",
  path: "/basicTool",
  component: () => import("@/views/basicTools/BaseTool.vue"),
  icon: "el-icon-set-up",
  children: [
    {
      path: "basicUse",
      name: "基础工具及同步器演示",
      component: () => import("@/views/basicTools/BasicToolUse.vue"),
    },
    {
      path: "AnnotationTool",
      name: "注释测量类工具",
      component: () => import("@/views/basicTools/AnnotationTool.vue"),
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
    {
      path: "colorBar",
      name: "基础colorBar",
      component: () => import("@/views/basicTools/ColorBar.vue"),
    },
    // {
    //   path: "basicPETTools",
    //   name: "PET模式下调整窗框窗位",
    //   component: () => import("@/views/basicTools/BasicPETUseTool.vue"),
    // },
  ],
};
