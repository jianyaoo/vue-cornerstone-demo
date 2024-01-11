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
export default function parseTM(time: string): TimeInterface {
  if (
    time === null ||
    time === undefined ||
    time.length < 2 ||
    typeof time !== 'string'
  ) {
    // must at least have HH
    throw new Error(`invalid TM '${time}'`);
  }

  // 0123456789
  // HHMMSS.FFFFFF
  const hh = parseInt(time.substring(0, 2), 10);
  const mm = time.length >= 4 ? parseInt(time.substring(2, 4), 10) : undefined;
  const ss = time.length >= 6 ? parseInt(time.substring(4, 6), 10) : undefined;
  const fractionalStr = time.length >= 8 ? time.substring(7, 13) : undefined;
  const ffffff = fractionalStr
    ? parseInt(fractionalStr, 10) * Math.pow(10, 6 - fractionalStr.length)
    : undefined;

  if (
    isNaN(hh) ||
    (mm !== undefined && isNaN(mm)) ||
    (ss !== undefined && isNaN(ss)) ||
    (ffffff !== undefined && isNaN(ffffff)) ||
    hh < 0 ||
    hh > 23 ||
    (mm && (mm < 0 || mm > 59)) ||
    (ss && (ss < 0 || ss > 59)) ||
    (ffffff && (ffffff < 0 || ffffff > 999999))
  ) {
    throw new Error(`invalid TM '${time}'`);
  }

  return {
    hours: hh,
    minutes: mm,
    seconds: ss,
    fractionalSeconds: ffffff,
  };
}

export { parseTM };
