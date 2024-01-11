import vtkBoundingBox from './DataModel/BoundingBox.js';
import vtkBox from './DataModel/Box.js';
import vtkCell from './DataModel/Cell.js';
import vtkCone from './DataModel/Cone.js';
import vtkCylinder from './DataModel/Cylinder.js';
import vtkDataSet from './DataModel/DataSet.js';
import vtkDataSetAttributes from './DataModel/DataSetAttributes.js';
import ITKHelper from './DataModel/ITKHelper.js';
import vtkImageData from './DataModel/ImageData.js';
import vtkImplicitBoolean from './DataModel/ImplicitBoolean.js';
import vtkLine from './DataModel/Line.js';
import vtkMolecule from './DataModel/Molecule.js';
import vtkPiecewiseFunction from './DataModel/PiecewiseFunction.js';
import vtkPlane from './DataModel/Plane.js';
import vtkPointSet from './DataModel/PointSet.js';
import vtkPolyData from './DataModel/PolyData.js';
import vtkSelectionNode from './DataModel/SelectionNode.js';
import vtkSphere from './DataModel/Sphere.js';
import vtkStructuredData from './DataModel/StructuredData.js';
import vtkTriangle from './DataModel/Triangle.js';

var DataModel = {
  vtkBoundingBox,
  vtkBox,
  vtkCell,
  vtkCone,
  vtkCylinder,
  vtkDataSet,
  vtkDataSetAttributes,
  vtkITKHelper: ITKHelper,
  vtkImageData,
  vtkImplicitBoolean,
  vtkLine,
  vtkMolecule,
  vtkPiecewiseFunction,
  vtkPlane,
  vtkPointSet,
  vtkPolyData,
  vtkSelectionNode,
  vtkSphere,
  vtkStructuredData,
  vtkTriangle
};

export { DataModel as default };
