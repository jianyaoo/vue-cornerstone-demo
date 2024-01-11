import { m as macro } from '../../macros2.js';
import vtkSphereSource from '../../Filters/Sources/SphereSource.js';
import vtkGlyphRepresentation from './GlyphRepresentation.js';
import { Behavior } from './WidgetRepresentation/Constants.js';

function vtkSphereContextRepresentation(publicAPI, model) {
  model.classHierarchy.push('vtkSphereContextRepresentation');
  publicAPI.setGlyphResolution = macro.chain(publicAPI.setGlyphResolution, model._pipeline.glyph.setThetaResolution, model._pipeline.glyph.setPhiResolution);
  publicAPI.setDrawBorder = draw => {
    model._pipeline.glyph.setLines(draw);
  };
  publicAPI.setDrawFace = draw => {
    model._pipeline.glyph.setFace(draw);
  };
  publicAPI.setOpacity = opacity => {
    model._pipeline.actor.getProperty().setOpacity(opacity);
  };
  model._pipeline.actor.getProperty().setOpacity(0.2);
}
function defaultValues(initialValues) {
  return {
    glyphResolution: 32,
    drawBorder: false,
    drawFace: true,
    behavior: Behavior.CONTEXT,
    _pipeline: {
      glyph: vtkSphereSource.newInstance({
        phiResolution: initialValues.glyphResolution ?? 32,
        thetaResolution: initialValues.glyphResolution ?? 32
      })
    },
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkGlyphRepresentation.extend(publicAPI, model, defaultValues(initialValues));
  macro.setGet(publicAPI, model, ['glyphResolution']);
  vtkSphereContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSphereContextRepresentation');
var vtkSphereContextRepresentation$1 = {
  newInstance,
  extend
};

export { vtkSphereContextRepresentation$1 as default, extend, newInstance };
