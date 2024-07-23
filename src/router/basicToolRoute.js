export default {
  name: "基础工具使用示例",
  path: "/basicTool",
  component: () => import("@/views/basicTools/BaseTool.vue"),
  icon: "el-icon-set-up",
  // children: [
  //   {
  //     path: "segmentation",
  //     name: "分割器的基础使用",
  //     component: () => import("@/views/basicTools/BasicSegmentation.vue"),
  //   },
  //   {
  //     path: "windowLevelTool",
  //     name: "窗宽窗位的基础使用",
  //     component: () => import("@/views/basicTools/WindowLevel.vue"),
  //   },
  //   {
  //     path: "basicPETTools",
  //     name: "PET模式下调整窗框窗位",
  //     component: () => import("@/views/basicTools/BasicPETUseTool.vue"),
  //   },
  // ],
};
