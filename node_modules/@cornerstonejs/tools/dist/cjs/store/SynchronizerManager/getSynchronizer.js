"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function getSynchronizer(synchronizerId) {
    return index_1.state.synchronizers.find((s) => s.id === synchronizerId);
}
exports.default = getSynchronizer;
//# sourceMappingURL=getSynchronizer.js.map