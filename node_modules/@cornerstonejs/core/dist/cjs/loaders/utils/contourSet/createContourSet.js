"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContourSet = void 0;
const enums_1 = require("../../../enums");
const validateContourSet_1 = require("./validateContourSet");
const ContourSet_1 = require("../../../cache/classes/ContourSet");
function createContourSet(geometryId, contourSetData) {
    (0, validateContourSet_1.validateContourSet)(contourSetData);
    const contourSet = new ContourSet_1.ContourSet({
        id: contourSetData.id,
        data: contourSetData.data,
        color: contourSetData.color,
        frameOfReferenceUID: contourSetData.frameOfReferenceUID,
        segmentIndex: 1,
    });
    const geometry = {
        id: geometryId,
        type: enums_1.GeometryType.CONTOUR,
        data: contourSet,
        sizeInBytes: contourSet.getSizeInBytes(),
    };
    return geometry;
}
exports.createContourSet = createContourSet;
//# sourceMappingURL=createContourSet.js.map