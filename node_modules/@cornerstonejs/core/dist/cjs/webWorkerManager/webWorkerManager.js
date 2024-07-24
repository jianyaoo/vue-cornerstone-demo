"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comlink = __importStar(require("comlink"));
const enums_1 = require("../enums/");
const requestPoolManager_1 = require("../requestPool/requestPoolManager");
class CentralizedWorkerManager {
    constructor() {
        this.workerRegistry = {};
        this.workerPoolManager = new requestPoolManager_1.RequestPoolManager('webworker');
    }
    registerWorker(workerName, workerFn, options = {}) {
        var _a;
        const { maxWorkerInstances = 1, overwrite = false, autoTerminateOnIdle = {
            enabled: false,
            idleTimeThreshold: 3000,
        }, } = options;
        if (this.workerRegistry[workerName] && !overwrite) {
            console.warn(`Worker type '${workerName}' is already registered...`);
            return;
        }
        if (overwrite && ((_a = this.workerRegistry[workerName]) === null || _a === void 0 ? void 0 : _a.idleCheckIntervalId)) {
            clearInterval(this.workerRegistry[workerName].idleCheckIntervalId);
        }
        const workerProperties = {
            workerFn: null,
            instances: [],
            loadCounters: [],
            lastActiveTime: [],
            nativeWorkers: [],
            autoTerminateOnIdle: autoTerminateOnIdle.enabled,
            idleCheckIntervalId: null,
            idleTimeThreshold: autoTerminateOnIdle.idleTimeThreshold,
        };
        workerProperties.loadCounters = Array(maxWorkerInstances).fill(0);
        workerProperties.lastActiveTime = Array(maxWorkerInstances).fill(null);
        for (let i = 0; i < maxWorkerInstances; i++) {
            const worker = workerFn();
            workerProperties.instances.push(Comlink.wrap(worker));
            workerProperties.nativeWorkers.push(worker);
            workerProperties.workerFn = workerFn;
        }
        this.workerRegistry[workerName] = workerProperties;
    }
    getNextWorkerAPI(workerName) {
        const workerProperties = this.workerRegistry[workerName];
        if (!workerProperties) {
            console.error(`Worker type '${workerName}' is not registered.`);
            return null;
        }
        const workerInstances = workerProperties.instances.filter((instance) => instance !== null);
        let minLoadIndex = 0;
        let minLoadValue = workerProperties.loadCounters[0] || 0;
        for (let i = 1; i < workerInstances.length; i++) {
            const currentLoadValue = workerProperties.loadCounters[i] || 0;
            if (currentLoadValue < minLoadValue) {
                minLoadIndex = i;
                minLoadValue = currentLoadValue;
            }
        }
        if (workerProperties.instances[minLoadIndex] === null) {
            const worker = workerProperties.workerFn();
            workerProperties.instances[minLoadIndex] = Comlink.wrap(worker);
            workerProperties.nativeWorkers[minLoadIndex] = worker;
        }
        workerProperties.loadCounters[minLoadIndex] += 1;
        return {
            api: workerProperties.instances[minLoadIndex],
            index: minLoadIndex,
        };
    }
    executeTask(workerName, methodName, args = {}, { requestType = enums_1.RequestType.Compute, priority = 0, options = {}, callbacks = [], } = {}) {
        return new Promise((resolve, reject) => {
            const requestFn = () => __awaiter(this, void 0, void 0, function* () {
                const { api, index } = this.getNextWorkerAPI(workerName);
                if (!api) {
                    const error = new Error(`No available worker instance for '${workerName}'`);
                    console.error(error);
                    reject(error);
                    return;
                }
                try {
                    let finalCallbacks = [];
                    if (callbacks.length) {
                        finalCallbacks = callbacks.map((cb) => {
                            return Comlink.proxy(cb);
                        });
                    }
                    const workerProperties = this.workerRegistry[workerName];
                    workerProperties.processing = true;
                    const results = yield api[methodName](args, ...finalCallbacks);
                    workerProperties.processing = false;
                    workerProperties.lastActiveTime[index] = Date.now();
                    if (workerProperties.autoTerminateOnIdle &&
                        !workerProperties.idleCheckIntervalId &&
                        workerProperties.idleTimeThreshold) {
                        workerProperties.idleCheckIntervalId = setInterval(() => {
                            this.terminateIdleWorkers(workerName, workerProperties.idleTimeThreshold);
                        }, workerProperties.idleTimeThreshold);
                    }
                    resolve(results);
                }
                catch (err) {
                    console.error(`Error executing method '${methodName}' on worker '${workerName}':`, err);
                    reject(err);
                }
                finally {
                    this.workerRegistry[workerName].loadCounters[index]--;
                }
            });
            this.workerPoolManager.addRequest(requestFn, requestType, options, priority);
        });
    }
    terminateIdleWorkers(workerName, idleTimeThreshold) {
        const workerProperties = this.workerRegistry[workerName];
        if (workerProperties.processing) {
            return;
        }
        const now = Date.now();
        workerProperties.instances.forEach((_, index) => {
            const lastActiveTime = workerProperties.lastActiveTime[index];
            const isWorkerActive = lastActiveTime !== null && workerProperties.loadCounters[index] > 0;
            const idleTime = now - lastActiveTime;
            if (!isWorkerActive && idleTime > idleTimeThreshold) {
                this.terminateWorkerInstance(workerName, index);
            }
        });
    }
    terminate(workerName) {
        const workerProperties = this.workerRegistry[workerName];
        if (!workerProperties) {
            console.error(`Worker type '${workerName}' is not registered.`);
            return;
        }
        workerProperties.instances.forEach((_, index) => {
            this.terminateWorkerInstance(workerName, index);
        });
    }
    terminateWorkerInstance(workerName, index) {
        const workerProperties = this.workerRegistry[workerName];
        const workerInstance = workerProperties.instances[index];
        if (workerInstance !== null) {
            workerInstance[Comlink.releaseProxy]();
            workerProperties.nativeWorkers[index].terminate();
            workerProperties.instances[index] = null;
            workerProperties.lastActiveTime[index] = null;
        }
    }
}
exports.default = CentralizedWorkerManager;
//# sourceMappingURL=webWorkerManager.js.map