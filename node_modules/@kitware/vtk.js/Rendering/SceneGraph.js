import vtkRenderPass from './SceneGraph/RenderPass.js';
import vtkRenderWindowViewNode from './SceneGraph/RenderWindowViewNode.js';
import vtkViewNode from './SceneGraph/ViewNode.js';
import vtkViewNodeFactory from './SceneGraph/ViewNodeFactory.js';

var SceneGraph = {
  vtkRenderPass,
  vtkRenderWindowViewNode,
  vtkViewNode,
  vtkViewNodeFactory
};

export { SceneGraph as default };
