import { Enums as csEnums } from '@cornerstonejs/core'
import {
	AdvancedMagnifyTool,
	AngleTool,
	ArrowAnnotateTool,
	CircleROITool,
	CobbAngleTool,
	CrosshairsTool,
	EllipticalROITool,
	KeyImageTool,
	LengthTool,
	LivewireContourTool,
	MagnifyTool,
	OverlayGridTool,
	PlanarFreehandROITool,
	ProbeTool,
	RectangleROITool,
	ReferenceCursors,
	ReferenceLinesTool,
	ScaleOverlayTool,
	SplineROITool, UltrasoundDirectionalTool,
} from '@cornerstonejs/tools'

const vpTypeEnums = csEnums.ViewportType;

const DEFAULT_CARDINAL_SCALE = 0.5;
const splineTypesDesc = {
	[SplineROITool.SplineTypes.Cardinal]: '张量样条',
	[SplineROITool.SplineTypes.Linear]: '线性样条',
	[SplineROITool.SplineTypes.CatmullRom]: '卡特姆-罗姆样条',
	[SplineROITool.SplineTypes.BSpline]: 'B样条',
}

// 基础测量工具配置项
export const baseAnnoToolConfig = [
	{
		label: '长度测量工具',
		toolName: LengthTool.toolName,
		tool: LengthTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '探针测量工具',
		toolName: ProbeTool.toolName,
		tool: ProbeTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '长方形ROI测量',
		toolName: RectangleROITool.toolName,
		tool: RectangleROITool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '椭圆形ROI测量',
		toolName: EllipticalROITool.toolName,
		tool: EllipticalROITool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '圆形ROI测量',
		toolName: CircleROITool.toolName,
		tool: CircleROITool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '箭头标注',
		toolName: ArrowAnnotateTool.toolName,
		tool: ArrowAnnotateTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '通用角度测量',
		toolName: AngleTool.toolName,
		tool: AngleTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
]

// 样条曲线工具实例配置项
const splineInstance = Object.values(SplineROITool.SplineTypes).map((item, index) => {
	let config = {};
	if (item === 'CARDINAL'){
		config = {
			spline: {
				type: item,
				configuration: {
					[item]: {
						scale: DEFAULT_CARDINAL_SCALE,
					},
				},
			},
		}
	}

	return {
		type: 'instance',
		label: `样条曲线绘制工具(${item})`,
		toolName: `${item}Tool`,
		tool: SplineROITool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
		desc: splineTypesDesc[item],
		config
	}
})

// 轮廓绘制工具配置项
export const splineAnnoToolsConfig = [
	{
		label: '动态轮廓测量工具',
		toolName: LivewireContourTool.toolName,
		tool: LivewireContourTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	{
		label: '自由曲线测量工具',
		toolName: PlanarFreehandROITool.toolName,
		tool: PlanarFreehandROITool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},
	...splineInstance
]

export const specificTool = [
	{
		label: '脊柱侧弯角度测量工具',
		toolName: CobbAngleTool.toolName,
		tool: CobbAngleTool,
		vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
	},{
		label: '超声波束的方向测量工具',
		toolName: UltrasoundDirectionalTool.toolName,
		tool: UltrasoundDirectionalTool,
		vpType: [vpTypeEnums.STACK],
	}
]



export const advancedTools = [
	KeyImageTool, // 关键图像标记管理工具
	MagnifyTool, // 放大镜
	AdvancedMagnifyTool, // 高级放大镜工具
	CrosshairsTool, // 十字线工具
	ReferenceLinesTool, // 参考线工具
	ReferenceCursors, //  同步参考光标工具
	OverlayGridTool,// 网格线工具
	ScaleOverlayTool, // 比例尺工具
]

export const registerAllTools = [
	...baseAnnoToolConfig,
	...splineAnnoToolsConfig,
	...specificTool
]
