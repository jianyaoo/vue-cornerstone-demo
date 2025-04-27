<!--<template>-->
<!--  <div>-->
<!--    <h3>渲染PET</h3>-->
<!--    <el-alert-->
<!--      title="从cornerstone服务器加载演示数据源，加载较慢请稍等"-->
<!--      type="info"-->
<!--    ></el-alert>-->
<!--    <div id="demo-wrap">-->
<!--      <div id="element1" class="cornerstone-item"></div>-->
<!--      <div id="element2" class="cornerstone-item"></div>-->
<!--      <div id="element3" class="cornerstone-item"></div>-->
<!--    </div>-->
<!--  </div>-->
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
<!--  utilities as csUtils,-->
<!--  getEnabledElement,-->
<!--} from "@cornerstonejs/core";-->
<!--import getTestPTImageId from "@/cornerstone/getTestPTImageId";-->
<!--import setCtTransferFunctionForVolumeActor from "@/cornerstone/helper/setCtTransferFunctionForVolumeActor";-->
<!--import setPetColorMapTransferFunctionForVolumeActor from "@/cornerstone/helper/setPetColorMapTransferFunctionForVolumeActor";-->
<!--import {-->
<!--  addTool,-->
<!--  Enums as cstEnums,-->
<!--  ToolGroupManager,-->
<!--  WindowLevelTool,-->
<!--  StackScrollTool,-->
<!--} from "@cornerstonejs/tools";-->

<!--const volumeLoaderScheme = "cornerstoneStreamingImageVolume";-->
<!--const ctVolumeName = "CT_VOLUME_ID";-->
<!--const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;-->

<!--const ptVolumeName = "PT_VOLUME_ID";-->
<!--const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;-->

<!--const viewportId1 = "CT_AXIAL";-->
<!--const viewportId2 = "CT_SAGITTAL";-->
<!--const viewportId3 = "CT_CORONAL";-->

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

<!--      this.addTools();-->

<!--      const ptVolume = await volumeLoader.createAndCacheVolume(-->
<!--        this.ptVolumeId,-->
<!--        {-->
<!--          imageIds: PTImageIds,-->
<!--        }-->
<!--      );-->
<!--      this.ptVolume = ptVolume;-->
<!--      // Set the volume to load-->
<!--      ptVolume.load();-->

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

<!--      // 在视图上设置Volume-->
<!--      await setVolumesForViewports(-->
<!--        renderingEngine,-->
<!--        [-->
<!--          {-->
<!--            volumeId: this.ptVolumeId,-->
<!--            callback: setPetColorMapTransferFunctionForVolumeActor,-->
<!--          },-->
<!--          {-->
<!--            volumeId: this.ctVolumeId,-->
<!--            callback: setCtTransferFunctionForVolumeActor,-->
<!--          },-->
<!--        ],-->
<!--        [viewportId1, viewportId2, viewportId3]-->
<!--      );-->

<!--      // 渲染图像-->
<!--      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);-->
<!--    },-->

<!--    addTools() {-->
<!--      //  顶层API全局添加-->
<!--      addTool(WindowLevelTool);-->
<!--      addTool(StackScrollTool);-->

<!--      // 创建工具组，在工具组添加-->
<!--      const toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId);-->
<!--      toolGroup.addTool(WindowLevelTool.toolName);-->
<!--      toolGroup.addTool(StackScrollTool.toolN0ame);-->
<!--      toolGroup.addViewport(viewportId1, this.renderingEngineId);-->
<!--      toolGroup.addViewport(viewportId2, this.renderingEngineId);-->
<!--      toolGroup.addViewport(viewportId3, this.renderingEngineId);-->

<!--      // 设置当前激活的工具-->
<!--      toolGroup.setToolActive(WindowLevelTool.toolName, {-->
<!--        bindings: [-->
<!--          {-->
<!--            mouseButton: cstEnums.MouseBindings.Primary,-->
<!--          },-->
<!--        ],-->
<!--      });-->
<!--      toolGroup.setToolActive(StackScrollTool.toolName, {-->
<!--        bindings: [-->
<!--          {-->
<!--            mouseButton: cstEnums.MouseBindings.Auxiliary,-->
<!--          },-->
<!--        ],-->
<!--      });-->

<!--      document-->
<!--        .getElementById("element1")-->
<!--        .addEventListener(csEnums.Events.VOI_MODIFIED, ({ detail }) => {-->
<!--          console.log(detail);-->
<!--          const { windowWidth, windowCenter } =-->
<!--            csUtils.windowLevel.toWindowLevel(-->
<!--              detail?.range?.lower,-->
<!--              detail?.range?.upper-->
<!--            );-->
<!--          console.log(-->
<!--            getRenderingEngine(this.renderingEngineId)-->
<!--              .getViewport(viewportId1)-->
<!--              .getReferenceId()-->
<!--          );-->
<!--          console.log(this.ctVolume);-->
<!--          console.log(this.ptVolume);-->
<!--          console.log(windowWidth, windowCenter);-->
<!--        });-->
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
