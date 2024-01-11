const cache = {};
const renderingEngineCache = {
    get: (id) => {
        return cache[id];
    },
    set: (re) => {
        const renderingEngineId = re.id;
        cache[renderingEngineId] = re;
    },
    delete: (id) => {
        return delete cache[id];
    },
    getAll: () => {
        const renderingEngineIds = Object.keys(cache);
        const renderingEngines = renderingEngineIds.map((id) => cache[id]);
        renderingEngines.sort((a, b) => {
            if (a.id[0] === '_' && b.id[0] !== '_') {
                return 1;
            }
            else if (a.id[0] !== '_' && b.id[0] === '_') {
                return -1;
            }
            else {
                return 0;
            }
        });
        return renderingEngines;
    },
};
export default renderingEngineCache;
//# sourceMappingURL=renderingEngineCache.js.map