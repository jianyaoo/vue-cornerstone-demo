"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.removeAllProviders = exports.removeProvider = exports.addProvider = void 0;
const providers = [];
function addProvider(provider, priority = 0) {
    let i;
    for (i = 0; i < providers.length; i++) {
        if (providers[i].priority <= priority) {
            break;
        }
    }
    providers.splice(i, 0, {
        priority,
        provider,
    });
}
exports.addProvider = addProvider;
function removeProvider(provider) {
    for (let i = 0; i < providers.length; i++) {
        if (providers[i].provider === provider) {
            providers.splice(i, 1);
            break;
        }
    }
}
exports.removeProvider = removeProvider;
function removeAllProviders() {
    while (providers.length > 0) {
        providers.pop();
    }
}
exports.removeAllProviders = removeAllProviders;
function getMetaData(type, ...queries) {
    for (let i = 0; i < providers.length; i++) {
        const result = providers[i].provider(type, ...queries);
        if (result !== undefined) {
            return result;
        }
    }
}
exports.get = getMetaData;
//# sourceMappingURL=metaData.js.map