"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const Events_1 = __importDefault(require("../../enums/Events"));
const Touch_1 = require("../../enums/Touch");
const getTouchEventPoints_1 = __importDefault(require("./getTouchEventPoints"));
const touch_1 = require("../../utilities/touch");
const core_2 = require("@cornerstonejs/core");
const runtimeSettings = core_2.Settings.getRuntimeSettings();
const { TOUCH_START, TOUCH_START_ACTIVATE, TOUCH_PRESS, TOUCH_DRAG, TOUCH_END, TOUCH_TAP, TOUCH_SWIPE, } = Events_1.default;
const zeroIPoint = {
    page: [0, 0],
    client: [0, 0],
    canvas: [0, 0],
    world: [0, 0, 0],
};
const zeroIDistance = {
    page: 0,
    client: 0,
    canvas: 0,
    world: 0,
};
const defaultState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        Object.assign(Object.assign({}, zeroIPoint), { touch: null }),
    ],
    lastPointsList: [
        Object.assign(Object.assign({}, zeroIPoint), { touch: null }),
    ],
    isTouchStart: false,
    startTime: null,
    pressTimeout: null,
    pressDelay: 700,
    pressMaxDistance: 5,
    accumulatedDistance: zeroIDistance,
    swipeDistanceThreshold: 48,
    swiped: false,
    swipeToleranceMs: 300,
};
const defaultTapState = {
    renderingEngineId: undefined,
    viewportId: undefined,
    element: null,
    startPointsList: [
        Object.assign(Object.assign({}, zeroIPoint), { touch: null }),
    ],
    taps: 0,
    tapTimeout: null,
    tapMaxDistance: 24,
    tapToleranceMs: 300,
};
let state = JSON.parse(JSON.stringify(defaultState));
let tapState = JSON.parse(JSON.stringify(defaultTapState));
function triggerEventCallback(ele, name, eventDetail) {
    return (0, core_1.triggerEvent)(ele, name, eventDetail);
}
function touchStartListener(evt) {
    state.element = evt.currentTarget;
    const enabledElement = (0, core_1.getEnabledElement)(state.element);
    const { renderingEngineId, viewportId } = enabledElement;
    state.renderingEngineId = renderingEngineId;
    state.viewportId = viewportId;
    if (state.isTouchStart) {
        return;
    }
    clearTimeout(state.pressTimeout);
    state.pressTimeout = setTimeout(() => _onTouchPress(evt), state.pressDelay);
    _onTouchStart(evt);
    document.addEventListener('touchmove', _onTouchDrag);
    document.addEventListener('touchend', _onTouchEnd);
}
function _onTouchPress(evt) {
    const totalDistance = state.accumulatedDistance.canvas;
    if (totalDistance > state.pressMaxDistance) {
        return;
    }
    const eventDetail = {
        event: evt,
        eventName: TOUCH_PRESS,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPointsList: (0, touch_1.copyPointsList)(state.startPointsList),
        lastPointsList: (0, touch_1.copyPointsList)(state.lastPointsList),
        startPoints: (0, touch_1.copyPoints)((0, touch_1.getMeanTouchPoints)(state.startPointsList)),
        lastPoints: (0, touch_1.copyPoints)((0, touch_1.getMeanTouchPoints)(state.lastPointsList)),
    };
    triggerEventCallback(eventDetail.element, TOUCH_PRESS, eventDetail);
}
function _onTouchStart(evt) {
    state.isTouchStart = true;
    state.startTime = new Date();
    const startPointsList = (0, getTouchEventPoints_1.default)(evt, state.element);
    const startPoints = (0, touch_1.getMeanTouchPoints)(startPointsList);
    const deltaPoints = zeroIPoint;
    const deltaDistance = zeroIDistance;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_START,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: startPointsList,
        lastPointsList: startPointsList,
        currentPointsList: startPointsList,
        startPoints: startPoints,
        lastPoints: startPoints,
        currentPoints: startPoints,
        deltaPoints,
        deltaDistance,
    };
    state.startPointsList = (0, touch_1.copyPointsList)(eventDetail.startPointsList);
    state.lastPointsList = (0, touch_1.copyPointsList)(eventDetail.lastPointsList);
    const eventDidPropagate = triggerEventCallback(eventDetail.element, TOUCH_START, eventDetail);
    if (eventDidPropagate) {
        triggerEventCallback(eventDetail.element, TOUCH_START_ACTIVATE, eventDetail);
    }
}
function _onTouchDrag(evt) {
    const currentPointsList = (0, getTouchEventPoints_1.default)(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? (0, touch_1.getDeltaPoints)(currentPointsList, lastPointsList)
        : zeroIPoint;
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? (0, touch_1.getDeltaDistanceBetweenIPoints)(currentPointsList, lastPointsList)
        : zeroIDistance;
    const totalDistance = currentPointsList.length === lastPointsList.length
        ? (0, touch_1.getDeltaDistance)(currentPointsList, state.lastPointsList)
        : zeroIDistance;
    state.accumulatedDistance = {
        page: state.accumulatedDistance.page + totalDistance.page,
        client: state.accumulatedDistance.client + totalDistance.client,
        canvas: state.accumulatedDistance.canvas + totalDistance.canvas,
        world: state.accumulatedDistance.world + totalDistance.world,
    };
    const eventDetail = {
        event: evt,
        eventName: TOUCH_DRAG,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        startPoints: (0, touch_1.getMeanTouchPoints)(state.startPointsList),
        lastPoints: (0, touch_1.getMeanTouchPoints)(lastPointsList),
        currentPoints: (0, touch_1.getMeanTouchPoints)(currentPointsList),
        startPointsList: (0, touch_1.copyPointsList)(state.startPointsList),
        lastPointsList: (0, touch_1.copyPointsList)(lastPointsList),
        currentPointsList,
        deltaPoints: deltaPoints,
        deltaDistance: deltaDistance,
    };
    triggerEventCallback(state.element, TOUCH_DRAG, eventDetail);
    _checkTouchSwipe(evt, deltaPoints);
    state.lastPointsList = (0, touch_1.copyPointsList)(currentPointsList);
}
function _onTouchEnd(evt) {
    clearTimeout(state.pressTimeout);
    const currentPointsList = (0, getTouchEventPoints_1.default)(evt, state.element);
    const lastPointsList = _updateTouchEventsLastPoints(state.element, state.lastPointsList);
    const deltaPoints = currentPointsList.length === lastPointsList.length
        ? (0, touch_1.getDeltaPoints)(currentPointsList, lastPointsList)
        : (0, touch_1.getDeltaPoints)(currentPointsList, currentPointsList);
    const deltaDistance = currentPointsList.length === lastPointsList.length
        ? (0, touch_1.getDeltaDistanceBetweenIPoints)(currentPointsList, lastPointsList)
        : (0, touch_1.getDeltaDistanceBetweenIPoints)(currentPointsList, currentPointsList);
    const eventDetail = {
        event: evt,
        eventName: TOUCH_END,
        element: state.element,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        startPointsList: (0, touch_1.copyPointsList)(state.startPointsList),
        lastPointsList: (0, touch_1.copyPointsList)(lastPointsList),
        currentPointsList,
        startPoints: (0, touch_1.getMeanTouchPoints)(state.startPointsList),
        lastPoints: (0, touch_1.getMeanTouchPoints)(lastPointsList),
        currentPoints: (0, touch_1.getMeanTouchPoints)(currentPointsList),
        deltaPoints,
        deltaDistance,
    };
    triggerEventCallback(eventDetail.element, TOUCH_END, eventDetail);
    _checkTouchTap(evt);
    state = JSON.parse(JSON.stringify(defaultState));
    document.removeEventListener('touchmove', _onTouchDrag);
    document.removeEventListener('touchend', _onTouchEnd);
}
function _checkTouchTap(evt) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (currentTime - startTime > tapState.tapToleranceMs) {
        return;
    }
    if (tapState.taps === 0) {
        tapState.element = state.element;
        tapState.renderingEngineId = state.renderingEngineId;
        tapState.viewportId = state.viewportId;
        tapState.startPointsList = state.startPointsList;
    }
    if (tapState.taps > 0 &&
        !(tapState.element == state.element &&
            tapState.renderingEngineId == state.renderingEngineId &&
            tapState.viewportId == state.viewportId)) {
        return;
    }
    const currentPointsList = (0, getTouchEventPoints_1.default)(evt, tapState.element);
    const distanceFromStart = (0, touch_1.getDeltaDistance)(currentPointsList, tapState.startPointsList).canvas;
    if (distanceFromStart > tapState.tapMaxDistance) {
        return;
    }
    clearTimeout(tapState.tapTimeout);
    tapState.taps += 1;
    tapState.tapTimeout = setTimeout(() => {
        const eventDetail = {
            event: evt,
            eventName: TOUCH_TAP,
            element: tapState.element,
            renderingEngineId: tapState.renderingEngineId,
            viewportId: tapState.viewportId,
            camera: {},
            currentPointsList,
            currentPoints: (0, touch_1.getMeanTouchPoints)(currentPointsList),
            taps: tapState.taps,
        };
        triggerEventCallback(eventDetail.element, TOUCH_TAP, eventDetail);
        tapState = JSON.parse(JSON.stringify(defaultTapState));
    }, tapState.tapToleranceMs);
}
function _checkTouchSwipe(evt, deltaPoints) {
    const currentTime = new Date().getTime();
    const startTime = state.startTime.getTime();
    if (state.swiped || currentTime - startTime > state.swipeToleranceMs) {
        return;
    }
    const [x, y] = deltaPoints.canvas;
    const eventDetail = {
        event: evt,
        eventName: TOUCH_SWIPE,
        renderingEngineId: state.renderingEngineId,
        viewportId: state.viewportId,
        camera: {},
        element: state.element,
        swipe: null,
    };
    if (Math.abs(x) > state.swipeDistanceThreshold) {
        eventDetail.swipe = x > 0 ? Touch_1.Swipe.RIGHT : Touch_1.Swipe.LEFT;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
    if (Math.abs(y) > state.swipeDistanceThreshold) {
        eventDetail.swipe = y > 0 ? Touch_1.Swipe.DOWN : Touch_1.Swipe.UP;
        triggerEventCallback(eventDetail.element, TOUCH_SWIPE, eventDetail);
        state.swiped = true;
    }
}
function _updateTouchEventsLastPoints(element, lastPoints) {
    const { viewport } = (0, core_1.getEnabledElement)(element);
    return lastPoints.map((lp) => {
        const world = viewport.canvasToWorld(lp.canvas);
        return {
            page: lp.page,
            client: lp.client,
            canvas: lp.canvas,
            world,
            touch: lp.touch,
        };
    });
}
exports.default = touchStartListener;
//# sourceMappingURL=touchStartListener.js.map