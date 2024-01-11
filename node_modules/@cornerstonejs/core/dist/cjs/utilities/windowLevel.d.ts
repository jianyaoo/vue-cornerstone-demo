declare function toWindowLevel(low: number, high: number): {
    windowWidth: number;
    windowCenter: number;
};
declare function toLowHighRange(windowWidth: number, windowCenter: number): {
    lower: number;
    upper: number;
};
export { toWindowLevel, toLowHighRange };
