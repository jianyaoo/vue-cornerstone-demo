<script setup>
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';
	import { eventTarget, getRenderingEngine, utilities as csUtils } from "@cornerstonejs/core";
	import { annotation, Enums as cstEnums } from "@cornerstonejs/tools";
	import { addTools, changeTool } from "@/cornerstone/tools/utils";
	import destoryCS from "@/cornerstone/helper/destoryCS";
	import { baseAnnoToolConfig, registerAllTools } from "@/cornerstone/tools/registerToolList";
	import { createIds, ctVolumeId, preType, renderingEngine_id, toolGroupIdByVolume } from "@/enums/cs";
	import useInitCS from "@/hooks/useInitCS";
	import useLoading from "@/hooks/useLoading";
	
	const volumeVp = createIds(preType.volumeVP, 3);
	const volumeDom = createIds(preType.volumeDom, 3);
	const {loading} = useLoading();
	
	const checkedToolName = ref("")
	const checkedToolObj = ref(null)
	const result = ref(null)
	const allAnnotation = ref([]);
	const isJson = computed(() => {
		const objectTypes = ['[object Object]', '[object Array]'];
		return objectTypes.includes(Object.prototype.toString.call(result.value));
	})
	
	onMounted(async () => {
		await useInitCS(
				['volume'],
				{},
				{},
				addTools([...baseAnnoToolConfig], volumeVp));
	});
	
	onBeforeUnmount(() => {
		destoryCS(renderingEngine_id, [toolGroupIdByVolume]);
	});
	
	
	eventTarget.addEventListener(cstEnums.Events.ANNOTATION_ADDED, () => {
		allAnnotation.value = annotation.state.getAllAnnotations()
	})
	
	const apiGroups = [{
		label: '交互类1 - 选中状态',
		button: 'selection'
	}, {
		label: '交互类2 - 锁定状态',
		button: 'locking'
	}, {
		label: '交互类3 - 显示隐藏',
		button: 'visibility'
	}, {
		label: '交互类4 - 设置样式',
		button: 'style'
	}, {
		label: '交互类5 - 编程式新增注释',
		button: 'program'
	}]
	
	const buttons = {
		selection: [{
			text: '获取所有选中的注释',
			action: () => result.value = annotation.selection.getAnnotationsSelected()
		}, {
			text: '获取某个工具下的注释',
			action: () => result.value = annotation.selection.getAnnotationsSelectedByToolName(checkedToolName.value)
		}, {
			text: '获取选中的个数',
			action: () => result.value = annotation.selection.getAnnotationsSelectedCount()
		}, {
			text: '设置第一个注释为选中',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0].annotationUID;
				annotation.selection.setAnnotationSelected(uid);
				nextTick(() => {
					result.value = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]
				})
			}
		}, {
			text: '判断第一个注释是否是选中状态',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0].annotationUID;
				result.value = annotation.selection.isAnnotationSelected(uid)
			}
		}, {
			text: '取消第一个注释的选中状态',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0].annotationUID;
				annotation.selection.deselectAnnotation(uid);
				nextTick(() => {
					result.value = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]
				})
			}
		}],
		locking: [{
			text: '初始化注释的locked属性',
			action: () => {
				const a1 = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0];
				annotation.locking.checkAndDefineIsLockedProperty(a1);
				result.value = a1;
			}
		}, {
			text: '获取当前锁定的所有注释',
			action: () => {
				result.value = annotation.locking.getAnnotationsLocked()
			}
		}, {
			text: '获取当前锁定的个数',
			action: () => {
				result.value = annotation.locking.getAnnotationsLockedCount()
			}
		}, {
			text: '设置第一个注释的锁定状态',
			action: () => {
				const a1 = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0];
				annotation.locking.setAnnotationLocked(a1, true);
				nextTick(() => {
					result.value = a1;
				})
			}
		}, {
			text: '取消第一个注释的锁定状态',
			action: () => {
				const a1 = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0];
				annotation.locking.setAnnotationLocked(a1, false);
				nextTick(() => {
					result.value = a1;
				})
			}
		}, {
			text: '取消所有注释的锁定状态',
			action: () => {
				annotation.locking.unlockAllAnnotations();
				result.value = annotation.locking.getAnnotationsLockedCount();
			}
		}, {
			text: '判断第一个注释是否被锁定',
			action: () => {
				const a1 = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0];
				result.value = annotation.locking.isAnnotationLocked(a1);
			}
		}],
		visibility: [{
			text: '显示所有的注释',
			action: () => {
				annotation.visibility.showAllAnnotations();
				getRenderingEngine(renderingEngine_id).getViewport(volumeVp[0]).render()
			}
		}, {
			text: '隐藏第一个注释',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]?.annotationUID;
				annotation.visibility.setAnnotationVisibility(uid, false);
				getRenderingEngine(renderingEngine_id).getViewport(volumeVp[0]).render();
				nextTick(() => {
					result.value = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]
				})
			}
		}, {
			text: '显示第一个注释',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]?.annotationUID;
				annotation.visibility.setAnnotationVisibility(uid, true);
				getRenderingEngine(renderingEngine_id).getViewport(volumeVp[0]).render();
				nextTick(() => {
					result.value = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]
				})
			}
		}, {
			text: '判断第一个注释的显示状态',
			action: () => {
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]?.annotationUID;
				result.value = annotation.visibility.isAnnotationVisible(uid)
			}
		}],
		style: [{
			text: '设置全局自定义样式',
			action: () => {
				const newStyle = {
					global: {
						color: 'rgb(0, 100, 0)',
						colorSelected: 'rgb(255, 0, 0)',
						colorLocked: 'rgb(0, 0, 255)',
					}
				}
				annotation.config.style.setDefaultToolStyles(newStyle);
			}
		}, {
			text: '设置某个工具的自定义样式',
			action: () => {
				const styles = {
					Length: {
						colorHighlighted: 'rgb(255, 0, 0)',
					},
					global: {
						lineWidth: '2',
					},
				}
				annotation.config.style.setToolGroupToolStyles(toolGroupIdByVolume, styles);
			}
		}, {
			text: '设置某个视口的自定义样式',
			action: () => {
				const styles = {
					Length: {
						colorHighlighted: 'rgb(255, 0, 255)',
					},
					global: {
						lineWidth: '2',
					},
				}
				annotation.config.style.setViewportToolStyles(volumeVp[0], styles);
			}
		}, {
			text: '设置某个注释的自定义样式',
			action: () => {
				const styles = {
					colorHighlighted: 'rgb(255, 0, 0)',
				};
				const uid = annotation.state.getAnnotations(checkedToolName.value, document.querySelector(`#${volumeDom[0]}`))?.[0]?.annotationUID;
				annotation.config.style.setAnnotationStyles(uid, styles);
			}
		}],
		program: [
			{
				text: '使用代码新增一个世界坐标注释',
				action: () => {
					const viewport = getRenderingEngine(renderingEngine_id)?.getViewport(volumeVp[0]);
					const camera = viewport?.getCamera();
					const annotationManager = annotation.state.getAnnotationManager();
					const newAnnotation1 = {
						annotationUID: csUtils.uuidv4(),
						invalidated: true,
						isLocked: false,
						isVisible: true,
						metadata: {
							FrameOfReferenceUID: annotationManager.getGroupKey(document.querySelector(`#${volumeDom[0]}`)),
							cameraFocalPoint: camera.focalPoint,
							cameraPosition: camera.position,
							volumeId: ctVolumeId,
							viewPlaneNormal: camera.viewPlaneNormal,
							viewUp: camera.viewUp,
							referencedImageId: '',
							toolName: 'Length',
						},
						data: {
							cachedStats: {},
							handles: {
								activeHandleIndex: null,
								points: [
											[
												-43.91416608593747,
												-116.80403594277189,
												-141.0900075358719
											],
											[
												71.36018388964845,
												192.42398224570468,
												-141.0900075358719
											]
										],
								textBox: {
									hasMoved: false,
									worldPosition: [0, 0, 0],
									worldBoundingBox: {
										topLeft: [0, 0, 0],
										topRight: [0, 0, 0],
										bottomLeft: [0, 0, 0],
										bottomRight: [0, 0, 0]
									}
								}
							},
						},
					};
					annotationManager.addAnnotation(newAnnotation1, annotationManager.getGroupKey(document.querySelector(`#${volumeDom[0]}`)));
					viewport.render();
					result.value = annotation.state.getAllAnnotations();
				}
			},{
				text: '使用代码新增一个屏幕坐标注释',
				action: () => {
					const viewport = getRenderingEngine(renderingEngine_id)?.getViewport(volumeVp[0]);
					const camera = viewport?.getCamera();
					const annotationManager = annotation.state.getAnnotationManager();
				
					//  二维坐标点
					const canvasPos = [[0,150], [300,150]];
					
					// 二维坐标转世界坐标 => 当前坐标点的位置是基于canvas定位的
					const worldPos = canvasPos.map(point => viewport.canvasToWorld(point))
					
					// 二维坐标转时间坐标 => 当前坐标点的位置是基于影像定位的
					const worldPos1 = canvasPos.map(point => csUtils.imageToWorldCoords(viewport.getCurrentImageId(), point))
					
					const newAnnotation1 = {
						annotationUID: csUtils.uuidv4(),
						invalidated: true,
						isLocked: false,
						isVisible: true,
						metadata: {
							FrameOfReferenceUID: viewport.getFrameOfReferenceUID,
							cameraFocalPoint: camera.focalPoint,
							cameraPosition: camera.position,
							volumeId: ctVolumeId,
							viewPlaneNormal: camera.viewPlaneNormal,
							viewUp: camera.viewUp,
							referencedImageId: '',
							toolName: 'Length',
						},
						data: {
							cachedStats: {},
							handles: {
								activeHandleIndex: null,
								points: worldPos1,
								textBox: {
									hasMoved: false,
									worldPosition: [0, 0, 0],
									worldBoundingBox: {
										topLeft: [0, 0, 0],
										topRight: [0, 0, 0],
										bottomLeft: [0, 0, 0],
										bottomRight: [0, 0, 0]
									}
								}
							},
						},
					};
					annotationManager.addAnnotation(newAnnotation1, annotationManager.getGroupKey(document.querySelector(`#${volumeDom[0]}`)));
					viewport.render();
					result.value = annotation.state.getAllAnnotations();
				}
			}
		]
	}
	
	function handleToolChange(toolName) {
		checkedToolObj.value = registerAllTools.find(item => item.toolName === toolName);
		changeTool(toolName, 'Disabled')
	}
</script>

<template>
  <div>
    <h3 class="page-title">
      注释操作API<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span>
    </h3>
    <el-alert
      title="🍊 🍊 🍊 执行任何操作前都先点击激活工具，针对测试类工具操作API基本一致，此处使用长度测量工具作为示例。在代码中搜索对应按钮的文字即可查看对应的API"
    />
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
                v-for="(item, index) in [baseAnnoToolConfig[0]]"
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
              交互API
            </template>
						
            <div>
              <div
                v-for="(group, index) in apiGroups"
                :key="index"
                class="api-group"
              >
                <label>{{ group.label }}</label>
                <div>
                  <el-button
                    v-for="(item, i) in buttons[group.button]"
                    :key="`button${i}`"
                    class="button"
                    type="primary"
                    size="small"
                    @click="item.action"
                  >
                    {{ item.text }}
                  </el-button>
                </div>
              </div>
            </div>
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
			
      <div class="result">
        <el-card
          class="result-item"
          shadow="always"
        >
          <template #header>
            当前所有注释
          </template>
          <vue-json-pretty
            :data="allAnnotation"
            class="result-content"
          />
        </el-card>
				
        <el-card
          class="result-item"
          shadow="always"
        >
          <template #header>
            API执行结果
          </template>
          <div>
            <textarea
              v-if="!isJson"
              class="result-text result-content"
              :value="result"
            />
            <vue-json-pretty
              v-else
              :data="result"
              class="result-content"
            />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
	.result {
		display: flex;
		
		.result-item {
			max-width: 50%;
			min-width: 800px;
			margin-bottom: 20px;
			
			
			&:first-child {
				margin-right: 40px;
			}
			
			.result-content {
				max-height: 400px;
				overflow-y: auto;
				
				textarea {
					width: 97%;
					height: 350px;
					overflow-y: auto;
					border: 1px solid #9CCDF0;
					padding: 10px;
				}
			}
		}
	}
	
	.api-group {
		margin-bottom: 20px;
		
		label {
			display: inline-block;
			margin-bottom: 10px;
		}
	}
</style>
