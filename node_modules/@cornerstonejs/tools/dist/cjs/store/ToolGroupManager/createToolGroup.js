"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const ToolGroup_1 = __importDefault(require("./ToolGroup"));
function createToolGroup(toolGroupId) {
    const toolGroupWithIdExists = index_1.state.toolGroups.some((tg) => tg.id === toolGroupId);
    if (toolGroupWithIdExists) {
        console.warn(`'${toolGroupId}' already exists.`);
        return;
    }
    const toolGroup = new ToolGroup_1.default(toolGroupId);
    index_1.state.toolGroups.push(toolGroup);
    return toolGroup;
}
exports.default = createToolGroup;
//# sourceMappingURL=createToolGroup.js.map