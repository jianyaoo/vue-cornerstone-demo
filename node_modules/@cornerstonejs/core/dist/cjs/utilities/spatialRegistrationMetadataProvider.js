"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const metaData_1 = require("../metaData");
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
            return gl_matrix_1.mat4.invert(gl_matrix_1.mat4.create(), state[entryIdReverse]);
        }
    },
};
(0, metaData_1.addProvider)(spatialRegistrationMetadataProvider.get.bind(spatialRegistrationMetadataProvider));
exports.default = spatialRegistrationMetadataProvider;
//# sourceMappingURL=spatialRegistrationMetadataProvider.js.map