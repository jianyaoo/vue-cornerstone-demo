export default {
  name: "基础渲染示例",
  path: "/basicUsage",
  component: () => import("../views/basicUsage/BasePage.vue"),
  icon: "icon-shouye",
  children: [
    {
      path: "stack",
      name: "渲染栈影像",
      component: () => import("../views/basicUsage/BaseStack.vue"),
    },
    {
      path: "baseVolume",
      name: "渲染Volume影像",
      component: () => import("../views/basicUsage/BaseVolume.vue"),
    },
    {
      path: "baseWadourl",
      name: "渲染wadouri格式",
      component: () => import("../views/basicUsage/BasicWadourl.vue"),
    },
    {
      path: "localFile",
      name: "加载本地dicom",
      component: () => import("../views/basicUsage/LocalFile.vue"),
    },
    {
      path: "niftiFile",
      name: "渲染nifti文件",
      component: () => import("../views/basicUsage/BaseNiftyFile.vue"),
    },
    {
      path: "basicPET",
      name: "渲染PET模式",
      component: () => import("../views/basicUsage/BasicPET.vue"),
    },
    {
      path: "load3DVolume",
      name: "加载3D影像",
      component: () => import("../views/basicUsage/Basic3DRender.vue"),
    },
  ],
};
