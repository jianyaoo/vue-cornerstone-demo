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

import { initCornerstone, getTestImageId } from "../cornerstone/index";

export default {
  name: "BaseVolume",

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

      const imageIds = await getTestImageId();

      // 准备一个渲染引擎 => renderingEngine
      const renderingEngine = new RenderingEngine(this.renderingEngineId);

      // 去创建并缓存一个Volume
      const volume = await volumeLoader.createAndCacheVolume(this.volumeId, {
        imageIds,
      });

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

      // 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
      volume.load();

      // 在视图上设置Volume
      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: this.volumeId,
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
