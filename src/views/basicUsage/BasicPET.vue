<!--<template>-->
<!--&lt;!&ndash;  <div>&ndash;&gt;-->
<!--&lt;!&ndash;    <h3>渲染PET</h3>&ndash;&gt;-->
<!--&lt;!&ndash;    <el-alert&ndash;&gt;-->
<!--&lt;!&ndash;      title="从cornerstone服务器加载演示数据源，加载较慢请稍等"&ndash;&gt;-->
<!--&lt;!&ndash;      type="info"&ndash;&gt;-->
<!--&lt;!&ndash;    ></el-alert>&ndash;&gt;-->
<!--&lt;!&ndash;    <div id="demo-wrap">&ndash;&gt;-->
<!--&lt;!&ndash;      <div id="element1" class="cornerstone-item"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div id="element2" class="cornerstone-item"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div id="element3" class="cornerstone-item"></div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--</template>-->

<!--<script>-->
<!--import { getTestImageId, initCornerstone } from "@/cornerstone";-->
<!--import {-->
<!--  Enums as csEnums,-->
<!--  RenderingEngine,-->
<!--  setVolumesForViewports,-->
<!--  volumeLoader,-->
<!--  getRenderingEngine,-->
<!--  cache,-->
<!--} from "@cornerstonejs/core";-->
<!--import getTestPTImageId from "@/cornerstone/getTestPTImageId";-->
<!--import setCtTransferFunctionForVolumeActor from "@/cornerstone/helper/setCtTransferFunctionForVolumeActor";-->
<!--import setPetColorMapTransferFunctionForVolumeActor from "@/cornerstone/helper/setPetColorMapTransferFunctionForVolumeActor";-->

<!--const volumeLoaderScheme = "cornerstoneStreamingImageVolume";-->
<!--const ctVolumeName = "CT_VOLUME_ID";-->
<!--const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;-->

<!--const ptVolumeName = "PT_VOLUME_ID";-->
<!--const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      ctVolumeId,-->
<!--      ptVolumeId,-->
<!--      renderingEngineId: "my_renderingEngine_2",-->
<!--      ctVolume: null,-->
<!--      ptVolume: null,-->
<!--    };-->
<!--  },-->

<!--  mounted() {-->
<!--    this.init();-->
<!--  },-->

<!--  beforeDestroy() {-->
<!--    getRenderingEngine(this.renderingEngineId).destroy();-->
<!--    cache.removeVolumeLoadObject(this.volumeId);-->
<!--  },-->

<!--  methods: {-->
<!--    async init() {-->
<!--      await initCornerstone();-->
<!--      const CTImageIds = await getTestImageId();-->
<!--      const PTImageIds = await getTestPTImageId();-->

<!--      // 准备一个渲染引擎 => renderingEngine-->
<!--      const renderingEngine = new RenderingEngine(this.renderingEngineId);-->

<!--      // 在渲染引擎中创建并加载视图，使视图与HTML元素绑定-->
<!--      const viewportId1 = "CT_AXIAL";-->
<!--      const viewportId2 = "CT_SAGITTAL";-->
<!--      const viewportId3 = "CT_CORONAL";-->
<!--      const viewportInputArray = [-->
<!--        {-->
<!--          viewportId: viewportId1,-->
<!--          type: csEnums.ViewportType.ORTHOGRAPHIC,-->
<!--          element: document.querySelector("#element1"),-->
<!--          defaultOptions: {-->
<!--            orientation: csEnums.OrientationAxis.AXIAL,-->
<!--          },-->
<!--        },-->
<!--        {-->
<!--          viewportId: viewportId2,-->
<!--          type: csEnums.ViewportType.ORTHOGRAPHIC,-->
<!--          element: document.querySelector("#element2"),-->
<!--          defaultOptions: {-->
<!--            orientation: csEnums.OrientationAxis.SAGITTAL,-->
<!--          },-->
<!--        },-->
<!--        {-->
<!--          viewportId: viewportId3,-->
<!--          type: csEnums.ViewportType.ORTHOGRAPHIC,-->
<!--          element: document.querySelector("#element3"),-->
<!--          defaultOptions: {-->
<!--            orientation: csEnums.OrientationAxis.CORONAL,-->
<!--          },-->
<!--        },-->
<!--      ];-->
<!--      renderingEngine.setViewports(viewportInputArray);-->

<!--      // 去创建并缓存一个Volume-->
<!--      const ctVolume = await volumeLoader.createAndCacheVolume(-->
<!--        this.ctVolumeId,-->
<!--        {-->
<!--          imageIds: CTImageIds,-->
<!--        }-->
<!--      );-->
<!--      this.ctVolume = ctVolume;-->

<!--      // 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件-->
<!--      ctVolume.load();-->

<!--      const ptVolume = await volumeLoader.createAndCacheVolume(-->
<!--        this.ptVolumeId,-->
<!--        {-->
<!--          imageIds: PTImageIds,-->
<!--        }-->
<!--      );-->
<!--      // Set the volume to load-->
<!--      ptVolume.load();-->

<!--      // 在视图上设置Volume-->
<!--      await setVolumesForViewports(-->
<!--        renderingEngine,-->
<!--        [-->
<!--          {-->
<!--            volumeId: this.ctVolumeId,-->
<!--            callback: setCtTransferFunctionForVolumeActor,-->
<!--          },-->
<!--          {-->
<!--            volumeId: this.ptVolumeId,-->
<!--            callback: setPetColorMapTransferFunctionForVolumeActor,-->
<!--          },-->
<!--        ],-->
<!--        [viewportId1, viewportId2, viewportId3]-->
<!--      );-->

<!--      // 渲染图像-->
<!--      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.cornerstone-item {-->
<!--  display: inline-block;-->
<!--  width: 300px;-->
<!--  height: 300px;-->
<!--  margin-top: 20px;-->
<!--}-->
<!--</style>-->
