<script setup>
import { baseAnnoToolConfig, splineAnnoToolsConfig, specificTool } from '@/cornerstone/tools/registerToolList'
import { addTools, changeTool } from '@/cornerstone/tools/utils'
import useInitCS from '@/hooks/useInitCS'
import useLoading from "@/hooks/useLoading";
import {
  createIds, preType,
} from "@/enums/cs";
import { activeDefaultTools } from '@/cornerstone/tools/utils'


const volumeVp = createIds(preType.volumeVP, 3);
const volumeDom = createIds(preType.volumeDom, 3);
const stackVp = createIds(preType.stackVP, 1);
const stackDom = createIds(preType.stackDom, 1);


const {loading} = useLoading();

const checkedTool = ref("")

onMounted(async () => {
  await useInitCS(
      ['volume', 'stack'],
      {
        //beforeRenderHook: activeDefaultTools(),
      },
      {
        //beforeRenderHook: activeDefaultTools(),
      },
      addTools([...baseAnnoToolConfig, ...splineAnnoToolsConfig, ...specificTool], volumeVp, stackVp));
});

function handleToolChange(toolName) {
  changeTool(toolName, 'Disabled')
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

          <el-radio-group
            v-model="checkedTool"
            @change="handleToolChange"
          >
            <el-radio
              v-for="(item, index) in baseAnnoToolConfig"
              :key="index"
              class="radio-item"
              :value="item.toolName"
            >
              {{ item.label }}（{{ item.toolName || '' }}）
            </el-radio>
          </el-radio-group>
        </el-card>
      </div>

      <div class="form-item-group">
        <el-card
          style="max-width: 50%; min-width: 1060px;margin-bottom: 20px"
          shadow="always"
        >
          <template #header>
            轮廓&自由绘制
          </template>
          <el-radio-group
            v-model="checkedTool"
            @change="handleToolChange"
          >
            <el-radio
              v-for="(item, index) in splineAnnoToolsConfig"
              :key="index"
              class="radio-item"
              :value="item.toolName"
            >
              {{ item.label }}（{{ item.desc || item.toolName }}）
            </el-radio>
          </el-radio-group>
        </el-card>
      </div>

      <div class="form-item-group">
        <el-card
          style="max-width: 50%; min-width: 1060px;margin-bottom: 20px"
          shadow="always"
        >
          <template #header>
            特定场景绘制工具
          </template>
          <el-radio-group
            v-model="checkedTool"
            @change="handleToolChange"
          >
            <el-radio
              v-for="(item, index) in specificTool"
              :key="index"
              class="radio-item"
              :value="item.toolName"
            >
              {{ item.label }}（{{ item.desc || item.toolName }}）
            </el-radio>
          </el-radio-group>
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

