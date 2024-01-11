"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const annotationState_1 = require("../stateManagement/annotation/annotationState");
function filterToolsWithAnnotationsForElement(element, tools) {
    const result = [];
    for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        if (!tool) {
            console.warn('undefined tool in filterToolsWithAnnotationsForElement');
            continue;
        }
        let annotations = (0, annotationState_1.getAnnotations)(tool.constructor.toolName, element);
        if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
            continue;
        }
        if (typeof tool.filterInteractableAnnotationsForElement === 'function') {
            annotations = tool.filterInteractableAnnotationsForElement(element, annotations);
        }
        if (annotations.length > 0) {
            result.push({ tool, annotations });
        }
    }
    return result;
}
exports.default = filterToolsWithAnnotationsForElement;
//# sourceMappingURL=filterToolsWithAnnotationsForElement.js.map