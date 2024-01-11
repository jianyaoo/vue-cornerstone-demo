<template>
  <div id="demo-wrap">
    <div id="element1" class="cornerstone-item"></div>
  </div>
</template>

<script>
import { RenderingEngine, Enums as csEnums } from "@cornerstonejs/core";

import { initCornerstone, getTestImageId } from "../cornerstone/index";

export default {
  name: "BaseStack",

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

      // 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
      const viewportId = "CT_AXIAL_STACK";
      const viewportInput = {
        viewportId: viewportId,
        element: document.querySelector("#element1"),
        type: csEnums.ViewportType.STACK,
      };
      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(viewportId);
      viewport.setStack(imageIds, 60);
      viewport.render();
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
