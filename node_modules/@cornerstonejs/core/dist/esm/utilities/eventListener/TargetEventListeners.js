var EventListenerPhases;
(function (EventListenerPhases) {
    EventListenerPhases[EventListenerPhases["None"] = 0] = "None";
    EventListenerPhases[EventListenerPhases["Capture"] = 1] = "Capture";
    EventListenerPhases[EventListenerPhases["Bubble"] = 2] = "Bubble";
})(EventListenerPhases || (EventListenerPhases = {}));
class TargetEventListeners {
    constructor(target) {
        this._eventListeners = new Map();
        this._children = new Map();
        this._target = target;
    }
    get isEmpty() {
        return this._eventListeners.size === 0 && this._children.size === 0;
    }
    addEventListener(type, callback, options) {
        const dotIndex = type.indexOf('.');
        const isNamespace = dotIndex !== -1;
        if (isNamespace) {
            const namespaceToken = type.substring(0, dotIndex);
            let childElementEventListener = this._children.get(namespaceToken);
            if (!childElementEventListener) {
                childElementEventListener = new TargetEventListeners(this._target);
                this._children.set(namespaceToken, childElementEventListener);
            }
            type = type.substring(dotIndex + 1);
            childElementEventListener.addEventListener(type, callback, options);
        }
        else {
            this._addEventListener(type, callback, options);
        }
    }
    removeEventListener(type, callback, options) {
        const dotIndex = type.indexOf('.');
        const isNamespace = dotIndex !== -1;
        if (isNamespace) {
            const namespaceToken = type.substring(0, dotIndex);
            const childElementEventListener = this._children.get(namespaceToken);
            if (!childElementEventListener) {
                return;
            }
            type = type.substring(dotIndex + 1);
            childElementEventListener.removeEventListener(type, callback, options);
            if (childElementEventListener.isEmpty) {
                this._children.delete(namespaceToken);
            }
        }
        else {
            this._removeEventListener(type, callback, options);
        }
    }
    reset() {
        Array.from(this._children.entries()).forEach(([namespace, child]) => {
            child.reset();
            if (child.isEmpty) {
                this._children.delete(namespace);
            }
            else {
                throw new Error('Child is not empty and cannot be removed');
            }
        });
        this._unregisterAllEvents();
    }
    _addEventListener(type, callback, options) {
        let listenersMap = this._eventListeners.get(type);
        if (!listenersMap) {
            listenersMap = new Map();
            this._eventListeners.set(type, listenersMap);
        }
        const useCapture = options?.capture ?? false;
        const listenerPhase = useCapture
            ? EventListenerPhases.Capture
            : EventListenerPhases.Bubble;
        const registeredPhases = listenersMap.get(callback) ?? EventListenerPhases.None;
        if (registeredPhases & listenerPhase) {
            console.warn('A listener is already registered for this phase');
            return;
        }
        listenersMap.set(callback, registeredPhases | listenerPhase);
        this._target.addEventListener(type, callback, options);
    }
    _removeEventListener(type, callback, options) {
        const useCapture = options?.capture ?? false;
        const listenerPhase = useCapture
            ? EventListenerPhases.Capture
            : EventListenerPhases.Bubble;
        const listenersMap = this._eventListeners.get(type);
        if (!listenersMap) {
            return;
        }
        const callbacks = callback ? [callback] : Array.from(listenersMap.keys());
        callbacks.forEach((callbackItem) => {
            const registeredPhases = listenersMap.get(callbackItem) ?? EventListenerPhases.None;
            const phaseRegistered = !!(registeredPhases & listenerPhase);
            if (!phaseRegistered) {
                return;
            }
            this._target.removeEventListener(type, callbackItem, options);
            const newListenerPhase = registeredPhases ^ listenerPhase;
            if (newListenerPhase === EventListenerPhases.None) {
                listenersMap.delete(callbackItem);
            }
            else {
                listenersMap.set(callbackItem, newListenerPhase);
            }
        });
        if (!listenersMap.size) {
            this._eventListeners.delete(type);
        }
    }
    _unregisterAllListeners(type, listenersMap) {
        Array.from(listenersMap.entries()).forEach(([listener, eventPhases]) => {
            const startPhase = EventListenerPhases.Capture;
            for (let currentPhase = startPhase; eventPhases; currentPhase <<= 1) {
                if (!(eventPhases & currentPhase)) {
                    continue;
                }
                const useCapture = currentPhase === EventListenerPhases.Capture ? true : false;
                this.removeEventListener(type, listener, { capture: useCapture });
                eventPhases ^= currentPhase;
            }
        });
    }
    _unregisterAllEvents() {
        Array.from(this._eventListeners.entries()).forEach(([type, listenersMap]) => this._unregisterAllListeners(type, listenersMap));
    }
}
export { TargetEventListeners as default, TargetEventListeners };
//# sourceMappingURL=TargetEventListeners.js.map