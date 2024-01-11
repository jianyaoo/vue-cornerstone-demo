"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wheelListener_1 = __importDefault(require("./wheelListener"));
function enable(element) {
    disable(element);
    element.addEventListener('wheel', wheelListener_1.default, { passive: false });
}
function disable(element) {
    element.removeEventListener('wheel', wheelListener_1.default);
}
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=index.js.map