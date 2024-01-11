"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAreaOfPoints = exports.pointCanProjectOnLine = exports.addCanvasPointsToArray = exports.pointsAreWithinCloseContourProximity = exports.getSubPixelSpacingAndXYDirections = exports.getClosestIntersectionWithPolyline = exports.getFirstIntersectionWithPolyline = void 0;
const getIntersectionWithPolyline_1 = require("./getIntersectionWithPolyline");
Object.defineProperty(exports, "getFirstIntersectionWithPolyline", { enumerable: true, get: function () { return getIntersectionWithPolyline_1.getFirstIntersectionWithPolyline; } });
Object.defineProperty(exports, "getClosestIntersectionWithPolyline", { enumerable: true, get: function () { return getIntersectionWithPolyline_1.getClosestIntersectionWithPolyline; } });
const getSubPixelSpacingAndXYDirections_1 = __importDefault(require("./getSubPixelSpacingAndXYDirections"));
exports.getSubPixelSpacingAndXYDirections = getSubPixelSpacingAndXYDirections_1.default;
const pointsAreWithinCloseContourProximity_1 = __importDefault(require("./pointsAreWithinCloseContourProximity"));
exports.pointsAreWithinCloseContourProximity = pointsAreWithinCloseContourProximity_1.default;
const addCanvasPointsToArray_1 = __importDefault(require("./addCanvasPointsToArray"));
exports.addCanvasPointsToArray = addCanvasPointsToArray_1.default;
const pointCanProjectOnLine_1 = __importDefault(require("./pointCanProjectOnLine"));
exports.pointCanProjectOnLine = pointCanProjectOnLine_1.default;
const calculateAreaOfPoints_1 = __importDefault(require("./calculateAreaOfPoints"));
exports.calculateAreaOfPoints = calculateAreaOfPoints_1.default;
//# sourceMappingURL=index.js.map