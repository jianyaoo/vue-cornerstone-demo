import { BaseTool } from './base';
import { getEnabledElement } from '@cornerstonejs/core';
class PanTool extends BaseTool {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
    }) {
        super(toolProps, defaultToolProps);
    }
    touchDragCallback(evt) {
        this._dragCallback(evt);
    }
    mouseDragCallback(evt) {
        this._dragCallback(evt);
    }
    _dragCallback(evt) {
        const { element, deltaPoints } = evt.detail;
        const enabledElement = getEnabledElement(element);
        const deltaPointsWorld = deltaPoints.world;
        const camera = enabledElement.viewport.getCamera();
        const { focalPoint, position } = camera;
        const updatedPosition = [
            position[0] - deltaPointsWorld[0],
            position[1] - deltaPointsWorld[1],
            position[2] - deltaPointsWorld[2],
        ];
        const updatedFocalPoint = [
            focalPoint[0] - deltaPointsWorld[0],
            focalPoint[1] - deltaPointsWorld[1],
            focalPoint[2] - deltaPointsWorld[2],
        ];
        enabledElement.viewport.setCamera({
            focalPoint: updatedFocalPoint,
            position: updatedPosition,
        });
        enabledElement.viewport.render();
    }
}
PanTool.toolName = 'Pan';
export default PanTool;
//# sourceMappingURL=PanTool.js.map