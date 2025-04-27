<script setup>
	import { addTools, changeTool } from '../../cornerstone/tools/utils'
	import {
		createIds,
		ctVolumeId,
		preType,
		renderingEngine_id,
		toolGroupId,
		toolGroupIdByStack,
		toolGroupIdByVolume
	} from "../../enums/cs";
	import useLoading from "../../hooks/useLoading";
	import useInitCS from "../../hooks/useInitCS";
	import {
		baseSegToolConfig,
		registerAllTools,
	} from "../../cornerstone/tools/registerToolList";
	import { volumeLoader } from "@cornerstonejs/core";
	import { segmentation, Enums as csToolsEnums } from "@cornerstonejs/tools";
	import destoryCS from "../../cornerstone/helper/destoryCS";
	
	const volumeVp = createIds(preType.volumeVP, 3);
	const volumeDom = createIds(preType.volumeDom, 3);
	
	const {loading} = useLoading();
	
	const checkedToolName = ref("")
	const checkedToolObj = ref(null)
	const segmentationId = 'MY_SEGMENTATION_ID';
	
	onMounted(async () => {
		await useInitCS(
				['volume'],
				{
					beforeRenderHook: addSegmentationsToState
				},
				{},
				addTools([...baseSegToolConfig], volumeVp));
	});
	
	onBeforeUnmount(() => {
		destoryCS(renderingEngine_id, [toolGroupIdByVolume, toolGroupIdByStack]);
	});
	
	async function addSegmentationsToState() {
		// Create a segmentation of the same resolution as the source data
		await volumeLoader.createAndCacheDerivedLabelmapVolume(ctVolumeId, {
			volumeId: segmentationId,
		});
		
		// Add the segmentations to state
		segmentation.addSegmentations([
			{
				segmentationId,
				representation: {
					type: csToolsEnums.SegmentationRepresentations.Labelmap,
					data: {
						volumeId: segmentationId,
					},
				},
			},
		]);
		
		await segmentation.addSegmentationRepresentations(toolGroupIdByVolume, [
			{
				segmentationId,
				type: csToolsEnums.SegmentationRepresentations.Labelmap,
			},
		]);
	}
	
	function handleToolChange(toolName) {
		checkedToolObj.value = registerAllTools.find(item => item.toolName === toolName);
		changeTool(toolName, 'Disabled')
	}
</script>

<template>
  <div>
    <h3 class="page-title">
      分割工具演示示例<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>
		
    <div class="opt-wrap">
      <div class="form">
        <div class="form-item-group">
          <el-card
            style="max-width: 50%; min-width: 800px;margin-bottom: 20px"
            shadow="always"
          >
            <template #header>
              基础分割工具
            </template>
						
            <el-radio-group
              v-model="checkedToolName"
              @change="handleToolChange"
            >
              <template
                v-for="(item, index) in baseSegToolConfig"
                :key="index"
              >
                <el-radio
                  v-if="!item.hide"
                  class="radio-item"
                  :value="item.toolName"
                >
                  {{ item.label }} {{ item.desc ? `(${item.desc})` : '' }}
                </el-radio>
              </template>
            </el-radio-group>
          </el-card>
        </div>
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
    </div>
  </div>
</template>

<style>

</style>
