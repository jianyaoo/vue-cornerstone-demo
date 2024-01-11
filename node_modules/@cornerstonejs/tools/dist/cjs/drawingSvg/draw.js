"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSvgDrawingHelper_1 = __importDefault(require("./getSvgDrawingHelper"));
function draw(element, fn) {
    const svgDrawingHelper = (0, getSvgDrawingHelper_1.default)(element);
    fn(svgDrawingHelper);
    svgDrawingHelper.clearUntouched();
}
exports.default = draw;
//# sourceMappingURL=draw.js.map