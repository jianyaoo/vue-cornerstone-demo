import widgetBehavior$1 from '../ShapeWidget/behavior.js';

function widgetBehavior(publicAPI, model) {
  model.shapeHandle = model.widgetState.getRectangleHandle();
  model.point1Handle = model.widgetState.getPoint1Handle();
  model.point2Handle = model.widgetState.getPoint2Handle();
  model.point1Handle.setManipulator(model.manipulator);
  model.point2Handle.setManipulator(model.manipulator);

  // We inherit shapeBehavior
  widgetBehavior$1(publicAPI, model);
  const superClass = {
    ...publicAPI
  };
  model.classHierarchy.push('vtkRectangleWidgetProp');
  publicAPI.setCorners = (point1, point2) => {
    if (superClass.setCorners) {
      superClass.setCorners(point1, point2);
    }
    model.shapeHandle.setOrigin(point1);
    model.shapeHandle.setCorner(point2);
  };
}

export { widgetBehavior as default };
