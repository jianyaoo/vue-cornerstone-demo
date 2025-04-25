<script setup>
	import {
		Enums as csEnums,
		RenderingEngine,
		volumeLoader,
		setVolumesForViewports, CONSTANTS,utilities
	} from "@cornerstonejs/core";
	
	import {
		Enums as cstEnums,
		segmentation,
		ToolGroupManager,
		addTool,
		SegmentationDisplayTool,
		BrushTool
	} from "@cornerstonejs/tools";
	
	import initCornerstone from "@/cornerstone/helper/initCornerstone";
	import getTestImageId from "@/cornerstone/helper/getTestImageId";
	import destoryCS from "@/cornerstone/helper/destoryCS";
	
	const renderingEngineId = "my_renderingEngine";
	const volumeId = "my_volume_id";
	const toolGroupId = "my_tool_group";
	const toolGroupId3D = "my_tool_group_3D";
	
	const viewportId1 = "CT_AXIAL";
	const viewportId2 = "CT_SAGITTAL";
	const viewportId3 = "CT_CORONAL";
	
	onMounted(() => {
		init();
	});
	
	onBeforeUnmount(() => {
		destoryCS(renderingEngineId, toolGroupId);
		destoryCS(renderingEngineId, toolGroupId3D);
	});
	
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
				type: csEnums.ViewportType.VOLUME_3D,
				element: document.querySelector("#element3"),
				defaultOptions: {
					background: CONSTANTS.BACKGROUND_COLORS.slicer3D,
				}
			}
		];
		renderingEngine.setViewports(viewportInputArray);
		
		// 将SegmentTools添加到全局及工具组中
		addSegmentTools();
		
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
		
		const volumeActor = renderingEngine.getViewport(viewportId3).getDefaultActor()
				.actor;
		utilities.applyPreset(
				volumeActor,
				CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Bone')
		);
		volumeActor.setVisibility(false);
		
		
		// 向状态管理中新增分割器
		await addSegmentationsToState();
		
		// 渲染图像
		renderingEngine.renderViewports([
			viewportId1,
			viewportId2,
			viewportId3
		]);
	}
	
	function addSegmentTools() {
		//  顶层API全局添加
		addTool(SegmentationDisplayTool);
		addTool(BrushTool);
		
		// 创建工具组，在工具组添加
		const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
		const toolGroup3D = ToolGroupManager.createToolGroup(toolGroupId3D);
		toolGroup.addTool(SegmentationDisplayTool.toolName);
		toolGroup3D.addTool(SegmentationDisplayTool.toolName);
		toolGroup.addTool(BrushTool.toolName);
		
		
		toolGroup.addToolInstance("CircularBrush", BrushTool.toolName, {
			activeStrategy: "FILL_INSIDE_CIRCLE"
		});
		
		toolGroup.addViewport(viewportId1, renderingEngineId);
		toolGroup.addViewport(viewportId2, renderingEngineId);
		toolGroup3D.addViewport(viewportId3, renderingEngineId);
		
		// 设置当前激活的工具
		toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
		toolGroup3D.setToolEnabled(SegmentationDisplayTool.toolName);
		toolGroup.setToolActive("CircularBrush", {
			bindings: [
				{
					mouseButton: cstEnums.MouseBindings.Primary
				}
			]
		});
	}
	
	async function addSegmentationsToState() {
		const segmentationId = "my_segmentation";
		
		await volumeLoader.createAndCacheDerivedSegmentationVolume(volumeId, {
			volumeId: segmentationId
		});
		
		segmentation.addSegmentations([
			{
				segmentationId: segmentationId,
				representation: {
					type: cstEnums.SegmentationRepresentations.Labelmap,
					data: {
						volumeId: segmentationId
					}
				}
			}
		]);
		
		await segmentation.addSegmentationRepresentations(toolGroupId, [
			{
				segmentationId: segmentationId,
				type: cstEnums.SegmentationRepresentations.Labelmap
			}
		]);
		
		await segmentation.addSegmentationRepresentations(toolGroupId3D, [
			{
				segmentationId: segmentationId,
				type: cstEnums.SegmentationRepresentations.Surface,
				options: {
					polySeg: {
						enabled: true,
					},
				},
			}
		]);
	}
</script>

<template>
	<div>
		<h3>刷子工具<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span></h3>
		<div id="demo-wrap">
			<div
					id="element1"
					v-loading="loading"
					class="cornerstone-item"
					element-loading-text="Loading..."
					element-loading-background="rgba(6, 28, 73, 0.2)"
			/>
			<div
					id="element2"
					v-loading="loading"
					class="cornerstone-item"
					element-loading-text="Loading..."
					element-loading-background="rgba(6, 28, 73, 0.2)"
			/>
			<div
					id="element3"
					v-loading="loading"
					class="cornerstone-item"
					element-loading-text="Loading..."
					element-loading-background="rgba(6, 28, 73, 0.2)"
			/>
		</div>
		<div id="tip">
			<p>拖动左键，使用刷子工具</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.cornerstone-item {
		display: inline-block;
		width: 300px;
		height: 300px;
		margin-top: 20px;
		margin-right: 20px;
		padding: 20px;
		border: 2px solid #96CDF2;
		border-radius: 10px;
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
