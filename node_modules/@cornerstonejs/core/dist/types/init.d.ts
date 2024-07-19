import { SharedArrayBufferModes } from './enums';
import { Cornerstone3DConfig } from './types';
declare function init(configuration?: Cornerstone3DConfig): Promise<boolean>;
declare function setUseCPURendering(status: boolean): void;
declare function setPreferSizeOverAccuracy(status: boolean): void;
declare function canRenderFloatTextures(): boolean;
declare function resetUseCPURendering(): void;
declare function getShouldUseCPURendering(): boolean;
declare function setUseSharedArrayBuffer(mode: SharedArrayBufferModes | boolean): void;
declare function resetUseSharedArrayBuffer(): void;
declare function getShouldUseSharedArrayBuffer(): boolean;
declare function isCornerstoneInitialized(): boolean;
declare function getConfiguration(): Cornerstone3DConfig;
declare function setConfiguration(c: Cornerstone3DConfig): void;
declare function getWebWorkerManager(): any;
export { init, getShouldUseCPURendering, getShouldUseSharedArrayBuffer, isCornerstoneInitialized, setUseCPURendering, setUseSharedArrayBuffer, setPreferSizeOverAccuracy, resetUseCPURendering, resetUseSharedArrayBuffer, getConfiguration, setConfiguration, getWebWorkerManager, canRenderFloatTextures, };
//# sourceMappingURL=init.d.ts.map