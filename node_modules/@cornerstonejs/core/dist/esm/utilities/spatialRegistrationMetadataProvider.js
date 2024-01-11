import { mat4 } from 'gl-matrix';
import { addProvider } from '../metaData';
const state = {};
const spatialRegistrationMetadataProvider = {
    add: (query, payload) => {
        const [viewportId1, viewportId2] = query;
        const entryId = `${viewportId1}_${viewportId2}`;
        if (!state[entryId]) {
            state[entryId] = {};
        }
        state[entryId] = payload;
    },
    get: (type, viewportId1, viewportId2) => {
        if (type !== 'spatialRegistrationModule') {
            return;
        }
        const entryId = `${viewportId1}_${viewportId2}`;
        if (state[entryId]) {
            return state[entryId];
        }
        const entryIdReverse = `${viewportId2}_${viewportId1}`;
        if (state[entryIdReverse]) {
            return mat4.invert(mat4.create(), state[entryIdReverse]);
        }
    },
};
addProvider(spatialRegistrationMetadataProvider.get.bind(spatialRegistrationMetadataProvider));
export default spatialRegistrationMetadataProvider;
//# sourceMappingURL=spatialRegistrationMetadataProvider.js.map