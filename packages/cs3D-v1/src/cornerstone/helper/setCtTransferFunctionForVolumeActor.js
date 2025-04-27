import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
const windowWidth = 400;
const windowCenter = 40;

const lower = windowCenter - windowWidth / 2.0;
const upper = windowCenter + windowWidth / 2.0;

const ctVoiRange = { lower, upper };

export default function setCtTransferFunctionForVolumeActor({ volumeActor }) {
  volumeActor
    .getProperty()
    .getRGBTransferFunction(0)
    .setMappingRange(lower, upper);

  // Create scalar opacity function
  const ofun = vtkPiecewiseFunction.newInstance();
  ofun.addPoint(0, 0.0);
  ofun.addPoint(0.1, 0.9);
  ofun.addPoint(5, 1.0);

  volumeActor.getProperty().setScalarOpacity(0, ofun);
}

export { ctVoiRange };
