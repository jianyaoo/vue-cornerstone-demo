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
		BrushTool, StackScrollTool, Enums as csToolsEnums
	} from "@cornerstonejs/tools";
	import dcmjs from "dcmjs";
	
	import {
		adaptersSEG,
		helpers
	} from "@cornerstonejs/adapters";
	
	import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
	
	import initCornerstone from "../../cornerstone/helper/initCornerstone";
	import getTestImageId from "../../cornerstone/helper/getTestImageId";
	import destoryCS from "../../cornerstone/helper/destoryCS";
	
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
		addTool(BrushTool);
		addTool(StackScrollTool);
		
		// 创建工具组，在工具组添加
		const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
		toolGroup.addTool(StackScrollTool.toolName);
		toolGroup.addTool(BrushTool.toolName);
		
		toolGroup.addToolInstance("CircularBrush", BrushTool.toolName, {
			activeStrategy: "FILL_INSIDE_CIRCLE"
		});
		
		toolGroup.addViewport(viewportId1, renderingEngineId);
		toolGroup.addViewport(viewportId2, renderingEngineId);
		toolGroup.addViewport(viewportId3, renderingEngineId);
		
		// 设置当前激活的工具
		toolGroup.setToolActive(StackScrollTool.toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Wheel}],
		})
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
		const derivedVolume = await volumeLoader.createAndCacheDerivedLabelmapVolume(volumeId, {
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
		
		const segmentationRepresentation = {
			segmentationId,
			type: csToolsEnums.SegmentationRepresentations.Labelmap,
		};
		await segmentation.addLabelmapRepresentationToViewportMap({
			[viewportId1]: [segmentationRepresentation],
			[viewportId2]: [segmentationRepresentation],
			[viewportId3]: [segmentationRepresentation],
		});
		
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
		
		const seg = segmentation.state.getSegmentation('my_segmentation');
		const { imageIds } = seg.representationData.Labelmap;
		
		
		const segImages = imageIds.map(imageId => cache.getImage(imageId));
		const referencedImages = segImages.map(image =>
				cache.getImage(image.referencedImageId)
		);
		
		const labelmaps2D = [];
		
		let z = 0;
		for (const segImage of segImages) {
			const segmentsOnLabelmap = new Set();
			const pixelData = segImage.getPixelData();
			const { rows, columns } = segImage;
			
			for (let i = 0; i < pixelData.length; i++) {
				const segment = pixelData[i];
				if (segment !== 0) {
					segmentsOnLabelmap.add(segment);
				}
			}
			
			labelmaps2D[z++] = {
				segmentsOnLabelmap: Array.from(segmentsOnLabelmap),
				pixelData,
				rows,
				columns
			};
		}
		
		const allSegmentsOnLabelmap = labelmaps2D.map(
				labelmap => labelmap.segmentsOnLabelmap
		);
		
		const labelmap3D = {
			segmentsOnLabelmap: Array.from(new Set(allSegmentsOnLabelmap.flat())),
			metadata: [],
			labelmaps2D
		};
		
		labelmap3D.segmentsOnLabelmap.forEach(segmentIndex => {
			const color = segmentation.config.color.getSegmentIndexColor(
					viewportId1,
					'my_segmentation',
					segmentIndex
			);
			
			labelmap3D.metadata[segmentIndex] = generateMockMetadata(segmentIndex, color);
		});
		
		const generatedSegmentation =
				adaptersSEG.Cornerstone3D.Segmentation.generateSegmentation(
						referencedImages,
						labelmap3D,
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
		createSegmentationRepresentation();
	}
	
	function createSegmentationRepresentation() {
		const segmentationId = 'my_segmentation_import'
		const segMap = {
			[viewportId1]: [{ segmentationId: segmentationId }],
			[viewportId2]: [{ segmentationId: segmentationId }],
			[viewportId3]: [{ segmentationId: segmentationId }]
		};
		
		segmentation.addLabelmapRepresentationToViewportMap(segMap);
	}
	
	async  function readSegmentation(file){
		const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
		const image = await imageLoader.loadAndCacheImage(imageId);
		
		if (!image) {
			return;
		}
		const instance = metaData.get("instance", imageId);
		
		if (instance.Modality !== "SEG") {
			console.error("This is not segmentation: " + file.name);
			return;
		}
		const arrayBuffer = image.data.byteArray.buffer;
		await loadSegmentation(arrayBuffer);
	}
	
	async function loadSegmentation(arrayBuffer){
		const { labelMapImages } =
				await adaptersSEG.Cornerstone3D.Segmentation.createFromDICOMSegBuffer(
						imageIds,
						arrayBuffer,
						{
							metadataProvider: metaData
						}
				);
		
		await createSegmentation(labelMapImages);
	}
	
	async function createSegmentation(labelMapImages) {
		const imageIds = labelMapImages?.flat().map(image => image.imageId);
		
		segmentation.addSegmentations([
			{
				segmentationId:'my_segmentation_import',
				representation: {
					type: cstEnums.SegmentationRepresentations.Labelmap,
					data: {
						imageIds
					}
				}
			}
		]);
	}
	
	// V1.0 以toolGroup为组处理Seg
	// async function loadSegmentation_V1(arrayBuffer){
	// 	const newSegmentationId = "LOAD_SEG_ID:" + csUtil.uuidv4();
	// 	const generateToolState =
	// 			await adaptersSEG.Cornerstone3D.Segmentation.generateToolState(
	// 					imageIds,
	// 					arrayBuffer,
	// 					{
	// 						metadataProvider: metaData
	// 					}
	// 			);
	//
	// 	const derivedVolume = await addSegmentationsToState(newSegmentationId);
	// 	//
	// 	const voxelManager = derivedVolume.voxelManager;
	// 	const derivedVolumeScalarData = voxelManager.getCompleteScalarDataArray();
	//
	// 	derivedVolumeScalarData.set(
	// 			new Uint8Array(generateToolState.labelmapBufferArray[0])
	// 	);
	// }
	
	function handFileChange(evt){
		const files = evt.target.files;
		handleImportSeg(files)
	}
</script>

<template>
  <div>
    <h3>刷子工具<span class="sub-tip"> ( 🔥🔥🔥 如果多次拖动后存在无响应的情况，先按 ESC 键，再拖动鼠标 )</span></h3>
    <el-button @click="handleExportSeg">
      导出Seg
    </el-button>
    <input
      type="file"
      @change="handFileChange"
    >
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
