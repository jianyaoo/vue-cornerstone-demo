"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const MouseCursor_1 = __importDefault(require("./MouseCursor"));
const DEFAULT_NAME = 'image-cursor';
class ImageMouseCursor extends MouseCursor_1.default {
    constructor(url, x, y, name, fallback) {
        super(name || ImageMouseCursor.getUniqueInstanceName(DEFAULT_NAME), fallback);
        this.url = url;
        this.x = Number(x) || 0;
        this.y = Number(y) || 0;
    }
    getStyleProperty() {
        const { url, x, y } = this;
        let style = `url('${url}')`;
        if (x >= 0 && y >= 0 && (x > 0 || y > 0)) {
            style += ` ${x} ${y}`;
        }
        return this.addFallbackStyleProperty(style);
    }
    static getUniqueInstanceName(prefix) {
        return `${prefix}-${core_1.utilities.getRuntimeId(ImageMouseCursor)}`;
    }
}
exports.default = ImageMouseCursor;
//# sourceMappingURL=ImageMouseCursor.js.map