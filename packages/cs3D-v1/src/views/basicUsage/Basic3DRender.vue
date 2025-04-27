<script setup>
import {
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
  CONSTANTS, getRenderingEngine
} from "@cornerstonejs/core";
import initCornerstone from "../../cornerstone/helper/initCornerstone";
import destoryCS from "../../cornerstone/helper/destoryCS";
import useLoading from "../../hooks/useLoading";
import get3DTestImageId from "../../cornerstone/helper/get3DTestImageId";
import {
  addTool,
  Enums as cstEnums,
  ToolGroupManager,
  TrackballRotateTool
} from "@cornerstonejs/tools";

const volumeName = "CT_VOLUME_ID";
const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
const volumeId = `${volumeLoaderScheme}:${volumeName}`;

const renderingEngineId = "my_renderingEngine";
let volumeIns = null;
const toolGroupId = "toolGroupId";
const viewportId = "3Dvp";

const presetOptions = CONSTANTS.VIEWPORT_PRESETS.map(item => item.name);

const preset = ref("CT-Bone");
const rotate = ref(0);
const invert = ref(false);


onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId);
});


const { loading } = useLoading();

async function init() {
  await initCornerstone();
  
  const imageIds = await get3DTestImageId();
  
  // step1: 准备一个渲染引擎 => renderingEngine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  
  // step2: 核心步骤 => 创建并缓存一个Volume
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds
  });
  volumeIns = volume;
  
  // step3: 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
  const viewportInputArray = [
    {
      viewportId: viewportId,
      type: csEnums.ViewportType.VOLUME_3D,
      element: document.querySelector("#element1"),
      defaultOptions: {
        orientation: csEnums.OrientationAxis.CORONAL,
        background: CONSTANTS.BACKGROUND_COLORS.slicer3D
      }
    }
  ];
  renderingEngine.setViewports(viewportInputArray);
  
  addTools();
  
  // step4:  加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
  await volume.load();
  
  await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportId]);
  
  const viewport = renderingEngine.getViewport(viewportId);
  viewport.setProperties({
    preset: preset.value,
  });
  
  viewport.render();
  
  // 设置当前激活的工具
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
  toolGroup.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Primary
      }
    ]
  });
}

function addTools() {
  //  顶层API全局添加
  addTool(TrackballRotateTool);
  
  // 创建工具组，在工具组添加
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  toolGroup.addTool(TrackballRotateTool.toolName);
  
  toolGroup.addViewport(viewportId, renderingEngineId);
}

function handleChange(type, value) {
  const viewport = getRenderingEngine(renderingEngineId).getViewport(viewportId);
  viewport.setProperties({
    [type]: value
  });
  viewport.render();
}
</script>

<template>
  <div>
    <h3>渲染3D影像</h3>
    <div class="form">
      <div class="form-item">
        <label class="label">preset预设：</label>
        <el-select
          v-model="preset"
          placeholder="Select"
          size="large"
          style="width: 150px"
          @change="(value) => handleChange('preset',value)"
        >
          <el-option
            v-for="item in presetOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div class="form-item">
        <label class="label">旋转角度：</label>
        <el-slider
          v-model="rotate"
          :min="0"
          :max="360"
          @input="(value) => handleChange('rotation',value)"
        />
      </div>
      <div class="form-item">
        <label class="label">颜色反转：</label>
        <el-radio-group
          v-model="invert"
          @change="(value) => handleChange('invert',value)"
        >
          <el-radio :value="false">
            false
          </el-radio>
          <el-radio :value="true">
            true
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div id="demo-wrap">
      <div
        id="element1"
        v-loading="loading"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  margin-top: 20px;
  
  .form-item {
    display: flex;
    align-items: center;
    vertical-align: middle;
    margin-right: 30px;
    min-width: 300px;
    
    .label {
      width: max-content;
      min-width: max-content;
      text-align: right;
    }
  }
}

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
