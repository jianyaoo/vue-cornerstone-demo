import TargetEventListeners from './TargetEventListeners';
class MultiTargetEventListenerManager {
    constructor() {
        this._targetsEventListeners = new Map();
    }
    addEventListener(target, type, callback, options) {
        let eventListeners = this._targetsEventListeners.get(target);
        if (!eventListeners) {
            eventListeners = new TargetEventListeners(target);
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
export { MultiTargetEventListenerManager as default, MultiTargetEventListenerManager, };
//# sourceMappingURL=MultiTargetEventListenerManager.js.map