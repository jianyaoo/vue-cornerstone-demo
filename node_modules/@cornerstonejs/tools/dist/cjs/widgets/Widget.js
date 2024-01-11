"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Widget = exports.default = void 0;
class Widget {
    constructor({ id, container }) {
        this._containerResizeCallback = (entries) => {
            let width;
            let height;
            const { contentRect, contentBoxSize } = entries[0];
            if (contentRect) {
                width = contentRect.width;
                height = contentRect.height;
            }
            else if (contentBoxSize === null || contentBoxSize === void 0 ? void 0 : contentBoxSize.length) {
                width = contentBoxSize[0].inlineSize;
                height = contentBoxSize[0].blockSize;
            }
            this._containerSize = { width, height };
            this.onContainerResize();
        };
        this._id = id;
        this._containerSize = { width: 0, height: 0 };
        this._rootElement = this.createRootElement(id);
        this._containerResizeObserver = new ResizeObserver(this._containerResizeCallback);
        if (container) {
            this.appendTo(container);
        }
    }
    get id() {
        return this._id;
    }
    get rootElement() {
        return this._rootElement;
    }
    appendTo(container) {
        const { _rootElement: rootElement, _containerResizeObserver: resizeObserver, } = this;
        const { parentElement: currentContainer } = rootElement;
        if (!container || container === currentContainer) {
            return;
        }
        if (currentContainer) {
            resizeObserver.unobserve(currentContainer);
        }
        container.appendChild(rootElement);
        resizeObserver.observe(container);
    }
    destroy() {
        const { _rootElement: rootElement, _containerResizeObserver: resizeObserver, } = this;
        const { parentElement } = rootElement;
        parentElement === null || parentElement === void 0 ? void 0 : parentElement.removeChild(rootElement);
        resizeObserver.disconnect();
    }
    get containerSize() {
        return Object.assign({}, this._containerSize);
    }
    createRootElement(id) {
        const rootElement = document.createElement('div');
        rootElement.id = id;
        rootElement.classList.add('widget');
        Object.assign(rootElement.style, {
            width: '100%',
            height: '100%',
        });
        return rootElement;
    }
    onContainerResize() {
    }
}
exports.default = Widget;
exports.Widget = Widget;
//# sourceMappingURL=Widget.js.map