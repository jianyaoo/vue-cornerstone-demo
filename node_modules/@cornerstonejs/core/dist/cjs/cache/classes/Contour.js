"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contour = void 0;
class Contour {
    constructor(props) {
        const { points, type } = props.data;
        this.id = props.id;
        this.points = points;
        this.type = type;
        this.color = props.color;
        this.segmentIndex = props.segmentIndex;
        this.sizeInBytes = this._getSizeInBytes();
    }
    _getSizeInBytes() {
        let sizeInBytes = 0;
        sizeInBytes += this.points.length * 3;
        return sizeInBytes;
    }
    getPoints() {
        return this.points;
    }
    getFlatPointsArray() {
        return this.points.map((point) => [...point]).flat();
    }
    getColor() {
        return this.color;
    }
    getType() {
        return this.type;
    }
}
exports.Contour = Contour;
exports.default = Contour;
//# sourceMappingURL=Contour.js.map