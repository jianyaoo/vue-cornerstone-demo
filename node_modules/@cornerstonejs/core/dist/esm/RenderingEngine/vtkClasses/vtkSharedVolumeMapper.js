import macro from '@kitware/vtk.js/macros';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
function vtkSharedVolumeMapper(publicAPI, model) {
    model.classHierarchy.push('vtkSharedVolumeMapper');
    const superDelete = publicAPI.delete;
    publicAPI.delete = () => {
        model.scalarTexture = null;
        superDelete();
    };
}
const DEFAULT_VALUES = {
    scalarTexture: null,
};
export function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    vtkVolumeMapper.extend(publicAPI, model, initialValues);
    macro.setGet(publicAPI, model, ['scalarTexture']);
    vtkSharedVolumeMapper(publicAPI, model);
}
export const newInstance = macro.newInstance(extend, 'vtkSharedVolumeMapper');
export default { newInstance, extend };
//# sourceMappingURL=vtkSharedVolumeMapper.js.map