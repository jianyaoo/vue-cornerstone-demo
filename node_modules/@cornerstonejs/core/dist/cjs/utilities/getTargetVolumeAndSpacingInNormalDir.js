"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = __importDefault(require("../cache/cache"));
const constants_1 = require("../constants");
const getSpacingInNormalDirection_1 = __importDefault(require("./getSpacingInNormalDirection"));
const volumeLoader_1 = require("../loaders/volumeLoader");
const getVolumeId_1 = require("./getVolumeId");
const EPSILON_PART = 1 + constants_1.EPSILON;
const startsWith = (str, starts) => starts === str.substring(0, Math.min(str.length, starts.length));
const isPrimaryVolume = (volume) => !!(0, volumeLoader_1.getVolumeLoaderSchemes)().find((scheme) => startsWith(volume.volumeId, scheme));
function getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetId, useSlabThickness = false) {
    const { viewPlaneNormal } = camera;
    const volumeActors = viewport.getActors();
    if (!volumeActors || !volumeActors.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const imageVolumes = volumeActors
        .map((va) => {
        var _a;
        const actorUID = (_a = va.referenceId) !== null && _a !== void 0 ? _a : va.uid;
        return cache_1.default.getVolume(actorUID);
    })
        .filter((iv) => !!iv);
    if (targetId) {
        const targetVolumeId = (0, getVolumeId_1.getVolumeId)(targetId);
        const imageVolumeIndex = imageVolumes.findIndex((iv) => targetVolumeId.includes(iv.volumeId));
        const imageVolume = imageVolumes[imageVolumeIndex];
        const { uid: actorUID } = volumeActors[imageVolumeIndex];
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport, useSlabThickness);
        return { imageVolume, spacingInNormalDirection, actorUID };
    }
    if (!imageVolumes.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const smallest = {
        spacingInNormalDirection: Infinity,
        imageVolume: null,
        actorUID: null,
    };
    const hasPrimaryVolume = imageVolumes.find(isPrimaryVolume);
    for (let i = 0; i < imageVolumes.length; i++) {
        const imageVolume = imageVolumes[i];
        if (hasPrimaryVolume && !isPrimaryVolume(imageVolume)) {
            continue;
        }
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport);
        if (spacingInNormalDirection * EPSILON_PART <
            smallest.spacingInNormalDirection) {
            smallest.spacingInNormalDirection = spacingInNormalDirection;
            smallest.imageVolume = imageVolume;
            smallest.actorUID = volumeActors[i].uid;
        }
    }
    return smallest;
}
exports.default = getTargetVolumeAndSpacingInNormalDir;
function getSpacingInNormal(imageVolume, viewPlaneNormal, viewport, useSlabThickness = false) {
    const { slabThickness } = viewport.getProperties();
    let spacingInNormalDirection = slabThickness;
    if (!slabThickness || useSlabThickness === false) {
        spacingInNormalDirection = (0, getSpacingInNormalDirection_1.default)(imageVolume, viewPlaneNormal);
    }
    return spacingInNormalDirection;
}
//# sourceMappingURL=getTargetVolumeAndSpacingInNormalDir.js.map