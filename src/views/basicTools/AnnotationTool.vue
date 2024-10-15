<script setup>
	import { getRenderingEngine } from "@cornerstonejs/core";
	import { annotation} from "@cornerstonejs/tools";
	import {
		baseAnnoToolConfig,
		splineAnnoToolsConfig,
		specificTool,
		registerAllTools
	} from '@/cornerstone/tools/registerToolList'
	import { addTools, changeTool } from '@/cornerstone/tools/utils'
	import { createIds, preType, renderingEngine_id, } from "@/enums/cs";
	import useInitCS from '@/hooks/useInitCS'
	import useLoading from "@/hooks/useLoading";


	
	
	const result = ref();
	const volumeVp = createIds(preType.volumeVP, 3);
	const volumeDom = createIds(preType.volumeDom, 3);
	const stackVp = createIds(preType.stackVP, 1);
	const stackDom = createIds(preType.stackDom, 1);
	
	const actuator = {
		allToolAnno: () => result.value = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`)),
		toolAnnoCount: () => result.value = annotation.state.getNumberOfAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`)),
		allAnno: () => result.value = annotation.state.getAllAnnotations(),
		removeAllAnno: () => {
			annotation.state.removeAllAnnotations();
			getRenderingEngine(renderingEngine_id).render()
		},
		getSingleAnno: (uid) => result.value = annotation.state.getAnnotation(uid),
		removeSingleAnno: (uid) => annotation.state.removeAnnotation(uid),
	}
	
	const stateButton = [
		{
			text: '获取当前工具的所有注释',
			action: actuator.allToolAnno,
		},
		{
			text: '获取当前工具的注释数量',
			action: actuator.toolAnnoCount,
		},
		{
			text: '获取所有工具的全部注释',
			action: actuator.allAnno,
		},
		{
			text: '删除所有工具的全部注释',
			action: actuator.removeAllAnno,
		},
		{
			text: '获取指定注释',
			action: actuator.getSingleAnno,
		},
		{
			text: '删除指定注释',
			action: actuator.removeSingleAnno,
		}
	]
	const selectedButton = [{
		text: '',
		action: ''
	}]
	
	
	const {loading} = useLoading();
	
	const checkedToolName = ref("")
	const checkedToolObj = ref(null)
	
	onMounted(async () => {
		await useInitCS(
				['volume', 'stack'],
				{},
				{},
				addTools([...baseAnnoToolConfig, ...splineAnnoToolsConfig, ...specificTool], volumeVp, stackVp));
	});
	
	function handleToolChange(toolName) {
		checkedToolObj.value = registerAllTools.find(item => item.toolName === toolName);
		changeTool(toolName, 'Disabled')
	}
</script>

<template>
  <div>
    <h3 class="page-title">
      注释测量工具演示示例<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>
		
    <div class="opt-wrap">
      <div class="form">
        <div class="form-item-group">
          <el-card
            style="max-width: 50%; min-width: 800px;margin-bottom: 20px"
            shadow="always"
          >
            <template #header>
              基础测量工具
            </template>
						
            <el-radio-group
              v-model="checkedToolName"
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
            style="max-width: 50%; min-width: 800px;margin-bottom: 20px"
            shadow="always"
          >
            <template #header>
              轮廓&自由绘制
            </template>
            <el-radio-group
              v-model="checkedToolName"
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
            style="max-width: 50%; min-width: 800px;margin-bottom: 20px"
            shadow="always"
          >
            <template #header>
              特定场景绘制工具
            </template>
            <el-radio-group
              v-model="checkedToolName"
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
			
      <div class="opt">
        <div v-if="checkedToolObj">
          <div class="title">
            工具操作
          </div>
          <p style="font-size: 14px;">
            激活中的工具：
            <el-tag
              type="success"
            >
              {{ checkedToolObj?.label }}({{ checkedToolObj?.toolName }}
            </el-tag>
          </p>
					
          <div class="opt-item-wrap">
            <label>状态类操作：</label>
            <div>
              <el-button
                v-for="(item, index) in stateButton"
                :key="index"
                class="button"
                type="primary"
                size="small"
                @click="item.action"
              >
                {{ item.text }}
              </el-button>
            </div>
          </div>
					
          <div class="result-wrap">
            <div class="title">
              执行结果
            </div>
            <textarea
              :value="JSON.stringify(result)"
              class="result-text"
            />
          </div>
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
	
	.opt-wrap {
		display: flex;
		
		.form {
			width: 820px;
		}
		
		.opt {
			background: #409eff36;
			padding: 20px;
			flex: 1;
			
			.title {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
			}
			
			.opt-item-wrap {
				display: flex;
				margin-top: 20px;
				font-size: 15px;
				
				label {
					display: inline-block;
					text-align: right;
					margin-right: 10px;
					width: 150px;
				}
				
				.button {
					margin-bottom: 10px;
				}
			}
			
			.result-wrap {
				textarea {
					width: 97%;
					height: 200px;
					overflow-y: auto;
					border: 1px solid #9CCDF0;
					padding: 10px;
				}
			}
		}
	}
</style>

