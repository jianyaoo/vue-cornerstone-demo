"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function destroy() {
    while (index_1.state.synchronizers.length > 0) {
        const synchronizer = index_1.state.synchronizers.pop();
        synchronizer.destroy();
    }
}
exports.default = destroy;
//# sourceMappingURL=destroy.js.map