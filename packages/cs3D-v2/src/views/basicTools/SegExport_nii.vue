<script setup>
	import {
		volumeLoader,
		RenderingEngine,
		Enums as csEnums,
		setVolumesForViewports,
		eventTarget,
		cache,
		metaData
	} from "@cornerstonejs/core";
	import { cornerstoneNiftiImageVolumeLoader, Enums as niftiEnum } from "@cornerstonejs/nifti-volume-loader";
	import initCornerstone from "../../cornerstone/helper/initCornerstone";
	import destoryCS from "../../cornerstone/helper/destoryCS";
	import {
		addTool,
		BrushTool, Enums as cstEnums, segmentation,
		StackScrollTool,
		ToolGroupManager
	} from "@cornerstonejs/tools";
	import { adaptersSEG, helpers } from "@cornerstonejs/adapters";
	import dcmjs from "dcmjs";
	
	const renderingEngineId = 'my_renderingEngine_3';
	let loading = ref(true)
	
	const viewportId1 = "CT_AXIAL";
	const viewportId2 = "CT_SAGITTAL";
	const viewportId3 = "CT_CORONAL";
	const niftiURL =
			"https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz";
	const volumeId = "nifti:" + niftiURL;
	const toolGroupId = "my_tool_group";
	
	onMounted(()=>{
		init();
	})
	
	onBeforeUnmount(()=>{
		destoryCS(renderingEngineId)
	})
	
	eventTarget.addEventListener(niftiEnum.Events.NIFTI_VOLUME_LOADED, () => {
		loading.value = false;
	})
	
	async function init() {
		await initCornerstone();
		
		// step1: 注册一个nifti格式的加载器
		volumeLoader.registerVolumeLoader(
				"nifti",
				cornerstoneNiftiImageVolumeLoader
		);
		
		// step2: 声明volumeId，格式为 'nifti:'+真实的请求路径
		// 在定义volumeId时使用 nifti 前缀，便于识别使用的加载器种类

		
		await volumeLoader.createAndCacheVolume(volumeId);
		
		const renderingEngine = new RenderingEngine(renderingEngineId);
		
		
		// 在渲染引擎中创建并加载视图，使视图与HTML元素绑定
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
		
		// 将SegmentTools添加到全局及工具组中
		addSegmentTools();
		
		// 在视图上设置Volume
		await setVolumesForViewports(
				renderingEngine,
				[
					{
						volumeId: volumeId,
					},
				],
				[viewportId1, viewportId2, viewportId3]
		);
		
		
		// 向状态管理中新增分割器
		await addSegmentationsToState();
		
		// 渲染图像
		renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
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
	function handleExportSeg(){
		// 第一步：获取标签映射信息
		const segmentationIds = getSegmentationIds();
		
		if (!segmentationIds.length) {
			return;
		}
		
		const cacheVolume = cache.getVolume(volumeId);
		console.log(cacheVolume)
		const csImages = cacheVolume.getCornerstoneImages();
		// const csImages = generateVirtualImageIds(cacheVolume);
		
		
		const activeSegmentationRepresentation =
				segmentation.activeSegmentation.getActiveSegmentationRepresentation(
						toolGroupId
				);
		
		const cacheSegmentationVolume = cache.getVolume(
				activeSegmentationRepresentation.segmentationId
		);
	
		const labelmapData = adaptersSEG.Cornerstone3D.Segmentation.generateLabelMaps2DFrom3D(
				cacheSegmentationVolume
		);

		
		
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
		
		// 第二步：将标签信息转换为Dicom Seg数据 - 这个过程是CornerStone3D自己封装处理的
		const generatedSegmentation =
				adaptersSEG.Cornerstone3D.Segmentation.generateSegmentation(
						[],
						labelmapData,
						metaData
				);
		
		// 第三步：数据流进行文件下载 - 这一步也是cornerstone3D本身支持的
		helpers.downloadDICOMData(generatedSegmentation.dataset, "mySEG.dcm");
	}
	
	function generateVirtualImageIds(volume) {
		const { dimensions } = volume;
		const slices = dimensions[2]; // 获取 Z 轴切片数
		
		const virtualImageIds = [];
		for (let i = 0; i < slices; i++) {
			virtualImageIds.push(`virtualDicom://niftiSlice_${i}`);
		}
		
		console.log("虚拟 ImageIds:", virtualImageIds);
		return virtualImageIds;
	}

</script>

<template>
  <div>
    <h3>加载渲染NifTi文件</h3>
		
    <el-button @click="handleExportSeg">
      导出Seg
    </el-button>
    <input
      type="file"
      @change="handFileChange"
    >
		
    <div
      id="demo-wrap"
    >
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
  </div>
</template>


<style lang="scss" scoped>
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
</style>
