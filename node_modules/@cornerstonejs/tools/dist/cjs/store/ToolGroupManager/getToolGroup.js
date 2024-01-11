"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function getToolGroup(toolGroupId) {
    return index_1.state.toolGroups.find((s) => s.id === toolGroupId);
}
exports.default = getToolGroup;
//# sourceMappingURL=getToolGroup.js.map