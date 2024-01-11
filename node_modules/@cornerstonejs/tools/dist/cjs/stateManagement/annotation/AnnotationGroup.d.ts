export declare type BaseEventDetail = {
    viewportId: string;
    renderingEngineId: string;
};
export default class AnnotationGroup {
    private annotationUIDs;
    private _isVisible;
    visibleFilter: (uid: string) => boolean;
    constructor();
    protected unboundVisibleFilter(uid: string): boolean;
    has(uid: string): boolean;
    setVisible(isVisible: boolean, baseEvent: BaseEventDetail, filter?: (annotationUID: string) => boolean): void;
    get isVisible(): boolean;
    findNearby(uid: string, direction: 1): string;
    add(...annotationUIDs: string[]): void;
    remove(...annotationUIDs: string[]): void;
    clear(): void;
}
