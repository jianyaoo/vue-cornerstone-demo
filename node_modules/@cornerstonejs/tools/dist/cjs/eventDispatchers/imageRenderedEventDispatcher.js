"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const triggerAnnotationRender_1 = __importDefault(require("../utilities/triggerAnnotationRender"));
const onImageRendered = function (evt) {
    (0, triggerAnnotationRender_1.default)(evt.detail.element);
};
const enable = function (element) {
    element.addEventListener(core_1.Enums.Events.IMAGE_RENDERED, onImageRendered);
};
const disable = function (element) {
    element.removeEventListener(core_1.Enums.Events.IMAGE_RENDERED, onImageRendered);
};
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=imageRenderedEventDispatcher.js.map