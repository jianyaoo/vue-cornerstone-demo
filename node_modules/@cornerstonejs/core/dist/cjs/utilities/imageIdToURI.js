"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function imageIdToURI(imageId) {
    const colonIndex = imageId.indexOf(':');
    return imageId.substring(colonIndex + 1);
}
exports.default = imageIdToURI;
//# sourceMappingURL=imageIdToURI.js.map