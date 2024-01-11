import combineDateTime, { FullDateInterface } from './combineDateTime';
import parseDA, { DateInterface } from './parseDA';
import parseTM, { TimeInterface } from './parseTM';
import dateTimeToFullDateInterface from './dateTimeToFullDateInterface';

/**
 * Javascript object with scan properties
 *
 * @interface InstanceMetadataForScanTimes
 */
interface InstanceMetadataForScanTimes {
  SeriesDate: string;
  SeriesTime: string;
  AcquisitionDate: string;
  AcquisitionTime: string;

  GEPrivatePostInjectionDateTime?: string;

  // Only used in Siemens case
  RadionuclideHalfLife?: number; // 	RadionuclideHalfLife(0x0018,0x1075)	in	Radiopharmaceutical	Information	Sequence(0x0054,0x0016)
  RadionuclideTotalDose?: number;
  FrameReferenceTime?: number;
  ActualFrameDuration?: number;
}

/**
 * Calculate the scan times
 *
 * @export
 * @param {InstanceMetadataForScanTimes[]} instances
 * @returns {FullDateInterface[]}
 */
export default function calculateScanTimes(
  instances: InstanceMetadataForScanTimes[]
): FullDateInterface[] {
  const {
    SeriesDate,
    SeriesTime,
    GEPrivatePostInjectionDateTime,
  } = instances[0];
  const results = new Array(instances.length);
  const seriesDate: DateInterface = parseDA(SeriesDate);
  const seriesTime: TimeInterface = parseTM(SeriesTime);
  const seriesDateTime: FullDateInterface = combineDateTime(
    seriesDate,
    seriesTime
  );

  let earliestAcquisitionDateTime = new FullDateInterface(
    `3000-01-01T00:00:00.000000Z`
  );
  let timeError = earliestAcquisitionDateTime.getTimeInSec();
  instances.forEach(instance => {
    const { AcquisitionDate, AcquisitionTime } = instance;

    const acquisitionDate: DateInterface = parseDA(AcquisitionDate);
    const acquisitionTime: TimeInterface = parseTM(AcquisitionTime);
    const acquisitionDateTime: FullDateInterface = combineDateTime(
      acquisitionDate,
      acquisitionTime
    );

    if (earliestAcquisitionDateTime.getTimeInSec() >= timeError) {
      earliestAcquisitionDateTime = acquisitionDateTime;
    } else {
      earliestAcquisitionDateTime =
        acquisitionDateTime.getTimeInSec() <
        earliestAcquisitionDateTime.getTimeInSec()
          ? acquisitionDateTime
          : earliestAcquisitionDateTime;
    }
  });

  if (earliestAcquisitionDateTime.getTimeInSec() >= timeError) {
    throw new Error('Earliest acquisition time or date could not be parsed.');
  }

  if (
    seriesDateTime.getTimeInSec() <= earliestAcquisitionDateTime.getTimeInSec()
  ) {
    return results.fill(seriesDateTime);
  } else {
    if (GEPrivatePostInjectionDateTime) {
      // GE Private scan
      return results.fill(
        dateTimeToFullDateInterface(GEPrivatePostInjectionDateTime)
      );
    } else {
      /*const hasValidFrameTimes = instances.every(instance => {
        return (
          instance.FrameReferenceTime &&
          instance.FrameReferenceTime > 0 &&
          instance.ActualFrameDuration &&
          instance.ActualFrameDuration > 0
        );
      });*/

      // TODO: Temporarily commented out the checks and logic below to
      // investigate the BQML_AC_DT_lessThan_S_DT_SIEMENS-instances case
      //if (!hasValidFrameTimes) {
      return results.fill(earliestAcquisitionDateTime);
      //}

      /* Siemens PETsyngo	3.x	multi-injection logic
      - backcompute	from	center	(average	count	rate	)	of	time	window	for	bed	position	(frame)	in	series (reliable	in	all	cases)
      - Acquisition	Date	(0x0008,0x0022)	and	Time	(0x0008,0x0032) are	the	start	of	the	bed	position	(frame)
      - Frame	Reference	Time	(0x0054,0x1300) is	the	offset	(ms)	from	the	scan	Date	and	Time we	want	to	the	average	count	rate	time
      */
      /*return instances.map(instance => {
        const {
          FrameReferenceTime,
          ActualFrameDuration,
          RadionuclideHalfLife,
          AcquisitionDate,
          AcquisitionTime,
        } = instance;
        // Some of these checks are only here because the compiler is complaining
        // We could potentially use the ! operator instead
        if (!FrameReferenceTime || FrameReferenceTime <= 0) {
          throw new Error(
            `FrameReferenceTime is invalid: ${FrameReferenceTime}`
          );
        }

        if (!ActualFrameDuration || ActualFrameDuration <= 0) {
          throw new Error(
            `ActualFrameDuration is invalid: ${ActualFrameDuration}`
          );
        }

        if (!RadionuclideHalfLife) {
          throw new Error('RadionuclideHalfLife is required');
        }

        if (!AcquisitionDate) {
          throw new Error('AcquisitionDate is required');
        }

        if (!AcquisitionTime) {
          throw new Error('AcquisitionTime is required');
        }

        const acquisitionDate: DateInterface = parseDA(AcquisitionDate);
        const acquisitionTime: TimeInterface = parseTM(AcquisitionTime);
        const acquisitionDateTime: FullDateInterface = combineDateTime(
          acquisitionDate,
          acquisitionTime
        );

        const frameDurationInSec = ActualFrameDuration / 1000;
        const decayConstant = Math.log(2) / RadionuclideHalfLife;
        const decayDuringFrame = decayConstant * frameDurationInSec;
        // TODO: double check this is correctly copied from QIBA pseudocode
        const averageCountRateTimeWithinFrameInSec =
          (1 / decayConstant) *
          Math.log(decayDuringFrame / (1 - Math.exp(-decayConstant)));
        const scanDateTimeAsNumber =
          Number(acquisitionDateTime) -
          FrameReferenceTime / 1000 +
          averageCountRateTimeWithinFrameInSec;

        const scanDate = new Date(scanDateTimeAsNumber);
        console.log('SIEMENS PATH');
        console.log(new Date(scanDateTimeAsNumber));
        return scanDate;
      });*/
    }
  }
}

export { calculateScanTimes };
