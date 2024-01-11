"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContourSet = void 0;
const Contour_1 = __importDefault(require("./Contour"));
class ContourSet {
    constructor(props) {
        var _a;
        this.color = [200, 0, 0];
        this.id = props.id;
        this.contours = [];
        this.color = (_a = props.color) !== null && _a !== void 0 ? _a : this.color;
        this.frameOfReferenceUID = props.frameOfReferenceUID;
        this.segmentIndex = props.segmentIndex;
        this._createEachContour(props.data);
        this.sizeInBytes = this._getSizeInBytes();
    }
    _createEachContour(contourDataArray) {
        contourDataArray.forEach((contourData) => {
            const { points, type, color } = contourData;
            const contour = new Contour_1.default({
                id: `${this.id}-segment-${this.segmentIndex}`,
                data: {
                    points,
                    type,
                    segmentIndex: this.segmentIndex,
                    color: color !== null && color !== void 0 ? color : this.color,
                },
                segmentIndex: this.segmentIndex,
                color: color !== null && color !== void 0 ? color : this.color,
            });
            this.contours.push(contour);
        });
        this._updateContourSetCentroid();
    }
    _updateContourSetCentroid() {
        const numberOfPoints = this.getTotalNumberOfPoints();
        const flatPointsArray = this.getFlatPointsArray();
        const sumOfPoints = flatPointsArray.reduce((acc, point) => {
            return [acc[0] + point[0], acc[1] + point[1], acc[2] + point[2]];
        }, [0, 0, 0]);
        const centroid = [
            sumOfPoints[0] / numberOfPoints,
            sumOfPoints[1] / numberOfPoints,
            sumOfPoints[2] / numberOfPoints,
        ];
        const closestPoint = flatPointsArray.reduce((closestPoint, point) => {
            const distanceToPoint = this._getDistance(centroid, point);
            const distanceToClosestPoint = this._getDistance(centroid, closestPoint);
            if (distanceToPoint < distanceToClosestPoint) {
                return point;
            }
            else {
                return closestPoint;
            }
        }, flatPointsArray[0]);
        this.centroid = closestPoint;
    }
    _getSizeInBytes() {
        return this.contours.reduce((sizeInBytes, contour) => {
            return sizeInBytes + contour.sizeInBytes;
        }, 0);
    }
    getCentroid() {
        return this.centroid;
    }
    getSegmentIndex() {
        return this.segmentIndex;
    }
    getColor() {
        return this.color;
    }
    getContours() {
        return this.contours;
    }
    getSizeInBytes() {
        return this.sizeInBytes;
    }
    getFlatPointsArray() {
        return this.contours.map((contour) => contour.getPoints()).flat();
    }
    getNumberOfContours() {
        return this.contours.length;
    }
    getTotalNumberOfPoints() {
        return this.contours.reduce((numberOfPoints, contour) => {
            return numberOfPoints + contour.getPoints().length;
        }, 0);
    }
    getNumberOfPointsArray() {
        return this.contours.reduce((acc, _, i) => {
            acc[i] = this.getNumberOfPointsInAContour(i);
            return acc;
        }, []);
    }
    getPointsInContour(contourIndex) {
        return this.contours[contourIndex].getPoints();
    }
    getNumberOfPointsInAContour(contourIndex) {
        return this.getPointsInContour(contourIndex).length;
    }
    _getDistance(pointA, pointB) {
        return Math.sqrt(Math.pow((pointA[0] - pointB[0]), 2) +
            Math.pow((pointA[1] - pointB[1]), 2) +
            Math.pow((pointA[2] - pointB[2]), 2));
    }
}
exports.ContourSet = ContourSet;
exports.default = Contour_1.default;
//# sourceMappingURL=ContourSet.js.map