import vtkGeometryRepresentationProxy from './Representations/GeometryRepresentationProxy.js';
import vtkGlyphRepresentationProxy from './Representations/GlyphRepresentationProxy.js';
import vtkMoleculeRepresentationProxy from './Representations/MoleculeRepresentationProxy.js';
import vtkSkyboxRepresentationProxy from './Representations/SkyboxRepresentationProxy.js';
import vtkSliceRepresentationProxy from './Representations/SliceRepresentationProxy.js';
import vtkSlicedGeometryRepresentationProxy from './Representations/SlicedGeometryRepresentationProxy.js';
import vtkVolumeRepresentationProxy from './Representations/VolumeRepresentationProxy.js';

var Representations = {
  vtkGeometryRepresentationProxy,
  vtkGlyphRepresentationProxy,
  vtkMoleculeRepresentationProxy,
  vtkSkyboxRepresentationProxy,
  vtkSliceRepresentationProxy,
  vtkSlicedGeometryRepresentationProxy,
  vtkVolumeRepresentationProxy
};

export { Representations as default };
