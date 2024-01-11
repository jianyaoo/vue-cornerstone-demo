import { Enums } from '@cornerstonejs/core';
import triggerAnnotationRender from '../utilities/triggerAnnotationRender';
const onImageRendered = function (evt) {
    triggerAnnotationRender(evt.detail.element);
};
const enable = function (element) {
    element.addEventListener(Enums.Events.IMAGE_RENDERED, onImageRendered);
};
const disable = function (element) {
    element.removeEventListener(Enums.Events.IMAGE_RENDERED, onImageRendered);
};
export default {
    enable,
    disable,
};
//# sourceMappingURL=imageRenderedEventDispatcher.js.map