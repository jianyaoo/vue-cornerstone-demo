import BasePage from "@/views/basicUsage/BasePage.vue";
import BaseVolume from "@/views/basicUsage/BaseVolume.vue";
import BaseStack from "@/views/basicUsage/BaseStack.vue";
import BaseNiftyFile from "@/views/basicUsage/BaseNiftyFile.vue";
import BaseTools from "@/views/basicTools/BaseTool.vue";
import BasicSegmentation from "@/views/basicTools/BasicSegmentation.vue";

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
  ],
};

const routes = [basicUsage, basicToolsUsage];

export default routes;
