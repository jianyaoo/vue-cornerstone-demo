import type { Types } from '@cornerstonejs/core';
import { Annotation } from './AnnotationTypes';
import { ISpline } from './';
import { ContourSegmentationAnnotationData } from './ContourSegmentationAnnotation';
import { ContourAnnotation } from './ContourAnnotation';
interface ROICachedStats {
    [targetId: string]: {
        Modality: string;
        area: number;
        areaUnit: string;
        max: number;
        mean: number;
        stdDev: number;
    };
}
export interface RectangleROIAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats?: ROICachedStats | {
            pointsInVolume?: Types.Point3[];
            projectionPoints?: Types.Point3[];
            projectionPointsImageIds?: string[];
        };
    };
}
export interface ProbeAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
        };
        cachedStats: {
            [targetId: string]: {
                Modality: string;
                index: Types.Point3;
                value: number;
            };
        };
        label: string;
    };
}
export interface LengthAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats: {
            [targetId: string]: {
                length: number;
                unit: string;
            };
        };
    };
}
export interface AdvancedMagnifyAnnotation extends Annotation {
    data: {
        zoomFactor: number;
        sourceViewportId: string;
        magnifyViewportId: string;
        isCanvasAnnotation: boolean;
        handles: {
            points: [Types.Point3, Types.Point3, Types.Point3, Types.Point3];
            activeHandleIndex: number | null;
        };
    };
}
export interface CircleROIAnnotation extends Annotation {
    data: {
        handles: {
            points: [Types.Point3, Types.Point3];
            activeHandleIndex: number | null;
            textBox?: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats?: (ROICachedStats & {
            [targetId: string]: {
                radius: number;
                radiusUnit: string;
                perimeter: number;
            };
        }) | {
            pointsInVolume: Types.Point3[];
            projectionPoints: Types.Point3[][];
        };
    };
}
export declare type SplineROIAnnotation = ContourAnnotation & {
    data: {
        label?: string;
        spline: {
            type: string;
            instance: ISpline;
            resolution: number;
        };
        cachedStats?: {
            [targetId: string]: {
                Modality: string;
                area: number;
                areaUnit: string;
            };
        };
    };
};
export declare type SplineContourSegmentationAnnotation = SplineROIAnnotation & ContourSegmentationAnnotationData;
export declare type LivewireContourAnnotation = ContourAnnotation;
export declare type LivewireContourSegmentationAnnotation = LivewireContourAnnotation & ContourSegmentationAnnotationData;
export interface EllipticalROIAnnotation extends Annotation {
    data: {
        handles: {
            points: [Types.Point3, Types.Point3, Types.Point3, Types.Point3];
            activeHandleIndex: number | null;
            textBox?: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats?: ROICachedStats;
        initialRotation: number;
    };
}
export interface BidirectionalAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats: {
            [targetId: string]: {
                length: number;
                width: number;
                unit: string;
            };
        };
    };
}
export interface RectangleROIThresholdAnnotation extends Annotation {
    metadata: {
        cameraPosition?: Types.Point3;
        cameraFocalPoint?: Types.Point3;
        viewPlaneNormal?: Types.Point3;
        viewUp?: Types.Point3;
        annotationUID?: string;
        FrameOfReferenceUID: string;
        referencedImageId?: string;
        toolName: string;
        enabledElement: Types.IEnabledElement;
        volumeId: string;
    };
    data: {
        label: string;
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
        };
    };
}
export interface RectangleROIStartEndThresholdAnnotation extends Annotation {
    metadata: {
        cameraPosition?: Types.Point3;
        cameraFocalPoint?: Types.Point3;
        viewPlaneNormal?: Types.Point3;
        viewUp?: Types.Point3;
        annotationUID?: string;
        FrameOfReferenceUID: string;
        referencedImageId?: string;
        toolName: string;
        enabledElement: any;
        volumeId: string;
        spacingInNormal: number;
    };
    data: {
        label: string;
        startCoordinate: number;
        endCoordinate: number;
        cachedStats: {
            pointsInVolume: Types.Point3[];
            projectionPoints: Types.Point3[][];
            projectionPointsImageIds: string[];
            statistics?: ROICachedStats | any[];
        };
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
    };
}
export interface CircleROIStartEndThresholdAnnotation extends Annotation {
    metadata: {
        cameraPosition?: Types.Point3;
        cameraFocalPoint?: Types.Point3;
        viewPlaneNormal?: Types.Point3;
        viewUp?: Types.Point3;
        annotationUID?: string;
        FrameOfReferenceUID: string;
        referencedImageId?: string;
        toolName: string;
        enabledElement: any;
        volumeId: string;
        spacingInNormal: number;
    };
    data: {
        label: string;
        startCoordinate: number;
        endCoordinate: number;
        cachedStats?: {
            pointsInVolume: Types.Point3[];
            projectionPoints: Types.Point3[][];
            statistics?: ROICachedStats | any[];
        };
        handles: {
            points: [Types.Point3, Types.Point3];
            activeHandleIndex: number | null;
            textBox?: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
    };
}
export declare type PlanarFreehandROIAnnotation = ContourAnnotation & {
    data: {
        label?: string;
        isOpenUShapeContour?: boolean;
        openUShapeContourVectorToPeak?: Types.Point3[];
        cachedStats?: ROICachedStats;
    };
};
export declare type PlanarFreehandContourSegmentationAnnotation = PlanarFreehandROIAnnotation & ContourSegmentationAnnotationData;
export declare type InterpolationROIAnnotation = ContourAnnotation & ContourSegmentationAnnotationData & {
    metadata: {
        annotationUID?: string;
    };
    interpolationUID?: string;
    interpolationCompleted?: boolean;
    isInterpolationUpdate?: boolean;
};
export interface ArrowAnnotation extends Annotation {
    data: {
        text: string;
        handles: {
            points: Types.Point3[];
            arrowFirst: boolean;
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
    };
}
export interface AngleAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats: {
            [targetId: string]: {
                angle: number;
            };
        };
    };
}
export interface UltrasoundDirectionalAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats: {
            [targetId: string]: {
                xValues: number[];
                yValues: number[];
                units: string[];
                isHorizontal: boolean;
                isUnitless: boolean;
            };
        };
    };
}
export interface CobbAngleAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
            textBox: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
        };
        label: string;
        cachedStats: {
            [targetId: string]: {
                angle: number;
                arc1Angle: number;
                arc2Angle: number;
                points: {
                    world: {
                        arc1Start: Types.Point3;
                        arc1End: Types.Point3;
                        arc2Start: Types.Point3;
                        arc2End: Types.Point3;
                        arc1Angle: number;
                        arc2Angle: number;
                    };
                    canvas: {
                        arc1Start: Types.Point2;
                        arc1End: Types.Point2;
                        arc2Start: Types.Point2;
                        arc2End: Types.Point2;
                        arc1Angle: number;
                        arc2Angle: number;
                    };
                };
            };
        };
    };
}
export interface ReferenceCursor extends Annotation {
    data: {
        handles: {
            points: [Types.Point3];
        };
    };
}
export interface ReferenceLineAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
        };
    };
}
export interface ScaleOverlayAnnotation extends Annotation {
    data: {
        handles: {
            points: Types.Point3[];
        };
        viewportId: string;
    };
}
export interface VideoRedactionAnnotation extends Annotation {
    metadata: {
        viewPlaneNormal: Types.Point3;
        viewUp: Types.Point3;
        FrameOfReferenceUID: string;
        referencedImageId: string;
        toolName: string;
    };
    data: {
        invalidated: boolean;
        handles: {
            points: Types.Point3[];
            activeHandleIndex: number | null;
        };
        cachedStats: {
            [key: string]: any;
        };
        active: boolean;
    };
}
export type { ContourAnnotation };
