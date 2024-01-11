"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    if (window.performance) {
        return performance.now();
    }
    return Date.now();
}
exports.default = default_1;
//# sourceMappingURL=now.js.map