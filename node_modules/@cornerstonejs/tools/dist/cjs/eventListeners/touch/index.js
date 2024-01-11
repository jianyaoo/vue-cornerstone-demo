"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preventGhostClick_1 = __importDefault(require("./preventGhostClick"));
const touchStartListener_1 = __importDefault(require("./touchStartListener"));
function disable(element) {
    preventGhostClick_1.default.disable(element);
    element.removeEventListener('touchstart', touchStartListener_1.default);
}
function enable(element) {
    disable(element);
    preventGhostClick_1.default.enable(element);
    element.addEventListener('touchstart', touchStartListener_1.default, {
        passive: false,
    });
}
exports.default = {
    enable,
    disable,
};
//# sourceMappingURL=index.js.map