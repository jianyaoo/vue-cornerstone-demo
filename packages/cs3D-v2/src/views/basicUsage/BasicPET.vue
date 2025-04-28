<script setup>
import {
  Enums as csEnums,
  utilities as csUtils,
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports,
  getRenderingEngine
} from "@cornerstonejs/core";
import setCtTransferFunctionForVolumeActor from "../../cornerstone/helper/setCtTransferFunctionForVolumeActor";
import setPetColorMapTransferFunctionForVolumeActor
  from "../../cornerstone/helper/setPetColorMapTransferFunctionForVolumeActor";
import initCornerstone from "../../cornerstone/helper/initCornerstone";
import getTestImageId from "../../cornerstone/helper/getTestImageId";
import getTestPTImageId from "../../cornerstone/helper/getTestPTImageId";
import destoryCS from "../../cornerstone/helper/destoryCS";
import useLoading from "../../hooks/useLoading";

const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
const ctVolumeName = "CT_VOLUME_ID";
const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;

const ptVolumeName = "PT_VOLUME_ID";
const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;

const renderingEngineId = "my_renderingEngine";
const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";

let ctVolume, ptVolume;

const viewportIdMap = {
  element1: viewportId1,
  element2: viewportId2,
  element3: viewportId3
};

const canvasPos = ref("");
const worldPos = ref("");
const ctValue = ref("");
const ptValue = ref("");
const currentVP = ref("")

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId);
});

const { loading } = useLoading();

async function init() {
  await initCornerstone();
  const CTImageIds = await getTestImageId();
  const PTImageIds = await getTestPTImageId();
  
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
  
  // 去创建并缓存一个Volume
  ctVolume = await volumeLoader.createAndCacheVolume(
    ctVolumeId,
    {
      imageIds: CTImageIds
    }
  );
  // 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  ctVolume.load();
  
  ptVolume = await volumeLoader.createAndCacheVolume(
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

function getValue(volume, worldPos) {
	// V1.0：使用 scalarData 获取体素数据
  const { dimensions, imageData, voxelManager } = volume;
  const index = imageData.worldToIndex(worldPos);
  
  index[0] = Math.floor(index[0]);
  index[1] = Math.floor(index[1]);
  index[2] = Math.floor(index[2]);
  
  if (!csUtils.indexWithinDimensions(index, dimensions)) {
    return 'out Range';
  }
  
  const yMultiple = dimensions[0];
  const zMultiple = dimensions[0] * dimensions[1];
  
	// V2.0：使用voxelManager对体素数据进行管理
  const value = voxelManager.getAtIndex(index[2] * zMultiple + index[1] * yMultiple + index[0])
  
  return value;
}

function handleMouseMove(event) {
  if (loading.value){
    return '';
  }
  
  
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  
  const canvas = [
    Math.floor(event.clientX - rect.left),
    Math.floor(event.clientY - rect.top)
  ];
  canvasPos.value = canvas;

  
  const viewport = getRenderingEngine(renderingEngineId).getViewport(viewportIdMap[element.id]);
  const worldPosTemp = viewport.canvasToWorld(canvas);
  currentVP.value = viewportIdMap[element.id];
  worldPos.value = worldPosTemp;
  ctValue.value = getValue(ctVolume, worldPosTemp);
  ptValue.value = getValue(ptVolume, worldPosTemp);
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
        @mousemove="handleMouseMove"
      />
      <div
        id="element2"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
        @mousemove="handleMouseMove"
      />
      <div
        id="element3"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
        @mousemove="handleMouseMove"
      />
    </div>
    <div id="value-demo">
      <p>viewportId：{{ currentVP }}</p>
      <p>canvas坐标：{{ canvasPos }}</p>
      <p>world坐标：{{ worldPos }}</p>
      <p>CT值：{{ ctValue }}</p>
      <p>PT值：{{ ptValue }}</p>
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

#value-demo {
  margin-top: 20px;
  
  p {
    line-height: 2;
  }
}
</style>
