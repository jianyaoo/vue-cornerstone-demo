import vtkStateBuilder from '../../Core/StateBuilder.js';

// Defines the structure of the widget state.
// See https://kitware.github.io/vtk-js/docs/concepts_widgets.html.
function stateGenerator() {
  return vtkStateBuilder.createBuilder().addStateFromMixin({
    labels: ['moveHandle'],
    mixins: ['origin', 'color3', 'scale1', 'direction', 'visible', 'manipulator'],
    name: 'moveHandle',
    initialValues: {
      scale1: 20,
      visible: true,
      direction: [0, 0, 1]
    }
  }).build();
}

export { stateGenerator as default };
