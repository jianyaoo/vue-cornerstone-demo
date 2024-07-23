<script setup>
import {
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
} from "@cornerstonejs/core";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import destoryCS from "@/cornerstone/helper/destoryCS";

const volumeId = 'my_volume_id_2';
const renderingEngineId = 'my_renderingEngine_2';
let volumeIns = null;

onMounted(()=>{
   init()
});

onBeforeUnmount(()=>{
  destoryCS(renderingEngineId)
})

async function init() {
  await initCornerstone();
  
  const imageIds = await getTestImageId();
  
  console.log(imageIds)
  // step1: 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  // step2: 核心步骤 => 创建并缓存一个Volume
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });
  volumeIns = volume;
  
  // step3: 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
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
  
  // step4:  加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  await volume.load();
  
  // step5: 在视图上设置Volume
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId,
      },
    ],
    [viewportId1, viewportId2, viewportId3]
  );
  
  // step6: 渲染图像
  renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
}
</script>

<template>
  <div>
    <h3>渲染Volume</h3>
    <div id="demo-wrap">
      <div
        id="element1"
        class="cornerstone-item"
      />
      <div
        id="element2"
        class="cornerstone-item"
      />
      <div
        id="element3"
        class="cornerstone-item"
      />
    </div>
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
