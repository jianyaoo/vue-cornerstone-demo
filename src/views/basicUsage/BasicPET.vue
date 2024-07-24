<script setup>
import {
  Enums as csEnums,
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports,
} from "@cornerstonejs/core";
import setCtTransferFunctionForVolumeActor from "@/cornerstone/helper/setCtTransferFunctionForVolumeActor";
import setPetColorMapTransferFunctionForVolumeActor
  from "@/cornerstone/helper/setPetColorMapTransferFunctionForVolumeActor";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import getTestPTImageId from "@/cornerstone/helper/getTestPTImageId";
import destoryCS from "@/cornerstone/helper/destoryCS";
import useLoading from "@/hooks/useLoading";

const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
const ctVolumeName = "CT_VOLUME_ID";
const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;

const ptVolumeName = "PT_VOLUME_ID";
const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;

const renderingEngineId = "my_renderingEngine";

onMounted(()=>{
  init();
})

onBeforeUnmount(()=>{
  destoryCS(renderingEngineId)
})

const { loading } = useLoading();

async function init() {
  await initCornerstone();
  const CTImageIds = await getTestImageId();
  const PTImageIds = await getTestPTImageId();
  
  // 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
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
  
  // 去创建并缓存一个Volume
  const ctVolume = await volumeLoader.createAndCacheVolume(
    ctVolumeId,
    {
      imageIds: CTImageIds
    }
  );
  // 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  ctVolume.load();
  
  const ptVolume = await volumeLoader.createAndCacheVolume(
    ptVolumeId,
    {
      imageIds: PTImageIds
    }
  );
  // Set the volume to load
  ptVolume.load();
  
  // 在视图上设置Volume
  // notes: 在每一个viewport中添加多个volume
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: ctVolumeId,
        callback: setCtTransferFunctionForVolumeActor
      },
      {
        volumeId: ptVolumeId,
        callback: setPetColorMapTransferFunctionForVolumeActor
      }
    ],
    [viewportId1, viewportId2, viewportId3]
  );
  
  // 渲染图像
  renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
}
</script>

<template>
  <div>
    <h3>渲染PET</h3>
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
  </div>
</template>

<style scoped lang="scss">
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
</style>
