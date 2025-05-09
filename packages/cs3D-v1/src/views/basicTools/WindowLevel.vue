<script setup>
import {
  Enums as csEnums,
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports
} from "@cornerstonejs/core";
import {
  addTool,
  Enums as cstEnums,
  ToolGroupManager,
  WindowLevelTool
} from "@cornerstonejs/tools";
import initCornerstone from "../../cornerstone/helper/initCornerstone";
import getTestImageId from "../../cornerstone/helper/getTestImageId";
import destoryCS from "../../cornerstone/helper/destoryCS";

const volumeId = "my_volume_id";
const renderingEngineId = "my_renderingEngine";
const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";
const toolGroupId = "my_tool_group";

onMounted(()=>{
  init()
})

onBeforeUnmount(()=>{
  destoryCS(renderingEngineId, toolGroupId)
})

async function init() {
  await initCornerstone();
  
  const imageIds = await getTestImageId();
  
  // 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  // 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
  const viewportInputArray = [
    {
      viewportId: viewportId1,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element1"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.AXIAL
      }
    },
    {
      viewportId: viewportId2,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element2"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.SAGITTAL
      }
    },
    {
      viewportId: viewportId3,
      type: csEnums.ViewportType.ORTHOGRAPHIC,
      element: document.querySelector("#element3"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.CORONAL
      }
    }
  ];
  renderingEngine.setViewports(viewportInputArray);
  
  // 将SegmentTools添加到全局及工具组中
  addTools();
  
  // 去创建并缓存一个Volume
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  });
  
  // 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  volume.load();
  
  // 在视图上设置Volume
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: volumeId
      }
    ],
    [viewportId1, viewportId2, viewportId3]
  );
  
  // 渲染图像
  renderingEngine.renderViewports([
    viewportId1,
    viewportId2,
    viewportId3
  ]);
  
  
  // 设置当前激活的工具
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Primary
      }
    ]
  });
}

function addTools() {
  //  顶层API全局添加
  addTool(WindowLevelTool);
  
  // 创建工具组，在工具组添加
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  toolGroup.addTool(WindowLevelTool.toolName);
  
  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
}
</script>


<template>
  <div>
    <h3>窗宽窗位的基础使用<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span></h3>
    <div id="demo-wrap">
      <div
        id="element1"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
      <div
        id="element2"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
      <div
        id="element3"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
    </div>
    <div id="tip">
      <p>拖动左键，使用平移工具(WindowLevelTool)修改windowLevel</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
  margin-right: 20px;
  padding: 0;
  border: 2px solid #96CDF2;
  border-radius: 10px;
}

.sub-tip{
  font-size: 14px;
  color: #fff;
}

#tip{
  margin-top: 20px;
  font-size: 14px;
  p{
    line-height: 30px;
    color: #eee;
  }
}
</style>
