import vtkStateBuilder from '../../Core/StateBuilder.js';
import { splineKind } from '../../../Common/DataModel/Spline3D/Constants.js';
import { BoundaryCondition } from '../../../Common/DataModel/Spline1D/Constants.js';

function generateState() {
  return vtkStateBuilder.createBuilder().addField({
    name: 'splineKind',
    initialValue: splineKind.KOCHANEK_SPLINE
  }).addField({
    name: 'splineClosed',
    initialValue: true
  }).addField({
    name: 'splineBoundaryCondition',
    initialValue: BoundaryCondition.DEFAULT
  }).addField({
    name: 'splineBoundaryConditionValues',
    initialValue: [0, 0, 0]
  }).addField({
    name: 'splineTension',
    initialValue: 0
  }).addField({
    name: 'splineContinuity',
    initialValue: 0
  }).addField({
    name: 'splineBias',
    initialValue: 0
  }).addStateFromMixin({
    labels: ['moveHandle'],
    mixins: ['origin', 'color', 'scale1', 'visible', 'manipulator'],
    name: 'moveHandle',
    initialValues: {
      scale1: 10,
      visible: false
    }
  }).addDynamicMixinState({
    labels: ['handles'],
    mixins: ['origin', 'color', 'scale1', 'visible', 'manipulator'],
    name: 'handle',
    initialValues: {
      scale1: 10
    }
  }).build();
}

export { generateState as default };
