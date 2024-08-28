<script setup>
import vtkColormaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";
import { getRenderingEngine } from "@cornerstonejs/core";
import {
  utilities as cstUtils,
} from "@cornerstonejs/tools";
import useLoading from "@/hooks/useLoading";
import useInitCS from '@/hooks/useInitCS'
import {
  createIds,
  ctVolumeId,
  ptVolumeId,
  renderingEngine_id,
} from "@/enums/cs";

const {ViewportColorbar} = cstUtils.voi.colorbar;
const {ColorbarRangeTextPosition} = cstUtils.voi.colorbar.Enums;
const colorMaps = vtkColormaps.rgbPresetNames.map((presetName) =>
    vtkColormaps.getPresetByName(presetName),
);

const elementIds = createIds("volumeDom", 3);

const ctTheme = ref("Grayscale");
const ctOpacity = ref(255);
const ptTheme = ref("jet");
const ptOpacity = ref(120);

const {loading} = useLoading();

onMounted(async () => {
  await useInitCS(['volume'], true);

  initColorBar(ctTheme.value, ctVolumeId);
  initColorBar(ptTheme.value, ptVolumeId);
  setColorMapToVP(ptVolumeId, ptOpacity.value, 'opacity');
});

watch(ctTheme, (newValue) => {
  setColorMapToVP(ctVolumeId, newValue);
});

watch(ptTheme, (newValue) => {
  setColorMapToVP(ptVolumeId, newValue);
});

watch(ctOpacity, (newValue) => {
  setColorMapToVP(ctVolumeId, newValue, 'opacity');
});

watch(ptOpacity, (newValue) => {
  setColorMapToVP(ptVolumeId, newValue, 'opacity');
});

function setColorMapToVP(volumeId, value, type = "name") {
  const typeObj = {
    name: () => ({
      name: value,
    }),

    opacity: () => {
      const op = value / 255;
      return {
        opacity: op,
      }
    },
  };

  const vps = getRenderingEngine(renderingEngine_id)
  .getViewports();
  vps.forEach(viewport => {
    viewport.setProperties(
        {
          colormap: {
            ...typeObj[type](),
          },
        },
        volumeId,
    );
    viewport.render();
  });
}

function initColorBar(activeColormapName, volumeId) {
  elementIds.forEach((id, index) => {
    new ViewportColorbar({
      id: `${volumeId}ColorBar`,
      element: document.querySelector(`#${id}`),
      container: document.querySelector(`#colorBar${index + 1}`),
      colormaps: colorMaps,
      activeColormapName,
      volumeId,
      ticks: {
        position: ColorbarRangeTextPosition.Left,
        style: {
          font: "12px Arial",
          color: "#fff",
          maxNumTicks: 8,
          tickSize: 5,
          tickWidth: 1,
          labelMargin: 3,
        },
      },
    });
  });

  setColorMapToVP(volumeId, activeColormapName);
}
</script>

<template>
  <div>
    <h3>
      colorBar基础使用<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>
    <div class="form">
      <div>
        <div class="form-item">
          <label>CT colorMap主题：</label>
          <el-select
            v-model="ctTheme"
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
          <label>CT 透明度：</label>
          <el-slider
            v-model="ctOpacity"
            :min="0"
            :max="255"
            :step="1"
          />
        </div>
      </div>
      <div>
        <div class="form-item">
          <label>PT colorMap主题：</label>
          <el-select
            v-model="ptTheme"
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
          <label>PT 透明度：</label>
          <el-slider
            v-model="ptOpacity"
            :min="0"
            :max="255"
            :step="1"
          />
        </div>
      </div>
    </div>
    <div id="demo-wrap">
      <div class="colorBar-wrap">
        <div
          :id="elementIds[0]"
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
          :id="elementIds[1]"
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
          :id="elementIds[2]"
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
    margin-right: 80px;
    margin-bottom: 15px;
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
    height: 50%;
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
