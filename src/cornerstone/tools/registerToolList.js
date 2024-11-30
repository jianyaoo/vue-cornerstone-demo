import { Enums as csEnums } from '@cornerstonejs/core'
import {
  AdvancedMagnifyTool,
  AngleTool,
  ArrowAnnotateTool, BrushTool, CircleROIStartEndThresholdTool,
  CircleROITool, CircleScissorsTool,
  CobbAngleTool,
  CrosshairsTool,
  EllipticalROITool,
  KeyImageTool,
  LengthTool,
  LivewireContourTool,
  MagnifyTool,
  OverlayGridTool, PaintFillTool,
  PlanarFreehandROITool,
  ProbeTool, RectangleROIStartEndThresholdTool, RectangleROIThresholdTool,
  RectangleROITool, RectangleScissorsTool,
  ReferenceCursors,
  ReferenceLinesTool,
  ScaleOverlayTool, SegmentationDisplayTool, SegmentSelectTool, SphereScissorsTool,
  SplineROITool, UltrasoundDirectionalTool,
} from '@cornerstonejs/tools'

const vpTypeEnums = csEnums.ViewportType;

/** =========================================== 注释工具声明 Start =============================================== **/
// 线条工具实例
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
  if (item === 'CARDINAL') {
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
  }, {
    label: '超声波束的方向测量工具',
    toolName: UltrasoundDirectionalTool.toolName,
    tool: UltrasoundDirectionalTool,
    vpType: [vpTypeEnums.STACK],
  }
]
/** =========================================== 注释工具声明 end =============================================== **/


/** =========================================== 分割工具声明 Start ============================================= **/
// 刷子工具实例
const brushInstanceNames = {
  CircularBrush: 'CircularBrush',
  CircularEraser: 'CircularEraser',
  SphereBrush: 'SphereBrush',
  SphereEraser: 'SphereEraser',
  ThresholdCircle: 'ThresholdCircle',
};
const brushStrategies = {
  [brushInstanceNames.CircularBrush]: 'FILL_INSIDE_CIRCLE',
  [brushInstanceNames.CircularEraser]: 'ERASE_INSIDE_CIRCLE',
  [brushInstanceNames.SphereBrush]: 'FILL_INSIDE_SPHERE',
  [brushInstanceNames.SphereEraser]: 'ERASE_INSIDE_SPHERE',
  [brushInstanceNames.ThresholdCircle]: 'THRESHOLD_INSIDE_CIRCLE',
};
const brushInstanceLabel = {
  [brushInstanceNames.CircularBrush]: '圆形刷子',
  [brushInstanceNames.CircularEraser]: '圆形橡皮擦',
  [brushInstanceNames.SphereBrush]: '球形刷子',
  [brushInstanceNames.SphereEraser]: '球形橡皮擦',
  [brushInstanceNames.ThresholdCircle]: '阈值刷子',
};
const brushInstance = Object.values(brushInstanceNames).map(toolName => {
  return {
    type: 'instance',
    label: `刷子工具(${toolName})`,
    toolName: `${toolName}`,
    tool: BrushTool,
    vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
    desc: brushInstanceLabel[toolName],
    config: {
      activeStrategy: brushStrategies[toolName],
    }
  }
})

// 基础分割工具
export const baseSegToolConfig = [{
  label: 'SegmentationDisplayTool',
  hide: true,
  toolName: SegmentationDisplayTool.toolName,
  tool: SegmentationDisplayTool,
  vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
}, {
  label: '刷子工具',
  hide: true,
  toolName: BrushTool.toolName,
  tool: BrushTool,
  vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
},
  ...brushInstance,
   {
    label: `圆形剪切(CircleScissorsTool)`,
    toolName: CircleScissorsTool.toolName,
    tool: CircleScissorsTool,
    vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
  }, {
    label: '填充工具(PaintFillTool)',
    toolName: PaintFillTool.toolName,
    tool: PaintFillTool,
    vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
  }, {
    label: '方形剪切(RectangleScissorsTool)',
    toolName: RectangleScissorsTool.toolName,
    tool: RectangleScissorsTool,
    vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
  }, {
    label: '球形剪切(SphereScissorsTool)',
    toolName: SphereScissorsTool.toolName,
    tool: SphereScissorsTool,
    vpType: [vpTypeEnums.ORTHOGRAPHIC, vpTypeEnums.STACK],
  }]

/** =========================================== 分割工具声明 end ============================================= **/


export const registerAllTools = [
  ...baseAnnoToolConfig,
  ...splineAnnoToolsConfig,
  ...specificTool,
  ...baseSegToolConfig
]
