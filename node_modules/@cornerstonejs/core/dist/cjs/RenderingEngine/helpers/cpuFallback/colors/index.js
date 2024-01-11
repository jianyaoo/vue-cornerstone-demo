"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupTable = exports.getColormapsList = exports.getColormap = void 0;
const colormap_1 = require("./colormap");
Object.defineProperty(exports, "getColormap", { enumerable: true, get: function () { return colormap_1.getColormap; } });
Object.defineProperty(exports, "getColormapsList", { enumerable: true, get: function () { return colormap_1.getColormapsList; } });
const lookupTable_1 = __importDefault(require("./lookupTable"));
exports.LookupTable = lookupTable_1.default;
//# sourceMappingURL=index.js.map