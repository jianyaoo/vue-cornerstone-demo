import { registerAllTools } from '@/cornerstone/tools/registerToolList'
import { renderingEngine_id, toolGroupId, toolGroupIdByStack, toolGroupIdByVolume } from '@/enums/cs'
import { Enums as csEnums } from '@cornerstonejs/core'
import {
	addTool, CrosshairsTool, Enums as cstEnums, PanTool, StackScrollMouseWheelTool, state, ToolGroupManager,
} from '@cornerstonejs/tools'
import { ElMessage } from 'element-plus'

function addToolInstance(item, toolGroup) {
	toolGroup.addToolInstance(item.toolName, item.tool.toolName, item.config)
}

function addToolGroup(item, toolGroup) {
	toolGroup.addTool(item.toolName)
}

export function addTools(registerToolsConfig, volumeVps = [], stackVps = []) {
	return () => {
		const toolGroupVolume = ToolGroupManager.createToolGroup(toolGroupIdByVolume);
		const toolGroupStack = ToolGroupManager.createToolGroup(toolGroupIdByStack);

		registerToolsConfig.forEach(item => {
			if (!state.tools[item.toolName]) {
				if (!state.tools[item.tool.toolName]){
					addTool(item.tool);
				}

				if (item.vpType.includes(csEnums.ViewportType.ORTHOGRAPHIC)) {
					const actuator = item.type === 'instance' ? addToolInstance : addToolGroup;
					actuator(item, toolGroupVolume)
				}

				if (item.vpType.includes(csEnums.ViewportType.STACK)) {
					const actuator = item.type === 'instance' ? addToolInstance : addToolGroup;
					actuator(item, toolGroupStack)
				}
			}
		})

		volumeVps.forEach(vp => toolGroupVolume.addViewport(vp, renderingEngine_id))
		stackVps.forEach(vp => toolGroupStack.addViewport(vp, renderingEngine_id))
	}
}

export function activeDefaultTools(type = 'stack') {
	return () => {
		const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
		toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Auxiliary}],
		})

		if (type === 'volume') {
			toolGroup.setToolActive(CrosshairsTool.toolName, {
				bindings: [{mouseButton: cstEnums.MouseBindings.Primary}],
			})
		}
	}
}

export function changeTool(toolName, status = 'Disabled') {
	const toolGroupVolume = ToolGroupManager.getToolGroup(toolGroupIdByVolume);
	const toolGroupStack = ToolGroupManager.getToolGroup(toolGroupIdByStack);

	const toolNameObj = registerAllTools.find(item => item.toolName === toolName);
	const vpTypes = toolNameObj.vpType;

	// 获取当前左键已激活的工具
	const activePrimaryToolName = toolGroupVolume.getActivePrimaryMouseButtonTool();
	if (activePrimaryToolName === toolName) {
		ElMessage({
			message: 'Volume视图当前工具处已于激活状态，点击左键尝试操作',
			type: 'warning',
		})
		return;
	}

	// 禁用掉已激活的工具
	if (activePrimaryToolName) {
		toolGroupVolume[`setTool${status}`](activePrimaryToolName);
		toolGroupStack[`setTool${status}`](activePrimaryToolName);
	}

	if (vpTypes.includes(csEnums.ViewportType.ORTHOGRAPHIC)) {
		// 启用当前选中的工具
		toolGroupVolume.setToolActive(toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Primary}],
		});
	}

	if (vpTypes.includes(csEnums.ViewportType.STACK)) {
		// 启用当前选中的工具
		toolGroupStack.setToolActive(toolName, {
			bindings: [{mouseButton: cstEnums.MouseBindings.Primary}],
		});
	}

}

