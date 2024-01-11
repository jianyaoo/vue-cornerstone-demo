"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContourSets = void 0;
const core_1 = require("@cornerstonejs/core");
const contourConfigCache_1 = require("./contourConfigCache");
const utils_1 = require("./utils");
function updateContourSets(viewport, geometryIds, contourRepresentation, contourRepresentationConfig, contourActorUID) {
    const { segmentationRepresentationUID, segmentsHidden } = contourRepresentation;
    const newContourConfig = contourRepresentationConfig.representations.CONTOUR;
    const cachedConfig = (0, contourConfigCache_1.getConfigCache)(segmentationRepresentationUID);
    const contourSetsActor = viewport.getActor(contourActorUID);
    if (!contourSetsActor) {
        console.warn(`No contour actor found for actorUID ${contourActorUID}. Skipping render.`);
        return;
    }
    const { actor } = contourSetsActor;
    const newOutlineWithActive = newContourConfig.outlineWidthActive;
    if ((cachedConfig === null || cachedConfig === void 0 ? void 0 : cachedConfig.outlineWidthActive) !== newOutlineWithActive) {
        actor
            .getProperty()
            .setLineWidth(newOutlineWithActive);
        (0, contourConfigCache_1.setConfigCache)(segmentationRepresentationUID, Object.assign({}, cachedConfig, {
            outlineWidthActive: newOutlineWithActive,
        }));
    }
    const mapper = actor.getMapper();
    const lut = mapper.getLookupTable();
    const segmentsToSetToInvisible = [];
    const segmentsToSetToVisible = [];
    for (const segmentIndex of segmentsHidden) {
        if (!cachedConfig.segmentsHidden.has(segmentIndex)) {
            segmentsToSetToInvisible.push(segmentIndex);
        }
    }
    for (const segmentIndex of cachedConfig.segmentsHidden) {
        if (!segmentsHidden.has(segmentIndex)) {
            segmentsToSetToVisible.push(segmentIndex);
        }
    }
    const mergedInvisibleSegments = Array.from(cachedConfig.segmentsHidden)
        .filter((segmentIndex) => !segmentsToSetToVisible.includes(segmentIndex))
        .concat(segmentsToSetToInvisible);
    const { contourSets, segmentSpecificConfigs } = geometryIds.reduce((acc, geometryId) => {
        const geometry = core_1.cache.getGeometry(geometryId);
        const { data: contourSet } = geometry;
        const segmentIndex = contourSet.getSegmentIndex();
        const segmentSpecificConfig = (0, utils_1.getSegmentSpecificConfig)(contourRepresentation, geometryId, segmentIndex);
        acc.contourSets.push(contourSet);
        acc.segmentSpecificConfigs[segmentIndex] = segmentSpecificConfig !== null && segmentSpecificConfig !== void 0 ? segmentSpecificConfig : {};
        return acc;
    }, { contourSets: [], segmentSpecificConfigs: {} });
    const affectedSegments = [
        ...mergedInvisibleSegments,
        ...segmentsToSetToVisible,
    ];
    const hasCustomSegmentSpecificConfig = Object.values(segmentSpecificConfigs).some((config) => Object.keys(config).length > 0);
    let polyDataModified = false;
    if (affectedSegments.length || hasCustomSegmentSpecificConfig) {
        const appendPolyData = mapper.getInputData();
        const appendScalars = appendPolyData.getPointData().getScalars();
        const appendScalarsData = appendScalars.getData();
        let offset = 0;
        contourSets.forEach((contourSet) => {
            var _a;
            const segmentIndex = contourSet.getSegmentIndex();
            const size = contourSet.getTotalNumberOfPoints();
            if (affectedSegments.includes(segmentIndex) ||
                ((_a = segmentSpecificConfigs[segmentIndex]) === null || _a === void 0 ? void 0 : _a.fillAlpha)) {
                const color = contourSet.getColor();
                let visibility = mergedInvisibleSegments.includes(segmentIndex)
                    ? 0
                    : 255;
                const segmentConfig = segmentSpecificConfigs[segmentIndex];
                if (segmentConfig.fillAlpha !== undefined) {
                    visibility = segmentConfig.fillAlpha * 255;
                }
                for (let i = 0; i < size; ++i) {
                    appendScalarsData[offset + i * 4] = color[0];
                    appendScalarsData[offset + i * 4 + 1] = color[1];
                    appendScalarsData[offset + i * 4 + 2] = color[2];
                    appendScalarsData[offset + i * 4 + 3] = visibility;
                }
                polyDataModified = true;
            }
            offset = offset + size * 4;
        });
        if (polyDataModified) {
            appendPolyData.modified();
        }
        (0, contourConfigCache_1.setConfigCache)(segmentationRepresentationUID, Object.assign({}, cachedConfig, {
            segmentsHidden: new Set(segmentsHidden),
        }));
        mapper.setLookupTable(lut);
    }
    viewport.render();
}
exports.updateContourSets = updateContourSets;
//# sourceMappingURL=updateContourSets.js.map