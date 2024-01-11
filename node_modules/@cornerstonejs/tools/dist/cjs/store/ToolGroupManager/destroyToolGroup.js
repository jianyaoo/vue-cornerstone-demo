"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const segmentation_1 = require("../../stateManagement/segmentation");
const triggerSegmentationRender_1 = require("../../utilities/segmentation/triggerSegmentationRender");
function destroyToolGroup(toolGroupId) {
    const toolGroupIndex = index_1.state.toolGroups.findIndex((tg) => tg.id === toolGroupId);
    if (toolGroupIndex > -1) {
        triggerSegmentationRender_1.segmentationRenderingEngine.removeToolGroup(toolGroupId);
        (0, segmentation_1.removeSegmentationsFromToolGroup)(toolGroupId);
        index_1.state.toolGroups.splice(toolGroupIndex, 1);
    }
}
exports.default = destroyToolGroup;
//# sourceMappingURL=destroyToolGroup.js.map