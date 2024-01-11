import { mat4 } from 'gl-matrix';
declare const spatialRegistrationMetadataProvider: {
    add: (query: string[], payload: mat4) => void;
    get: (type: string, viewportId1: string, viewportId2: string) => mat4;
};
export default spatialRegistrationMetadataProvider;
