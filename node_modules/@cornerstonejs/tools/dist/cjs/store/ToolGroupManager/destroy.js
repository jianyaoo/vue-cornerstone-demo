"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const destroyToolGroup_1 = __importDefault(require("./destroyToolGroup"));
function destroy() {
    const toolGroups = [...index_1.state.toolGroups];
    for (const toolGroup of toolGroups) {
        (0, destroyToolGroup_1.default)(toolGroup.id);
    }
    index_1.state.toolGroups = [];
}
exports.default = destroy;
//# sourceMappingURL=destroy.js.map