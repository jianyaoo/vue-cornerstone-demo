import { MouseCursor } from '.';
declare function initElementCursor(element: HTMLDivElement, cursor: MouseCursor | null): void;
declare function _setElementCursor(element: HTMLDivElement, cursor: MouseCursor | null): void;
declare function resetElementCursor(element: HTMLDivElement): void;
declare function hideElementCursor(element: HTMLDivElement): void;
export { initElementCursor, resetElementCursor, hideElementCursor, _setElementCursor as setElementCursor, };
