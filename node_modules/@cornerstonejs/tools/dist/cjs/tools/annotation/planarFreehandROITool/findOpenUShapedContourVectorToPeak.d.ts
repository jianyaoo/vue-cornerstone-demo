import type { Types } from '@cornerstonejs/core';
import { PlanarFreehandROIAnnotation } from '../../../types/ToolSpecificAnnotationTypes';
export default function findOpenUShapedContourVectorToPeak(canvasPoints: Types.Point2[], viewport: Types.IStackViewport | Types.IVolumeViewport): Types.Point3[];
export declare function findOpenUShapedContourVectorToPeakOnRender(enabledElement: Types.IEnabledElement, annotation: PlanarFreehandROIAnnotation): Types.Point3[];
