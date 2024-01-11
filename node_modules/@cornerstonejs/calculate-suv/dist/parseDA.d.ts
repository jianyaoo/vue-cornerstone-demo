/**
 * Javascript object with properties year, month and day
 *
 * @export
 * @interface DateInterface
 */
export interface DateInterface {
    year: number;
    month: number;
    day: number;
}
/**
 * Parses a DA formatted string into a Javascript object
 * @param {string} date a string in the DA VR format
 * @param {boolean} [validate] - true if an exception should be thrown if the date is invalid
 * @returns {DateInterface} Javascript object with properties year, month and day or undefined if not present or not 8 bytes long
 */
export default function parseDA(date: string): DateInterface;
export { parseDA };
