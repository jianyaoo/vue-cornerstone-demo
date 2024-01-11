export default throttle;
declare function throttle(func: Function, wait?: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): Function;
