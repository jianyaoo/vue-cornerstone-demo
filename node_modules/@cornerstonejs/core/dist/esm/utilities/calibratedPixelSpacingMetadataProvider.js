import imageIdToURI from './imageIdToURI';
const state = {};
const metadataProvider = {
    add: (imageId, payload) => {
        const imageURI = imageIdToURI(imageId);
        state[imageURI] = payload;
    },
    get: (type, imageId) => {
        if (type === 'calibratedPixelSpacing') {
            const imageURI = imageIdToURI(imageId);
            return state[imageURI];
        }
    },
};
export default metadataProvider;
//# sourceMappingURL=calibratedPixelSpacingMetadataProvider.js.map