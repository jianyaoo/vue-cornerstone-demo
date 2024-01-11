import { m as macro } from '../../macros2.js';
import vtk from '../../vtk.js';
import vtkActor from '../../Rendering/Core/Actor.js';
import vtkProperty from '../../Rendering/Core/Property.js';
import vtkGlyph3DMapper from '../../Rendering/Core/Glyph3DMapper.js';
import vtkDataArray from '../../Common/Core/DataArray.js';
import vtkPolyData from '../../Common/DataModel/PolyData.js';
import vtkColorTransferFunction from '../../Rendering/Core/ColorTransferFunction.js';
import vtkAbstractRepresentationProxy from '../Core/AbstractRepresentationProxy.js';
import '../../Filters/Sources/ArrowSource.js';
import '../../Filters/Sources/CircleSource.js';
import '../../Filters/Sources/ConcentricCylinderSource.js';
import '../../Filters/Sources/ConeSource.js';
import '../../Filters/Sources/CubeSource.js';
import '../../Filters/Sources/Cursor3D.js';
import '../../Filters/Sources/CylinderSource.js';
import '../../Filters/Sources/ImageGridSource.js';
import '../../Filters/Sources/LineSource.js';
import '../../Filters/Sources/PlaneSource.js';
import '../../Filters/Sources/PointSource.js';
import '../../Filters/Sources/RTAnalyticSource.js';
import '../../Filters/Sources/SLICSource.js';
import '../../Filters/Sources/SphereSource.js';

// ----------------------------------------------------------------------------
// vtkGlyphRepresentationProxy methods
// ----------------------------------------------------------------------------

function vtkGlyphRepresentationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGlyphRepresentationProxy');
  model.property = vtkProperty.newInstance();
  function processJSON(description) {
    model.actors.length = 0;

    // Handle colors
    const lookupTable = vtkColorTransferFunction.newInstance();
    lookupTable.applyColorMap({
      RGBPoints: description.rgbPoints
    });

    // Handle glyph
    model.glyph = {};
    let count = description.glyph.length;
    while (count--) {
      const glyph = description.glyph[count];
      model.glyph[glyph.id] = vtk(glyph);
    }

    // Handle mapping
    count = description.mapping.length;
    while (count--) {
      const sourceDesc = description.mapping[count];
      const glyph = model.glyph[sourceDesc.glyphId];
      const source = vtkPolyData.newInstance();
      source.getPoints().setData(Float32Array.from(sourceDesc.coordinates), 3);
      if (sourceDesc.scale) {
        source.getPointData().addArray(vtkDataArray.newInstance({
          name: 'scaling',
          values: Float32Array.from(sourceDesc.scale),
          numberOfComponents: 3
        }));
      }
      const mapper = vtkGlyph3DMapper.newInstance({
        useLookupTableScalarRange: true,
        lookupTable,
        orient: false,
        scaling: !!sourceDesc.scale,
        scaleArray: 'scaling',
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_COMPONENTS
      });
      const actor = vtkActor.newInstance();
      if (model.property) {
        actor.setProperty(model.property);
      }
      actor.setMapper(mapper);
      mapper.setInputData(source, 0);
      mapper.setInputConnection(glyph.getOutputPort(), 1);
      model.actors.push(actor);
    }
  }
  model.sourceDependencies.push({
    setInputData: processJSON
  });

  // Add actors
  // model.actors.push(model.sphereActor);
  // model.actors.push(model.stickActor);

  // API ----------------------------------------------------------------------

  publicAPI.setColorBy = () => {};
  publicAPI.getColorBy = () => [];
  publicAPI.listDataArrays = () => [];
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkGlyphRepresentationProxy(publicAPI, model);
  macro.proxyPropertyMapping(publicAPI, model, {
    edgeVisibility: {
      modelKey: 'property',
      property: 'edgeVisibility'
    }
  });
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkGlyphRepresentationProxy');

// ----------------------------------------------------------------------------

var vtkGlyphRepresentationProxy$1 = {
  newInstance,
  extend
};

export { vtkGlyphRepresentationProxy$1 as default, extend, newInstance };
