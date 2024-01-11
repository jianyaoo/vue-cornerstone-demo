import renderingEngineCache from './renderingEngineCache';
export function getRenderingEngine(id) {
    return renderingEngineCache.get(id);
}
export function getRenderingEngines() {
    return renderingEngineCache.getAll();
}
export default getRenderingEngine;
//# sourceMappingURL=getRenderingEngine.js.map