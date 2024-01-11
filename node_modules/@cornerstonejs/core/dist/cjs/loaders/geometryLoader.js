"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndCacheGeometry = void 0;
require("@kitware/vtk.js/Rendering/Profiles/Geometry");
const cache_1 = __importDefault(require("../cache"));
const enums_1 = require("../enums");
const createContourSet_1 = require("./utils/contourSet/createContourSet");
const createSurface_1 = require("./utils/surface/createSurface");
function createAndCacheGeometry(geometryId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let geometry = cache_1.default.getGeometry(geometryId);
        if (geometry) {
            return geometry;
        }
        if (options.type === enums_1.GeometryType.CONTOUR) {
            geometry = (0, createContourSet_1.createContourSet)(geometryId, options.geometryData);
        }
        else if (options.type === enums_1.GeometryType.SURFACE) {
            geometry = (0, createSurface_1.createSurface)(geometryId, options.geometryData);
        }
        else {
            throw new Error('Unknown geometry type, Only CONTOUR is supported');
        }
        const geometryLoadObject = {
            promise: Promise.resolve(geometry),
        };
        yield cache_1.default.putGeometryLoadObject(geometryId, geometryLoadObject);
        return geometry;
    });
}
exports.createAndCacheGeometry = createAndCacheGeometry;
//# sourceMappingURL=geometryLoader.js.map