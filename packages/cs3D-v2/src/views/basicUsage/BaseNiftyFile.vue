<script setup>
	import {
		volumeLoader,
		RenderingEngine,
		Enums as csEnums,
		setVolumesForViewports,
		eventTarget,
		imageLoader
	} from "@cornerstonejs/core";
import {
	cornerstoneNiftiImageLoader,
	createNiftiImageIdsAndCacheMetadata,
	Enums as niftiEnum,
} from '@cornerstonejs/nifti-volume-loader';
import initCornerstone from "../../cornerstone/helper/initCornerstone";
import destoryCS from "../../cornerstone/helper/destoryCS";

const renderingEngineId = 'my_renderingEngine_3';
let loading = ref(true)

onMounted(()=>{
  init();
})

onBeforeUnmount(()=>{
  destoryCS(renderingEngineId)
})

eventTarget.addEventListener(niftiEnum.Events.NIFTI_VOLUME_LOADED, () => {
  loading.value = false;
})

async function init() {
  await initCornerstone();
	
	// 1.0版本
  // step1: 注册一个nifti格式的加载器
  // volumeLoader.registerVolumeLoader(
  //   "nifti",
  //   cornerstoneNiftiImageVolumeLoader
  // );
	// ==========================================================
	// 2.0版本
	// 在2.0版本中主要基于image进行渲染，由注册volume更新为注册imageLoader
	imageLoader.registerImageLoader('nifti', cornerstoneNiftiImageLoader);
  
  // step2: 声明volumeId，格式为 'nifti:'+真实的请求路径
  // 在定义volumeId时使用 nifti 前缀，便于识别使用的加载器种类
  const niftiURL =
    "https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz";
	// 1.0版本：由于注册的是volume，需要对volumeID进行处理;在2.0中不需要
  // const volumeId = "nifti:" + niftiURL;
	   const volumeId = 'niftiVolume';
	// ==========================================================
  // 2.0版本：自动对nifti进行处理，生成 以 nifti:为前缀的imageId
	const imageIds = await createNiftiImageIdsAndCacheMetadata({ url: niftiURL });
	const volume = await volumeLoader.createAndCacheVolume(volumeId, {
		imageIds,
	});
	
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
	
	
  // 在视图上设置Volume
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: volumeId,
      },
    ],
    [viewportId1, viewportId2, viewportId3]
  );
	
	await volume.load();
	
  // 渲染图像
  renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
}
</script>

<template>
  <div>
    <h3>加载渲染NifTi文件</h3>
    <div
      id="demo-wrap"
    >
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


<style lang="scss" scoped>
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
</style>
