"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestPoolManager_1 = require("./requestPoolManager");
const RequestType_1 = __importDefault(require("../enums/RequestType"));
const imageRetrievalPoolManager = new requestPoolManager_1.RequestPoolManager('imageRetrievalPool');
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Interaction, 200);
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Thumbnail, 200);
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType_1.default.Prefetch, 200);
imageRetrievalPoolManager.grabDelay = 0;
exports.default = imageRetrievalPoolManager;
//# sourceMappingURL=imageRetrievalPoolManager.js.map