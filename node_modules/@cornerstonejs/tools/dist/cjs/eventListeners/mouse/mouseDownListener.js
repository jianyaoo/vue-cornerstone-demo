"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mouseDoubleClickIgnoreListener = exports.getMouseButton = void 0;
const core_1 = require("@cornerstonejs/core");
const Events_1 = __importDefault(require("../../enums/Events"));
const mouseMoveListener_1 = __importDefault(require("./mouseMoveListener"));
const getMouseEventPoints_1 = __importDefault(require("./getMouseEventPoints"));
const { MOUSE_DOWN, MOUSE_DOWN_ACTIVATE, MOUSE_CLICK, MOUSE_UP, MOUSE_DRAG } = Events_1.default;
const DOUBLE_CLICK_TOLERANCE_MS = 400;
const MULTI_BUTTON_TOLERANCE_MS = 150;
const DOUBLE_CLICK_DRAG_TOLERANCE = 3;
const defaultState = {
    mouseButton: undefined,
    element: null,
    renderingEngineId: undefined,
    viewportId: undefined,
    isClickEvent: true,
    clickDelay: 200,
    preventClickTimeout: null,
    startPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
    lastPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
};
let state = {
    mouseButton: undefined,
    renderingEngineId: undefined,
    viewportId: undefined,
    isClickEvent: true,
    clickDelay: 200,
    element: null,
    preventClickTimeout: null,
    startPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
    lastPoints: {
        page: [0, 0],
        client: [0, 0],
        canvas: [0, 0],
        world: [0, 0, 0],
    },
};
const doubleClickState = {
    doubleClickTimeout: null,
    mouseDownEvent: null,
    mouseUpEvent: null,
    ignoreDoubleClick: false,
};
function mouseDownListener(evt) {
    if (doubleClickState.doubleClickTimeout) {
        if (evt.buttons === doubleClickState.mouseDownEvent.buttons) {
            return;
        }
        doubleClickState.mouseDownEvent = evt;
        _doStateMouseDownAndUp();
        return;
    }
    doubleClickState.doubleClickTimeout = setTimeout(_doStateMouseDownAndUp, evt.buttons === 1 ? DOUBLE_CLICK_TOLERANCE_MS : MULTI_BUTTON_TOLERANCE_MS);
    doubleClickState.mouseDownEvent = evt;
    doubleClickState.ignoreDoubleClick = false;
    state.element = evt.currentTarget;
    state.mouseButton = evt.buttons;
    const enabledElement = (0, core_1.getEnabledElement)(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    state.preventClickTimeout = setTimeout(_preventClickHandler, state.clickDelay);
    state.element.removeEventListener('mousemove', mouseMoveListener_1.default);
    const startPoints = (0, getMouseEventPoints_1.default)(evt, state.element);
    state.startPoints = _copyPoints(startPoints);
    state.lastPoints = _copyPoints(startPoints);
    document.addEventListener('mouseup', _onMouseUp);
    document.addEventListener('mousemove', _onMouseDrag);
}
function _doMouseDown(evt) {
    const deltaPoints = _getDeltaPoints(state.startPoints, state.startPoints);
    const eventDetail = {
        event: evt,
        eventName: MOUSE_DOWN,
        element: state.element,
        mouseButton: state.mouseButton,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPoints: state.startPoints,
        lastPoints: state.startPoints,
        currentPoints: state.startPoints,
        deltaPoints,
    };
    state.lastPoints = _copyPoints(eventDetail.lastPoints);
    const notConsumed = (0, core_1.triggerEvent)(eventDetail.element, MOUSE_DOWN, eventDetail);
    if (notConsumed) {
        (0, core_1.triggerEvent)(eventDetail.element, MOUSE_DOWN_ACTIVATE, eventDetail);
    }
}
function _onMouseDrag(evt) {
    const currentPoints = (0, getMouseEventPoints_1.default)(evt, state.element);
    const lastPoints = _updateMouseEventsLastPoints(state.element, state.lastPoints);
    const deltaPoints = _getDeltaPoints(currentPoints, lastPoints);
    if (doubleClickState.doubleClickTimeout) {
        if (_isDragPastDoubleClickTolerance(deltaPoints.canvas)) {
            _doStateMouseDownAndUp();
        }
        else {
            return;
        }
    }
    const eventDetail = {
        event: evt,
        eventName: MOUSE_DRAG,
        mouseButton: state.mouseButton,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPoints: _copyPoints(state.startPoints),
        lastPoints: _copyPoints(lastPoints),
        currentPoints,
        deltaPoints,
    };
    const consumed = !(0, core_1.triggerEvent)(state.element, MOUSE_DRAG, eventDetail);
    if (consumed) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
    state.lastPoints = _copyPoints(currentPoints);
}
function _onMouseUp(evt) {
    clearTimeout(state.preventClickTimeout);
    if (doubleClickState.doubleClickTimeout) {
        if (!doubleClickState.mouseUpEvent) {
            doubleClickState.mouseUpEvent = evt;
            state.element.addEventListener('mousemove', _onMouseMove);
        }
        else {
            _cleanUp();
        }
    }
    else {
        const eventName = state.isClickEvent ? MOUSE_CLICK : MOUSE_UP;
        const currentPoints = (0, getMouseEventPoints_1.default)(evt, state.element);
        const deltaPoints = _getDeltaPoints(currentPoints, state.lastPoints);
        const eventDetail = {
            event: evt,
            eventName,
            mouseButton: state.mouseButton,
            element: state.element,
            renderingEngineId: state.renderingEngineId,
            viewportId: state.viewportId,
            camera: {},
            startPoints: _copyPoints(state.startPoints),
            lastPoints: _copyPoints(state.lastPoints),
            currentPoints,
            deltaPoints,
        };
        (0, core_1.triggerEvent)(eventDetail.element, eventName, eventDetail);
        _cleanUp();
    }
    document.removeEventListener('mousemove', _onMouseDrag);
}
function _onMouseMove(evt) {
    const currentPoints = (0, getMouseEventPoints_1.default)(evt, state.element);
    const lastPoints = _updateMouseEventsLastPoints(state.element, state.lastPoints);
    const deltaPoints = _getDeltaPoints(currentPoints, lastPoints);
    if (!_isDragPastDoubleClickTolerance(deltaPoints.canvas)) {
        return;
    }
    _doStateMouseDownAndUp();
    (0, mouseMoveListener_1.default)(evt);
}
function _isDragPastDoubleClickTolerance(delta) {
    return Math.abs(delta[0]) + Math.abs(delta[1]) > DOUBLE_CLICK_DRAG_TOLERANCE;
}
function _preventClickHandler() {
    state.isClickEvent = false;
}
function _doStateMouseDownAndUp() {
    doubleClickState.ignoreDoubleClick = true;
    const mouseDownEvent = doubleClickState.mouseDownEvent;
    const mouseUpEvent = doubleClickState.mouseUpEvent;
    _clearDoubleClickTimeoutAndEvents();
    _doMouseDown(mouseDownEvent);
    if (mouseUpEvent) {
        _onMouseUp(mouseUpEvent);
    }
}
function _clearDoubleClickTimeoutAndEvents() {
    if (doubleClickState.doubleClickTimeout) {
        clearTimeout(doubleClickState.doubleClickTimeout);
        doubleClickState.doubleClickTimeout = null;
    }
    doubleClickState.mouseDownEvent = null;
    doubleClickState.mouseUpEvent = null;
}
function _cleanUp() {
    var _a, _b;
    document.removeEventListener('mouseup', _onMouseUp);
    (_a = state.element) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousemove', _onMouseMove);
    (_b = state.element) === null || _b === void 0 ? void 0 : _b.addEventListener('mousemove', mouseMoveListener_1.default);
    _clearDoubleClickTimeoutAndEvents();
    state = JSON.parse(JSON.stringify(defaultState));
}
function _copyPoints(points) {
    return JSON.parse(JSON.stringify(points));
}
function _updateMouseEventsLastPoints(element, lastPoints) {
    const { viewport } = (0, core_1.getEnabledElement)(element);
    const world = viewport.canvasToWorld(lastPoints.canvas);
    return {
        page: lastPoints.page,
        client: lastPoints.client,
        canvas: lastPoints.canvas,
        world,
    };
}
function _getDeltaPoints(currentPoints, lastPoints) {
    return {
        page: _subtractPoints2D(currentPoints.page, lastPoints.page),
        client: _subtractPoints2D(currentPoints.client, lastPoints.client),
        canvas: _subtractPoints2D(currentPoints.canvas, lastPoints.canvas),
        world: _subtractPoints3D(currentPoints.world, lastPoints.world),
    };
}
function _subtractPoints2D(point0, point1) {
    return [point0[0] - point1[0], point0[1] - point1[1]];
}
function _subtractPoints3D(point0, point1) {
    return [point0[0] - point1[0], point0[1] - point1[1], point0[2] - point1[2]];
}
function getMouseButton() {
    return state.mouseButton;
}
exports.getMouseButton = getMouseButton;
function mouseDoubleClickIgnoreListener(evt) {
    if (doubleClickState.ignoreDoubleClick) {
        doubleClickState.ignoreDoubleClick = false;
        evt.stopImmediatePropagation();
        evt.preventDefault();
    }
    else {
        _cleanUp();
    }
}
exports.mouseDoubleClickIgnoreListener = mouseDoubleClickIgnoreListener;
exports.default = mouseDownListener;
//# sourceMappingURL=mouseDownListener.js.map