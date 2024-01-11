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
exports.removeSegmentationsFromToolGroup = exports.addSegmentationRepresentations = exports.resetAnnotationManager = exports.getAnnotationManager = exports.setAnnotationManager = exports.getAnnotation = exports.removeAnnotation = exports.getNumberOfAnnotations = exports.addAnnotation = exports.getAnnotations = exports.annotationSelection = exports.annotationLocking = exports.defaultFrameOfReferenceSpecificAnnotationManager = exports.FrameOfReferenceSpecificAnnotationManager = void 0;
const FrameOfReferenceSpecificAnnotationManager_1 = __importStar(require("./annotation/FrameOfReferenceSpecificAnnotationManager"));
exports.FrameOfReferenceSpecificAnnotationManager = FrameOfReferenceSpecificAnnotationManager_1.default;
Object.defineProperty(exports, "defaultFrameOfReferenceSpecificAnnotationManager", { enumerable: true, get: function () { return FrameOfReferenceSpecificAnnotationManager_1.defaultFrameOfReferenceSpecificAnnotationManager; } });
const annotationLocking = __importStar(require("./annotation/annotationLocking"));
exports.annotationLocking = annotationLocking;
const annotationSelection = __importStar(require("./annotation/annotationSelection"));
exports.annotationSelection = annotationSelection;
const annotationState_1 = require("./annotation/annotationState");
Object.defineProperty(exports, "getAnnotations", { enumerable: true, get: function () { return annotationState_1.getAnnotations; } });
Object.defineProperty(exports, "addAnnotation", { enumerable: true, get: function () { return annotationState_1.addAnnotation; } });
Object.defineProperty(exports, "removeAnnotation", { enumerable: true, get: function () { return annotationState_1.removeAnnotation; } });
Object.defineProperty(exports, "getAnnotation", { enumerable: true, get: function () { return annotationState_1.getAnnotation; } });
Object.defineProperty(exports, "getNumberOfAnnotations", { enumerable: true, get: function () { return annotationState_1.getNumberOfAnnotations; } });
Object.defineProperty(exports, "setAnnotationManager", { enumerable: true, get: function () { return annotationState_1.setAnnotationManager; } });
Object.defineProperty(exports, "getAnnotationManager", { enumerable: true, get: function () { return annotationState_1.getAnnotationManager; } });
Object.defineProperty(exports, "resetAnnotationManager", { enumerable: true, get: function () { return annotationState_1.resetAnnotationManager; } });
const segmentation_1 = require("./segmentation");
Object.defineProperty(exports, "addSegmentationRepresentations", { enumerable: true, get: function () { return segmentation_1.addSegmentationRepresentations; } });
Object.defineProperty(exports, "removeSegmentationsFromToolGroup", { enumerable: true, get: function () { return segmentation_1.removeSegmentationsFromToolGroup; } });
//# sourceMappingURL=index.js.map