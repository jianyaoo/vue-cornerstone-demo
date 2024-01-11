/**
 * Javascript object with properties for hours, minutes, seconds and fractionalSeconds
 *
 * @export
 * @interface TimeInterface
 */
export interface TimeInterface {
    hours?: number;
    minutes?: number;
    seconds?: number;
    fractionalSeconds?: number;
}
/**
 * Parses a TM formatted string into a javascript object with properties for hours, minutes, seconds and fractionalSeconds
 * @param {string} time - a string in the TM VR format
 * @returns {string} javascript object with properties for hours, minutes, seconds and fractionalSeconds or undefined if no element or data.  Missing fields are set to undefined
 */
export default function parseTM(time: string): TimeInterface;
export { parseTM };
