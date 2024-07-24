<!--基础使用案例1：加载stack图像-->
<script setup>
import {
  RenderingEngine,
  Enums as csEnums
} from "@cornerstonejs/core";

import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import destoryCS from "@/cornerstone/helper/destoryCS";
import useLoading from "@/hooks/useLoading";

const renderingEngineId = 'renderingEngineId';

const { loading } = useLoading('stack');

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId)
})

async function init() {
  await initCornerstone();
  
  const imageIds = await getTestImageId();
  
  // step1: 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  // step2：在渲染引擎中创建并加载视图，使视图与HTML元素绑定
  const viewportId = "CT_AXIAL_STACK";
  const viewportInput = {
    viewportId: viewportId,
    element: document.querySelector("#element1"),
    type: csEnums.ViewportType.STACK
  };
  renderingEngine.enableElement(viewportInput);
  
  // step3：渲染viewport视图
  const viewport = renderingEngine.getViewport(viewportId);
  viewport.setStack(imageIds, 60);
  viewport.render();
}
</script>

<template>
  <div id="demo-wrap">
    <h3>渲染栈影像</h3>
    <div
      id="element1"
      v-loading="loading"
      element-loading-text="Loading..."
      element-loading-background="rgba(6, 28, 73, 0.2)"
      class="cornerstone-item"
    />
  </div>
</template>

<style lang="scss" scoped>
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
  padding: 20px;
  border: 2px solid #96CDF2;
  border-radius: 10px;
}
</style>
