"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const helpers_1 = require("./helpers");
const segmentationState_1 = require("./segmentationState");
function addSegmentations(segmentationInputArray) {
    (0, helpers_1.validateSegmentationInput)(segmentationInputArray);
    segmentationInputArray.map((segInput) => {
        const segmentationInput = (0, lodash_clonedeep_1.default)(segInput);
        (0, segmentationState_1.addSegmentation)(segmentationInput);
    });
}
exports.default = addSegmentations;
//# sourceMappingURL=addSegmentations.js.map