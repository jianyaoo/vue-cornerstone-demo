import { m as macro } from '../../macros2.js';
import vtkCircleSource from '../../Filters/Sources/CircleSource.js';
import vtkGlyphRepresentation from './GlyphRepresentation.js';
import { Behavior } from './WidgetRepresentation/Constants.js';

// ----------------------------------------------------------------------------
// vtkCircleContextRepresentation methods
// ----------------------------------------------------------------------------

function vtkCircleContextRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCircleContextRepresentation');

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model._pipeline.actor.getProperty().setOpacity(0.2);
  model._pipeline.mapper.setResolveCoincidentTopology(true);
  model._pipeline.mapper.setRelativeCoincidentTopologyPolygonOffsetParameters(-1, -1);

  // --------------------------------------------------------------------------

  publicAPI.setGlyphResolution = macro.chain(publicAPI.setGlyphResolution, model._pipeline.glyph.setResolution);

  // --------------------------------------------------------------------------

  publicAPI.setDrawBorder = macro.chain(publicAPI.setDrawBorder, draw => model._pipeline.glyph.setLines(draw));

  // --------------------------------------------------------------------------

  publicAPI.setDrawFace = macro.chain(publicAPI.setDrawFace, draw => model._pipeline.glyph.setFace(draw));

  // --------------------------------------------------------------------------

  publicAPI.setOpacity = opacity => {
    model._pipeline.actor.getProperty().setOpacity(opacity);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    behavior: Behavior.CONTEXT,
    glyphResolution: 32,
    drawBorder: false,
    drawFace: true,
    ...initialValues,
    _pipeline: {
      glyph: initialValues?.pipeline?.glyph ?? vtkCircleSource.newInstance({
        resolution: initialValues.glyphResolution ?? 32,
        radius: 1,
        lines: initialValues.drawBorder ?? false,
        face: initialValues.drawFace ?? true,
        direction: [0, 0, 1]
      }),
      ...initialValues?.pipeline
    }
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkGlyphRepresentation.extend(publicAPI, model, defaultValues(initialValues));
  macro.setGet(publicAPI, model, ['glyphResolution', 'drawFace', 'drawBorder']);
  macro.get(publicAPI, model._pipeline, ['glyph', 'mapper', 'actor']);

  // Object specific methods
  vtkCircleContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCircleContextRepresentation');

// ----------------------------------------------------------------------------

var vtkCircleContextRepresentation$1 = {
  newInstance,
  extend
};

export { vtkCircleContextRepresentation$1 as default, extend, newInstance };
