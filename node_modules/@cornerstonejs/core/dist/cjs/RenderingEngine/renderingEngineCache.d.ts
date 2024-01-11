import type { IRenderingEngine } from '../types';
declare const renderingEngineCache: {
    get: (id: string) => IRenderingEngine;
    set: (re: IRenderingEngine) => void;
    delete: (id: string) => boolean;
    getAll: () => Array<IRenderingEngine>;
};
export default renderingEngineCache;
