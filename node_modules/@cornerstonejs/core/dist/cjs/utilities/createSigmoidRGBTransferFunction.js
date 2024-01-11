"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColorTransferFunction_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/ColorTransferFunction"));
const DataArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/DataArray"));
const windowLevelUtil = __importStar(require("./windowLevel"));
function createSigmoidRGBTransferFunction(voiRange, approximationNodes = 1024) {
    const { windowWidth, windowCenter } = windowLevelUtil.toWindowLevel(voiRange.lower, voiRange.upper);
    const sigmoid = (x, wc, ww) => {
        return 1 / (1 + Math.exp((-4 * (x - wc)) / ww));
    };
    const logit = (y, wc, ww) => {
        return wc - (ww / 4) * Math.log((1 - y) / y);
    };
    const range = [...Array(approximationNodes + 2).keys()]
        .map((v) => v / (approximationNodes + 2))
        .slice(1, -1);
    const table = range.reduce((res, y) => {
        const x = logit(y, windowCenter, windowWidth);
        return res.concat(x, y, y, y, 0.5, 0.0);
    }, []);
    const cfun = ColorTransferFunction_1.default.newInstance();
    cfun.buildFunctionFromArray(DataArray_1.default.newInstance({ values: table, numberOfComponents: 6 }));
    return cfun;
}
exports.default = createSigmoidRGBTransferFunction;
//# sourceMappingURL=createSigmoidRGBTransferFunction.js.map