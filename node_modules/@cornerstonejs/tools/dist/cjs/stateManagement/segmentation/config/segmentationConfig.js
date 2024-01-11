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
exports.setSegmentSpecificConfig = exports.getSegmentSpecificConfig = exports.setSegmentationRepresentationSpecificConfig = exports.getSegmentationRepresentationSpecificConfig = exports.setToolGroupSpecificConfig = exports.getToolGroupSpecificConfig = exports.setGlobalRepresentationConfig = exports.getGlobalRepresentationConfig = exports.setGlobalConfig = exports.getGlobalConfig = void 0;
const SegmentationState = __importStar(require("../../../stateManagement/segmentation/segmentationState"));
function getGlobalConfig() {
    return SegmentationState.getGlobalConfig();
}
exports.getGlobalConfig = getGlobalConfig;
function setGlobalConfig(segmentationConfig) {
    SegmentationState.setGlobalConfig(segmentationConfig);
}
exports.setGlobalConfig = setGlobalConfig;
function getGlobalRepresentationConfig(representationType) {
    const globalConfig = getGlobalConfig();
    return globalConfig.representations[representationType];
}
exports.getGlobalRepresentationConfig = getGlobalRepresentationConfig;
function setGlobalRepresentationConfig(representationType, config) {
    const globalConfig = getGlobalConfig();
    setGlobalConfig(Object.assign(Object.assign({}, globalConfig), { representations: Object.assign(Object.assign({}, globalConfig.representations), { [representationType]: Object.assign(Object.assign({}, globalConfig.representations[representationType]), config) }) }));
}
exports.setGlobalRepresentationConfig = setGlobalRepresentationConfig;
function getToolGroupSpecificConfig(toolGroupId) {
    return SegmentationState.getToolGroupSpecificConfig(toolGroupId);
}
exports.getToolGroupSpecificConfig = getToolGroupSpecificConfig;
function setToolGroupSpecificConfig(toolGroupId, segmentationRepresentationConfig) {
    SegmentationState.setToolGroupSpecificConfig(toolGroupId, segmentationRepresentationConfig);
}
exports.setToolGroupSpecificConfig = setToolGroupSpecificConfig;
function getSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID) {
    return SegmentationState.getSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID);
}
exports.getSegmentationRepresentationSpecificConfig = getSegmentationRepresentationSpecificConfig;
function setSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID, config) {
    SegmentationState.setSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID, config);
}
exports.setSegmentationRepresentationSpecificConfig = setSegmentationRepresentationSpecificConfig;
function getSegmentSpecificConfig(toolGroupId, segmentationRepresentationUID, segmentIndex) {
    return SegmentationState.getSegmentSpecificRepresentationConfig(toolGroupId, segmentationRepresentationUID, segmentIndex);
}
exports.getSegmentSpecificConfig = getSegmentSpecificConfig;
function setSegmentSpecificConfig(toolGroupId, segmentationRepresentationUID, config) {
    SegmentationState.setSegmentSpecificRepresentationConfig(toolGroupId, segmentationRepresentationUID, config);
}
exports.setSegmentSpecificConfig = setSegmentSpecificConfig;
//# sourceMappingURL=segmentationConfig.js.map