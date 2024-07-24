"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StackViewport_1 = __importDefault(require("../StackViewport"));
const VolumeViewport_1 = __importDefault(require("../VolumeViewport"));
const ViewportType_1 = __importDefault(require("../../enums/ViewportType"));
const VolumeViewport3D_1 = __importDefault(require("../VolumeViewport3D"));
const VideoViewport_1 = __importDefault(require("../VideoViewport"));
const WSIViewport_1 = __importDefault(require("../WSIViewport"));
const viewportTypeToViewportClass = {
    [ViewportType_1.default.ORTHOGRAPHIC]: VolumeViewport_1.default,
    [ViewportType_1.default.PERSPECTIVE]: VolumeViewport_1.default,
    [ViewportType_1.default.STACK]: StackViewport_1.default,
    [ViewportType_1.default.VOLUME_3D]: VolumeViewport3D_1.default,
    [ViewportType_1.default.VIDEO]: VideoViewport_1.default,
    [ViewportType_1.default.WholeSlide]: WSIViewport_1.default,
};
exports.default = viewportTypeToViewportClass;
//# sourceMappingURL=viewportTypeToViewportClass.js.map