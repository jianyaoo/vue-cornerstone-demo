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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCursorForElement = exports.CursorSVG = exports.CursorNames = exports.registerCursor = exports.elementCursor = exports.SVGMouseCursor = exports.ImageMouseCursor = exports.MouseCursor = void 0;
const MouseCursor_1 = __importStar(require("./MouseCursor"));
exports.MouseCursor = MouseCursor_1.default;
const ImageMouseCursor_1 = __importDefault(require("./ImageMouseCursor"));
exports.ImageMouseCursor = ImageMouseCursor_1.default;
const SVGMouseCursor_1 = __importDefault(require("./SVGMouseCursor"));
exports.SVGMouseCursor = SVGMouseCursor_1.default;
const elementCursor = __importStar(require("./elementCursor"));
exports.elementCursor = elementCursor;
const setCursorForElement_1 = __importDefault(require("./setCursorForElement"));
exports.setCursorForElement = setCursorForElement_1.default;
const SVGCursorDescriptor_1 = require("./SVGCursorDescriptor");
Object.defineProperty(exports, "registerCursor", { enumerable: true, get: function () { return SVGCursorDescriptor_1.registerCursor; } });
Object.defineProperty(exports, "CursorSVG", { enumerable: true, get: function () { return SVGCursorDescriptor_1.CursorSVG; } });
const CursorNames = [...SVGCursorDescriptor_1.svgCursorNames, ...MouseCursor_1.standardCursorNames];
exports.CursorNames = CursorNames;
//# sourceMappingURL=index.js.map