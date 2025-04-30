<script setup>
	import {
		volumeLoader,
		RenderingEngine,
		Enums as csEnums,
		setVolumesForViewports,
	} from "@cornerstonejs/core";
	import {
		Enums as cstEnums,
		StackScrollTool,
		ToolGroupManager,
		addTool
	} from "@cornerstonejs/tools";
	
	
	import initCornerstone from "@/cornerstone/helper/initCornerstone";
	import destoryCS from "@/cornerstone/helper/destoryCS";
	import useLoading from "@/hooks/useLoading";
	import initProvidersCustom from "@/cornerstone/helper/initProvidersCustom";
	
	const volumeId = 'my_volume_id_2';
	const renderingEngineId = 'my_renderingEngine_2';
	let volumeIns = null;
	
	onMounted(() => {
		init()
	});
	
	onBeforeUnmount(() => {
		destoryCS(renderingEngineId, 'groupId')
	})
	
	const {loading} = useLoading();
	
	async function init() {
		await initCornerstone();
		
		// Notes：非必须，当使用wadourl渲染时，出现MetaData解析失败的问题，可以手动添加一下provider
		initProvidersCustom();
		
		addTools();
		
		const imageIds = [
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000000.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000001.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000002.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000003.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000004.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000005.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000006.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000007.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000008.dcm',
			'wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000009.dcm',
		];
		
		// step1: 准备一个渲染引擎 => renderingEngine
		const renderingEngine = new RenderingEngine(renderingEngineId);
		
		// step2: 核心步骤 => 创建并缓存一个Volume
		const volume = await volumeLoader.createAndCacheVolume(volumeId, {
			imageIds,
		});
		volumeIns = volume;
		
		// step3: 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
		const viewportId1 = "CT_AXIAL";
		const viewportId2 = "CT_SAGITTAL";
		const viewportId3 = "CT_CORONAL";
		const viewportInputArray = [
			{
				viewportId: viewportId1,
				type: csEnums.ViewportType.ORTHOGRAPHIC,
				element: document.querySelector("#element1"),
				defaultOptions: {
					orientation: csEnums.OrientationAxis.AXIAL,
				},
			},
			{
				viewportId: viewportId2,
				type: csEnums.ViewportType.ORTHOGRAPHIC,
				element: document.querySelector("#element2"),
				defaultOptions: {
					orientation: csEnums.OrientationAxis.SAGITTAL,
				},
			},
			{
				viewportId: viewportId3,
				type: csEnums.ViewportType.ORTHOGRAPHIC,
				element: document.querySelector("#element3"),
				defaultOptions: {
					orientation: csEnums.OrientationAxis.CORONAL,
				},
			},
		];
		renderingEngine.setViewports(viewportInputArray);
		
		const toolGroup = ToolGroupManager.getToolGroup("groupId");
		toolGroup.addViewport(viewportId1, renderingEngineId);
		toolGroup.addViewport(viewportId2, renderingEngineId);
		toolGroup.addViewport(viewportId3, renderingEngineId);
		
		// step4:  加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
		await volume.load();
		
		// step5: 在视图上设置Volume
		await setVolumesForViewports(
				renderingEngine,
				[
					{
						volumeId,
					},
				],
				[viewportId1, viewportId2, viewportId3]
		);
		
		toolGroup.setToolActive(StackScrollTool.toolName, {
			bindings: [{
				mouseButton: cstEnums.MouseBindings.Wheel
			}]
		});
		
		// step6: 渲染图像
		renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
	}
	
	function addTools() {
		addTool(StackScrollTool);
		
		const toolGroup = ToolGroupManager.createToolGroup("groupId");
		toolGroup.addTool(StackScrollTool.toolName);
	}
</script>

<template>
  <div>
    <h3>渲染Volume wadouri格式</h3>
    <div id="demo-wrap">
      <div
        id="element1"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
      <div
        id="element2"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
      <div
        id="element3"
        class="cornerstone-item"
        element-loading-text="Loading..."
        element-loading-background="rgba(6, 28, 73, 0.2)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
