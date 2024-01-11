"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/VolumeMapper/Constants"));
const { BlendMode } = Constants_1.default;
var BlendModes;
(function (BlendModes) {
    BlendModes[BlendModes["COMPOSITE"] = 0] = "COMPOSITE";
    BlendModes[BlendModes["MAXIMUM_INTENSITY_BLEND"] = 1] = "MAXIMUM_INTENSITY_BLEND";
    BlendModes[BlendModes["MINIMUM_INTENSITY_BLEND"] = 2] = "MINIMUM_INTENSITY_BLEND";
    BlendModes[BlendModes["AVERAGE_INTENSITY_BLEND"] = 3] = "AVERAGE_INTENSITY_BLEND";
})(BlendModes || (BlendModes = {}));
exports.default = BlendModes;
//# sourceMappingURL=BlendModes.js.map