"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageIdToURI_1 = __importDefault(require("./imageIdToURI"));
const state = {};
const metadataProvider = {
    add: (imageId, payload) => {
        const imageURI = (0, imageIdToURI_1.default)(imageId);
        state[imageURI] = payload;
    },
    get: (type, imageId) => {
        if (type === 'calibratedPixelSpacing') {
            const imageURI = (0, imageIdToURI_1.default)(imageId);
            return state[imageURI];
        }
    },
};
exports.default = metadataProvider;
//# sourceMappingURL=calibratedPixelSpacingMetadataProvider.js.map