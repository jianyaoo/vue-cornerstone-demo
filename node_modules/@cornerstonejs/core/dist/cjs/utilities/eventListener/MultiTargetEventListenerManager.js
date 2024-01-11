"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiTargetEventListenerManager = exports.default = void 0;
const TargetEventListeners_1 = __importDefault(require("./TargetEventListeners"));
class MultiTargetEventListenerManager {
    constructor() {
        this._targetsEventListeners = new Map();
    }
    addEventListener(target, type, callback, options) {
        let eventListeners = this._targetsEventListeners.get(target);
        if (!eventListeners) {
            eventListeners = new TargetEventListeners_1.default(target);
            this._targetsEventListeners.set(target, eventListeners);
        }
        eventListeners.addEventListener(type, callback, options);
    }
    removeEventListener(target, type, callback, options) {
        const eventListeners = this._targetsEventListeners.get(target);
        if (!eventListeners) {
            return;
        }
        eventListeners.removeEventListener(type, callback, options);
        if (eventListeners.isEmpty) {
            this._targetsEventListeners.delete(target);
        }
    }
    reset() {
        Array.from(this._targetsEventListeners.entries()).forEach(([target, targetEventListeners]) => {
            targetEventListeners.reset();
            this._targetsEventListeners.delete(target);
        });
    }
}
exports.default = MultiTargetEventListenerManager;
exports.MultiTargetEventListenerManager = MultiTargetEventListenerManager;
//# sourceMappingURL=MultiTargetEventListenerManager.js.map