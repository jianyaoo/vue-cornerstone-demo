import vtkPickerManipulator from './Manipulators/PickerManipulator.js';
import vtkLineManipulator from './Manipulators/LineManipulator.js';
import vtkPlanePointManipulator from './Manipulators/PlaneManipulator.js';
import vtkTrackballManipulator from './Manipulators/TrackballManipulator.js';

var Manipulators = {
  vtkPickerManipulator,
  vtkLineManipulator,
  vtkPlaneManipulator: vtkPlanePointManipulator,
  vtkTrackballManipulator
};

export { Manipulators as default };
