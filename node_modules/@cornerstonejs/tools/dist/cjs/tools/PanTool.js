"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const core_1 = require("@cornerstonejs/core");
class PanTool extends base_1.BaseTool {
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
        const enabledElement = (0, core_1.getEnabledElement)(element);
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
exports.default = PanTool;
//# sourceMappingURL=PanTool.js.map