"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSegmentationRepresentationSpecificConfig = exports.setSegmentationRepresentationSpecificConfig = exports.getSegmentSpecificConfig = exports.setSegmentSpecificConfig = exports.setToolGroupSpecificConfig = exports.setGlobalRepresentationConfig = exports.setGlobalConfig = exports.getToolGroupSpecificConfig = exports.getGlobalRepresentationConfig = exports.getGlobalConfig = exports.visibility = exports.color = void 0;
const color = __importStar(require("./segmentationColor"));
exports.color = color;
const visibility = __importStar(require("./segmentationVisibility"));
exports.visibility = visibility;
const segmentationConfig_1 = require("./segmentationConfig");
Object.defineProperty(exports, "getGlobalConfig", { enumerable: true, get: function () { return segmentationConfig_1.getGlobalConfig; } });
Object.defineProperty(exports, "getGlobalRepresentationConfig", { enumerable: true, get: function () { return segmentationConfig_1.getGlobalRepresentationConfig; } });
Object.defineProperty(exports, "getToolGroupSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.getToolGroupSpecificConfig; } });
Object.defineProperty(exports, "setGlobalConfig", { enumerable: true, get: function () { return segmentationConfig_1.setGlobalConfig; } });
Object.defineProperty(exports, "setGlobalRepresentationConfig", { enumerable: true, get: function () { return segmentationConfig_1.setGlobalRepresentationConfig; } });
Object.defineProperty(exports, "setToolGroupSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.setToolGroupSpecificConfig; } });
Object.defineProperty(exports, "setSegmentSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.setSegmentSpecificConfig; } });
Object.defineProperty(exports, "getSegmentSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.getSegmentSpecificConfig; } });
Object.defineProperty(exports, "setSegmentationRepresentationSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.setSegmentationRepresentationSpecificConfig; } });
Object.defineProperty(exports, "getSegmentationRepresentationSpecificConfig", { enumerable: true, get: function () { return segmentationConfig_1.getSegmentationRepresentationSpecificConfig; } });
//# sourceMappingURL=index.js.map