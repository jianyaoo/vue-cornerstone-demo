import eventTarget from '../eventTarget';
export default function triggerEvent(el = eventTarget, type, detail = null) {
    if (!type) {
        throw new Error('Event type was not defined');
    }
    const event = new CustomEvent(type, {
        detail,
        cancelable: true,
    });
    return el.dispatchEvent(event);
}
//# sourceMappingURL=triggerEvent.js.map