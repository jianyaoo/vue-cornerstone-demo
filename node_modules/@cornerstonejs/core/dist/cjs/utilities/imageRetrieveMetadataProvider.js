"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metaData_1 = require("../metaData");
const retrieveConfigurationState = new Map();
const IMAGE_RETRIEVE_CONFIGURATION = 'imageRetrieveConfiguration';
const imageRetrieveMetadataProvider = {
    IMAGE_RETRIEVE_CONFIGURATION,
    clear: () => {
        retrieveConfigurationState.clear();
    },
    add: (key, payload) => {
        retrieveConfigurationState.set(key, payload);
    },
    get: (type, ...queries) => {
        if (type === IMAGE_RETRIEVE_CONFIGURATION) {
            return queries
                .map((query) => retrieveConfigurationState.get(query))
                .find((it) => it !== undefined);
        }
    },
};
(0, metaData_1.addProvider)(imageRetrieveMetadataProvider.get.bind(imageRetrieveMetadataProvider));
exports.default = imageRetrieveMetadataProvider;
//# sourceMappingURL=imageRetrieveMetadataProvider.js.map