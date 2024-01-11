"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function destroySynchronizer(synchronizerId) {
    const synchronizerIndex = index_1.state.synchronizers.findIndex((sync) => sync.id === synchronizerId);
    if (synchronizerIndex > -1) {
        const synchronizer = index_1.state.synchronizers[synchronizerIndex];
        synchronizer.destroy();
        index_1.state.synchronizers.splice(synchronizerIndex, 1);
    }
}
exports.default = destroySynchronizer;
//# sourceMappingURL=destroySynchronizer.js.map