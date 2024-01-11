import { vec3 } from 'gl-matrix';
import { metaData, CONSTANTS, getRenderingEngine, utilities as csUtils, } from '@cornerstonejs/core';
import { addAnnotation, getAnnotations, } from '../stateManagement/annotation/annotationState';
import { getToolGroup } from '../store/ToolGroupManager';
import { drawLine as drawLineSvg } from '../drawingSvg';
import triggerAnnotationRenderForViewportIds from '../utilities/triggerAnnotationRenderForViewportIds';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
const { EPSILON } = CONSTANTS;
class OverlayGridTool extends AnnotationDisplayTool {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            sourceImageIds: [],
        },
    }) {
        super(toolProps, defaultToolProps);
        this.onSetToolEnabled = () => {
            this._init();
        };
        this.onSetToolActive = () => {
            this._init();
        };
        this._init = () => {
            const sourceImageIds = this.configuration.sourceImageIds;
            if (!sourceImageIds?.length) {
                console.warn('OverlayGridTool: No sourceImageIds provided in configuration');
                return;
            }
            const imagePlaneModule = metaData.get('imagePlaneModule', sourceImageIds[0]);
            if (!imagePlaneModule) {
                console.warn('OverlayGridTool: No imagePlaneModule found for sourceImageIds');
                return;
            }
            const { frameOfReferenceUID } = imagePlaneModule;
            const viewportsInfo = getToolGroup(this.toolGroupId).viewportsInfo;
            if (!viewportsInfo?.length) {
                console.warn('OverlayGridTool: No viewports found');
                return;
            }
            const annotations = getAnnotations(this.getToolName(), frameOfReferenceUID);
            if (!annotations?.length) {
                const pointSets = sourceImageIds.map((id) => {
                    return this.calculateImageIdPointSets(id);
                });
                const newAnnotation = {
                    highlighted: true,
                    invalidated: true,
                    metadata: {
                        toolName: this.getToolName(),
                        FrameOfReferenceUID: frameOfReferenceUID,
                        referencedImageId: null,
                    },
                    data: {
                        viewportData: new Map(),
                        pointSets,
                    },
                };
                addAnnotation(newAnnotation, frameOfReferenceUID);
            }
            triggerAnnotationRenderForViewportIds(getRenderingEngine(viewportsInfo[0].renderingEngineId), viewportsInfo.map(({ viewportId }) => viewportId));
        };
        this.calculateImageIdPointSets = (imageId) => {
            const { imagePositionPatient, rows, columns, rowCosines, columnCosines, rowPixelSpacing, columnPixelSpacing, } = metaData.get('imagePlaneModule', imageId);
            const topLeft = [...imagePositionPatient];
            const topRight = [...imagePositionPatient];
            const bottomLeft = [...imagePositionPatient];
            const bottomRight = [...imagePositionPatient];
            vec3.scaleAndAdd(topRight, imagePositionPatient, columnCosines, columns * columnPixelSpacing);
            vec3.scaleAndAdd(bottomLeft, imagePositionPatient, rowCosines, rows * rowPixelSpacing);
            vec3.scaleAndAdd(bottomRight, bottomLeft, columnCosines, columns * columnPixelSpacing);
            const pointSet1 = [topLeft, bottomLeft, topRight, bottomRight];
            const pointSet2 = [topLeft, topRight, bottomLeft, bottomRight];
            return { pointSet1, pointSet2 };
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            const sourceImageIds = this.configuration.sourceImageIds;
            let renderStatus = false;
            if (!sourceImageIds?.length) {
                return renderStatus;
            }
            const { viewport: targetViewport, FrameOfReferenceUID } = enabledElement;
            const targetImageIds = targetViewport.getImageIds();
            if (targetImageIds.length < 2) {
                return renderStatus;
            }
            const annotations = getAnnotations(this.getToolName(), FrameOfReferenceUID);
            if (!annotations?.length) {
                return renderStatus;
            }
            const annotation = annotations[0];
            const { annotationUID } = annotation;
            const { focalPoint, viewPlaneNormal } = targetViewport.getCamera();
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
            };
            const imageIdNormal = (this.getImageIdNormal(sourceImageIds[0]));
            if (this.isParallel(viewPlaneNormal, imageIdNormal)) {
                return renderStatus;
            }
            const targetViewportPlane = csUtils.planar.planeEquation(viewPlaneNormal, focalPoint);
            const pointSets = annotation.data.pointSets;
            const viewportData = annotation.data.viewportData;
            for (let i = 0; i < sourceImageIds.length; i++) {
                const { pointSet1, pointSet2 } = pointSets[i];
                const targetData = viewportData.get(targetViewport.id) ||
                    this.initializeViewportData(viewportData, targetViewport.id);
                if (!targetData.pointSetsToUse[i]) {
                    let pointSetToUse = pointSet1;
                    let topBottomVec = vec3.subtract(vec3.create(), pointSet1[0], pointSet1[1]);
                    topBottomVec = vec3.normalize(vec3.create(), topBottomVec);
                    if (this.isPerpendicular(topBottomVec, viewPlaneNormal)) {
                        pointSetToUse = pointSet2;
                    }
                    targetData.pointSetsToUse[i] = pointSetToUse;
                    targetData.lineStartsWorld[i] = csUtils.planar.linePlaneIntersection(pointSetToUse[0], pointSetToUse[1], targetViewportPlane);
                    targetData.lineEndsWorld[i] = csUtils.planar.linePlaneIntersection(pointSetToUse[2], pointSetToUse[3], targetViewportPlane);
                }
                const lineStartWorld = targetData.lineStartsWorld[i];
                const lineEndWorld = targetData.lineEndsWorld[i];
                styleSpecifier.annotationUID = annotationUID;
                const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotation);
                const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
                const color = this.getStyle('color', styleSpecifier, annotation);
                const shadow = this.getStyle('shadow', styleSpecifier, annotation);
                const canvasCoordinates = [lineStartWorld, lineEndWorld].map((world) => targetViewport.worldToCanvas(world));
                const dataId = `${annotationUID}-line`;
                const lineUID = `${i}`;
                drawLineSvg(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates[0], canvasCoordinates[1], {
                    color,
                    width: lineWidth,
                    lineDash,
                    shadow,
                }, dataId);
            }
            renderStatus = true;
            return renderStatus;
        };
        this.initializeViewportData = (viewportData, id) => {
            viewportData.set(id, {
                pointSetsToUse: [],
                lineStartsWorld: [],
                lineEndsWorld: [],
            });
            return viewportData.get(id);
        };
        this.isPerpendicular = (vec1, vec2) => {
            const dot = vec3.dot(vec1, vec2);
            return Math.abs(dot) < EPSILON;
        };
    }
    isParallel(vec1, vec2) {
        return Math.abs(vec3.dot(vec1, vec2)) > 1 - EPSILON;
    }
    getImageIdNormal(imageId) {
        const { imageOrientationPatient } = metaData.get('imagePlaneModule', imageId);
        const rowCosineVec = vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
        const colCosineVec = vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
        return vec3.cross(vec3.create(), rowCosineVec, colCosineVec);
    }
}
OverlayGridTool.toolName = 'OverlayGrid';
export default OverlayGridTool;
//# sourceMappingURL=OverlayGridTool.js.map