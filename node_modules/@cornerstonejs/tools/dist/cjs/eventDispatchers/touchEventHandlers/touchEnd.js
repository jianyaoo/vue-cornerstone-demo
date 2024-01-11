"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customCallbackHandler_1 = __importDefault(require("../shared/customCallbackHandler"));
const touchEnd = customCallbackHandler_1.default.bind(null, 'Touch', 'touchEndCallback');
exports.default = touchEnd;
//# sourceMappingURL=touchEnd.js.map