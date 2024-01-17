<template>
  <div id="demo-wrap">
    <div id="element1" class="cornerstone-item"></div>
    <div id="element2" class="cornerstone-item"></div>
    <div id="element3" class="cornerstone-item"></div>
  </div>
</template>

<script>
import {
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
} from "@cornerstonejs/core";
import { cornerstoneNiftiImageVolumeLoader } from "@cornerstonejs/nifti-volume-loader";
import { initCornerstone } from "../cornerstone/index";

export default {
  name: "VueCornerstoneDemoNiftyFile",

  data() {
    return {
      volumeId: "my_volume_id",
      renderingEngineId: "my_renderingEngine",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await initCornerstone();

      // 注册一个nifti格式的加载器
      volumeLoader.registerVolumeLoader(
        "nifti",
        cornerstoneNiftiImageVolumeLoader
      );

      const niftiURL =
        "https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz";

      // 在定义volumeId时使用 nifti 前缀，便于识别使用的加载器种类
      const volumeId = "nifti:" + niftiURL;
      await volumeLoader.createAndCacheVolume(volumeId);

      const renderingEngine = new RenderingEngine(this.renderingEngineId);
      // 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
      const viewportId1 = "CT_AXIAL";
      const viewportId2 = "CT_SAGITTAL";
      const viewportId3 = "CT_CORONAL";
      const viewportInputArray = [
        {
          viewportId: viewportId1,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element1"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: viewportId2,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element2"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: viewportId3,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element3"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.CORONAL,
          },
        },
      ];
      renderingEngine.setViewports(viewportInputArray);

      // 在视图上设置Volume
      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: volumeId,
          },
        ],
        [viewportId1, viewportId2, viewportId3]
      );

      // 渲染图像
      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
    },
  },
};
</script>

<style lang="scss" scoped>
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
}
</style>
