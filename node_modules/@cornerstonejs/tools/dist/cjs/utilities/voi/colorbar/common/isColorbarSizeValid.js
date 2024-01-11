"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isColorbarSizeValid = exports.default = void 0;
const isColorbarSizeValid = (size) => {
    return !!size && size.width > 0 && size.height > 0;
};
exports.default = isColorbarSizeValid;
exports.isColorbarSizeValid = isColorbarSizeValid;
//# sourceMappingURL=isColorbarSizeValid.js.map