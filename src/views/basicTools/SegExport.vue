<script setup>
	import {
		Enums as csEnums,
			utilities as csUtil,
		RenderingEngine,
		volumeLoader,
		setVolumesForViewports,
		cache,
		metaData,
		imageLoader
	} from "@cornerstonejs/core";
	
	import {
		Enums as cstEnums,
		segmentation,
		ToolGroupManager,
		addTool,
		SegmentationDisplayTool,
		BrushTool, StackScrollMouseWheelTool
	} from "@cornerstonejs/tools";
	import dcmjs from "dcmjs";
	
	import {
		adaptersSEG,
		helpers
	} from "@cornerstonejs/adapters";
	
	import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
	
	import initCornerstone from "@/cornerstone/helper/initCornerstone";
	import getTestImageId from "@/cornerstone/helper/getTestImageId";
	import destoryCS from "@/cornerstone/helper/destoryCS";
	
	const renderingEngineId = "my_renderingEngine";
	const volumeId = "my_volume_id";
	const toolGroupId = "my_tool_group";
	
	const viewportId1 = "CT_AXIAL";
	const viewportId2 = "CT_SAGITTAL";
	const viewportId3 = "CT_CORONAL";
	let imageIds = [];
	
	onMounted(() => {
		init();
	});
	
	onBeforeUnmount(() => {
		destoryCS(renderingEngineId, toolGroupId);
	});
	
	async function init() {
		await initCornerstone();
		
		imageIds = await getTestImageId();
		
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
		
		// 将SegmentTools添加到全局及工具组中
		addSegmentTools();
		
		// 去创建并缓存一个Volume
		const volume = await volumeLoader.createAndCacheVolume(volumeId, {
			imageIds
		});
		
		// 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
		volume.load();
		
		console.log(volume)
		
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
		addTool(StackScrollMouseWheelTool);
		
		// 创建工具组，在工具组添加
		const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
		toolGroup.addTool(StackScrollMouseWheelTool.toolName);
		toolGroup.addTool(SegmentationDisplayTool.toolName);
		toolGroup.addTool(BrushTool.toolName);
		
		toolGroup.addToolInstance("CircularBrush", BrushTool.toolName, {
			activeStrategy: "FILL_INSIDE_CIRCLE"
		});
		
		toolGroup.addViewport(viewportId1, renderingEngineId);
		toolGroup.addViewport(viewportId2, renderingEngineId);
		toolGroup.addViewport(viewportId3, renderingEngineId);
		
		// 设置当前激活的工具
		toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Auxiliary}],
		})
		toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
		toolGroup.setToolActive("CircularBrush", {
			bindings: [
				{
					mouseButton: cstEnums.MouseBindings.Primary
				}
			]
		});
	}
	
	async function addSegmentationsToState(segmentationId = 'my_segmentation') {
		
		// 导入的Seg文件与原影像建立了关联
		const derivedVolume = await volumeLoader.createAndCacheDerivedSegmentationVolume(volumeId, {
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
		
		return derivedVolume;
	}
	
	function getSegmentationIds() {
		return segmentation.state
				.getSegmentations()
				.map(x => x.segmentationId);
	}
	
	function handleExportSeg(){
		// 第一步：获取标签映射信息
		const segmentationIds = getSegmentationIds();
		
		if (!segmentationIds.length) {
			return;
		}
		
		const cacheVolume = cache.getVolume(volumeId);
		const csImages = cacheVolume.getCornerstoneImages();
		
		console.log(csImages)
		
		const activeSegmentationRepresentation =
				segmentation.activeSegmentation.getActiveSegmentationRepresentation(
						toolGroupId
				);
		
		const cacheSegmentationVolume = cache.getVolume(
				activeSegmentationRepresentation.segmentationId
		);
		console.log(cacheSegmentationVolume)
		const labelmapData = adaptersSEG.Cornerstone3D.Segmentation.generateLabelMaps2DFrom3D(
				cacheSegmentationVolume
		);
		console.log(labelmapData)
		
		
		labelmapData.metadata = [];
		labelmapData.segmentsOnLabelmap.forEach((segmentIndex) => {
			const color = segmentation.config.color.getColorForSegmentIndex(
					toolGroupId,
					activeSegmentationRepresentation.segmentationRepresentationUID,
					segmentIndex
			);
			
			const segmentMetadata = generateMockMetadata(segmentIndex, color);
			labelmapData.metadata[segmentIndex] = segmentMetadata;
		});
		
		console.log(metaData.get("instance", csImages[0].imageId))
		// 第二步：将标签信息转换为Dicom Seg数据 - 这个过程是CornerStone3D自己封装处理的
		const generatedSegmentation =
				adaptersSEG.Cornerstone3D.Segmentation.generateSegmentation(
						csImages,
						labelmapData,
						metaData
				);
		
		// 第三步：数据流进行文件下载 - 这一步也是cornerstone3D本身支持的
		helpers.downloadDICOMData(generatedSegmentation.dataset, "mySEG.nii");
	}
	
	function generateMockMetadata(segmentIndex, color) {
		const RecommendedDisplayCIELabValue = dcmjs.data.Colors.rgb2DICOMLAB(
				color.slice(0, 3).map(value => value / 255)
		).map(value => Math.round(value));
		
		return {
			SegmentedPropertyCategoryCodeSequence: {
				CodeValue: "T-D0050",
				CodingSchemeDesignator: "SRT",
				CodeMeaning: "Tissue"
			},
			SegmentNumber: segmentIndex.toString(),
			SegmentLabel: "Tissue " + segmentIndex.toString(),
			SegmentAlgorithmType: "SEMIAUTOMATIC",
			SegmentAlgorithmName: "Slicer Prototype",
			RecommendedDisplayCIELabValue,
			SegmentedPropertyTypeCodeSequence: {
				CodeValue: "T-D0050",
				CodingSchemeDesignator: "SRT",
				CodeMeaning: "Tissue"
			}
		};
	}
	
	async function handleImportSeg(files){
		if (!volumeId) {
			return;
		}
		
		for (const file of files) {
			await readSegmentation(file);
		}
	}
	
	async  function readSegmentation(file){
		const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
		const image = await imageLoader.loadAndCacheImage(imageId);
		
		if (!image) {
			return;
		}
		console.log(imageId)
		const instance = metaData.get("instance", imageId);
		console.log(instance)
		if (instance.Modality !== "SEG") {
			console.error("This is not segmentation: " + file.name);
			return;
		}
		const arrayBuffer = image.data.byteArray.buffer;
		loadSegmentation(arrayBuffer);
	}
	
	async function loadSegmentation(arrayBuffer){
		const newSegmentationId = "LOAD_SEG_ID:" + csUtil.uuidv4();
		const generateToolState =
				await adaptersSEG.Cornerstone3D.Segmentation.generateToolState(
						imageIds,
						arrayBuffer,
						metaData
				);
		
		const derivedVolume = await addSegmentationsToState(newSegmentationId);
		//
		const derivedVolumeScalarData = derivedVolume.getScalarData();
		derivedVolumeScalarData.set(
				new Uint8Array(generateToolState.labelmapBufferArray[0])
		);
	}
	
	function handFileChange(evt){
		const files = evt.target.files;
		handleImportSeg(files)
	}
</script>

<template>
	<div>
		<h3>刷子工具<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span></h3>
		<el-button @click="handleExportSeg">导出Seg</el-button>
		<input type="file" @change="handFileChange"/>
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
