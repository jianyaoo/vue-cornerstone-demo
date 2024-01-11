export default debounce;
declare function debounce(func: Function, wait?: number, options?: {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}): Function;
