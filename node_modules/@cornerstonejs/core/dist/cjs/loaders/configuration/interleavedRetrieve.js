"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const nearbyFrames = [
    {
        offset: -1,
        imageQualityStatus: enums_1.ImageQualityStatus.ADJACENT_REPLICATE,
    },
    {
        offset: +1,
        imageQualityStatus: enums_1.ImageQualityStatus.ADJACENT_REPLICATE,
    },
    { offset: +2, imageQualityStatus: enums_1.ImageQualityStatus.FAR_REPLICATE },
];
const interleavedRetrieveConfiguration = [
    {
        id: 'initialImages',
        positions: [0.5, 0, -1],
        retrieveType: 'default',
        requestType: enums_1.RequestType.Thumbnail,
        priority: 5,
        nearbyFrames,
    },
    {
        id: 'quarterThumb',
        decimate: 4,
        offset: 3,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFast',
        priority: 6,
        nearbyFrames,
    },
    {
        id: 'halfThumb',
        decimate: 4,
        offset: 1,
        priority: 7,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFast',
        nearbyFrames,
    },
    {
        id: 'quarterFull',
        decimate: 4,
        offset: 2,
        priority: 8,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'halfFull',
        decimate: 4,
        offset: 0,
        priority: 9,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'threeQuarterFull',
        decimate: 4,
        offset: 1,
        priority: 10,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'finalFull',
        decimate: 4,
        offset: 3,
        priority: 11,
        requestType: enums_1.RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'errorRetrieve',
    },
];
exports.default = interleavedRetrieveConfiguration;
//# sourceMappingURL=interleavedRetrieve.js.map