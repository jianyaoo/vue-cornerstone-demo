"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestPoolManager_1 = require("./requestPoolManager");
const RequestType_1 = __importDefault(require("../enums/RequestType"));
const imageLoadPoolManager = new requestPoolManager_1.RequestPoolManager('imageLoadPool');
imageLoadPoolManager.grabDelay = 0;
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Interaction, 1000);
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Thumbnail, 1000);
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Prefetch, 1000);
exports.default = imageLoadPoolManager;
//# sourceMappingURL=imageLoadPoolManager.js.map