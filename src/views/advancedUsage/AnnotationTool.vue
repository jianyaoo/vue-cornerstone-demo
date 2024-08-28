<script setup>
import { addTools, changeTool } from '@/cornerstone/tools/utils'
import useInitCS from '@/hooks/useInitCS'
import useLoading from "@/hooks/useLoading";
import {
  createIds, preType, renderingEngine_id, toolGroupId,
} from "@/enums/cs";

import { activeDefaultTools } from '@/cornerstone/tools/utils'
import {
  LengthTool,
  HeightTool,
  ProbeTool,
  RectangleROITool,
  EllipticalROITool,
  CircleROITool,
  SplineROITool,
  BidirectionalTool,
  ArrowAnnotateTool,
  AngleTool,
  CobbAngleTool, addTool, ToolGroupManager, StackScrollMouseWheelTool, CrosshairsTool,
} from '@cornerstonejs/tools'

const volumeVp = createIds(preType.volumeVP, 3);
const volumeDom = createIds(preType.volumeDom, 3);
const stackVp = createIds(preType.stackVP, 1);
const stackDom = createIds(preType.stackDom, 1);

const registerTools = [
  LengthTool, ProbeTool, RectangleROITool, EllipticalROITool, CircleROITool, ArrowAnnotateTool, AngleTool,
  CobbAngleTool,
]

const registerToolsRadio = [
  {
    value: LengthTool.toolName,
    label: '长度测量工具',
  },
  {
    value: ProbeTool.toolName,
    label: '探针测量工具',
  },
  {
    value: RectangleROITool.toolName,
    label: '长方体ROI测量',
  },
  {
    value: EllipticalROITool.toolName,
    label: '椭圆形ROI测量',
  },
  {
    value: CircleROITool.toolName,
    label: '圆形ROI测量',
  },
  {
    value: ArrowAnnotateTool.toolName,
    label: '箭头标注',
  },
  {
    value: AngleTool.toolName,
    label: '通用角度测量',
  },
  {
    value: CobbAngleTool.toolName,
    label: '脊柱侧弯角度测量',
  },
]

const {loading} = useLoading();

const checkedTool = ref("")
const checkType = ref(false)

onMounted(async () => {
  await useInitCS(
      ['volume', 'stack'],
      {
        beforeRenderHook: activeDefaultTools(),
      },
      {
        beforeRenderHook: activeDefaultTools(),
      },
      addTools([...registerTools, StackScrollMouseWheelTool], volumeVp.concat(stackVp)));
});

function handleToolChange(toolName) {
  changeTool(toolName, checkType.value ? 'Passive' : 'Disabled')
}

</script>

<template>
  <div>
    <h3 class="page-title">
      注释测量工具演示示例<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>

    <div class="form">
      <div class="form-item-group">
        <el-card
          style="max-width: 50%; min-width: 1060px;margin-bottom: 20px"
          shadow="always"
        >
          <template #header>
            基础测量工具
          </template>
          <div>
            <label class="label">切换时是否保留上一个工具的测量内容：</label>
            <el-switch
              v-model="checkType"
              active-text="保留"
              inactive-text="不保留"
            />
          </div>
          <div>
            <label class="label">基础测量工具：</label>
            <el-radio-group
              v-model="checkedTool"
              @change="handleToolChange"
            >
              <el-radio
                v-for="(item, index) in registerToolsRadio"
                :key="index"
                class="radio-item"
                :value="item.value"
              >
                {{ item.label }}（{{ item.value }}）
              </el-radio>
            </el-radio-group>
          </div>
        </el-card>
      </div>
    </div>

    <div id="demo-wrap">
      <div class="viewport-wrap">
        <div class="title">
          volume渲染
        </div>
        <div
          v-for="(id) in volumeDom"
          :id="id"
          :key="id"
          v-loading="loading"
          class="cornerstone-item"
          element-loading-text="Loading..."
          element-loading-background="rgba(6, 28, 73, 0.2)"
        />
      </div>

      <div class="viewport-wrap">
        <div class="title">
          stack渲染
        </div>
        <div
          v-for="(id) in stackDom"
          :id="id"
          :key="id"
          v-loading="loading"
          class="cornerstone-item"
          element-loading-text="Loading..."
          element-loading-background="rgba(6, 28, 73, 0.2)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.label {
  font-size: 14px;
  color: #ddd;
  display: inline-block;
  margin-bottom: 5px;
}
</style>

