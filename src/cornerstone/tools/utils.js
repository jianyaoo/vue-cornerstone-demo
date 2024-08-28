import { renderingEngine_id, toolGroupId } from '@/enums/cs'
import {
	addTool, CrosshairsTool, Enums as cstEnums, PanTool, StackScrollMouseWheelTool, state, ToolGroupManager,
} from '@cornerstonejs/tools'
import { ElMessage } from 'element-plus'

export function addTools(registerTools, vps){
	return () => {
		const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

		registerTools.forEach(tool => {
			if (!state.tools[tool.toolName]){
				addTool(tool);
				toolGroup.addTool(tool.toolName)
			}
		})

		vps.forEach(vp => toolGroup.addViewport(vp, renderingEngine_id))
	}
}

export function activeDefaultTools(type = 'stack') {
	return () => {
		const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
		toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Auxiliary}],
		})

		if (type === 'volume'){
			toolGroup.setToolActive(CrosshairsTool.toolName, {
				bindings: [{mouseButton: cstEnums.MouseBindings.Primary}],
			})
		}
	}
}


export function changeTool(toolName, status = 'Disabled'){
	const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

	// 获取当前左键已激活的工具
	const activePrimaryToolName = toolGroup.getActivePrimaryMouseButtonTool();
	if (activePrimaryToolName === toolName) {
		ElMessage({
			message: '当前工具处已于激活状态，点击左键尝试操作',
			type: 'warning',
		})
		return;
	}

	// 禁用掉已激活的工具
	if (activePrimaryToolName) {
		toolGroup[`setTool${status}`](activePrimaryToolName);
	}

	// 启用当前选中的工具
	toolGroup.setToolActive(toolName, {
		bindings: [{mouseButton: cstEnums.MouseBindings.Primary}],
	});
}

