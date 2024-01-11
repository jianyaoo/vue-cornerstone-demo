/**
 * Check the number of days for a picked month and year
 * algorithm based on http://stackoverflow.com/questions/1433030/validate-number-of-days-in-a-given-month
 *
 * @param {number} m
 * @param {number} y
 * @returns {number} number of days
 */
function daysInMonth(m: number, y: number): number {
  // m is 0 indexed: 0-11
  switch (m) {
    case 2:
      return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
    case 9:
    case 4:
    case 6:
    case 11:
      return 30;
    default:
      return 31;
  }
}

/**
 * Check if the date is valid
 *
 * @param {number} d
 * @param {number} m
 * @param {number} y
 * @returns {boolean} boolean result
 */
function isValidDate(d: number, m: number, y: number): boolean {
  // make year is a number
  if (isNaN(y)) {
    return false;
  }

  return m > 0 && m <= 12 && d > 0 && d <= daysInMonth(m, y);
}

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
export default function parseDA(date: string): DateInterface {
  if (
    date === undefined ||
    date === null ||
    date.length !== 8 ||
    typeof date !== 'string'
  ) {
    throw new Error(`invalid DA '${date}'`);
  }

  const yyyy = parseInt(date.substring(0, 4), 10);
  const mm = parseInt(date.substring(4, 6), 10);
  const dd = parseInt(date.substring(6, 8), 10);

  if (isValidDate(dd, mm, yyyy) !== true) {
    throw new Error(`invalid DA '${date}'`);
  }

  return {
    year: yyyy,
    month: mm,
    day: dd,
  };
}

export { parseDA };
