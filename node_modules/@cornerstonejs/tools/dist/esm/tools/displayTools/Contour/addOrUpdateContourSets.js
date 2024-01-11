import { addContourSetsToElement } from './addContourSetsToElement';
import { updateContourSets } from './updateContourSets';
export function addOrUpdateContourSets(viewport, geometryIds, contourRepresentation, contourRepresentationConfig) {
    const { segmentationRepresentationUID } = contourRepresentation;
    const actorUID = `CONTOUR_${segmentationRepresentationUID}`;
    const actor = viewport.getActor(actorUID);
    const addOrUpdateFn = actor ? updateContourSets : addContourSetsToElement;
    addOrUpdateFn(viewport, geometryIds, contourRepresentation, contourRepresentationConfig, actorUID);
}
//# sourceMappingURL=addOrUpdateContourSets.js.map