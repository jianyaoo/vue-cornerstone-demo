import RLEVoxelMap from './RLEVoxelMap';
import isEqual from './isEqual';
const DEFAULT_RLE_SIZE = 5 * 1024;
export default class VoxelManager {
    constructor(dimensions, _get, _set) {
        this.modifiedSlices = new Set();
        this.boundsIJK = [
            [Infinity, -Infinity],
            [Infinity, -Infinity],
            [Infinity, -Infinity],
        ];
        this.numComps = 1;
        this.getAtIJK = (i, j, k) => {
            const index = i + j * this.width + k * this.frameSize;
            return this._get(index);
        };
        this.setAtIJK = (i, j, k, v) => {
            const index = i + j * this.width + k * this.frameSize;
            if (this._set(index, v) !== false) {
                this.modifiedSlices.add(k);
                VoxelManager.addBounds(this.boundsIJK, [i, j, k]);
            }
        };
        this.getAtIJKPoint = ([i, j, k]) => this.getAtIJK(i, j, k);
        this.setAtIJKPoint = ([i, j, k], v) => this.setAtIJK(i, j, k, v);
        this.getAtIndex = (index) => this._get(index);
        this.setAtIndex = (index, v) => {
            if (this._set(index, v) !== false) {
                const pointIJK = this.toIJK(index);
                this.modifiedSlices.add(pointIJK[2]);
                VoxelManager.addBounds(this.boundsIJK, pointIJK);
            }
        };
        this.forEach = (callback, options) => {
            const boundsIJK = options?.boundsIJK || this.getBoundsIJK();
            const { isWithinObject } = options || {};
            if (this.map) {
                for (const index of this.map.keys()) {
                    const pointIJK = this.toIJK(index);
                    const value = this._get(index);
                    const callbackArguments = { value, index, pointIJK };
                    if (isWithinObject?.(callbackArguments) === false) {
                        continue;
                    }
                    callback(callbackArguments);
                }
            }
            else {
                for (let k = boundsIJK[2][0]; k <= boundsIJK[2][1]; k++) {
                    const kIndex = k * this.frameSize;
                    for (let j = boundsIJK[1][0]; j <= boundsIJK[1][1]; j++) {
                        const jIndex = kIndex + j * this.width;
                        for (let i = boundsIJK[0][0], index = jIndex + i; i <= boundsIJK[0][1]; i++, index++) {
                            const value = this.getAtIndex(index);
                            const callbackArguments = { value, index, pointIJK: [i, j, k] };
                            if (isWithinObject?.(callbackArguments) === false) {
                                continue;
                            }
                            callback(callbackArguments);
                        }
                    }
                }
            }
        };
        this.dimensions = dimensions;
        this.width = dimensions[0];
        this.frameSize = this.width * dimensions[1];
        this._get = _get;
        this._set = _set;
    }
    addPoint(point) {
        const index = Array.isArray(point)
            ? point[0] + this.width * point[1] + this.frameSize * point[2]
            : point;
        if (!this.points) {
            this.points = new Set();
        }
        this.points.add(index);
    }
    getPoints() {
        return this.points
            ? [...this.points].map((index) => this.toIJK(index))
            : [];
    }
    getPointIndices() {
        return this.points ? [...this.points] : [];
    }
    toIJK(index) {
        return [
            index % this.width,
            Math.floor((index % this.frameSize) / this.width),
            Math.floor(index / this.frameSize),
        ];
    }
    toIndex(ijk) {
        return ijk[0] + ijk[1] * this.width + ijk[2] * this.frameSize;
    }
    getBoundsIJK() {
        if (this.boundsIJK[0][0] < this.dimensions[0]) {
            return this.boundsIJK;
        }
        return this.dimensions.map((dimension) => [0, dimension - 1]);
    }
    clear() {
        if (this.map) {
            this.map.clear();
        }
        this.boundsIJK.map((bound) => {
            bound[0] = Infinity;
            bound[1] = -Infinity;
        });
        this.modifiedSlices.clear();
        this.points?.clear();
    }
    getArrayOfSlices() {
        return Array.from(this.modifiedSlices);
    }
    static addBounds(bounds, point) {
        if (!bounds) {
            bounds = [
                [Infinity, -Infinity],
                [Infinity, -Infinity],
                [Infinity, -Infinity],
            ];
        }
        bounds[0][0] = Math.min(point[0], bounds[0][0]);
        bounds[0][1] = Math.max(point[0], bounds[0][1]);
        bounds[1][0] = Math.min(point[1], bounds[1][0]);
        bounds[1][1] = Math.max(point[1], bounds[1][1]);
        bounds[2][0] = Math.min(point[2], bounds[2][0]);
        bounds[2][1] = Math.max(point[2], bounds[2][1]);
    }
    static createRGBVolumeVoxelManager(dimensions, scalarData, numComponents) {
        const voxels = new VoxelManager(dimensions, (index) => {
            index *= numComponents;
            return [scalarData[index++], scalarData[index++], scalarData[index++]];
        }, (index, v) => {
            index *= 3;
            const isChanged = !isEqual(scalarData[index], v);
            scalarData[index++] = v[0];
            scalarData[index++] = v[1];
            scalarData[index++] = v[2];
            return isChanged;
        });
        voxels.numComps = numComponents;
        voxels.scalarData = scalarData;
        return voxels;
    }
    static createVolumeVoxelManager(dimensions, scalarData, numComponents = 0) {
        if (dimensions.length !== 3) {
            throw new Error('Dimensions must be provided as [number, number, number] for [width, height, depth]');
        }
        if (!numComponents) {
            numComponents =
                scalarData.length / dimensions[0] / dimensions[1] / dimensions[2];
            if (numComponents > 4 || numComponents < 1 || numComponents === 2) {
                throw new Error(`Number of components ${numComponents} must be 1, 3 or 4`);
            }
        }
        if (numComponents > 1) {
            return VoxelManager.createRGBVolumeVoxelManager(dimensions, scalarData, numComponents);
        }
        return VoxelManager.createNumberVolumeVoxelManager(dimensions, scalarData);
    }
    static createNumberVolumeVoxelManager(dimensions, scalarData) {
        const voxels = new VoxelManager(dimensions, (index) => scalarData[index], (index, v) => {
            const isChanged = scalarData[index] !== v;
            scalarData[index] = v;
            return isChanged;
        });
        voxels.scalarData = scalarData;
        return voxels;
    }
    static createMapVoxelManager(dimension) {
        const map = new Map();
        const voxelManager = new VoxelManager(dimension, map.get.bind(map), (index, v) => map.set(index, v) && true);
        voxelManager.map = map;
        return voxelManager;
    }
    static createHistoryVoxelManager(sourceVoxelManager) {
        const map = new Map();
        const { dimensions } = sourceVoxelManager;
        const voxelManager = new VoxelManager(dimensions, (index) => map.get(index), function (index, v) {
            if (!map.has(index)) {
                const oldV = this.sourceVoxelManager.getAtIndex(index);
                if (oldV === v) {
                    return false;
                }
                map.set(index, oldV);
            }
            else if (v === map.get(index)) {
                map.delete(index);
            }
            this.sourceVoxelManager.setAtIndex(index, v);
        });
        voxelManager.map = map;
        voxelManager.scalarData = sourceVoxelManager.scalarData;
        voxelManager.sourceVoxelManager = sourceVoxelManager;
        return voxelManager;
    }
    static createLazyVoxelManager(dimensions, planeFactory) {
        const map = new Map();
        const [width, height, depth] = dimensions;
        const planeSize = width * height;
        const voxelManager = new VoxelManager(dimensions, (index) => map.get(Math.floor(index / planeSize))?.[index % planeSize], (index, v) => {
            const k = Math.floor(index / planeSize);
            let layer = map.get(k);
            if (!layer) {
                layer = planeFactory(width, height);
                map.set(k, layer);
            }
            layer[index % planeSize] = v;
        });
        voxelManager.map = map;
        return voxelManager;
    }
    static createRLEVoxelManager(dimensions) {
        const [width, height, depth] = dimensions;
        const map = new RLEVoxelMap(width, height, depth);
        const voxelManager = new VoxelManager(dimensions, (index) => map.get(index), (index, v) => map.set(index, v));
        voxelManager.map = map;
        voxelManager.getPixelData = map.getPixelData.bind(map);
        return voxelManager;
    }
    static addInstanceToImage(image) {
        const { width, height } = image;
        const scalarData = image.getPixelData();
        if (scalarData?.length >= width * height) {
            image.voxelManager = VoxelManager.createVolumeVoxelManager([width, height, 1], scalarData);
            return;
        }
        image.voxelManager = VoxelManager.createRLEVoxelManager([
            width,
            height,
            1,
        ]);
        image.getPixelData = image.voxelManager.getPixelData;
        image.sizeInBytes = DEFAULT_RLE_SIZE;
    }
}
//# sourceMappingURL=VoxelManager.js.map