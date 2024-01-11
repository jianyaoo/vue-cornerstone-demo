import vtkStateBuilder from '../../Core/StateBuilder.js';

function generateState() {
  return vtkStateBuilder.createBuilder().addStateFromMixin({
    labels: ['moveHandle'],
    mixins: ['origin', 'color', 'scale1', 'visible', 'manipulator'],
    name: 'moveHandle',
    initialValues: {
      // when scaleInPixels=true, the handles have 30px height
      scale1: 30,
      visible: false
    }
  }).addDynamicMixinState({
    labels: ['handles'],
    mixins: ['origin', 'color', 'scale1', 'visible', 'manipulator'],
    name: 'handle',
    initialValues: {
      scale1: 30
    }
  }).build();
}

export { generateState as default };
