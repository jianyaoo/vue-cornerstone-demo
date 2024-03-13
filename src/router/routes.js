import BasePage from "@/views/basicUsage/BasePage.vue";
import BaseVolume from "@/views/basicUsage/BaseVolume.vue";
import BaseStack from "@/views/basicUsage/BaseStack.vue";
import BaseNiftyFile from "@/views/basicUsage/BaseNiftyFile.vue";
import BaseTools from "@/views/basicTools/BaseTool.vue";
import BasicSegmentation from "@/views/basicTools/BasicSegmentation.vue";
import WindowLevel from "@/views/basicTools/WindowLevel.vue";
import BasicPET from "@/views/basicUsage/BasicPET.vue";
import BasicPETUseTool from "@/views/basicTools/BasicPETUseTool.vue";

const basicUsage = {
  name: "基础渲染功能",
  path: "/base",
  component: BasePage,
  icon: "el-icon-location",
  children: [
    {
      path: "stack",
      name: "渲染栈图片",
      component: BaseStack,
    },
    {
      path: "baseVolume",
      name: "渲染Volume",
      component: BaseVolume,
    },
    {
      path: "niftiFile",
      name: "加载nifti文件",
      component: BaseNiftyFile,
    },
    {
      path: "basicPET",
      name: "渲染PET模式",
      component: BasicPET,
    },
  ],
};

const basicToolsUsage = {
  name: "基础工具使用",
  path: "/tools",
  component: BaseTools,
  icon: "el-icon-set-up",
  children: [
    {
      path: "segmentation",
      name: "分割器的基础使用",
      component: BasicSegmentation,
    },
    {
      path: "windowLevelTool",
      name: "窗宽窗位的基础使用",
      component: WindowLevel,
    },
    {
      path: "basicPETTools",
      name: "PET模式下调整窗框窗位",
      component: BasicPETUseTool,
    },
  ],
};

const routes = [
  { path: "/", redirect: "/base/stack" },
  basicUsage,
  basicToolsUsage,
];

export default routes;
