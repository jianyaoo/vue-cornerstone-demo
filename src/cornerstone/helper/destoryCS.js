import { ToolGroupManager, destroy as cstDestory } from "@cornerstonejs/tools";
import { cache, getRenderingEngine } from "@cornerstonejs/core";

const destoryToolGroup = {
  '[object String]': (toolId) =>  ToolGroupManager.destroyToolGroup(toolId),
  '[object Array]': (toolId) => {
    toolId.forEach(item => ToolGroupManager.destroyToolGroup(toolId))
  }
}

export default function(renderId, toolId){
  if (toolId){
    const type = Object.prototype.toString.call(toolId);
    destoryToolGroup[type](toolId);
    cstDestory();
  }

  cache.purgeCache();
  getRenderingEngine(renderId)?.destroy()
}
