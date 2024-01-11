import vtkConstants from '@kitware/vtk.js/Rendering/Core/VolumeMapper/Constants';
const { BlendMode } = vtkConstants;
var BlendModes;
(function (BlendModes) {
    BlendModes[BlendModes["COMPOSITE"] = 0] = "COMPOSITE";
    BlendModes[BlendModes["MAXIMUM_INTENSITY_BLEND"] = 1] = "MAXIMUM_INTENSITY_BLEND";
    BlendModes[BlendModes["MINIMUM_INTENSITY_BLEND"] = 2] = "MINIMUM_INTENSITY_BLEND";
    BlendModes[BlendModes["AVERAGE_INTENSITY_BLEND"] = 3] = "AVERAGE_INTENSITY_BLEND";
})(BlendModes || (BlendModes = {}));
export default BlendModes;
//# sourceMappingURL=BlendModes.js.map