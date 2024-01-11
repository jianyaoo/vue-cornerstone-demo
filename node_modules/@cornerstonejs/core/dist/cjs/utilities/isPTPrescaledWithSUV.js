"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPTPrescaledWithSUV = (image) => {
    var _a, _b;
    return ((_a = image.preScale) === null || _a === void 0 ? void 0 : _a.scaled) && ((_b = image.preScale.scalingParameters) === null || _b === void 0 ? void 0 : _b.suvbw);
};
exports.default = isPTPrescaledWithSUV;
//# sourceMappingURL=isPTPrescaledWithSUV.js.map