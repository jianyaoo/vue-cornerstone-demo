export class Surface {
    constructor(props) {
        this.color = [200, 0, 0];
        this.id = props.id;
        this.points = props.data.points;
        this.polys = props.data.polys;
        this.color = props.color ?? this.color;
        this.frameOfReferenceUID = props.frameOfReferenceUID;
        this.sizeInBytes = this._getSizeInBytes();
    }
    _getSizeInBytes() {
        return this.points.length * 4 + this.polys.length * 4;
    }
    getColor() {
        return this.color;
    }
    getPoints() {
        return this.points;
    }
    getPolys() {
        return this.polys;
    }
    setColor(color) {
        this.color = color;
    }
    setPoints(points) {
        this.points = points;
    }
    setPolys(polys) {
        this.polys = polys;
    }
    getSizeInBytes() {
        return this.sizeInBytes;
    }
}
//# sourceMappingURL=Surface.js.map