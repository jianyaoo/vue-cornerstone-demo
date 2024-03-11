export default CentralizedWorkerManager;
declare class CentralizedWorkerManager {
    workerRegistry: {};
    workerPoolManager: RequestPoolManager;
    registerWorker(workerName: any, workerFn: any, options?: {}): void;
    getNextWorkerAPI(workerName: any): {
        api: any;
        index: number;
    };
    executeTask(workerName: any, methodName: any, args?: {}, { requestType, priority, options, callbacks, }?: {
        requestType?: RequestType;
        priority?: number;
        options?: {};
        callbacks?: any[];
    }): Promise<any>;
    terminateIdleWorkers(workerName: any, idleTimeThreshold: any): void;
    terminate(workerName: any): void;
    terminateWorkerInstance(workerName: any, index: any): void;
}
import { RequestPoolManager } from "../requestPool/requestPoolManager";
import { RequestType } from "../enums/";
//# sourceMappingURL=webWorkerManager.d.ts.map