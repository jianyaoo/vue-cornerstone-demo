"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrUpdateContourSets = void 0;
const addContourSetsToElement_1 = require("./addContourSetsToElement");
const updateContourSets_1 = require("./updateContourSets");
function addOrUpdateContourSets(viewport, geometryIds, contourRepresentation, contourRepresentationConfig) {
    const { segmentationRepresentationUID } = contourRepresentation;
    const actorUID = `CONTOUR_${segmentationRepresentationUID}`;
    const actor = viewport.getActor(actorUID);
    const addOrUpdateFn = actor ? updateContourSets_1.updateContourSets : addContourSetsToElement_1.addContourSetsToElement;
    addOrUpdateFn(viewport, geometryIds, contourRepresentation, contourRepresentationConfig, actorUID);
}
exports.addOrUpdateContourSets = addOrUpdateContourSets;
//# sourceMappingURL=addOrUpdateContourSets.js.map