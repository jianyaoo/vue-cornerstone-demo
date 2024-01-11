import combineDateTime, { FullDateInterface } from './combineDateTime';
import { parseDA, DateInterface } from './parseDA';
import { parseTM, TimeInterface } from './parseTM';
import dateTimeToFullDateInterface from './dateTimeToFullDateInterface';

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
}): FullDateInterface {
  const {
    RadiopharmaceuticalStartDateTime,
    RadiopharmaceuticalStartTime,
    SeriesDate,
  } = input;

  let time: TimeInterface;
  let date: DateInterface;
  if (RadiopharmaceuticalStartDateTime) {
    return dateTimeToFullDateInterface(RadiopharmaceuticalStartDateTime);
  } else if (RadiopharmaceuticalStartTime && SeriesDate) {
    // start Date	is not explicit - assume	same as	Series Date;
    // but consider	spanning midnight
    // TODO: do we need some logic to check if the scan went over midnight?
    time = parseTM(RadiopharmaceuticalStartTime);
    date = parseDA(SeriesDate);

    return combineDateTime(date, time);
  }

  throw new Error(`Invalid input: ${input}`);
}

export { calculateStartTime };
