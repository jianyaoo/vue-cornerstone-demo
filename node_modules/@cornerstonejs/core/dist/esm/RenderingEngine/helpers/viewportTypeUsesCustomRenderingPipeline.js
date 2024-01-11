import viewportTypeToViewportClass from './viewportTypeToViewportClass';
export default function viewportTypeUsesCustomRenderingPipeline(viewportType) {
    return viewportTypeToViewportClass[viewportType].useCustomRenderingPipeline;
}
//# sourceMappingURL=viewportTypeUsesCustomRenderingPipeline.js.map