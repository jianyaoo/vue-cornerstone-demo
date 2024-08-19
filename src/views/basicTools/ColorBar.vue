<script setup>
import vtkColormaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";
import {
  Enums as csEnums,
  RenderingEngine,
  volumeLoader,
  setVolumesForViewports,
  getRenderingEngine
} from "@cornerstonejs/core";
import {
  addTool,
  Enums as cstEnums,
  utilities as cstUtils,
  ToolGroupManager,
  WindowLevelTool
} from "@cornerstonejs/tools";
import initCornerstone from "@/cornerstone/helper/initCornerstone";
import getTestImageId from "@/cornerstone/helper/getTestImageId";
import destoryCS from "@/cornerstone/helper/destoryCS";
import useLoading from "@/hooks/useLoading";

const { ViewportColorbar } = cstUtils.voi.colorbar;
const { ColorbarRangeTextPosition } = cstUtils.voi.colorbar.Enums;

const volumeId = "my_volume_id";
const renderingEngineId = "my_renderingEngine";

const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";
const toolGroupId = "my_tool_group";

const currentTheme = ref("jet");
const currentOpacity = ref(1);

const { loading } = useLoading();

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destoryCS(renderingEngineId, toolGroupId);
});

const colorMaps = vtkColormaps.rgbPresetNames.map((presetName) =>
  vtkColormaps.getPresetByName(presetName)
);

watch(currentTheme, (newValue) => {
  setColorMapToVP(newValue);
});

watch(currentOpacity, (newValue) => {
  setColorMapToVP(newValue, "opacity");
});

function setColorMapToVP(newValue, type = "name") {
  const typeObj = {
    name: () => ({
      name: newValue
    }),
    
    opacity: () => ({
      opacity: newValue
    })
  };
  
  const vps = getRenderingEngine(renderingEngineId).getViewports();
  vps.forEach(viewport => {
    viewport.setProperties(
      {
        colormap: {
          ...typeObj[type]()
        }
      },
      volumeId
    );
    viewport.render();
  });
}

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
  
  initColorBar();
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
  
  // 设置当前激活的工具
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: cstEnums.MouseBindings.Primary
      }
    ]
  });
}

function initColorBar() {
  [1, 2, 3].forEach(item => {
    new ViewportColorbar({
      id: "ctColorBar",
      element: document.querySelector(`#element${item}`),
      container: document.querySelector(`#colorBar${item}`),
      colormaps: colorMaps,
      activeColormapName: currentTheme.value,
      volumeId: volumeId,
      ticks: {
        position: ColorbarRangeTextPosition.Left,
        style: {
          font: "12px Arial",
          color: "#fff",
          maxNumTicks: 8,
          tickSize: 5,
          tickWidth: 1,
          labelMargin: 3
        }
      }
    });
  });
  
  setColorMapToVP(currentTheme.value);
}
</script>

<template>
  <div>
    <h3>
      colorBar基础使用<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>
    <div class="form">
      <div class="form-item">
        <label>colorMap主题：</label>
        <el-select
          v-model="currentTheme"
          placeholder="Select"
          size="large"
          style="width: 150px"
        >
          <el-option
            v-for="item in colorMaps"
            :key="item.Name"
            :label="item.Name"
            :value="item.Name"
          />
        </el-select>
      </div>
      <div class="form-item">
        <label>透明度：</label>
        <el-slider
          v-model="currentOpacity"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </div>
    </div>
    <div id="demo-wrap">
      <div class="colorBar-wrap">
        <div
          id="element1"
          v-loading="loading"
          class="cornerstone-item"
          element-loading-text="Loading..."
          element-loading-background="rgba(6, 28, 73, 0.2)"
        />
        <div
          id="colorBar1"
          class="colorBar"
        />
      </div>
      <div class="colorBar-wrap">
        <div
          id="element2"
          v-loading="loading"
          class="cornerstone-item"
          element-loading-text="Loading..."
          element-loading-background="rgba(6, 28, 73, 0.2)"
        />
        <div
          id="colorBar2"
          class="colorBar"
        />
      </div>
      <div class="colorBar-wrap">
        <div
          id="element3"
          v-loading="loading"
          class="cornerstone-item"
          element-loading-text="Loading..."
          element-loading-background="rgba(6, 28, 73, 0.2)"
        />
        <div
          id="colorBar3"
          class="colorBar"
        />
      </div>
    </div>
    <div id="tip">
      <p>拖动右侧手柄，修改当前主题的窗宽窗距</p>
      <p>✨ ✨ ✨选择主题，尝试修改视图的主题色</p>
      <p>✨ ✨ ✨滑动透明度，尝试修改视图的透明度</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
#demo-wrap {
  display: flex;
}

.form {
  margin-top: 20px;
  display: flex;
  
  .form-item {
    display: flex;
    align-items: center;
    vertical-align: middle;
    margin-right: 30px;
  }
}

.colorBar-wrap {
  position: relative;
  display: grid;
  width: 300px;
  height: 300px;
  grid-template-columns: 1fr 20px;
  margin-top: 20px;
  margin-right: 20px;
  padding: 20px 10px 20px 20px;
  border: 2px solid #96CDF2;
  border-radius: 10px;
  
  .cornerstone-item {
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .colorBar {
    position: relative;
    box-sizing: border-box;
    border: 1px solid rgb(85, 85, 85);
    cursor: initial;
    width: 100%;
    height: 100%;
  }
}

.sub-tip {
  font-size: 14px;
  color: #fff;
}

#tip {
  margin-top: 20px;
  font-size: 14px;
  
  p {
    line-height: 30px;
    color: #eee;
  }
}
</style>

<style>
.el-slider {
  width: 200px;
  vertical-align: middle;
}
</style>
