import { RequestType, ImageQualityStatus } from '../../enums';
const nearbyFrames = [
    {
        offset: -1,
        imageQualityStatus: ImageQualityStatus.ADJACENT_REPLICATE,
    },
    {
        offset: +1,
        imageQualityStatus: ImageQualityStatus.ADJACENT_REPLICATE,
    },
    { offset: +2, imageQualityStatus: ImageQualityStatus.FAR_REPLICATE },
];
const interleavedRetrieveConfiguration = [
    {
        id: 'initialImages',
        positions: [0.5, 0, -1],
        retrieveType: 'default',
        requestType: RequestType.Thumbnail,
        priority: 5,
        nearbyFrames,
    },
    {
        id: 'quarterThumb',
        decimate: 4,
        offset: 3,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFast',
        priority: 6,
        nearbyFrames,
    },
    {
        id: 'halfThumb',
        decimate: 4,
        offset: 1,
        priority: 7,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFast',
        nearbyFrames,
    },
    {
        id: 'quarterFull',
        decimate: 4,
        offset: 2,
        priority: 8,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'halfFull',
        decimate: 4,
        offset: 0,
        priority: 9,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'threeQuarterFull',
        decimate: 4,
        offset: 1,
        priority: 10,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'finalFull',
        decimate: 4,
        offset: 3,
        priority: 11,
        requestType: RequestType.Thumbnail,
        retrieveType: 'multipleFinal',
    },
    {
        id: 'errorRetrieve',
    },
];
export default interleavedRetrieveConfiguration;
//# sourceMappingURL=interleavedRetrieve.js.map