import { StackViewport } from '..';
import getEnabledElement from '../getEnabledElement';
function getImageLegacy(element) {
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) {
        return;
    }
    const { viewport } = enabledElement;
    if (!(viewport instanceof StackViewport)) {
        throw new Error(`An image can only be fetched for a stack viewport and not for a viewport of type: ${viewport.type}`);
    }
    return viewport.getCornerstoneImage();
}
export default getImageLegacy;
//# sourceMappingURL=getImageLegacy.js.map