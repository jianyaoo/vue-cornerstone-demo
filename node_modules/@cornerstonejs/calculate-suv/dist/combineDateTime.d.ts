import { DateInterface } from './parseDA';
import { TimeInterface } from './parseTM';
/**
 * Javascript object that handles dates and compute the time.
 *
 * @export
 * @class FullDateInterface
 */
export declare class FullDateInterface {
    fullDate: string;
    /**
     * Creates an instance of FullDateInterface.
     * @param {string} date formatted as yyyy-mm-ddTHH:MM:SS.FFFFFFZ
     * @memberof FullDateInterface
     */
    constructor(date: string);
    /**
     * returns time since 1 january 1970
     *
     * @returns {number} time in sec
     * @memberof FullDateInterface
     */
    getTimeInSec(): number;
    /**
     * returns time since 1 january 1970
     *
     * @returns {number} time in microsec
     * @memberof FullDateInterface
     */
    getTimeInMicroSec(): number;
}
export interface FullDateInterface {
    date: string;
}
/**
 * Combines two javascript objects containing the date and time information
 *
 * @export
 * @param {DateInterface} date
 * @param {TimeInterface} time
 * @returns {FullDateInterface}
 */
export default function combineDateTime(date: DateInterface, time: TimeInterface): FullDateInterface;
export { combineDateTime };
