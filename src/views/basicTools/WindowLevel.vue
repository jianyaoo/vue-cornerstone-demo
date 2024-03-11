<template>
  <div>
    <h3>窗宽窗位的基础使用</h3>
    <el-alert
      title="从cornerstone服务器加载演示数据源，加载较慢请稍等"
      type="info"
    ></el-alert>
    <el-alert
      title="如遇电脑卡顿，再次调整时，按ESC键结束，然后调整第二个"
      type="warning"
      style="margin-top: 20px"
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
  Enums as csEnums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from "@cornerstonejs/core";
import { getTestImageId, initCornerstone } from "@/cornerstone";
import {
  addTool,
  Enums as cstEnums,
  destroy as cstDestroy,
  ToolGroupManager,
  WindowLevelTool,
} from "@cornerstonejs/tools";

export default {
  name: "WindowLevel",
  data() {
    return {
      volumeId: "my_volume_id",
      renderingEngineId: "my_renderingEngine",
      viewportId1: "CT_AXIAL",
      viewportId2: "CT_SAGITTAL",
      viewportId3: "CT_CORONAL",
      toolGroupId: "my_tool_group",
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    getRenderingEngine(this.renderingEngineId).destroy();
    cache.removeVolumeLoadObject(this.volumeId);
    cache.removeVolumeLoadObject(this.derivedVolumeId);
    cstDestroy();
  },
  methods: {
    async init() {
      await initCornerstone();
      const imageIds = await getTestImageId();

      // 准备一个渲染引擎 => renderingEngine
      const renderingEngine = new RenderingEngine(this.renderingEngineId);

      // 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
      const viewportInputArray = [
        {
          viewportId: this.viewportId1,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element1"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: this.viewportId2,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element2"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: this.viewportId3,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element3"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.CORONAL,
          },
        },
      ];
      renderingEngine.setViewports(viewportInputArray);

      // 将SegmentTools添加到全局及工具组中
      this.addTools();

      // 去创建并缓存一个Volume
      const volume = await volumeLoader.createAndCacheVolume(this.volumeId, {
        imageIds,
      });

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
        [this.viewportId1, this.viewportId2, this.viewportId3]
      );

      // 渲染图像
      renderingEngine.renderViewports([
        this.viewportId1,
        this.viewportId2,
        this.viewportId3,
      ]);
    },

    addTools() {
      //  顶层API全局添加
      addTool(WindowLevelTool);

      // 创建工具组，在工具组添加
      const toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId);
      toolGroup.addTool(WindowLevelTool.toolName);

      toolGroup.addViewport(this.viewportId1, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId2, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId3, this.renderingEngineId);

      // 设置当前激活的工具
      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: cstEnums.MouseBindings.Primary,
          },
        ],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
}
</style>
