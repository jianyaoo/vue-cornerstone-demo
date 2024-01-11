import { getEnabledElement } from '@cornerstonejs/core';
export default function getMouseEventPoints(evt, element) {
    const elementToUse = element || evt.currentTarget;
    const { viewport } = getEnabledElement(elementToUse);
    const clientPoint = _clientToPoint(evt);
    const pagePoint = _pageToPoint(evt);
    const canvasPoint = _pagePointsToCanvasPoints(elementToUse, pagePoint);
    const worldPoint = viewport.canvasToWorld(canvasPoint);
    return {
        page: pagePoint,
        client: clientPoint,
        canvas: canvasPoint,
        world: worldPoint,
    };
}
function _pagePointsToCanvasPoints(element, pagePoint) {
    const rect = element.getBoundingClientRect();
    return [
        pagePoint[0] - rect.left - window.pageXOffset,
        pagePoint[1] - rect.top - window.pageYOffset,
    ];
}
function _pageToPoint(evt) {
    return [evt.pageX, evt.pageY];
}
function _clientToPoint(evt) {
    return [evt.clientX, evt.clientY];
}
//# sourceMappingURL=getMouseEventPoints.js.map