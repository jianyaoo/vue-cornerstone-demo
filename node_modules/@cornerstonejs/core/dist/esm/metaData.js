const providers = [];
export function addProvider(provider, priority = 0) {
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
export function removeProvider(provider) {
    for (let i = 0; i < providers.length; i++) {
        if (providers[i].provider === provider) {
            providers.splice(i, 1);
            break;
        }
    }
}
export function removeAllProviders() {
    while (providers.length > 0) {
        providers.pop();
    }
}
function getMetaData(type, ...queries) {
    for (let i = 0; i < providers.length; i++) {
        const result = providers[i].provider(type, ...queries);
        if (result !== undefined) {
            return result;
        }
    }
}
export { getMetaData as get };
//# sourceMappingURL=metaData.js.map