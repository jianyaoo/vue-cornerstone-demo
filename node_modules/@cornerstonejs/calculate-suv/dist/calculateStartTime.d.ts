import { FullDateInterface } from './combineDateTime';
/**
 * Calculate start time
 *
 * @export
 * @param {{
 *   RadiopharmaceuticalStartDateTime?: string;
 *   RadiopharmaceuticalStartTime?: string;
 *   SeriesDate?: string;
 * }} input
 * @returns {FullDateInterface}
 */
export default function calculateStartTime(input: {
    RadiopharmaceuticalStartDateTime?: string;
    RadiopharmaceuticalStartTime?: string;
    SeriesDate?: string;
}): FullDateInterface;
export { calculateStartTime };
