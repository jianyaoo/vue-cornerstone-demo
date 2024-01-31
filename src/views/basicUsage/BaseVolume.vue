<template>
  <div>
    <h3>渲染Volume</h3>
    <el-alert
      title="从cornerstone服务器加载演示数据源，加载较慢请稍等"
      type="info"
    ></el-alert>
    <div id="demo-wrap">
      <div id="element1" class="cornerstone-item"></div>
      <div id="element2" class="cornerstone-item"></div>
      <div id="element3" class="cornerstone-item"></div>
    </div>
  </div>
</template>

<script>
import {
  cache,
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
  getRenderingEngine,
} from "@cornerstonejs/core";

import { initCornerstone, getTestImageId } from "../../cornerstone";

export default {
  name: "BaseVolume",

  data() {
    return {
      volumeId: "my_volume_id_2",
      renderingEngineId: "my_renderingEngine_2",
      volume: null,
    };
  },

  mounted() {
    this.init();
  },

  beforeDestroy() {
    getRenderingEngine(this.renderingEngineId).destroy();
    cache.removeVolumeLoadObject(this.volumeId);
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
      this.volume = volume;

      console.log(volume);
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
      await volume.load();

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

      console.log(renderingEngine);
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
  margin-top: 20px;
}
</style>
