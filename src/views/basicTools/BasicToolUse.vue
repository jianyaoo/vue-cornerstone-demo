<script setup>
import {
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports
} from "@cornerstonejs/core";
import {
  StackScrollMouseWheelTool,
  PanTool,
  ZoomTool,
  ToolGroupManager,
  addTool,
  Enums as cstEnums
} from "@cornerstonejs/tools";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import destoryCS from "@/cornerstone/helper/destoryCS";
import useLoading from "@/hooks/useLoading";

const volumeId = "my_volume_id_2";
const renderingEngineId = "my_renderingEngine_2";
const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";
const groupId = "group_id";

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, groupId);
});

const { loading } = useLoading();

async function init() {
  await initCornerstone();
  
  const imageIds = await getTestImageId();
  
  addTools();
  
  // step1: 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  // step2: 核心步骤 => 创建并缓存一个Volume
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  });
  
  // step3: 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
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
  
  // step4:  加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  await volume.load();
  
  // step5: 在视图上设置Volume
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId
      }
    ],
    [viewportId1, viewportId2, viewportId3]
  );
  
  // step6：激活工具
  const toolGroup = ToolGroupManager.getToolGroup(groupId);
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Auxiliary
    }]
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Primary
    }]
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{
      mouseButton: cstEnums.MouseBindings.Secondary
    }]
  });
  
  // step7: 渲染图像
  renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
}

function addTools() {
  // step1: 全局添加工具
  addTool(StackScrollMouseWheelTool);
  addTool(PanTool);
  addTool(ZoomTool);
  
  // step2：为工具组添加工具
  const toolGroup = ToolGroupManager.createToolGroup(groupId);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  
  //  step3：将工具组应用到需要作用的视图
  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
  
  // step4：禁用默认菜单
  ['element1', 'element2', 'element3'].forEach(id => {
    const dom = document.querySelector(`#${id}`);
    dom.oncontextmenu = () => false;
  })
}
</script>

<template>
  <div>
    <h3>基础工具演示<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span></h3>
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
      <p>拖动左键，使用平移工具(PanTool)移动影像</p>
      <p>滚动中轮，切换Volume显示的层级</p>
      <p>拖动右键，使用缩放工具(ZoomTool)缩放影像</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
  margin-right: 20px;
  padding: 20px;
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
