"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const math_1 = require("../../../utilities/math");
const { addCanvasPointsToArray, getFirstIntersectionWithPolyline } = math_1.polyline;
function checkForFirstCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { element, currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstIntersectionWithPolyline(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (crossedLineSegment) {
        this.editData.startCrossingIndex = crossedLineSegment[0];
        this.removePointsUpUntilFirstCrossing(isClosedContour);
    }
    else if (prevCanvasPoints.length >= 2) {
        if (editCanvasPoints.length >
            this.configuration.checkCanvasEditFallbackProximity) {
            const firstEditCanvasPoint = editCanvasPoints[0];
            const distanceIndexPairs = [];
            for (let i = 0; i < prevCanvasPoints.length; i++) {
                const prevCanvasPoint = prevCanvasPoints[i];
                const distance = gl_matrix_1.vec2.distance(prevCanvasPoint, firstEditCanvasPoint);
                distanceIndexPairs.push({ distance, index: i });
            }
            distanceIndexPairs.sort((a, b) => a.distance - b.distance);
            const twoClosestDistanceIndexPairs = [
                distanceIndexPairs[0],
                distanceIndexPairs[1],
            ];
            const lowestIndex = Math.min(twoClosestDistanceIndexPairs[0].index, twoClosestDistanceIndexPairs[1].index);
            this.editData.startCrossingIndex = lowestIndex;
        }
        else {
            const dir = gl_matrix_1.vec2.create();
            gl_matrix_1.vec2.subtract(dir, editCanvasPoints[1], editCanvasPoints[0]);
            gl_matrix_1.vec2.normalize(dir, dir);
            const proximity = 6;
            const extendedPoint = [
                editCanvasPoints[0][0] - dir[0] * proximity,
                editCanvasPoints[0][1] - dir[1] * proximity,
            ];
            const crossedLineSegmentFromExtendedPoint = getFirstIntersectionWithPolyline(prevCanvasPoints, extendedPoint, editCanvasPoints[0], isClosedContour);
            if (crossedLineSegmentFromExtendedPoint) {
                const pointsToPrepend = [extendedPoint];
                addCanvasPointsToArray(element, pointsToPrepend, editCanvasPoints[0], this.commonData);
                editCanvasPoints.unshift(...pointsToPrepend);
                this.removePointsUpUntilFirstCrossing(isClosedContour);
                this.editData.editIndex = editCanvasPoints.length - 1;
                this.editData.startCrossingIndex =
                    crossedLineSegmentFromExtendedPoint[0];
            }
        }
    }
}
function removePointsUpUntilFirstCrossing(isClosedContour) {
    const { editCanvasPoints, prevCanvasPoints } = this.editData;
    let numPointsToRemove = 0;
    for (let i = 0; i < editCanvasPoints.length - 1; i++) {
        const firstLine = [editCanvasPoints[i], editCanvasPoints[i + 1]];
        const didCrossLine = !!getFirstIntersectionWithPolyline(prevCanvasPoints, firstLine[0], firstLine[1], isClosedContour);
        numPointsToRemove++;
        if (didCrossLine) {
            break;
        }
    }
    editCanvasPoints.splice(0, numPointsToRemove);
    this.editData.editIndex = editCanvasPoints.length - 1;
}
function checkForSecondCrossing(evt, isClosedContour) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { prevCanvasPoints } = this.editData;
    const crossedLineSegment = getFirstIntersectionWithPolyline(prevCanvasPoints, canvasPos, lastCanvasPoint, isClosedContour);
    if (!crossedLineSegment) {
        return false;
    }
    return true;
}
function removePointsAfterSecondCrossing(isClosedContour) {
    const { prevCanvasPoints, editCanvasPoints } = this.editData;
    for (let i = editCanvasPoints.length - 1; i > 0; i--) {
        const lastLine = [editCanvasPoints[i], editCanvasPoints[i - 1]];
        const didCrossLine = !!getFirstIntersectionWithPolyline(prevCanvasPoints, lastLine[0], lastLine[1], isClosedContour);
        editCanvasPoints.pop();
        if (didCrossLine) {
            break;
        }
    }
}
function findSnapIndex() {
    const { editCanvasPoints, prevCanvasPoints, startCrossingIndex } = this.editData;
    if (startCrossingIndex === undefined) {
        return;
    }
    const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
    const distanceIndexPairs = [];
    for (let i = 0; i < prevCanvasPoints.length; i++) {
        const prevCanvasPoint = prevCanvasPoints[i];
        const distance = gl_matrix_1.vec2.distance(prevCanvasPoint, lastEditCanvasPoint);
        distanceIndexPairs.push({ distance, index: i });
    }
    distanceIndexPairs.sort((a, b) => a.distance - b.distance);
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -1);
    for (let i = 0; i < distanceIndexPairs.length; i++) {
        const { index } = distanceIndexPairs[i];
        const snapCanvasPosition = prevCanvasPoints[index];
        const lastEditCanvasPoint = editCanvasPoints[editCanvasPoints.length - 1];
        const crossedLineSegment = getFirstIntersectionWithPolyline(editCanvasPointsLessLastOne, snapCanvasPosition, lastEditCanvasPoint, false);
        if (!crossedLineSegment) {
            return index;
        }
    }
    return -1;
}
function checkAndRemoveCrossesOnEditLine(evt) {
    const eventDetail = evt.detail;
    const { currentPoints, lastPoints } = eventDetail;
    const canvasPos = currentPoints.canvas;
    const lastCanvasPoint = lastPoints.canvas;
    const { editCanvasPoints } = this.editData;
    const editCanvasPointsLessLastOne = editCanvasPoints.slice(0, -2);
    const crossedLineSegment = getFirstIntersectionWithPolyline(editCanvasPointsLessLastOne, canvasPos, lastCanvasPoint, false);
    if (!crossedLineSegment) {
        return;
    }
    const editIndexCrossed = crossedLineSegment[0];
    const numPointsToRemove = editCanvasPoints.length - editIndexCrossed;
    for (let i = 0; i < numPointsToRemove; i++) {
        editCanvasPoints.pop();
    }
}
function registerEditLoopCommon(toolInstance) {
    toolInstance.checkForFirstCrossing = checkForFirstCrossing.bind(toolInstance);
    toolInstance.removePointsUpUntilFirstCrossing =
        removePointsUpUntilFirstCrossing.bind(toolInstance);
    toolInstance.checkForSecondCrossing =
        checkForSecondCrossing.bind(toolInstance);
    toolInstance.findSnapIndex = findSnapIndex.bind(toolInstance);
    toolInstance.removePointsAfterSecondCrossing =
        removePointsAfterSecondCrossing.bind(toolInstance);
    toolInstance.checkAndRemoveCrossesOnEditLine =
        checkAndRemoveCrossesOnEditLine.bind(toolInstance);
}
exports.default = registerEditLoopCommon;
//# sourceMappingURL=editLoopCommon.js.map